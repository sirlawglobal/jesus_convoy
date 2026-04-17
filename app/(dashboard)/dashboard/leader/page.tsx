"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Megaphone, Users, Building2 } from "lucide-react";

interface Me { name: string; role: string; ministry?: { _id: string; name: string }; }
interface Announcement { _id: string; title: string; message: string; audience: string; priority: string; createdAt: string; }

const priorityBorder = { high: "border-red-500/40", normal: "border-gold-500/40", low: "border-slate-500/40" };

export default function LeaderOverviewPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => {
      if (d.user) {
        setMe(d.user);
        const ministryId = d.user.ministry?._id;
        const url = ministryId ? `/api/announcements?ministry=${ministryId}` : "/api/announcements";
        fetch(url).then((r) => r.json()).then((a) => setAnnouncements(a.announcements ?? []));
      }
    });
  }, []);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">Leader Dashboard</h1>
        <p className="text-slate-400 mt-1">Welcome back, {me?.name ?? "Leader"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="glass rounded-2xl p-6">
          <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-3">
            <Building2 className="w-5 h-5" />
          </div>
          <p className="text-slate-400 text-sm">Your Ministry</p>
          <p className="text-white font-bold text-xl mt-1">{me?.ministry?.name ?? "Not assigned"}</p>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="w-10 h-10 bg-gold-500/20 text-gold-400 rounded-xl flex items-center justify-center mb-3">
            <Megaphone className="w-5 h-5" />
          </div>
          <p className="text-slate-400 text-sm">Announcements</p>
          <p className="text-white font-bold text-xl mt-1">{announcements.length}</p>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mb-3">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-slate-400 text-sm">Role</p>
          <p className="text-white font-bold text-xl mt-1 capitalize">{me?.role}</p>
        </div>
      </div>

      {/* Announcements */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-white font-bold text-xl mb-4">Recent Announcements</h2>
        {announcements.length === 0 ? (
          <p className="text-slate-500 text-sm">No announcements to show.</p>
        ) : (
          <div className="space-y-3">
            {announcements.slice(0, 5).map((a) => (
              <div key={a._id} className={`glass rounded-xl p-4 border-l-2 ${priorityBorder[a.priority as keyof typeof priorityBorder] ?? "border-slate-500/40"}`}>
                <h3 className="text-white font-semibold mb-1">{a.title}</h3>
                <p className="text-slate-400 text-sm">{a.message}</p>
                <p className="text-slate-500 text-xs mt-2">{new Date(a.createdAt).toLocaleDateString("en-NG", { dateStyle: "medium" })}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
