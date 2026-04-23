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
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch posts");
        return r.json();
      })
      .then((d) => {
        setPosts(d.posts ?? []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Blog fetch error:", err);
        setLoading(false);
      });
  }, [category]);

  const categories = [...new Set(posts.map((p) => p.category))];

  return (
    <div className="min-h-screen bg-navy-950">
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[500px] h-[300px] bg-gold-500/8 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 px-6">
          <p className="text-gold-500 text-sm font-semibold uppercase tracking-widest mb-3">Devotionals &amp; Insights</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">Blog &amp; <span className="gradient-text">Devotionals</span></h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">Daily inspiration and deep dives into God&apos;s Word.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        {/* Category filter */}
        <div className="flex gap-3 flex-wrap mb-10 overflow-x-auto no-scrollbar pb-2">
          <button onClick={() => setCategory("")} className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${!category ? "gradient-gold text-navy-950 border-gold-400 shadow-lg shadow-gold-500/20" : "glass text-slate-400 border-white/5 hover:text-white"}`}>All Posts</button>
          {categories.map((c) => (
            <button key={c} onClick={() => setCategory(c)} className={`px-6 py-2 rounded-full text-sm font-bold transition-all capitalize whitespace-nowrap border ${category === c ? "gradient-gold text-navy-950 border-gold-400 shadow-lg shadow-gold-500/20" : "glass text-slate-400 border-white/5 hover:text-white"}`}>{c}</button>
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
                <div className="glass rounded-3xl overflow-hidden card-hover h-full flex flex-col border border-white/5">
                  <div className="h-52 bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center relative overflow-hidden">
                    {p.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <BookOpen className="w-8 h-8 text-gold-500/30" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 glass-light/10 backdrop-blur-md rounded-lg text-gold-400 text-[10px] font-bold uppercase tracking-widest border border-gold-500/20">{p.category}</span>
                    </div>
                  </div>
                  <div className="p-7 flex flex-col flex-1">
                    <h3 className="text-white font-bold text-xl mb-4 group-hover:text-gold-400 transition-colors flex-1 line-clamp-3 leading-snug">{p.title}</h3>
                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 gradient-gold rounded-lg flex items-center justify-center text-navy-950 text-xs font-black">
                          {p.author?.name ? p.author.name.charAt(0) : "J"}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white text-[11px] font-bold">{p.author?.name || "Jesus Convoy"}</span>
                          <span className="text-slate-500 text-[10px] flex items-center gap-1 font-medium">
                            {p.publishedAt && <><Calendar className="w-3 h-3" /> {new Date(p.publishedAt).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}</>}
                          </span>
                        </div>
                      </div>
                      <div className="w-8 h-8 glass rounded-lg flex items-center justify-center text-gold-400 group-hover:bg-gold-500 group-hover:text-navy-950 transition-all">
                        <ArrowRight className="w-4 h-4" />
                      </div>
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
