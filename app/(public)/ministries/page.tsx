"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users } from "lucide-react";

interface Ministry { _id: string; name: string; description: string; leader?: { name: string; avatar?: string }; workers: { name: string }[]; image?: string; }

export default function MinistriesPage() {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ministries").then((r) => r.json()).then((d) => { setMinistries(d.ministries ?? []); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-navy-950">
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[500px] h-[300px] bg-gold-500/8 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 px-6">
          <p className="text-gold-500 text-sm font-semibold uppercase tracking-widest mb-3">Get Involved</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Our <span className="gradient-text">Ministries</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Discover your place in God&apos;s work through our vibrant ministry departments.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass rounded-2xl h-64 shimmer" />
            ))}
          </div>
        ) : ministries.length === 0 ? (
          <div className="text-center py-20 text-slate-500">No ministries found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ministries.map((m) => (
              <Link key={m._id} href={`/ministries/${m._id}`}>
                <div className="glass rounded-3xl p-6 sm:p-8 card-hover h-full flex flex-col border border-white/5">
                  <div className="w-14 h-14 gradient-gold rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-gold-500/20">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-2xl mb-3">{m.name}</h3>
                  <p className="text-slate-400 text-base leading-relaxed flex-1 line-clamp-3 mb-6">{m.description}</p>
                  {m.leader && (
                    <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                      <div className="w-7 h-7 gradient-gold rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {m.leader.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white text-xs font-medium">{m.leader.name}</p>
                        <p className="text-slate-500 text-xs">Ministry Leader</p>
                      </div>
                      <span className="ml-auto text-xs text-slate-500">
                        {m.workers.length} member{m.workers.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
