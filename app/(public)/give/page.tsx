"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Heart, CheckCircle } from "lucide-react";
import { generateReference } from "@/lib/utils";

const CATEGORIES = [
  { value: "tithe", label: "Tithe", desc: "Give your first-fruit to God" },
  { value: "offering", label: "Offering", desc: "Sow into the Kingdom" },
  { value: "donation", label: "Donation", desc: "Support a specific project" },
] as const;

type Category = (typeof CATEGORIES)[number]["value"];

export default function GivePage() {
  const [form, setForm] = useState({
    donorName: "",
    email: "",
    amount: "",
    category: "tithe" as Category,
    currency: "NGN" as "NGN" | "USD"
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const currencySymbol = form.currency === "NGN" ? "₦" : "$";
  const minAmount = form.currency === "NGN" ? 100 : 1;

  async function handleGive(e: React.FormEvent) {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    if (!form.donorName || !form.email || isNaN(amount) || amount < minAmount) {
      return toast.error(`Please fill all fields. Minimum amount is ${currencySymbol}${minAmount}`);
    }

    setLoading(true);
    const reference = generateReference();

    // Save donation record
    const saveRes = await fetch("/api/donations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        donorName: form.donorName,
        email: form.email,
        amount,
        category: form.category,
        currency: form.currency,
        reference
      }),
    });

    if (!saveRes.ok) {
      setLoading(false);
      return toast.error("Could not initiate payment. Please try again.");
    }

    const PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!PUBLIC_KEY) {
      setLoading(false);
      toast.error("Payment not configured. Please contact the church.");
      return;
    }

    // Load Paystack inline
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.onload = () => {
      // @ts-expect-error Paystack is a global from CDN
      const handler = window.PaystackPop.setup({
        key: PUBLIC_KEY,
        email: form.email,
        amount: amount * 100,
        currency: form.currency,
        ref: reference,
        metadata: { custom_fields: [{ display_name: "Donor", variable_name: "donor", value: form.donorName }] },
        callback: async (response: { reference: string }) => {
          const verifyRes = await fetch("/api/donations/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reference: response.reference }),
          });
          setLoading(false);
          if (verifyRes.ok) { setSuccess(true); toast.success("Thank you for your giving! 🙏"); }
          else toast.error("Payment verification failed. Please contact us.");
        },
        onClose: () => { setLoading(false); toast.error("Payment cancelled"); },
      });
      handler.openIframe();
    };
    document.body.appendChild(script);
  }

  return (
    <div className="min-h-screen bg-navy-950">
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[500px] h-[300px] bg-gold-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <p className="text-gold-500 text-sm font-semibold uppercase tracking-widest mb-3">Give Online</p>
          <h1 className="text-5xl font-black text-white mb-4">Kingdom <span className="gradient-text">Giving</span></h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            &ldquo;Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.&rdquo; — 2 Cor 9:7
          </p>
        </div>
      </section>

      <div className="max-w-xl mx-auto px-6 pb-24">
        {success ? (
          <div className="glass rounded-3xl p-12 text-center">
            <div className="w-20 h-20 bg-gold-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-gold-400" />
            </div>
            <h2 className="text-white font-black text-3xl mb-3">Thank You! 🙏</h2>
            <p className="text-slate-400 text-lg">Your giving has been received. May God bless you abundantly.</p>
          </div>
        ) : (
          <div className="glass rounded-3xl p-8">
            <h2 className="text-white font-bold text-2xl mb-6 flex items-center gap-2">
              <Heart className="w-6 h-6 text-gold-400" /> Make a Gift
            </h2>

            {/* Currency selector */}
            <div className="flex gap-2 mb-6 p-1 glass rounded-2xl w-fit">
              {["NGN", "USD"].map((curr) => (
                <button
                  key={curr}
                  type="button"
                  onClick={() => setForm({ ...form, currency: curr as "NGN" | "USD", amount: "" })}
                  className={`px-6 py-2 rounded-xl font-bold transition-all ${form.currency === curr ? "gradient-gold text-navy-950" : "text-slate-400 hover:text-white"}`}
                >
                  {curr}
                </button>
              ))}
            </div>

            {/* Category selector */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setForm({ ...form, category: c.value })}
                  className={`p-4 rounded-2xl text-left transition-all ${form.category === c.value ? "gradient-gold text-navy-950" : "glass text-slate-300 hover:border-gold-500/30"}`}
                >
                  <p className="font-bold text-sm">{c.label}</p>
                  <p className={`text-xs mt-0.5 ${form.category === c.value ? "text-navy-900" : "text-slate-500"}`}>{c.desc}</p>
                </button>
              ))}
            </div>

            <form onSubmit={handleGive} className="space-y-4">
              <div>
                <label className="text-slate-400 text-sm mb-1 block">Full Name *</label>
                <input required value={form.donorName} onChange={(e) => setForm({ ...form, donorName: e.target.value })} placeholder="John Doe" className="w-full px-4 py-3 glass rounded-xl text-white placeholder-slate-500 border border-white/10 focus:outline-none focus:border-gold-500/50" />
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-1 block">Email Address *</label>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" className="w-full px-4 py-3 glass rounded-xl text-white placeholder-slate-500 border border-white/10 focus:outline-none focus:border-gold-500/50" />
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-1 block">Amount ({currencySymbol}) *</label>
                <input required type="number" min={minAmount} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder={form.currency === "NGN" ? "5000" : "50"} className="w-full px-4 py-3 glass rounded-xl text-white placeholder-slate-500 border border-white/10 focus:outline-none focus:border-gold-500/50" />
              </div>

              {/* Quick amounts */}
              <div className="flex gap-2 flex-wrap">
                {(form.currency === "NGN" ? [1000, 2000, 5000, 10000, 20000, 50000] : [10, 20, 50, 100, 200, 500]).map((a) => (
                  <button key={a} type="button" onClick={() => setForm({ ...form, amount: String(a) })}
                    className="px-3 py-1 glass rounded-lg text-xs text-slate-300 hover:text-gold-400 hover:border-gold-500/30 transition-all">
                    {currencySymbol}{a.toLocaleString()}
                  </button>
                ))}
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-4 gradient-gold rounded-2xl font-black text-navy-950 text-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                <Heart className="w-5 h-5" />
                {loading ? "Processing…" : "Give Now"}
              </button>
              <p className="text-slate-500 text-xs text-center">Secured by Paystack. Your transaction is safe and encrypted.</p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
