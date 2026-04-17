"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Calendar, Tag, ArrowRight } from "lucide-react";

interface BlogPost { _id: string; title: string; slug: string; category: string; coverImage?: string; publishedAt?: string; author?: { name: string }; }

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");

  useEffect(() => {
    const url = `/api/blog${category ? `?category=${category}` : ""}`;
    setLoading(true);
    fetch(url).then((r) => r.json()).then((d) => { setPosts(d.posts ?? []); setLoading(false); });
  }, [category]);

  const categories = [...new Set(posts.map((p) => p.category))];

  return (
    <div className="min-h-screen bg-navy-950">
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[500px] h-[300px] bg-gold-500/8 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <p className="text-gold-500 text-sm font-semibold uppercase tracking-widest mb-3">Devotionals &amp; Insights</p>
          <h1 className="text-5xl font-black text-white mb-4">Blog &amp; <span className="gradient-text">Devotionals</span></h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">Daily inspiration and deep dives into God&apos;s Word.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          <button onClick={() => setCategory("")} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${!category ? "gradient-gold text-navy-950" : "glass text-slate-400 hover:text-white"}`}>All</button>
          {categories.map((c) => (
            <button key={c} onClick={() => setCategory(c)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${category === c ? "gradient-gold text-navy-950" : "glass text-slate-400 hover:text-white"}`}>{c}</button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <div key={i} className="glass rounded-2xl h-72 shimmer" />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-slate-500">No posts found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p) => (
              <Link key={p._id} href={`/blog/${p.slug}`} className="group">
                <div className="glass rounded-2xl overflow-hidden card-hover h-full flex flex-col">
                  <div className="h-48 bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center">
                    {p.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen className="w-10 h-10 text-gold-500/40" />
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="flex items-center gap-1 text-gold-400 text-xs font-medium"><Tag className="w-3 h-3" />{p.category}</span>
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2 group-hover:text-gold-400 transition-colors flex-1 line-clamp-3">{p.title}</h3>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                      <span className="text-slate-500 text-xs flex items-center gap-1">
                        {p.author?.name && <><span>{p.author.name}</span> &middot; </>}
                        {p.publishedAt && <><Calendar className="w-3 h-3" /> {new Date(p.publishedAt).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}</>}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gold-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
