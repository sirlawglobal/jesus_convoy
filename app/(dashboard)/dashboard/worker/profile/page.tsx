"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Save, User } from "lucide-react";

interface Me { _id: string; name: string; email: string; role: string; phone?: string; bio?: string; avatar?: string; }

export default function WorkerProfilePage() {
  const [me, setMe] = useState<Me | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", bio: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => {
      if (d.user) {
        setMe(d.user);
        setForm({ name: d.user.name, phone: d.user.phone ?? "", bio: d.user.bio ?? "" });
      }
    });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!me) return;
    setSaving(true);
    const res = await fetch(`/api/users/${me._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) toast.success("Profile updated!");
    else { const d = await res.json(); toast.error(d.error ?? "Failed"); }
  }

  const inputCls = "w-full px-4 py-3 glass rounded-xl text-white placeholder-slate-500 border border-white/10 focus:outline-none focus:border-gold-500/50";

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">My Profile</h1>
        <p className="text-slate-400 mt-1">Update your personal information</p>
      </div>

      <div className="max-w-lg">
        {/* Avatar */}
        <div className="glass rounded-2xl p-6 mb-6 flex items-center gap-6">
          <div className="w-20 h-20 gradient-gold rounded-full flex items-center justify-center text-white font-black text-3xl flex-shrink-0">
            {form.name.charAt(0) || <User className="w-8 h-8" />}
          </div>
          <div>
            <p className="text-white font-bold text-xl">{form.name || "Your Name"}</p>
            <p className="text-slate-400 text-sm">{me?.email}</p>
            <span className="mt-1 inline-block text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full capitalize">{me?.role}</span>
          </div>
        </div>

        <form onSubmit={handleSave} className="glass rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-slate-400 text-sm mb-1 block font-medium">Full Name *</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" className={inputCls} />
          </div>
          <div>
            <label className="text-slate-400 text-sm mb-1 block font-medium">Phone Number</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+234 800 000 0000" className={inputCls} />
          </div>
          <div>
            <label className="text-slate-400 text-sm mb-1 block font-medium">Bio</label>
            <textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell us a little about yourself…" className={inputCls + " resize-none"} />
          </div>
          <button type="submit" disabled={saving} className="flex items-center gap-2 w-full justify-center py-3 gradient-gold rounded-xl font-bold text-navy-950 hover:opacity-90 disabled:opacity-50">
            <Save className="w-4 h-4" />
            {saving ? "Saving…" : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
