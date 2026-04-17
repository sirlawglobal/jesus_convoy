"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Edit } from "lucide-react";
import Modal from "@/components/ui/Modal";

interface Sermon { _id: string; title: string; speaker: string; topic: string; date: string; views: number; }

export default function AdminSermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", speaker: "", topic: "", date: "", videoUrl: "", audioUrl: "", description: "" });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const d = await fetch("/api/sermons?limit=100").then((r) => r.json());
    setSermons(d.sermons ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/sermons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) { toast.success("Sermon added!"); setModalOpen(false); setForm({ title: "", speaker: "", topic: "", date: "", videoUrl: "", audioUrl: "", description: "" }); load(); }
    else { const d = await res.json(); toast.error(d.error ?? "Failed"); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this sermon?")) return;
    await fetch(`/api/sermons/${id}`, { method: "DELETE" });
    toast.success("Sermon deleted"); load();
  }

  const inputCls = "w-full px-4 py-3 glass rounded-xl text-white placeholder-slate-500 border border-white/10 focus:outline-none focus:border-gold-500/50";

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Sermons</h1>
          <p className="text-slate-400 mt-1">Manage sermon library</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2 gradient-gold rounded-xl font-semibold text-navy-950 hover:opacity-90">
          <Plus className="w-4 h-4" /> Add Sermon
        </button>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-white/10">
            <tr className="text-left">
              {["Title", "Speaker", "Topic", "Date", "Views", "Actions"].map((h) => (
                <th key={h} className="px-6 py-4 text-slate-400 text-xs font-semibold uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading…</td></tr>
            ) : sermons.map((s) => (
              <tr key={s._id} className="hover:bg-white/3 transition-colors">
                <td className="px-6 py-4 text-white font-medium text-sm max-w-xs truncate">{s.title}</td>
                <td className="px-6 py-4 text-slate-400 text-sm">{s.speaker}</td>
                <td className="px-6 py-4 text-slate-400 text-sm">{s.topic}</td>
                <td className="px-6 py-4 text-slate-400 text-sm">{new Date(s.date).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}</td>
                <td className="px-6 py-4 text-slate-400 text-sm">{s.views}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="text-slate-400 hover:text-blue-400 p-1"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(s._id)} className="text-slate-400 hover:text-red-400 p-1"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Sermon">
        <form onSubmit={handleCreate} className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Sermon Title" className={inputCls} />
          <div className="grid grid-cols-2 gap-3">
            <input required value={form.speaker} onChange={(e) => setForm({ ...form, speaker: e.target.value })} placeholder="Speaker" className={inputCls} />
            <input required value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} placeholder="Topic" className={inputCls} />
          </div>
          <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputCls} />
          <input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="YouTube URL (optional)" className={inputCls} />
          <input value={form.audioUrl} onChange={(e) => setForm({ ...form, audioUrl: e.target.value })} placeholder="Audio URL (optional)" className={inputCls} />
          <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description (optional)" className={inputCls + " resize-none"} />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 glass rounded-xl text-slate-300">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-3 gradient-gold rounded-xl font-bold text-navy-950 disabled:opacity-50">
              {saving ? "Saving…" : "Add Sermon"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
