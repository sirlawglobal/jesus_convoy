"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Eye } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";

interface Post { _id: string; title: string; slug: string; category: string; published: boolean; publishedAt?: string; author?: { name: string }; }

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", category: "", coverImage: "", published: false });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const d = await fetch("/api/blog?limit=50").then((r) => r.json());
    setPosts(d.posts ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, tags: [] }),
    });
    setSaving(false);
    if (res.ok) { toast.success("Post created!"); setModalOpen(false); setForm({ title: "", content: "", category: "", coverImage: "", published: false }); load(); }
    else { const d = await res.json(); toast.error(d.error ?? "Failed"); }
  }

  async function handleDelete(slug: string) {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/blog/${slug}`, { method: "DELETE" });
    toast.success("Post deleted"); load();
  }

  const inputCls = "w-full px-4 py-3 glass rounded-xl text-white placeholder-slate-500 border border-white/10 focus:outline-none focus:border-gold-500/50";

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Blog Posts</h1>
          <p className="text-slate-400 mt-1">Manage devotionals and articles</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2 gradient-gold rounded-xl font-semibold text-navy-950 hover:opacity-90">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-white/10">
            <tr className="text-left">
              {["Title", "Category", "Author", "Status", "Date", "Actions"].map((h) => (
                <th key={h} className="px-6 py-4 text-slate-400 text-xs font-semibold uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading…</td></tr>
            ) : posts.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No posts yet.</td></tr>
            ) : posts.map((p) => (
              <tr key={p._id} className="hover:bg-white/3 transition-colors">
                <td className="px-6 py-4 text-white font-medium text-sm max-w-xs truncate">{p.title}</td>
                <td className="px-6 py-4 text-slate-400 text-sm capitalize">{p.category}</td>
                <td className="px-6 py-4 text-slate-400 text-sm">{p.author?.name ?? "—"}</td>
                <td className="px-6 py-4">
                  <Badge label={p.published ? "Published" : "Draft"} variant={p.published ? "green" : "gray"} />
                </td>
                <td className="px-6 py-4 text-slate-500 text-sm">{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" }) : "—"}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 p-1"><Eye className="w-4 h-4" /></a>
                    <button onClick={() => handleDelete(p.slug)} className="text-slate-400 hover:text-red-400 p-1"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Blog Post">
        <form onSubmit={handleCreate} className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Post Title" className={inputCls} />
          <input required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category (e.g. Devotional)" className={inputCls} />
          <input value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} placeholder="Cover Image URL (optional)" className={inputCls} />
          <textarea required rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Write your post content here…" className={inputCls + " resize-none"} />
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-4 h-4 accent-gold-500" />
            <span className="text-slate-300 text-sm">Publish immediately</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 glass rounded-xl text-slate-300">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-3 gradient-gold rounded-xl font-bold text-navy-950 disabled:opacity-50">
              {saving ? "Saving…" : "Create Post"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
