"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const publicNav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Sermons", href: "/sermons" },
  { label: "Events", href: "/events" },
  { label: "Ministries", href: "/ministries" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  async function handleDashboard() {
    router.push("/dashboard");
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center shadow-lg shadow-gold-500/20 border border-white/10 group-hover:border-gold-500/50 transition-all">
              <img src="/jc-logo.jpeg" alt="Jesus Convoy Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">
              Jesus <span className="gradient-text">Convoy</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {publicNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive(item.href)
                    ? "text-gold-400 bg-gold-500/10"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/give"
              className="px-4 py-1.5 rounded-lg text-sm font-semibold text-navy-900 gradient-gold hover:opacity-90 transition-opacity"
            >
              Give
            </Link>
            <button
              onClick={handleDashboard}
              className="px-4 py-1.5 rounded-lg text-sm font-medium text-white border border-white/20 hover:border-gold-500/50 hover:text-gold-400 transition-all"
            >
              Dashboard
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-navy-950/95 backdrop-blur-xl px-4 py-4 space-y-1">
          {publicNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "text-gold-400 bg-gold-500/10"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-3 flex gap-2">
            <Link
              href="/give"
              className="flex-1 text-center px-4 py-2 rounded-lg text-sm font-semibold text-navy-900 gradient-gold"
            >
              Give
            </Link>
            <Link
              href="/dashboard"
              className="flex-1 text-center px-4 py-2 rounded-lg text-sm font-medium text-white border border-white/20"
            >
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
