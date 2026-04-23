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
        <div className="relative z-10 px-6">
          <p className="text-gold-500 text-sm font-semibold uppercase tracking-widest mb-3">Word of God</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            <span className="gradient-text">Sermons</span> & Messages
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            Spirit-filled messages to strengthen your faith and transform your life.
          </p>
        </div>
      </section>

      {/* Filters */}
      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 pb-12 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sermons by title, topic or speaker…"
            className="w-full pl-11 pr-4 py-4 glass rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-gold-500/60 border border-white/10 transition-all text-sm"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <select
            value={speaker}
            onChange={(e) => setSpeaker(e.target.value)}
            className="pl-11 pr-10 py-4 glass rounded-2xl text-white focus:outline-none border border-white/10 bg-navy-950 appearance-none cursor-pointer min-w-[200px] text-sm font-medium"
          >
            <option value="">All Speakers</option>
            {speakers.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          </div>
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
                <div className="glass rounded-3xl overflow-hidden card-hover h-full border border-white/5">
                  <div className="h-44 bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center relative overflow-hidden">
                    {s.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.thumbnail} alt={s.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-16 h-16 gradient-gold rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl shadow-gold-500/30">
                        <Play className="w-7 h-7 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <span className="text-gold-400 text-xs font-bold uppercase tracking-wider">{s.topic}</span>
                    <h3 className="text-white font-bold mt-2 mb-3 group-hover:text-gold-400 transition-colors line-clamp-2 text-base leading-snug">
                      {s.title}
                    </h3>
                    <p className="text-slate-500 text-xs font-medium">
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
