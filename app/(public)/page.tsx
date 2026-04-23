"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Heart, Users, Calendar, ArrowRight, Star } from "lucide-react";
import { useEffect, useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" as const },
  }),
};

interface Sermon { _id: string; title: string; speaker: string; date: string; topic: string; thumbnail?: string; }
interface Announcement { _id: string; title: string; message: string; priority: string; }
interface Event { _id: string; title: string; date: string; location?: string; image?: string; }

export default function HomePage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch("/api/sermons?limit=3").then((r) => r.json()).then((d) => setSermons(d.sermons ?? []));
    fetch("/api/announcements").then((r) => r.json()).then((d) => setAnnouncements(d.announcements ?? []));
    fetch("/api/events?upcoming=true").then((r) => r.json()).then((d) => setEvents(d.events?.slice(0, 3) ?? []));
  }, []);

  return (
    <div className="min-h-screen bg-navy-950">
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-navy-600/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full text-gold-400 text-sm font-medium mb-8"
          >
            <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
              <img src="/jc-logo.jpeg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            Welcome to Jesus Convoy
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-[1.1] mb-6"
          >
            Advancing God&apos;s{" "}
            <span className="gradient-text">Kingdom</span>
            <br /> Together
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="text-slate-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            A vibrant community of believers committed to worship, discipleship, and
            impacting our world for Christ.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/live"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 gradient-gold rounded-2xl font-bold text-navy-950 hover:opacity-90 transition-opacity shadow-2xl shadow-gold-500/30"
            >
              <Play className="w-5 h-5" />
              Watch Live
            </Link>
            <Link
              href="/give"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 glass rounded-2xl font-semibold text-white hover:border-gold-500/40 transition-all"
            >
              <Heart className="w-5 h-5 text-gold-400" />
              Give Online
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-2 px-8 py-2 text-slate-300 hover:text-white font-medium transition-colors"
            >
              Join Us <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 text-xs"
        >
          <span>Scroll to explore</span>
          <div className="w-px h-8 bg-gradient-to-b from-slate-500 to-transparent" />
        </motion.div>
      </section>

      {/* ── Service Times ── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Sunday First Service", time: "8:00 AM", emoji: "🌅" },
            { label: "Sunday Second Service", time: "10:30 AM", emoji: "☀️" },
            { label: "Wednesday Bible Study", time: "6:00 PM", emoji: "📖" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              className="glass rounded-2xl p-6 flex items-center gap-4"
            >
              <span className="text-3xl">{s.emoji}</span>
              <div>
                <p className="text-slate-400 text-sm">{s.label}</p>
                <p className="text-white font-bold text-xl">{s.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Announcements ── */}
      {announcements.length > 0 && (
        <section className="py-8 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="glass rounded-3xl p-6 sm:p-8 border-l-4 border-gold-500">
              <p className="text-gold-400 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <Star className="w-4 h-4" /> Latest Announcements
              </p>
              <div className="space-y-4">
                {announcements.slice(0, 2).map((a) => (
                  <div key={a._id} className="border-b border-white/5 last:border-0 pb-4 last:pb-0">
                    <p className="text-white font-bold text-lg mb-1">{a.title}</p>
                    <p className="text-slate-400 text-sm leading-relaxed">{a.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Sermons ── */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-gold-500 text-sm font-semibold uppercase tracking-widest mb-2">
                Featured
              </p>
              <h2 className="text-4xl font-black text-white">Latest Sermons</h2>
            </div>
            <Link
              href="/sermons"
              className="flex items-center gap-1 text-gold-400 hover:text-gold-300 text-sm font-medium transition-colors"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sermons.length === 0
              ? [0, 1, 2].map((i) => (
                  <div key={i} className="glass rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-44 bg-white/5 shimmer" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-white/5 rounded shimmer w-3/4" />
                      <div className="h-3 bg-white/5 rounded shimmer w-1/2" />
                    </div>
                  </div>
                ))
              : sermons.map((s, i) => (
                  <motion.div
                    key={s._id}
                    custom={i}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={fadeUp}
                  >
                    <Link href={`/sermons/${s._id}`} className="group block">
                      <div className="glass rounded-2xl overflow-hidden card-hover">
                        <div className="h-44 bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center relative">
                          {s.thumbnail ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={s.thumbnail}
                              alt={s.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 gradient-gold rounded-full flex items-center justify-center">
                              <Play className="w-7 h-7 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <p className="text-gold-400 text-xs font-medium mb-1">{s.topic}</p>
                          <h3 className="text-white font-bold text-lg group-hover:text-gold-400 transition-colors line-clamp-2 mb-2">
                            {s.title}
                          </h3>
                          <p className="text-slate-400 text-sm">
                            {s.speaker} &middot;{" "}
                            {new Date(s.date).toLocaleDateString("en-NG", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      {/* ── Upcoming Events ── */}
      <section className="section-padding bg-navy-900/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-gold-500 text-sm font-semibold uppercase tracking-widest mb-2">
                Coming Up
              </p>
              <h2 className="text-4xl font-black text-white">Upcoming Events</h2>
            </div>
            <Link
              href="/events"
              className="flex items-center gap-1 text-gold-400 hover:text-gold-300 text-sm font-medium transition-colors"
            >
              See all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.length === 0 ? (
              <p className="text-slate-500 col-span-3 text-center py-10">
                No upcoming events. Check back soon!
              </p>
            ) : (
              events.map((e, i) => (
                <motion.div
                  key={e._id}
                  custom={i}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  variants={fadeUp}
                >
                  <Link href={`/events/${e._id}`}>
                    <div className="glass rounded-2xl p-6 card-hover">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-14 h-14 gradient-gold rounded-xl flex flex-col items-center justify-center text-white font-bold">
                          <span className="text-xs">
                            {new Date(e.date).toLocaleString("en", { month: "short" }).toUpperCase()}
                          </span>
                          <span className="text-xl leading-none">
                            {new Date(e.date).getDate()}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-white font-bold mb-1 line-clamp-2">{e.title}</h3>
                          {e.location && (
                            <p className="text-slate-400 text-sm flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {e.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── CTA Strip ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 border border-gold-500/20"
          >
            <div className="w-16 h-16 gradient-gold rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-gold-500/30">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-black text-white mb-4">
              Join Our Community
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
              Become part of a family that worships together, grows together, and
              impacts the world together.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="px-8 py-4 gradient-gold rounded-2xl font-bold text-navy-950 hover:opacity-90 transition-opacity"
              >
                Get Connected
              </Link>
              <Link
                href="/ministries"
                className="px-8 py-4 glass rounded-2xl font-semibold text-white hover:border-gold-500/40 transition-all"
              >
                Find a Ministry
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
