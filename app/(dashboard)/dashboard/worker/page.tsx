"use client";

import { useEffect, useState } from "react";
import { Bell, Building2 } from "lucide-react";

interface Me { name: string; email: string; role: string; ministry?: { name: string }; }
interface Announcement { _id: string; title: string; message: string; priority: string; createdAt: string; }

export default function WorkerOverviewPage() {
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
        <h1 className="text-3xl font-black text-white">My Dashboard</h1>
        <p className="text-slate-400 mt-1">Welcome, {me?.name ?? "Worker"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="glass rounded-2xl p-6">
          <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mb-3">
            <Building2 className="w-5 h-5" />
          </div>
          <p className="text-slate-400 text-sm">My Ministry</p>
          <p className="text-white font-bold text-xl mt-1">{me?.ministry?.name ?? "Not assigned"}</p>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="w-10 h-10 bg-gold-500/20 text-gold-400 rounded-xl flex items-center justify-center mb-3">
            <Bell className="w-5 h-5" />
          </div>
          <p className="text-slate-400 text-sm">Announcements</p>
          <p className="text-white font-bold text-xl mt-1">{announcements.length}</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="text-white font-bold text-xl mb-4">Announcements</h2>
        {announcements.length === 0 ? (
          <div className="flex flex-col items-center text-slate-500 py-8">
            <Bell className="w-8 h-8 mb-2 opacity-30" />
            <p>No announcements at this time.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {announcements.map((a) => (
              <div key={a._id} className={`glass rounded-xl p-4 border-l-2 ${a.priority === "high" ? "border-red-500/50" : a.priority === "low" ? "border-slate-500/30" : "border-gold-500/40"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-semibold text-sm flex-1">{a.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${a.priority === "high" ? "bg-red-500/20 text-red-400" : "bg-gold-500/20 text-gold-400"}`}>{a.priority}</span>
                </div>
                <p className="text-slate-400 text-sm">{a.message}</p>
                <p className="text-slate-600 text-xs mt-2">{new Date(a.createdAt).toLocaleDateString("en-NG", { dateStyle: "medium" })}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
