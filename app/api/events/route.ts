import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthFromRequest } from "@/lib/auth";
import { EventSchema } from "@/lib/validations";
import Event from "@/models/Event";

export async function GET(req: NextRequest) {
  await connectDB();
  const url = new URL(req.url);
  const upcoming = url.searchParams.get("upcoming");
  const filter = upcoming === "true" ? { date: { $gte: new Date() } } : {};
  const events = await Event.find(filter).sort({ date: 1 }).lean();
  return Response.json({ events });
}

export async function POST(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth || auth.role !== "admin")
    return Response.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = EventSchema.safeParse(body);
  if (!parsed.success)
    return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });

  await connectDB();
  const event = await Event.create({
    ...parsed.data,
    date: new Date(parsed.data.date),
    endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : undefined,
  });
  return Response.json({ event }, { status: 201 });
}
