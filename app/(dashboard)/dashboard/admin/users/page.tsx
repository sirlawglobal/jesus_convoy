"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Edit, Search } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";

interface User { _id: string; name: string; email: string; role: "admin" | "leader" | "worker"; phone?: string; ministry?: { name: string }; createdAt: string; }
const roleBadge = { admin: "purple", leader: "blue", worker: "green" } as const;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "worker", phone: "" });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const d = await fetch("/api/users?limit=100").then((r) => r.json());
    setUsers(d.users ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) { toast.success("User created!"); setModalOpen(false); setForm({ name: "", email: "", password: "", role: "worker", phone: "" }); load(); }
    else { const d = await res.json(); toast.error(d.error ?? "Failed"); }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete ${name}?`)) return;
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("User deleted"); load(); }
    else toast.error("Failed to delete");
  }

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Users</h1>
          <p className="text-slate-400 mt-1">Manage church staff and members</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2 gradient-gold rounded-xl font-semibold text-navy-950 hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users…"
          className="w-full pl-10 pr-4 py-3 glass rounded-xl text-white placeholder-slate-500 border border-white/10 focus:outline-none focus:border-gold-500/60 max-w-sm" />
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-white/10">
            <tr className="text-left">
              {["Name", "Email", "Role", "Ministry", "Actions"].map((h) => (
                <th key={h} className="px-6 py-4 text-slate-400 text-xs font-semibold uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No users found.</td></tr>
            ) : (
              filtered.map((u) => (
                <tr key={u._id} className="hover:bg-white/3 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 gradient-gold rounded-full flex items-center justify-center text-white text-sm font-bold">{u.name.charAt(0)}</div>
                      <span className="text-white font-medium text-sm">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{u.email}</td>
                  <td className="px-6 py-4"><Badge label={u.role} variant={roleBadge[u.role]} /></td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{u.ministry?.name ?? "—"}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="text-slate-400 hover:text-blue-400 p-1 transition-colors"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(u._id, u.name)} className="text-slate-400 hover:text-red-400 p-1 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add New User">
        <form onSubmit={handleCreate} className="space-y-4">
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full Name" className="w-full px-4 py-3 glass rounded-xl text-white placeholder-slate-500 border border-white/10 focus:outline-none focus:border-gold-500/50" />
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email Address" className="w-full px-4 py-3 glass rounded-xl text-white placeholder-slate-500 border border-white/10 focus:outline-none focus:border-gold-500/50" />
          <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password (min 6 chars)" className="w-full px-4 py-3 glass rounded-xl text-white placeholder-slate-500 border border-white/10 focus:outline-none focus:border-gold-500/50" />
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone (optional)" className="w-full px-4 py-3 glass rounded-xl text-white placeholder-slate-500 border border-white/10 focus:outline-none focus:border-gold-500/50" />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-4 py-3 glass rounded-xl text-white border border-white/10 bg-navy-950 focus:outline-none focus:border-gold-500/50">
            <option value="worker">Worker</option>
            <option value="leader">Leader</option>
            <option value="admin">Admin</option>
          </select>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 glass rounded-xl text-slate-300 hover:text-white transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-3 gradient-gold rounded-xl font-bold text-navy-950 hover:opacity-90 disabled:opacity-50">
              {saving ? "Creating…" : "Create User"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
