import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthFromRequest } from "@/lib/auth";
import { SettingsSchema } from "@/lib/validations";
import Settings from "@/models/Settings";

export async function GET() {
  await connectDB();
  let settings = await Settings.findOne().lean();
  if (!settings) {
    settings = await Settings.create({});
  }
  return Response.json({ settings });
}

export async function PATCH(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth || auth.role !== "admin")
    return Response.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = SettingsSchema.safeParse(body);
  if (!parsed.success)
    return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });

  await connectDB();
  const settings = await Settings.findOneAndUpdate({}, parsed.data, {
    new: true,
    upsert: true,
  }).lean();
  return Response.json({ settings });
}
