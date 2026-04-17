"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Edit } from "lucide-react";
import Modal from "@/components/ui/Modal";

interface IEvent { _id: string; title: string; date: string; location?: string; registrationOpen: boolean; registrations: unknown[]; }

export default function AdminEventsPage() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", date: "", endDate: "", location: "", registrationOpen: false });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const d = await fetch("/api/events").then((r) => r.json());
    setEvents(d.events ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) { toast.success("Event created!"); setModalOpen(false); setForm({ title: "", description: "", date: "", endDate: "", location: "", registrationOpen: false }); load(); }
    else { const d = await res.json(); toast.error(d.error ?? "Failed"); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this event?")) return;
    await fetch(`/api/events/${id}`, { method: "DELETE" });
    toast.success("Event deleted"); load();
  }

  const inputCls = "w-full px-4 py-3 glass rounded-xl text-white placeholder-slate-500 border border-white/10 focus:outline-none focus:border-gold-500/50";

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Events</h1>
          <p className="text-slate-400 mt-1">Manage church programs and events</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2 gradient-gold rounded-xl font-semibold text-navy-950 hover:opacity-90">
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      <div className="space-y-3">
        {loading ? <div className="text-slate-500 text-center py-8">Loading…</div> : events.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center text-slate-500">No events yet.</div>
        ) : events.map((e) => (
          <div key={e._id} className="glass rounded-2xl p-5 flex items-center gap-5">
            <div className="w-14 h-14 gradient-gold rounded-xl flex flex-col items-center justify-center text-white font-bold flex-shrink-0 shadow-lg shadow-gold-500/20">
              <span className="text-xs uppercase">{new Date(e.date).toLocaleString("en", { month: "short" })}</span>
              <span className="text-xl leading-none">{new Date(e.date).getDate()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold">{e.title}</h3>
              <div className="flex gap-4 mt-1 text-slate-400 text-sm">
                {e.location && <span>{e.location}</span>}
                <span>{e.registrations.length} registrations</span>
                {e.registrationOpen && <span className="text-emerald-400">Registration open</span>}
              </div>
            </div>
            <div className="flex gap-2">
              <button className="text-slate-400 hover:text-blue-400 p-2 transition-colors"><Edit className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(e._id)} className="text-slate-400 hover:text-red-400 p-2 transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Event">
        <form onSubmit={handleCreate} className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Event Title" className={inputCls} />
          <textarea required rows={3} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className={inputCls + " resize-none"} />
          <div className="grid grid-cols-2 gap-3">
            <input required type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputCls} />
            <input type="datetime-local" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className={inputCls} />
          </div>
          <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location (optional)" className={inputCls} />
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.registrationOpen} onChange={(e) => setForm({ ...form, registrationOpen: e.target.checked })} className="w-4 h-4 accent-gold-500" />
            <span className="text-slate-300 text-sm">Enable Registration</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 glass rounded-xl text-slate-300">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-3 gradient-gold rounded-xl font-bold text-navy-950 disabled:opacity-50">
              {saving ? "Creating…" : "Create Event"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
