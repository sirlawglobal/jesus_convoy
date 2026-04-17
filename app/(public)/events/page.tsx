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
        <div className="relative z-10">
          <p className="text-gold-500 text-sm font-semibold uppercase tracking-widest mb-3">Church Calendar</p>
          <h1 className="text-5xl font-black text-white mb-4">
            Events &amp; <span className="gradient-text">Programs</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Stay connected with all that&apos;s happening at Jesus Convoy.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 pb-8 flex gap-2">
        {(["upcoming", "past"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all capitalize ${tab === t ? "gradient-gold text-navy-950 font-semibold" : "glass text-slate-400 hover:text-white"}`}
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
          <div className="space-y-4">
            {events.map((e) => (
              <Link key={e._id} href={`/events/${e._id}`}>
                <div className="glass rounded-2xl p-6 card-hover flex items-center gap-6">
                  <div className="flex-shrink-0 w-16 h-16 gradient-gold rounded-xl flex flex-col items-center justify-center text-white font-bold shadow-lg shadow-gold-500/20">
                    <span className="text-xs uppercase">{new Date(e.date).toLocaleString("en", { month: "short" })}</span>
                    <span className="text-2xl leading-none">{new Date(e.date).getDate()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-xl mb-1 truncate">{e.title}</h3>
                    <p className="text-slate-400 text-sm line-clamp-1 mb-2">{e.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(e.date).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {e.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {e.location}
                        </span>
                      )}
                    </div>
                  </div>
                  {e.registrationOpen && (
                    <span className="flex-shrink-0 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium border border-emerald-500/30">
                      Register
                    </span>
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
