"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Save } from "lucide-react";

interface Settings { churchName?: string; tagline?: string; serviceTimings?: string; location?: string; phone?: string; email?: string; liveStreamUrl?: string; facebookUrl?: string; youtubeUrl?: string; instagramUrl?: string; paystackEnabled?: boolean; }

const inputCls = "w-full px-4 py-3 glass rounded-xl text-white placeholder-slate-500 border border-white/10 focus:outline-none focus:border-gold-500/50";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((d) => { setSettings(d.settings ?? {}); setLoading(false); });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    if (res.ok) toast.success("Settings saved!");
    else toast.error("Failed to save settings");
  }

  if (loading) return <div className="p-8 text-center text-slate-500">Loading…</div>;

  const field = (label: string, key: keyof Settings, type = "text", placeholder = "") => (
    <div key={key}>
      <label className="text-slate-400 text-sm mb-1.5 block font-medium">{label}</label>
      <input type={type} value={(settings[key] as string) ?? ""} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })} placeholder={placeholder} className={inputCls} />
    </div>
  );

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Configure your church platform</p>
      </div>

      <form onSubmit={handleSave} className="max-w-2xl space-y-8">
        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-bold text-lg border-b border-white/10 pb-3">Church Info</h2>
          {field("Church Name", "churchName", "text", "Jesus Convoy")}
          {field("Tagline", "tagline", "text", "Advancing God's Kingdom Together")}
          {field("Service Timings", "serviceTimings", "text", "Sunday: 8am & 10:30am | Wednesday: 6pm")}
          {field("Location", "location", "text", "Lagos, Nigeria")}
          {field("Phone", "phone", "tel", "+234 800 000 0000")}
          {field("Email", "email", "email", "info@jesusconvoy.org")}
        </div>

        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-bold text-lg border-b border-white/10 pb-3">Live Stream</h2>
          {field("YouTube/Facebook Live URL", "liveStreamUrl", "url", "https://youtube.com/watch?v=...")}
        </div>

        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-bold text-lg border-b border-white/10 pb-3">Social Links</h2>
          {field("Facebook URL", "facebookUrl", "url")}
          {field("YouTube URL", "youtubeUrl", "url")}
          {field("Instagram URL", "instagramUrl", "url")}
        </div>

        <div className="glass rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-white font-semibold">Enable Paystack Giving</p>
            <p className="text-slate-400 text-sm">Allow online donations via Paystack</p>
          </div>
          <button
            type="button"
            onClick={() => setSettings({ ...settings, paystackEnabled: !settings.paystackEnabled })}
            className={`relative w-12 h-6 rounded-full transition-colors ${settings.paystackEnabled ? "bg-gold-500" : "bg-slate-600"}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings.paystackEnabled ? "translate-x-6" : ""}`} />
          </button>
        </div>

        <button type="submit" disabled={saving} className="flex items-center gap-2 px-8 py-4 gradient-gold rounded-2xl font-bold text-navy-950 hover:opacity-90 disabled:opacity-50">
          <Save className="w-5 h-5" />
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
