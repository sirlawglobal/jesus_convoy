"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";

interface BlogPost {
  _id: string; title: string; slug: string; content: string;
  category: string; coverImage?: string; tags?: string[];
  publishedAt?: string; author?: { name: string; avatar?: string };
}

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blog/${slug}`).then((r) => r.json()).then((d) => { setPost(d.post); setLoading(false); });
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!post) return <div className="min-h-screen bg-navy-950 flex items-center justify-center text-slate-400">Post not found.</div>;

  return (
    <div className="min-h-screen bg-navy-950 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/blog" className="inline-flex items-center gap-2 text-slate-400 hover:text-gold-400 transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        {post.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.coverImage} alt={post.title} className="w-full rounded-2xl mb-8 max-h-80 object-cover" />
        )}

        <div className="glass rounded-3xl p-8 md:p-12">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="flex items-center gap-1 text-gold-400 text-xs font-medium px-3 py-1 bg-gold-500/10 rounded-full">
              <Tag className="w-3 h-3" />{post.category}
            </span>
            {post.tags?.map((t) => (
              <span key={t} className="text-slate-500 text-xs px-3 py-1 glass rounded-full">{t}</span>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-white mb-4">{post.title}</h1>

          <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-8 pb-8 border-b border-white/10">
            {post.author && (
              <span className="flex items-center gap-1.5">
                <div className="w-5 h-5 gradient-gold rounded-full flex-shrink-0" />
                <User className="w-4 h-4" />{post.author.name}
              </span>
            )}
            {post.publishedAt && (
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(post.publishedAt).toLocaleDateString("en-NG", { dateStyle: "long" })}
              </span>
            )}
          </div>

          <div className="prose prose-invert prose-gold max-w-none">
            {post.content.split("\n").map((para, i) =>
              para.trim() ? (
                <p key={i} className="text-slate-300 leading-relaxed mb-4">
                  {para}
                </p>
              ) : null
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
