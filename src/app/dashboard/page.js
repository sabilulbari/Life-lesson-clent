"use client";

import { useEffect, useState } from "react";
import { getUserStats } from "@/actions/users";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Plus, Award, Bookmark, ArrowRight, Calendar, BookOpen, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function DashboardHome() {
  const { data: session } = useSession();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getUserStats();
        setStats(data);
      } catch (err) {
        toast.error("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent animate-spin rounded-full mb-3" />
        <span className="text-xs text-slate-400">Loading metrics...</span>
      </div>
    );
  }

  if (!stats) return <p className="text-sm text-slate-400">No data found</p>;

  return (
    <div className="space-y-8">
      {/* Welcome message */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight text-slate-200">
          Hello, {session?.user?.name}!
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Here is an overview of your wisdom portfolio and weekly contributions.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-slate-800/20 border border-slate-700/30 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lessons Created</div>
            <div className="text-2xl font-extrabold text-slate-200 mt-1">{stats.totalCreated || 0}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
            <BookOpen size={18} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-800/20 border border-slate-700/30 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Saved Favorites</div>
            <div className="text-2xl font-extrabold text-slate-200 mt-1">{stats.totalSaved || 0}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
            <Bookmark size={18} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-800/20 border border-slate-700/30 flex items-center justify-between col-span-1 sm:col-span-2 lg:col-span-1">
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Plan Level</div>
            <div className="text-base font-extrabold text-gradient uppercase mt-1">
              {session?.user?.plan || "Free"} ⭐
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
            <Award size={18} />
          </div>
        </div>
      </div>

      {/* Chart and Quick Links Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Contribution Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-800/20 border border-slate-700/30 space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Activity Tracker</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.contributionChart}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} allowDecimals={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15, 23, 42, 0.95)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "8px",
                    color: "#f8fafc",
                    fontSize: "11px"
                  }}
                />
                <Bar dataKey="lessons" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions Shortcuts */}
        <div className="p-5 rounded-2xl bg-slate-800/20 border border-slate-700/30 space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Quick Actions</h3>
          <div className="flex flex-col gap-2.5">
            <Link
              href="/dashboard/add-lesson"
              className="flex items-center justify-between w-full p-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white transition-all text-xs font-semibold"
            >
              <div className="flex items-center space-x-2">
                <Plus size={14} />
                <span>Write Life Lesson</span>
              </div>
              <ArrowRight size={12} />
            </Link>

            <Link
              href="/dashboard/profile"
              className="flex items-center justify-between w-full p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 transition-all text-xs font-semibold"
            >
              <span>Manage Profile Details</span>
              <ArrowRight size={12} />
            </Link>

            <Link
              href="/public-lessons"
              className="flex items-center justify-between w-full p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 transition-all text-xs font-semibold"
            >
              <span>Browse Community Wisdom</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Recently Created Lessons */}
      <div className="p-5 rounded-2xl bg-slate-800/20 border border-slate-700/30 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Recently Added Lessons</h3>
          <Link href="/dashboard/my-lessons" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline">
            View All My Lessons
          </Link>
        </div>

        {stats.recentLessons?.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">You haven't written any life lessons yet. Click "Write Life Lesson" to start!</p>
        ) : (
          <div className="divide-y divide-slate-800/30">
            {stats.recentLessons?.map((lesson) => (
              <div key={lesson._id} className="flex items-center justify-between py-3">
                <div className="flex flex-col space-y-0.5 max-w-[70%]">
                  <h4 className="text-sm font-bold truncate text-slate-200">{lesson.title}</h4>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">{lesson.category}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    lesson.visibility === "Public" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                  }`}>
                    {lesson.visibility}
                  </span>
                  <Link
                    href={`/lessons/${lesson._id}`}
                    className="p-1 rounded bg-slate-800 hover:bg-indigo-500 text-slate-400 hover:text-white transition-colors"
                  >
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
