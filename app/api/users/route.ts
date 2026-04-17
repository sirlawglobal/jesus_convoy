import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthFromRequest, hashPassword } from "@/lib/auth";
import { UserCreateSchema } from "@/lib/validations";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth || auth.role !== "admin")
    return Response.json({ error: "Forbidden" }, { status: 403 });

  await connectDB();
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") ?? "1");
  const limit = parseInt(url.searchParams.get("limit") ?? "20");
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find().select("-password").populate("ministry", "name").skip(skip).limit(limit).lean(),
    User.countDocuments(),
  ]);

  return Response.json({ users, total, page, limit });
}

export async function POST(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth || auth.role !== "admin")
    return Response.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = UserCreateSchema.safeParse(body);
  if (!parsed.success)
    return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });

  await connectDB();
  const exists = await User.findOne({ email: parsed.data.email });
  if (exists) return Response.json({ error: "Email already in use" }, { status: 409 });

  const hashed = await hashPassword(parsed.data.password);
  const user = await User.create({ ...parsed.data, password: hashed });
  const { password: _, ...safe } = user.toObject();
  return Response.json({ user: safe }, { status: 201 });
}
