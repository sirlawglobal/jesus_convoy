"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Bell, Plus } from "lucide-react";
import Modal from "@/components/ui/Modal";

interface Announcement { _id: string; title: string; message: string; audience: string; priority: string; createdAt: string; }

export default function LeaderAnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [ministryId, setMinistryId] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", message: "", audience: "ministry", priority: "normal", expiresAt: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => {
      const id = d.user?.ministry?._id ?? "";
      setMinistryId(id);
      const url = id ? `/api/announcements?ministry=${id}` : "/api/announcements";
      fetch(url).then((r) => r.json()).then((a) => { setItems(a.announcements ?? []); setLoading(false); });
    });
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, ministry: ministryId }),
    });
    setSaving(false);
    if (res.ok) {
      toast.success("Announcement posted!");
      setModalOpen(false);
      setForm({ title: "", message: "", audience: "ministry", priority: "normal", expiresAt: "" });
      const url = ministryId ? `/api/announcements?ministry=${ministryId}` : "/api/announcements";
      fetch(url).then((r) => r.json()).then((a) => setItems(a.announcements ?? []));
    } else { const d = await res.json(); toast.error(d.error ?? "Failed"); }
  }

  const inputCls = "w-full px-4 py-3 glass rounded-xl text-white placeholder-slate-500 border border-white/10 focus:outline-none focus:border-gold-500/50";
  const selectCls = "w-full px-4 py-3 glass rounded-xl text-white border border-white/10 bg-navy-950 focus:outline-none focus:border-gold-500/50";

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Announcements</h1>
          <p className="text-slate-400 mt-1">Post updates to your ministry</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2 gradient-gold rounded-xl font-semibold text-navy-950 hover:opacity-90">
          <Plus className="w-4 h-4" /> New
        </button>
      </div>

      <div className="space-y-4">
        {loading ? <div className="text-slate-500 text-center py-8">Loading…</div> : items.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center flex flex-col items-center text-slate-500">
            <Bell className="w-10 h-10 mb-2 opacity-30" />
            <p>No announcements yet.</p>
          </div>
        ) : items.map((a) => (
          <div key={a._id} className="glass rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${a.priority === "high" ? "bg-red-500/20 text-red-400" : a.priority === "low" ? "bg-slate-500/20 text-slate-400" : "bg-gold-500/20 text-gold-400"}`}>{a.priority}</span>
              <span className="text-slate-500 text-xs ml-auto">{new Date(a.createdAt).toLocaleDateString("en-NG", { dateStyle: "medium" })}</span>
            </div>
            <h3 className="text-white font-bold mb-1">{a.title}</h3>
            <p className="text-slate-400 text-sm">{a.message}</p>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Announcement">
        <form onSubmit={handleCreate} className="space-y-3">
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className={inputCls} />
          <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Message…" className={inputCls + " resize-none"} />
          <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className={selectCls}>
            <option value="low">Low Priority</option>
            <option value="normal">Normal Priority</option>
            <option value="high">High Priority</option>
          </select>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 glass rounded-xl text-slate-300">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-3 gradient-gold rounded-xl font-bold text-navy-950 disabled:opacity-50">
              {saving ? "Posting…" : "Post"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
