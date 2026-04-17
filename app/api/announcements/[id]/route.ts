import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthFromRequest } from "@/lib/auth";
import Announcement from "@/models/Announcement";
import { AnnouncementSchema } from "@/lib/validations";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthFromRequest(req);
  if (!auth || (auth.role !== "admin" && auth.role !== "leader"))
    return Response.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const parsed = AnnouncementSchema.partial().safeParse(body);
  if (!parsed.success)
    return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });

  await connectDB();
  const updated = await Announcement.findByIdAndUpdate(id, parsed.data, { new: true }).lean();
  if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ announcement: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthFromRequest(req);
  if (!auth || auth.role !== "admin")
    return Response.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  await connectDB();
  await Announcement.findByIdAndDelete(id);
  return Response.json({ message: "Announcement deleted" });
}
