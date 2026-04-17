import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthFromRequest } from "@/lib/auth";
import { SermonSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import Sermon from "@/models/Sermon";

export async function GET(req: NextRequest) {
  await connectDB();
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") ?? "1");
  const limit = parseInt(url.searchParams.get("limit") ?? "12");
  const speaker = url.searchParams.get("speaker");
  const topic = url.searchParams.get("topic");

  const filter: Record<string, unknown> = {};
  if (speaker) filter.speaker = { $regex: speaker, $options: "i" };
  if (topic) filter.topic = { $regex: topic, $options: "i" };

  const [sermons, total] = await Promise.all([
    Sermon.find(filter).sort({ date: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Sermon.countDocuments(filter),
  ]);

  return Response.json({ sermons, total, page, limit });
}

export async function POST(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth || auth.role !== "admin")
    return Response.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = SermonSchema.safeParse(body);
  if (!parsed.success)
    return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });

  await connectDB();
  const slug = slugify(parsed.data.title) + "-" + Date.now();
  const sermon = await Sermon.create({ ...parsed.data, slug, date: new Date(parsed.data.date) });
  return Response.json({ sermon }, { status: 201 });
}
