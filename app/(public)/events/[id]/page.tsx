"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Calendar, MapPin, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface IEvent { _id: string; title: string; description: string; date: string; endDate?: string; location?: string; image?: string; registrationOpen: boolean; }

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    fetch(`/api/events/${id}`).then((r) => r.json()).then((d) => { setEvent(d.event); setLoading(false); });
  }, [id]);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) return toast.error("Please fill all required fields");
    setSubmitting(true);
    const res = await fetch(`/api/events/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSubmitting(false);
    if (res.ok) { setRegistered(true); toast.success("Registration successful!"); }
    else { const d = await res.json(); toast.error(d.error ?? "Registration failed"); }
  }

  if (loading) return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!event) return <div className="min-h-screen bg-navy-950 flex items-center justify-center text-slate-400">Event not found.</div>;

  return (
    <div className="min-h-screen bg-navy-950 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/events" className="inline-flex items-center gap-2 text-slate-400 hover:text-gold-400 transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </Link>

        <div className="glass rounded-3xl overflow-hidden">
          <div className="h-64 gradient-navy flex items-end p-8 relative">
            <div className="w-20 h-20 gradient-gold rounded-2xl flex flex-col items-center justify-center text-white font-bold absolute top-8 right-8 shadow-xl">
              <span className="text-xs uppercase">{new Date(event.date).toLocaleString("en", { month: "short" })}</span>
              <span className="text-3xl leading-none">{new Date(event.date).getDate()}</span>
            </div>
            <div>
              <h1 className="text-3xl font-black text-white mb-2">{event.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-gold-400" />
                  {new Date(event.date).toLocaleString("en-NG", { dateStyle: "full", timeStyle: "short" })}
                </span>
                {event.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-gold-400" />{event.location}</span>}
              </div>
            </div>
          </div>
          <div className="p-8">
            <p className="text-slate-300 leading-relaxed mb-8">{event.description}</p>

            {event.registrationOpen && !registered && (
              <div className="glass rounded-2xl p-6 border border-gold-500/20">
                <h2 className="text-white font-bold text-xl mb-4">Register for this Event</h2>
                <form onSubmit={handleRegister} className="space-y-4">
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full Name *" className="w-full px-4 py-3 glass rounded-xl text-white placeholder-slate-500 border border-white/10 focus:outline-none focus:border-gold-500/50" />
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email Address *" className="w-full px-4 py-3 glass rounded-xl text-white placeholder-slate-500 border border-white/10 focus:outline-none focus:border-gold-500/50" />
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone Number (optional)" className="w-full px-4 py-3 glass rounded-xl text-white placeholder-slate-500 border border-white/10 focus:outline-none focus:border-gold-500/50" />
                  <button type="submit" disabled={submitting} className="w-full py-3 gradient-gold rounded-xl font-bold text-navy-950 hover:opacity-90 transition-opacity disabled:opacity-50">
                    {submitting ? "Registering…" : "Register Now"}
                  </button>
                </form>
              </div>
            )}

            {registered && (
              <div className="flex items-center gap-3 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">You are registered! See you there 🎉</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
