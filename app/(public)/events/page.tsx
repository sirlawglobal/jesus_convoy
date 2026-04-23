"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Clock } from "lucide-react";

interface IEvent { _id: string; title: string; description: string; date: string; endDate?: string; location?: string; image?: string; registrationOpen: boolean; }

export default function EventsPage() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const now = new Date().toISOString();
    const url = tab === "upcoming" ? "/api/events?upcoming=true" : "/api/events";
    fetch(url).then((r) => r.json()).then((d) => {
      const all: IEvent[] = d.events ?? [];
      if (tab === "past") setEvents(all.filter((e) => new Date(e.date) < new Date()));
      else setEvents(all);
      setLoading(false);
    });
  }, [tab]);

  return (
    <div className="min-h-screen bg-navy-950">
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[500px] h-[300px] bg-gold-500/8 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 px-6">
          <p className="text-gold-500 text-sm font-semibold uppercase tracking-widest mb-3">Church Calendar</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Events &amp; <span className="gradient-text">Programs</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            Stay connected with all that&apos;s happening at Jesus Convoy.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 pb-12 flex gap-3 overflow-x-auto no-scrollbar">
        {(["upcoming", "past"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all capitalize whitespace-nowrap border ${tab === t ? "gradient-gold text-navy-950 border-gold-400 shadow-lg shadow-gold-500/20" : "glass text-slate-400 border-white/5 hover:text-white"}`}
          >
            {t === "upcoming" ? "Upcoming Events" : "Past Events"}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass rounded-2xl h-32 shimmer" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 text-slate-500">No {tab} events found.</div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {events.map((e) => (
              <Link key={e._id} href={`/events/${e._id}`} className="group">
                <div className="glass rounded-3xl p-6 sm:p-8 card-hover flex flex-col sm:flex-row items-start sm:items-center gap-6 border border-white/5">
                  <div className="flex-shrink-0 w-20 h-20 gradient-gold rounded-2xl flex flex-col items-center justify-center text-navy-950 font-black shadow-xl shadow-gold-500/20 group-hover:scale-110 transition-transform">
                    <span className="text-xs uppercase tracking-tighter opacity-70">{new Date(e.date).toLocaleString("en", { month: "short" })}</span>
                    <span className="text-3xl leading-none">{new Date(e.date).getDate()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-white font-bold text-2xl group-hover:text-gold-400 transition-colors truncate">{e.title}</h3>
                      {e.registrationOpen && (
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">
                          Register Now
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-base line-clamp-2 mb-4 leading-relaxed">{e.description}</p>
                    <div className="flex flex-wrap gap-5 text-sm text-slate-500 font-medium">
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gold-500" />
                        {new Date(e.date).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {e.location && (
                        <span className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gold-500" /> {e.location}
                        </span>
                      )}
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
