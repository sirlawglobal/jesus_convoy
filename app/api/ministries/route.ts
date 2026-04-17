import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthFromRequest } from "@/lib/auth";
import { MinistrySchema } from "@/lib/validations";
import Ministry from "@/models/Ministry";

export async function GET() {
  await connectDB();
  const ministries = await Ministry.find({ isActive: true })
    .populate("leader", "name avatar")
    .populate("workers", "name avatar")
    .lean();
  return Response.json({ ministries });
}

export async function POST(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth || auth.role !== "admin")
    return Response.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = MinistrySchema.safeParse(body);
  if (!parsed.success)
    return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });

  await connectDB();
  const ministry = await Ministry.create(parsed.data);
  return Response.json({ ministry }, { status: 201 });
}
