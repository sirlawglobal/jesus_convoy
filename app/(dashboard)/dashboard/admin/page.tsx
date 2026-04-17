"use client";

import { useEffect, useState } from "react";
import { Users, BookOpen, Calendar, MessageSquare, HandCoins, Megaphone, Building2, Newspaper } from "lucide-react";

interface Stats { users: number; sermons: number; events: number; messages: number; donations: number; announcements: number; ministries: number; posts: number; }

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-white font-black text-3xl mt-1">{value.toLocaleString()}</p>
    </div>
  );
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats>({ users: 0, sermons: 0, events: 0, messages: 0, donations: 0, announcements: 0, ministries: 0, posts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/users?limit=1").then((r) => r.json()),
      fetch("/api/sermons?limit=1").then((r) => r.json()),
      fetch("/api/events").then((r) => r.json()),
      fetch("/api/contact").then((r) => r.json()),
      fetch("/api/donations").then((r) => r.json()),
      fetch("/api/announcements").then((r) => r.json()),
      fetch("/api/ministries").then((r) => r.json()),
      fetch("/api/blog?limit=1").then((r) => r.json()),
    ]).then(([u, s, e, m, d, a, mn, b]) => {
      setStats({
        users: u.total ?? 0,
        sermons: s.total ?? 0,
        events: e.events?.length ?? 0,
        messages: m.messages?.length ?? 0,
        donations: d.total ?? 0,
        announcements: a.announcements?.length ?? 0,
        ministries: mn.ministries?.length ?? 0,
        posts: b.total ?? 0,
      });
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => <div key={i} className="glass rounded-2xl h-32 shimmer" />)}
    </div>
  );

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">Admin Dashboard</h1>
        <p className="text-slate-400 mt-1">Overview of Jesus Convoy operations</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Members" value={stats.users} icon={Users} color="bg-purple-500/20 text-purple-400" />
        <StatCard label="Sermons" value={stats.sermons} icon={BookOpen} color="bg-gold-500/20 text-gold-400" />
        <StatCard label="Events" value={stats.events} icon={Calendar} color="bg-blue-500/20 text-blue-400" />
        <StatCard label="Ministries" value={stats.ministries} icon={Building2} color="bg-emerald-500/20 text-emerald-400" />
        <StatCard label="Blog Posts" value={stats.posts} icon={Newspaper} color="bg-pink-500/20 text-pink-400" />
        <StatCard label="Announcements" value={stats.announcements} icon={Megaphone} color="bg-orange-500/20 text-orange-400" />
        <StatCard label="Messages" value={stats.messages} icon={MessageSquare} color="bg-cyan-500/20 text-cyan-400" />
        <StatCard label="Total Donations (₦)" value={stats.donations} icon={HandCoins} color="bg-green-500/20 text-green-400" />
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="text-white font-bold text-lg mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            ["Add Sermon", "/dashboard/admin/sermons"],
            ["Add Event", "/dashboard/admin/events"],
            ["New Blog Post", "/dashboard/admin/blog"],
            ["New Announcement", "/dashboard/admin/announcements"],
          ].map(([label, href]) => (
            <a key={href} href={href} className="px-4 py-3 glass rounded-xl text-sm font-medium text-slate-300 hover:text-gold-400 hover:border-gold-500/30 transition-all text-center">
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
