"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import Modal from "@/components/ui/Modal";

interface Announcement { _id: string; title: string; message: string; audience: string; priority: string; expiresAt?: string; createdAt: string; }
const priorityColor = { high: "text-red-400 bg-red-500/20", normal: "text-gold-400 bg-gold-500/20", low: "text-slate-400 bg-slate-500/20" } as const;

export default function AdminAnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", message: "", audience: "all", priority: "normal", expiresAt: "" });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const d = await fetch("/api/announcements").then((r) => r.json());
    setItems(d.announcements ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) { toast.success("Announcement created!"); setModalOpen(false); load(); setForm({ title: "", message: "", audience: "all", priority: "normal", expiresAt: "" }); }
    else { const d = await res.json(); toast.error(d.error ?? "Failed"); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this announcement?")) return;
    await fetch(`/api/announcements/${id}`, { method: "DELETE" });
    toast.success("Deleted"); load();
  }

  const selectCls = "w-full px-4 py-3 glass rounded-xl text-white border border-white/10 bg-navy-950 focus:outline-none focus:border-gold-500/50";
  const inputCls = "w-full px-4 py-3 glass rounded-xl text-white placeholder-slate-500 border border-white/10 focus:outline-none focus:border-gold-500/50";

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Announcements</h1>
          <p className="text-slate-400 mt-1">Communicate with your congregation</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2 gradient-gold rounded-xl font-semibold text-navy-950 hover:opacity-90">
          <Plus className="w-4 h-4" /> New Announcement
        </button>
      </div>

      <div className="space-y-4">
        {loading ? <div className="text-slate-500 text-center py-8">Loading…</div> : items.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center text-slate-500">No announcements yet.</div>
        ) : items.map((a) => (
          <div key={a._id} className="glass rounded-2xl p-5 flex items-start gap-4">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize flex-shrink-0 mt-0.5 ${priorityColor[a.priority as keyof typeof priorityColor] ?? "text-slate-400"}`}>
              {a.priority}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold mb-1">{a.title}</h3>
              <p className="text-slate-400 text-sm line-clamp-2">{a.message}</p>
              <div className="flex gap-4 mt-2 text-slate-500 text-xs">
                <span>Audience: {a.audience}</span>
                <span>{new Date(a.createdAt).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}</span>
                {a.expiresAt && <span>Expires: {new Date(a.expiresAt).toLocaleDateString("en-NG", { month: "short", day: "numeric" })}</span>}
              </div>
            </div>
            <button onClick={() => handleDelete(a._id)} className="text-slate-500 hover:text-red-400 p-1 transition-colors flex-shrink-0">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Announcement">
        <form onSubmit={handleCreate} className="space-y-3">
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className={inputCls} />
          <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Message…" className={inputCls + " resize-none"} />
          <div className="grid grid-cols-2 gap-3">
            <select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} className={selectCls}>
              <option value="all">Everyone</option>
              <option value="workers">Workers &amp; Leaders</option>
              <option value="ministry">Ministry Specific</option>
            </select>
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className={selectCls}>
              <option value="low">Low Priority</option>
              <option value="normal">Normal Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
          <div>
            <label className="text-slate-400 text-sm mb-1 block">Expiry Date (optional)</label>
            <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className={inputCls} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 glass rounded-xl text-slate-300">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-3 gradient-gold rounded-xl font-bold text-navy-950 disabled:opacity-50">
              {saving ? "Posting…" : "Post Announcement"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
