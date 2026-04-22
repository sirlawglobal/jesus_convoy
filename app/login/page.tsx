"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error("Please fill all fields");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (res.ok) {
      const data = await res.json();
      toast.success(`Welcome back, ${data.user.name}!`);
      router.push(`/dashboard/${data.user.role}`);
    } else {
      const data = await res.json();
      toast.error(data.error ?? "Login failed");
    }
  }

  return (
    <div className="glass rounded-3xl p-8 border border-white/10">
      <h1 className="text-2xl font-black text-white mb-6">Welcome Back</h1>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="text-slate-400 text-sm mb-1.5 block font-medium">Email Address</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="admin@jesusconvoy.org"
            className="w-full px-4 py-3.5 glass rounded-xl text-white placeholder-slate-500 border border-white/10 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/20 transition-all"
          />
        </div>

        <div>
          <label className="text-slate-400 text-sm mb-1.5 block font-medium">Password</label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="w-full px-4 py-3.5 pr-12 glass rounded-xl text-white placeholder-slate-500 border border-white/10 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 gradient-gold rounded-2xl font-bold text-navy-950 text-base hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-white/10 text-center">
        <Link href="/" className="text-slate-400 hover:text-gold-400 text-sm transition-colors">
          ← Back to public site
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] bg-gold-500/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center shadow-xl shadow-gold-500/20 border border-white/10 group-hover:border-gold-500/50 transition-all">
              <img src="/jc-logo.jpeg" alt="Jesus Convoy Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-white text-2xl">
              Jesus <span className="gradient-text">Convoy</span>
            </span>
          </Link>
          <p className="text-slate-400 mt-2 text-sm">Staff Portal Login</p>
        </div>

        <Suspense fallback={<div className="glass rounded-3xl p-8 border border-white/10 text-center text-slate-400 font-medium">Loading portal...</div>}>
          <LoginForm />
        </Suspense>

        <p className="text-center text-slate-600 text-xs mt-4">
          Authorized personnel only. All access is logged.
        </p>
      </div>
    </div>
  );
}
