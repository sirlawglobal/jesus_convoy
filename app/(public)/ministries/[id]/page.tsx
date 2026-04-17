"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Users, ArrowLeft } from "lucide-react";

interface Ministry {
  _id: string; name: string; description: string; image?: string;
  leader?: { _id: string; name: string; avatar?: string; phone?: string; email?: string };
  workers: { _id: string; name: string; avatar?: string }[];
}

export default function MinistryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [ministry, setMinistry] = useState<Ministry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/ministries/${id}`).then((r) => r.json()).then((d) => { setMinistry(d.ministry); setLoading(false); });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!ministry) return <div className="min-h-screen bg-navy-950 flex items-center justify-center text-slate-400">Ministry not found.</div>;

  return (
    <div className="min-h-screen bg-navy-950 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/ministries" className="inline-flex items-center gap-2 text-slate-400 hover:text-gold-400 transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Ministries
        </Link>

        <div className="glass rounded-3xl p-8 mb-8">
          <div className="w-16 h-16 gradient-gold rounded-xl flex items-center justify-center mb-6 shadow-xl shadow-gold-500/20">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-4">{ministry.name}</h1>
          <p className="text-slate-300 leading-relaxed text-lg">{ministry.description}</p>
        </div>

        {ministry.leader && (
          <div className="glass rounded-2xl p-6 mb-6">
            <h2 className="text-white font-bold text-xl mb-4">Ministry Leader</h2>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 gradient-gold rounded-full flex items-center justify-center text-white font-bold text-xl">
                {ministry.leader.name.charAt(0)}
              </div>
              <div>
                <p className="text-white font-semibold text-lg">{ministry.leader.name}</p>
                {ministry.leader.email && <p className="text-slate-400 text-sm">{ministry.leader.email}</p>}
              </div>
            </div>
          </div>
        )}

        {ministry.workers.length > 0 && (
          <div className="glass rounded-2xl p-6">
            <h2 className="text-white font-bold text-xl mb-4">Ministry Members ({ministry.workers.length})</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ministry.workers.map((w) => (
                <div key={w._id} className="flex items-center gap-3 glass rounded-xl p-3">
                  <div className="w-8 h-8 gradient-gold rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {w.name.charAt(0)}
                  </div>
                  <span className="text-white text-sm font-medium truncate">{w.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
