"use client";

import { useEffect, useState } from "react";
import { Radio, Clock } from "lucide-react";

function useCountdown(targetMs: number) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    function tick() {
      const diff = targetMs - Date.now();
      if (diff <= 0) return;
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetMs]);
  return time;
}

// Next Sunday at 10:30am
function nextSunday(): number {
  const now = new Date();
  const sunday = new Date(now);
  sunday.setDate(now.getDate() + ((7 - now.getDay()) % 7 || 7));
  sunday.setHours(10, 30, 0, 0);
  return sunday.getTime();
}

export default function LivePage() {
  const [liveUrl, setLiveUrl] = useState("");
  const countdown = useCountdown(nextSunday());

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => setLiveUrl(d.settings?.liveStreamUrl ?? ""));
  }, []);

  function getEmbedUrl(url: string): string {
    if (!url) return "";
    const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?\s]+)/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1`;
    const fb = url.includes("facebook.com/live");
    if (fb) return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;
    return url;
  }

  const embedUrl = getEmbedUrl(liveUrl);
  const units = ["days", "hours", "minutes", "seconds"] as const;

  return (
    <div className="min-h-screen bg-navy-950">
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[500px] h-[300px] bg-gold-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full text-red-400 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            Live Stream
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Watch <span className="gradient-text">Live</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            Join us for our live service, wherever you are in the world.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 pb-24">
        {/* Live embed */}
        {embedUrl ? (
          <div className="glass rounded-3xl overflow-hidden mb-8 aspect-video">
            <iframe
              src={embedUrl}
              title="Live Stream"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="glass rounded-3xl p-12 text-center mb-8">
            <div className="w-20 h-20 gradient-gold rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-gold-500/30 animate-float">
              <Radio className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-white font-black text-3xl mb-2">Service is Not Live Yet</h2>
            <p className="text-slate-400">Join us this Sunday at 10:30am for a Spirit-filled service.</p>
          </div>
        )}

        {/* Countdown */}
        <div className="glass rounded-3xl p-8 sm:p-12 text-center border border-white/5">
          <p className="text-gold-400 text-sm font-bold uppercase tracking-widest mb-8 flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" /> Next Service Countdown
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {units.map((unit) => (
              <div key={unit} className="glass rounded-2xl p-5 sm:p-6 border border-white/5 shadow-xl shadow-gold-500/5">
                <div className="text-3xl sm:text-4xl font-black text-white mb-1">
                  {String(countdown[unit]).padStart(2, "0")}
                </div>
                <div className="text-slate-500 text-[10px] sm:text-xs uppercase font-bold tracking-widest">{unit}</div>
              </div>
            ))}
          </div>
          <p className="text-slate-500 text-sm mt-8 font-medium italic opacity-70">Every Sunday at 10:30 AM WAT</p>
        </div>
      </div>
    </div>
  );
}
