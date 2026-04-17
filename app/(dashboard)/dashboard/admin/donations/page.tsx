"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HandCoins, TrendingUp } from "lucide-react";

interface Donation { _id: string; donorName: string; email: string; amount: number; category: string; reference: string; status: string; createdAt: string; }
const catColor = { tithe: "text-purple-400 bg-purple-500/20", offering: "text-blue-400 bg-blue-500/20", donation: "text-green-400 bg-green-500/20" } as const;

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/donations").then((r) => r.json()).then((d) => {
      setDonations(d.donations ?? []);
      setTotal(d.total ?? 0);
      setLoading(false);
    });
  }, []);

  const titheTotal = donations.filter((d) => d.category === "tithe").reduce((s, d) => s + d.amount, 0);
  const offeringTotal = donations.filter((d) => d.category === "offering").reduce((s, d) => s + d.amount, 0);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">Donations</h1>
        <p className="text-slate-400 mt-1">Track church giving records</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Received", value: total, icon: TrendingUp, color: "bg-green-500/20 text-green-400" },
          { label: "Tithes", value: titheTotal, icon: HandCoins, color: "bg-purple-500/20 text-purple-400" },
          { label: "Offerings", value: offeringTotal, icon: HandCoins, color: "bg-blue-500/20 text-blue-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass rounded-2xl p-6">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-slate-400 text-sm">{label}</p>
            <p className="text-white font-black text-2xl">₦{value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-white/10">
            <tr className="text-left">
              {["Donor", "Email", "Amount", "Category", "Reference", "Date"].map((h) => (
                <th key={h} className="px-6 py-4 text-slate-400 text-xs font-semibold uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading…</td></tr>
            ) : donations.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No donations yet.</td></tr>
            ) : donations.map((d) => (
              <tr key={d._id} className="hover:bg-white/3 transition-colors">
                <td className="px-6 py-4 text-white font-medium text-sm">{d.donorName}</td>
                <td className="px-6 py-4 text-slate-400 text-sm">{d.email}</td>
                <td className="px-6 py-4 text-white font-bold text-sm">₦{d.amount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${catColor[d.category as keyof typeof catColor] ?? "text-slate-400"}`}>
                    {d.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500 text-xs font-mono">{d.reference}</td>
                <td className="px-6 py-4 text-slate-400 text-sm">{new Date(d.createdAt).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
