"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Cross, LayoutDashboard, Users, Building2, BookOpen, Calendar,
  Newspaper, Megaphone, HandCoins, MessageSquare, Settings,
  LogOut, Menu, X, ChevronRight, User
} from "lucide-react";

interface Me {
  name: string; email: string; role: "admin" | "leader" | "worker"; avatar?: string;
  ministry?: { name: string };
}

const adminNav = [
  { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
  { label: "Users", href: "/dashboard/admin/users", icon: Users },
  { label: "Ministries", href: "/dashboard/admin/ministries", icon: Building2 },
  { label: "Sermons", href: "/dashboard/admin/sermons", icon: BookOpen },
  { label: "Events", href: "/dashboard/admin/events", icon: Calendar },
  { label: "Blog", href: "/dashboard/admin/blog", icon: Newspaper },
  { label: "Announcements", href: "/dashboard/admin/announcements", icon: Megaphone },
  { label: "Donations", href: "/dashboard/admin/donations", icon: HandCoins },
  { label: "Messages", href: "/dashboard/admin/messages", icon: MessageSquare },
  { label: "Settings", href: "/dashboard/admin/settings", icon: Settings },
];

const leaderNav = [
  { label: "Overview", href: "/dashboard/leader", icon: LayoutDashboard },
  { label: "My Ministry", href: "/dashboard/leader/ministry", icon: Building2 },
  { label: "Announcements", href: "/dashboard/leader/announcements", icon: Megaphone },
];

const workerNav = [
  { label: "Overview", href: "/dashboard/worker", icon: LayoutDashboard },
  { label: "My Profile", href: "/dashboard/worker/profile", icon: User },
];

const roleNav = { admin: adminNav, leader: leaderNav, worker: workerNav };
const roleColor = { admin: "bg-purple-500/20 text-purple-400", leader: "bg-blue-500/20 text-blue-400", worker: "bg-emerald-500/20 text-emerald-400" };

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.ok ? r.json() : null).then((d) => {
      if (d?.user) setMe(d.user);
      else router.push("/login");
    });
  }, [router]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Logged out");
    router.push("/login");
  }

  const nav = me ? roleNav[me.role] : [];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-8 h-8 gradient-gold rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-gold-500/30">
          <Cross className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-white text-sm">
            Jesus <span className="gradient-text">Convoy</span>
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-slate-500 hover:text-white transition-colors hidden lg:block"
        >
          <ChevronRight className={`w-4 h-4 transition-transform ${collapsed ? "" : "rotate-180"}`} />
        </button>
      </div>

      {/* User profile */}
      {me && (
        <div className={`px-4 py-4 border-b border-white/10 ${collapsed ? "items-center" : ""}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 gradient-gold rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {me.name.charAt(0)}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-white font-semibold text-sm truncate">{me.name}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${roleColor[me.role]}`}>
                  {me.role}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {nav.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "gradient-gold text-navy-950"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 pb-4 space-y-1 border-t border-white/10 pt-4">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <Cross className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Public Site</span>}
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col h-screen ${collapsed ? "w-16" : "w-60"} glass border-r border-white/10 transition-all duration-300 flex-shrink-0 sticky top-0`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile topbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 glass border-b border-white/10 flex items-center justify-between px-4 h-14">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 gradient-gold rounded-full flex items-center justify-center">
            <Cross className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-white text-sm">Jesus Convoy</span>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white p-2">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-navy-950 border-r border-white/10 overflow-y-auto pt-14">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
