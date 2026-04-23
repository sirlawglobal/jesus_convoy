import Link from "next/link";
import { Share2, Video, Globe, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-navy-950 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2 flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center shadow-lg shadow-gold-500/20 border border-white/10 group-hover:border-gold-500/50 transition-all">
                <img src="/jc-logo.jpeg" alt="Jesus Convoy Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-white text-xl">
                Jesus <span className="gradient-text">Convoy</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
              Advancing God&apos;s Kingdom Together. A vibrant community of believers committed to
              worship, discipleship, and impacting our world.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-gold-400 hover:border-gold-500/30 transition-all"
                aria-label="Facebook"
              >
                <Share2 className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-gold-400 hover:border-gold-500/30 transition-all"
                aria-label="YouTube"
              >
                <Video className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-gold-400 hover:border-gold-500/30 transition-all"
                aria-label="Instagram"
              >
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                ["About Us", "/about"],
                ["Sermons", "/sermons"],
                ["Events", "/events"],
                ["Ministries", "/ministries"],
                ["Blog", "/blog"],
                ["Give Online", "/give"],
                ["Watch Live", "/live"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-slate-400 hover:text-gold-400 text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">
              Service Times
            </h4>
            <div className="space-y-2 text-sm text-slate-400 mb-8">
              <p>🕗 Sunday: 8:00am &amp; 10:30am</p>
              <p>🕕 Wednesday: 6:00pm</p>
            </div>
            <div className="space-y-4 text-sm text-slate-400">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold-500 shrink-0" />
                <span>info@jesusconvoy.org</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold-500 shrink-0" />
                <span>+234 800 000 0000</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                <span>Akure, Ondo State, Nigeria</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {year} Jesus Convoy. All rights reserved.
          </p>
          <Link
            href="/dashboard"
            className="text-slate-500 hover:text-gold-400 text-xs transition-colors"
          >
            Staff Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}
