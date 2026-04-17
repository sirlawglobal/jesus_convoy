import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthFromRequest } from "@/lib/auth";
import { AnnouncementSchema } from "@/lib/validations";
import Announcement from "@/models/Announcement";

export async function GET(req: NextRequest) {
  await connectDB();
  const auth = getAuthFromRequest(req);
  const url = new URL(req.url);
  const ministryId = url.searchParams.get("ministry");

  let filter: Record<string, unknown> = {};

  if (auth) {
    // Dashboard: show relevant announcements based on role
    const orConditions: Record<string, unknown>[] = [{ audience: "all" }];
    if (auth.role === "worker" || auth.role === "leader") orConditions.push({ audience: "workers" });
    if (ministryId) orConditions.push({ audience: "ministry", ministry: ministryId });
    filter = { $or: orConditions };
  } else {
    // Public: only "all" audience, not expired
    filter = {
      audience: "all",
      $or: [{ expiresAt: null }, { expiresAt: { $gte: new Date() } }],
    };
  }

  const announcements = await Announcement.find(filter)
    .sort({ priority: -1, createdAt: -1 })
    .limit(20)
    .lean();

  return Response.json({ announcements });
}

export async function POST(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth || (auth.role !== "admin" && auth.role !== "leader"))
    return Response.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = AnnouncementSchema.safeParse(body);
  if (!parsed.success)
    return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });

  await connectDB();
  const announcement = await Announcement.create({
    ...parsed.data,
    createdBy: auth.userId,
    expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : undefined,
  });
  return Response.json({ announcement }, { status: 201 });
}
