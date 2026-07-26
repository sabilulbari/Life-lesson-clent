"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PlusCircle, BookOpen, Bookmark, User, Users, Flag, Settings, ShieldCheck, ChevronRight, Sparkles, ArrowRight } from "lucide-react";

export default function Sidebar({ session, closeMobileMenu }) {
  const pathname = usePathname();
  const isAdmin = session?.user?.role === "admin";
  const isPremium = session?.user?.plan === "premium";
  const isAdminRoute = pathname.startsWith("/dashboard/admin");

  const userLinks = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Add Lesson", href: "/dashboard/add-lesson", icon: PlusCircle },
    { name: "My Lessons", href: "/dashboard/my-lessons", icon: BookOpen },
    { name: "My Favorites", href: "/dashboard/my-favorites", icon: Bookmark },
    { name: "Profile Settings", href: "/dashboard/profile", icon: User },
  ];

  const adminLinks = [
    { name: "Admin Stats", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Manage Users", href: "/dashboard/admin/manage-users", icon: Users },
    { name: "Manage Lessons", href: "/dashboard/admin/manage-lessons", icon: BookOpen },
    { name: "Reported Lessons", href: "/dashboard/admin/reported-lessons", icon: Flag },
    { name: "Admin Profile", href: "/dashboard/admin/profile", icon: Settings },
  ];

  const activeLinks = isAdminRoute ? adminLinks : userLinks;

  return (
    <div className="glass rounded-3xl border border-[var(--card-border)] p-6 space-y-6 h-full sticky top-24">
      {/* User Info Widget */}
      <div className="hidden md:flex items-center space-x-3 pb-5 border-b border-slate-800/40">
        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-indigo-500 flex items-center justify-center text-white font-bold text-lg border-2 border-indigo-500/20 shadow-md">
          {session?.user?.image ? (
            <Image src={session.user.image} height={48} width={48} alt="User" className="w-full h-full object-cover" />
          ) : (
            session?.user?.name?.charAt(0).toUpperCase()
          )}
        </div>
        <div className="overflow-hidden">
          <h4 className="font-bold text-sm text-slate-200 truncate">{session?.user?.name}</h4>
          <div className="flex items-center gap-1.5 mt-0.5">
            {isAdmin ? (
              <span className="inline-flex items-center gap-0.5 text-[9px] bg-rose-500/20 text-rose-400 font-bold px-1.5 py-0.5 rounded">
                <ShieldCheck size={8} /> Admin
              </span>
            ) : isPremium ? (
              <span className="inline-flex items-center gap-0.5 text-[9px] bg-indigo-500/20 text-indigo-400 font-bold px-1.5 py-0.5 rounded">
                <Sparkles size={8} /> Premium
              </span>
            ) : (
              <span className="inline-flex items-center gap-0.5 text-[9px] bg-slate-800 text-slate-400 font-bold px-1.5 py-0.5 rounded">Free Plan</span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-3 mb-2">{isAdminRoute ? "Admin Management" : "User Navigation"}</div>

        {activeLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={closeMobileMenu}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive ? "bg-indigo-500/15 text-indigo-400 border-l-2 border-indigo-500" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
              }`}
            >
              <Icon size={16} />
              <span>{link.name}</span>
              {isActive && <ChevronRight size={12} className="ml-auto text-indigo-400" />}
            </Link>
          );
        })}
      </div>

      {/* Admin Switch Link */}
      {isAdmin && (
        <div className="pt-4 border-t border-slate-800/40">
          <Link
            href={isAdminRoute ? "/dashboard" : "/dashboard/admin"}
            onClick={closeMobileMenu}
            className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-bold bg-slate-800/40 hover:bg-indigo-500/10 border border-slate-700/50 text-slate-300 hover:text-indigo-400 transition-all"
          >
            <span>{isAdminRoute ? "View User Side" : "View Admin Panel"}</span>
            <ArrowRight size={10} />
          </Link>
        </div>
      )}
    </div>
  );
}
