"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Sun, Moon, Menu, X, ChevronDown, User, LayoutDashboard, LogOut, Award } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();

  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState("dark");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // থিম ইনিশিয়ালাইজেশন
  // useEffect(() => {
  //   const savedTheme = localStorage.getItem("theme") || "dark";
  //   setTheme(savedTheme);
  //   if (savedTheme === "dark") {
  //     document.documentElement.classList.add("dark");
  //   } else {
  //     document.documentElement.classList.remove("dark");
  //   }
  // }, []);

  // থিম টগল
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // সাইন আউট হ্যান্ডলার (সঠিক ফাংশন কল সহ)
  const handleLogout = async () => {
    try {
      // authClient.signOut ব্যবহার করতে হবে যেন কোনো ইম্পোর্ট এরর না হয়
      await authClient.signOut();
      toast.success("Successfully logged out");
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Error signing out");
    }
  };

  const isFreeUser = session?.user && (!session.user.plan || session.user.plan === "free");
  const isAdminUser = session?.user && session.user.role === "admin";

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Public Lessons", href: "/public-lessons" },
    ...(session
      ? [
          { name: "Add Lesson", href: "/dashboard/add-lesson" },
          { name: "My Lessons", href: "/dashboard/my-lessons" },
        ]
      : []),
    ...(isFreeUser ? [{ name: "Pricing / Upgrade", href: "/pricing" }] : []),
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-(--card-border) text-foreground backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-indigo-500/20">
                L
              </div>
              <span className="font-bold text-xl tracking-tight font-display bg-linear-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">Life Lessons</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors hover:text-indigo-400 py-1 ${isActive ? "text-indigo-500" : "text-slate-400 dark:text-slate-300"}`}
                >
                  {link.name}
                  {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-indigo-500 to-cyan-400 rounded-full" />}
                </Link>
              );
            })}
          </div>

          {/* Action Bar (Theme + Auth) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700/50 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Auth Buttons */}
            {isPending ? (
              <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                  className="flex items-center space-x-2 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/50 border border-slate-200 dark:border-slate-700/50 transition-all"
                >
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
                    {session.user.image ? (
                      <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
                    ) : (
                      session.user.name?.charAt(0).toUpperCase() || "U"
                    )}
                  </div>
                  <span className="text-xs font-semibold max-w-[100px] truncate hidden lg:block">{session.user.name}</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl glass border border-[var(--card-border)] shadow-xl p-1.5 animate-in fade-in-50 slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-[var(--card-border)] mb-1">
                      <div className="text-xs text-slate-400 truncate">Logged in as</div>
                      <div className="text-sm font-semibold truncate text-gradient">{session.user.name}</div>
                      {session.user.plan === "premium" && (
                        <span className="inline-flex items-center gap-1 mt-1 text-[10px] bg-indigo-500/20 text-indigo-400 font-bold px-1.5 py-0.5 rounded-full">
                          <Award size={10} /> Premium User
                        </span>
                      )}
                    </div>

                    <Link
                      href={isAdminUser ? "/dashboard/admin/profile" : "/dashboard/profile"}
                      className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg text-sm hover:bg-indigo-500/10 hover:text-indigo-400 transition-colors"
                    >
                      <User size={14} />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      href={isAdminUser ? "/dashboard/admin" : "/dashboard"}
                      className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg text-sm hover:bg-indigo-500/10 hover:text-indigo-400 transition-colors"
                    >
                      <LayoutDashboard size={14} />
                      <span>{isAdminUser ? "Admin Panel" : "Dashboard"}</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg text-sm hover:bg-rose-500/10 text-rose-400 transition-colors text-left"
                    >
                      <LogOut size={14} />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login" className="px-4 py-2 text-sm font-medium hover:text-indigo-500 transition-colors">
                  Log In
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all hover:scale-[1.02]"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            <button onClick={toggleTheme} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-300">
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-300">
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass border-t border-[var(--card-border)] py-4 px-4 space-y-3 animate-in slide-in-from-top-5 duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  pathname === link.href ? "bg-indigo-500/10 text-indigo-400" : "hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-[var(--card-border)]">
            {session ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-3 px-3 py-1">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-indigo-500 flex items-center justify-center text-white font-bold">
                    {session.user.image ? (
                      <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
                    ) : (
                      session.user.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-semibold truncate">{session.user.name}</div>
                    <div className="text-xs text-slate-400 truncate">{session.user.email}</div>
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <Link
                    href={isAdminUser ? "/dashboard/admin" : "/dashboard"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <LayoutDashboard size={16} />
                    <span>{isAdminUser ? "Admin Panel" : "Dashboard"}</span>
                  </Link>

                  <Link
                    href={isAdminUser ? "/dashboard/admin/profile" : "/dashboard/profile"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <User size={16} />
                    <span>My Profile</span>
                  </Link>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center space-x-2 w-full px-3 py-2 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 text-left"
                  >
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 px-2">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-center text-sm font-medium rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-center text-sm font-semibold rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
