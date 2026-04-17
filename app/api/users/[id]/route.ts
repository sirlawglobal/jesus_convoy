import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthFromRequest } from "@/lib/auth";
import { UserUpdateSchema } from "@/lib/validations";
import User from "@/models/User";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthFromRequest(req);
  if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const user = await User.findById(id).select("-password").populate("ministry", "name").lean();
  if (!user) return Response.json({ error: "Not found" }, { status: 404 });

  return Response.json({ user });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthFromRequest(req);
  if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  // Workers can only update themselves
  if (auth.role === "worker" && auth.userId !== id)
    return Response.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = UserUpdateSchema.safeParse(body);
  if (!parsed.success)
    return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });

  // Only admins can change roles
  if (parsed.data.role && auth.role !== "admin") delete parsed.data.role;
  if (parsed.data.ministry && auth.role !== "admin") delete parsed.data.ministry;

  await connectDB();
  const user = await User.findByIdAndUpdate(id, parsed.data, { new: true })
    .select("-password")
    .lean();
  if (!user) return Response.json({ error: "Not found" }, { status: 404 });

  return Response.json({ user });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthFromRequest(req);
  if (!auth || auth.role !== "admin")
    return Response.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  await connectDB();
  await User.findByIdAndDelete(id);
  return Response.json({ message: "User deleted" });
}
