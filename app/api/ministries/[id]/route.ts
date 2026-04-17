import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthFromRequest } from "@/lib/auth";
import { MinistrySchema } from "@/lib/validations";
import Ministry from "@/models/Ministry";
import User from "@/models/User";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const ministry = await Ministry.findById(id)
    .populate("leader", "name avatar email phone")
    .populate("workers", "name avatar email phone")
    .lean();
  if (!ministry) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ ministry });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthFromRequest(req);
  if (!auth || (auth.role !== "admin" && auth.role !== "leader"))
    return Response.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();

  // Handle adding/removing workers
  if (body.addWorker) {
    await connectDB();
    const updated = await Ministry.findByIdAndUpdate(
      id, { $addToSet: { workers: body.addWorker } }, { new: true }
    ).lean();
    await User.findByIdAndUpdate(body.addWorker, { ministry: id });
    return Response.json({ ministry: updated });
  }

  if (body.removeWorker) {
    await connectDB();
    const updated = await Ministry.findByIdAndUpdate(
      id, { $pull: { workers: body.removeWorker } }, { new: true }
    ).lean();
    await User.findByIdAndUpdate(body.removeWorker, { ministry: null });
    return Response.json({ ministry: updated });
  }

  const parsed = MinistrySchema.partial().safeParse(body);
  if (!parsed.success)
    return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });

  await connectDB();
  const updated = await Ministry.findByIdAndUpdate(id, parsed.data, { new: true }).lean();
  if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ ministry: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthFromRequest(req);
  if (!auth || auth.role !== "admin")
    return Response.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  await connectDB();
  await Ministry.findByIdAndDelete(id);
  return Response.json({ message: "Ministry deleted" });
}
