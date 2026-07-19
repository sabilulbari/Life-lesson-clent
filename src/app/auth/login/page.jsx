"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { KeyRound, Mail } from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await signIn.email({
        email: formData.email,
        password: formData.password,
        callbackURL: "/dashboard",
      });

      if (response?.error) {
        toast.error(response.error.message || "Invalid credentials.");
      } else {
        toast.success("Successfully logged in!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      toast.error(err.message || "An error occurred during log in.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard"
      });
    } catch (err) {
      toast.error("Google authentication failed.");
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-12">
      <div className="w-full max-w-md glass rounded-3xl p-8 border border-[var(--card-border)] relative overflow-hidden">
        {/* Decorative lights */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative text-center mb-8">
          <h2 className="text-3xl font-extrabold font-display bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Log in to continue exploring shared wisdom.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Mail size={16} />
              </span>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm text-[var(--foreground)] transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <KeyRound size={16} />
              </span>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm text-[var(--foreground)] transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 font-semibold text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
            ) : (
              <span>Log In</span>
            )}
          </button>
        </form>

        {/* Social / Google Login */}
        <div className="mt-6 pt-6 border-t border-slate-700/50">
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full py-2.5 rounded-xl border border-slate-700/50 bg-slate-800/40 text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all flex items-center justify-center space-x-2 font-medium text-sm"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Don't have an account?{" "}
          <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold underline">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
}
