"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Users, UserPlus, UserMinus } from "lucide-react";

interface MinistryMember { _id: string; name: string; email: string; phone?: string; }
interface Ministry { _id: string; name: string; description: string; leader?: MinistryMember; workers: MinistryMember[]; }

export default function LeaderMinistryPage() {
  const [ministry, setMinistry] = useState<Ministry | null>(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<MinistryMember[]>([]);
  const [addEmail, setAddEmail] = useState("");

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then(async (d) => {
      const ministryId = d.user?.ministry?._id;
      if (!ministryId) { setLoading(false); return; }
      const [min, users] = await Promise.all([
        fetch(`/api/ministries/${ministryId}`).then((r) => r.json()),
        fetch("/api/users?limit=100").then((r) => r.json()),
      ]);
      setMinistry(min.ministry);
      setAllUsers(users.users ?? []);
      setLoading(false);
    });
  }, []);

  async function removeWorker(workerId: string) {
    if (!ministry) return;
    const res = await fetch(`/api/ministries/${ministry._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ removeWorker: workerId }),
    });
    if (res.ok) { toast.success("Worker removed"); const d = await res.json(); setMinistry(d.ministry); }
    else toast.error("Failed");
  }

  async function addWorker() {
    if (!ministry || !addEmail) return;
    const user = allUsers.find((u) => u.email.toLowerCase() === addEmail.toLowerCase());
    if (!user) return toast.error("No user found with that email");
    const res = await fetch(`/api/ministries/${ministry._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addWorker: user._id }),
    });
    if (res.ok) { toast.success("Worker added"); const d = await res.json(); setMinistry(d.ministry); setAddEmail(""); }
    else toast.error("Failed");
  }

  if (loading) return <div className="p-8 text-center text-slate-500">Loading…</div>;
  if (!ministry) return <div className="p-8 text-center text-slate-500">You are not assigned to a ministry.</div>;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">{ministry.name}</h1>
        <p className="text-slate-400 mt-1">{ministry.description}</p>
      </div>

      {/* Add worker */}
      <div className="glass rounded-2xl p-6 mb-6">
        <h2 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-gold-400" /> Add Member
        </h2>
        <div className="flex gap-3">
          <input
            value={addEmail}
            onChange={(e) => setAddEmail(e.target.value)}
            placeholder="Enter member email…"
            className="flex-1 px-4 py-3 glass rounded-xl text-white placeholder-slate-500 border border-white/10 focus:outline-none focus:border-gold-500/50"
          />
          <button onClick={addWorker} className="px-5 py-3 gradient-gold rounded-xl font-semibold text-navy-950 hover:opacity-90 transition-opacity whitespace-nowrap">
            Add Member
          </button>
        </div>
      </div>

      {/* Workers list */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-gold-400" /> Ministry Members ({ministry.workers.length})
        </h2>
        {ministry.workers.length === 0 ? (
          <p className="text-slate-500 text-sm">No members yet. Add some above.</p>
        ) : (
          <div className="space-y-2">
            {ministry.workers.map((w) => (
              <div key={w._id} className="flex items-center gap-4 glass rounded-xl px-4 py-3">
                <div className="w-9 h-9 gradient-gold rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {w.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm">{w.name}</p>
                  <p className="text-slate-500 text-xs truncate">{w.email}</p>
                </div>
                <button onClick={() => removeWorker(w._id)} className="text-slate-500 hover:text-red-400 transition-colors p-1">
                  <UserMinus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
