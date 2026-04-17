import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthFromRequest } from "@/lib/auth";
import { SermonSchema } from "@/lib/validations";
import Sermon from "@/models/Sermon";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  // Support lookup by _id or slug
  const sermon = await Sermon.findOne({ $or: [{ _id: id }, { slug: id }] }).lean();
  if (!sermon) return Response.json({ error: "Not found" }, { status: 404 });
  // Increment views
  await Sermon.findByIdAndUpdate(sermon._id, { $inc: { views: 1 } });
  return Response.json({ sermon });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthFromRequest(req);
  if (!auth || auth.role !== "admin")
    return Response.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const parsed = SermonSchema.partial().safeParse(body);
  if (!parsed.success)
    return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });

  await connectDB();
  const updated = await Sermon.findByIdAndUpdate(id, parsed.data, { new: true }).lean();
  if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ sermon: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthFromRequest(req);
  if (!auth || auth.role !== "admin")
    return Response.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  await connectDB();
  await Sermon.findByIdAndDelete(id);
  return Response.json({ message: "Sermon deleted" });
}
