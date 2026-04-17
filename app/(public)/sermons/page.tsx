"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play, Search, Filter } from "lucide-react";

interface Sermon {
  _id: string; title: string; speaker: string; topic: string;
  date: string; thumbnail?: string; views: number;
}

export default function SermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [speaker, setSpeaker] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (speaker) params.set("speaker", speaker);
    setLoading(true);
    fetch(`/api/sermons?${params}&limit=24`)
      .then((r) => r.json())
      .then((d) => { setSermons(d.sermons ?? []); setLoading(false); });
  }, [speaker]);

  const filtered = sermons.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.speaker.toLowerCase().includes(search.toLowerCase()) ||
      s.topic.toLowerCase().includes(search.toLowerCase())
  );

  const speakers = [...new Set(sermons.map((s) => s.speaker))];

  return (
    <div className="min-h-screen bg-navy-950">
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-gold-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <p className="text-gold-500 text-sm font-semibold uppercase tracking-widest mb-3">Word of God</p>
          <h1 className="text-5xl font-black text-white mb-4">
            <span className="gradient-text">Sermons</span> & Messages
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Spirit-filled messages to strengthen your faith and transform your life.
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 pb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sermons…"
            className="w-full pl-10 pr-4 py-3 glass rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-gold-500/60 border border-white/10 transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <select
            value={speaker}
            onChange={(e) => setSpeaker(e.target.value)}
            className="pl-10 pr-8 py-3 glass rounded-xl text-white focus:outline-none border border-white/10 bg-navy-950 appearance-none cursor-pointer min-w-[180px]"
          >
            <option value="">All Speakers</option>
            {speakers.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden animate-pulse">
                <div className="h-40 bg-white/5 shimmer" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-white/5 rounded shimmer" />
                  <div className="h-3 bg-white/5 rounded shimmer w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-500">No sermons found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((s) => (
              <Link key={s._id} href={`/sermons/${s._id}`} className="group">
                <div className="glass rounded-2xl overflow-hidden card-hover h-full">
                  <div className="h-40 bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center relative overflow-hidden">
                    {s.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.thumbnail} alt={s.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-14 h-14 gradient-gold rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <span className="text-gold-400 text-xs font-medium">{s.topic}</span>
                    <h3 className="text-white font-bold mt-1 mb-2 group-hover:text-gold-400 transition-colors line-clamp-2 text-sm">
                      {s.title}
                    </h3>
                    <p className="text-slate-500 text-xs">
                      {s.speaker} &middot; {new Date(s.date).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
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
