import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthFromRequest } from "@/lib/auth";
import { BlogPostSchema } from "@/lib/validations";
import BlogPost from "@/models/BlogPost";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();
  const post = await BlogPost.findOne({ slug }).populate("author", "name avatar").lean();
  if (!post) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ post });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const auth = getAuthFromRequest(req);
  if (!auth || auth.role !== "admin")
    return Response.json({ error: "Forbidden" }, { status: 403 });

  const { slug } = await params;
  const body = await req.json();
  const parsed = BlogPostSchema.partial().safeParse(body);
  if (!parsed.success)
    return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });

  if (parsed.data.published) parsed.data = { ...parsed.data, publishedAt: new Date() } as typeof parsed.data;

  await connectDB();
  const updated = await BlogPost.findOneAndUpdate({ slug }, parsed.data, { new: true }).lean();
  if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ post: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const auth = getAuthFromRequest(req);
  if (!auth || auth.role !== "admin")
    return Response.json({ error: "Forbidden" }, { status: 403 });

  const { slug } = await params;
  await connectDB();
  await BlogPost.findOneAndDelete({ slug });
  return Response.json({ message: "Post deleted" });
}
