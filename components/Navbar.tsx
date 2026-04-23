"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
        <div className="flex items-center justify-between h-16 md:h-20 transition-all">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden flex items-center justify-center shadow-lg shadow-gold-500/20 border border-white/10 group-hover:border-gold-500/50 transition-all">
              <img src="/jc-logo.jpeg" alt="Jesus Convoy Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-white text-lg md:text-xl tracking-tight">
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
              className="px-5 py-2 rounded-xl text-sm font-semibold text-navy-900 gradient-gold hover:opacity-90 transition-all shadow-lg shadow-gold-500/20"
            >
              Give
            </Link>
            <button
              onClick={handleDashboard}
              className="px-5 py-2 rounded-xl text-sm font-medium text-white border border-white/10 bg-white/5 hover:border-gold-500/50 hover:text-gold-400 transition-all"
            >
              Dashboard
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6 text-gold-400" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden border-t border-white/10 bg-navy-950/98 backdrop-blur-2xl overflow-hidden"
          >
            <div className="px-4 py-6 space-y-2">
              {publicNav.map((item, idx) => (
                <motion.div
                  key={item.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      isActive(item.href)
                        ? "text-gold-400 bg-gold-500/10 border border-gold-500/20"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-4 grid grid-cols-2 gap-3"
              >
                <Link
                  href="/give"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-bold text-navy-900 gradient-gold shadow-lg shadow-gold-500/20"
                >
                  Give
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center px-4 py-3.5 rounded-xl text-sm font-medium text-white border border-white/10 bg-white/5"
                >
                  Dashboard
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
