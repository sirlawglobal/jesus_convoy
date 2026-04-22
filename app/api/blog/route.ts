import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthFromRequest } from "@/lib/auth";
import { BlogPostSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import BlogPost from "@/models/BlogPost";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const auth = getAuthFromRequest(req);
    const category = url.searchParams.get("category");
    const page = parseInt(url.searchParams.get("page") ?? "1");
    const limit = parseInt(url.searchParams.get("limit") ?? "10");

    const filter: Record<string, unknown> = auth?.role === "admin" ? {} : { published: true };
    if (category) filter.category = { $regex: category, $options: "i" };

    const [posts, total] = await Promise.all([
      BlogPost.find(filter)
        .populate("author", "name avatar")
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      BlogPost.countDocuments(filter),
    ]);

    return Response.json({ posts, total, page, limit });
  } catch (err) {
    console.error("[API/BLOG/GET]", err);
    return Response.json({ error: "Server error", details: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth || auth.role !== "admin")
    return Response.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = BlogPostSchema.safeParse(body);
  if (!parsed.success)
    return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });

  await connectDB();
  const slug = slugify(parsed.data.title) + "-" + Date.now();
  const post = await BlogPost.create({
    ...parsed.data,
    slug,
    author: auth.userId,
    publishedAt: parsed.data.published ? new Date() : undefined,
  });
  return Response.json({ post }, { status: 201 });
}
