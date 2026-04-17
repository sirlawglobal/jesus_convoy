"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Users, UserCheck } from "lucide-react";
import Modal from "@/components/ui/Modal";

interface Ministry { _id: string; name: string; description: string; leader?: { name: string }; workers: { name: string }[]; isActive: boolean; }

export default function AdminMinistriesPage() {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const d = await fetch("/api/ministries").then((r) => r.json());
    setMinistries(d.ministries ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/ministries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) { toast.success("Ministry created!"); setModalOpen(false); setForm({ name: "", description: "" }); load(); }
    else { const d = await res.json(); toast.error(d.error ?? "Failed"); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this ministry?")) return;
    await fetch(`/api/ministries/${id}`, { method: "DELETE" });
    toast.success("Ministry deleted"); load();
  }

  const inputCls = "w-full px-4 py-3 glass rounded-xl text-white placeholder-slate-500 border border-white/10 focus:outline-none focus:border-gold-500/50";

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Ministries</h1>
          <p className="text-slate-400 mt-1">Manage church departments and teams</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2 gradient-gold rounded-xl font-semibold text-navy-950 hover:opacity-90">
          <Plus className="w-4 h-4" /> New Ministry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          [1, 2, 3].map((i) => <div key={i} className="glass rounded-2xl h-40 shimmer" />)
        ) : ministries.length === 0 ? (
          <div className="col-span-3 glass rounded-2xl p-12 text-center text-slate-500">No ministries yet.</div>
        ) : (
          ministries.map((m) => (
            <div key={m._id} className="glass rounded-2xl p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-white font-bold text-lg">{m.name}</h3>
                <button onClick={() => handleDelete(m._id)} className="text-slate-500 hover:text-red-400 p-1 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-slate-400 text-sm line-clamp-2 mb-4">{m.description}</p>
              <div className="flex items-center gap-4 text-xs text-slate-500 border-t border-white/10 pt-3">
                <span className="flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  {m.leader?.name ?? "No leader"}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {m.workers.length} member{m.workers.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Ministry">
        <form onSubmit={handleCreate} className="space-y-4">
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ministry Name" className={inputCls} />
          <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description…" className={inputCls + " resize-none"} />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 glass rounded-xl text-slate-300">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-3 gradient-gold rounded-xl font-bold text-navy-950 disabled:opacity-50">
              {saving ? "Creating…" : "Create Ministry"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
