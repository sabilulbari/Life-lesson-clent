"use client";

import { useSession } from "@/lib/auth-client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  PlusCircle,
  BookOpen,
  Bookmark,
  User,
  Users,
  Flag,
  Settings,
  ShieldCheck,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  ArrowRight
} from "lucide-react";
import toast from "react-hot-toast";

export default function DashboardLayout({ children }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      toast.error("Please login to access the dashboard.");
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
          <span className="text-sm text-slate-400 font-medium">Verifying authorization...</span>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const isAdmin = session.user.role === "admin";
  const isPremium = session.user.plan === "premium";
  
  // Guard admin routes
  const isAdminRoute = pathname.startsWith("/dashboard/admin");
  if (isAdminRoute && !isAdmin) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center text-2xl font-bold border border-rose-500/25">
          !
        </div>
        <h1 className="text-3xl font-extrabold font-display">Access Denied</h1>
        <p className="text-sm text-slate-400 max-w-sm">
          You do not have the required administrative permissions to access this route.
        </p>
        <Link href="/dashboard" className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-xs transition-colors">
          Go to User Dashboard
        </Link>
      </div>
    );
  }

  // Sidebar Links
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
    <div className="flex-grow flex flex-col md:flex-row gap-6 py-4">
      {/* Mobile Toggle Bar */}
      <div className="md:hidden flex items-center justify-between glass p-4 rounded-2xl border border-[var(--card-border)]">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
            {session.user.image ? (
              <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
            ) : (
              session.user.name?.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <div className="text-xs font-bold truncate max-w-[150px]">{session.user.name}</div>
            <div className="text-[9px] text-slate-500">
              {isAdmin ? "Administrator" : isPremium ? "Premium User" : "Free Member"}
            </div>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`md:w-64 flex-shrink-0 md:block ${sidebarOpen ? "block" : "hidden"} md:relative z-30`}>
        <div className="glass rounded-3xl border border-[var(--card-border)] p-6 space-y-6 h-full sticky top-24">
          
          {/* User Summary Widget */}
          <div className="hidden md:flex items-center space-x-3 pb-5 border-b border-slate-800/40">
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-indigo-500 flex items-center justify-center text-white font-bold text-lg border-2 border-indigo-500/20 shadow-md">
              {session.user.image ? (
                <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
              ) : (
                session.user.name?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-bold text-sm text-slate-200 truncate">{session.user.name}</h4>
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
                  <span className="inline-flex items-center gap-0.5 text-[9px] bg-slate-800 text-slate-400 font-bold px-1.5 py-0.5 rounded">
                    Free Plan
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Links list */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-3 mb-2">
              {isAdminRoute ? "Admin Management" : "User Navigation"}
            </div>
            
            {activeLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-indigo-500/15 text-indigo-400 border-l-2 border-indigo-500"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
                  }`}
                >
                  <Icon size={16} />
                  <span>{link.name}</span>
                  {isActive && <ChevronRight size={12} className="ml-auto text-indigo-400" />}
                </Link>
              );
            })}
          </div>

          {/* Switch Role Quick Link for Admins */}
          {isAdmin && (
            <div className="pt-4 border-t border-slate-800/40">
              <Link
                href={isAdminRoute ? "/dashboard" : "/dashboard/admin"}
                className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-bold bg-slate-800/40 hover:bg-indigo-500/10 border border-slate-700/50 text-slate-300 hover:text-indigo-400 transition-all"
              >
                <span>{isAdminRoute ? "View User Side" : "View Admin Panel"}</span>
                <ArrowRight size={10} />
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Main Dashboard Panel Content */}
      <div className="flex-grow max-w-full overflow-hidden">
        <div className="glass rounded-3xl border border-[var(--card-border)] p-6 sm:p-8 min-h-[550px] flex flex-col justify-between">
          <div className="space-y-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
