"use client";

import { useEffect, useState } from "react";
import { getAdminStats } from "@/actions/users";
import { useSession } from "@/lib/auth-client";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Users, BookOpen, AlertTriangle, UserCheck, Calendar, ArrowRight, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminHome() {
  const { data: session } = useSession();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (err) {
        toast.error("Failed to load admin statistics");
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
        <span className="text-xs text-slate-400">Loading admin metrics...</span>
      </div>
    );
  }

  if (!stats) return <p className="text-sm text-slate-400">Unable to load admin data.</p>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight text-slate-200 flex items-center gap-2">
          <ShieldCheck className="text-indigo-400" /> Admin Console
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Platform-wide moderation controls, growth charts, and user contributions logs.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-slate-800/20 border border-slate-700/30 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Active Users</div>
            <div className="text-2xl font-extrabold text-slate-200 mt-1">{stats.totalUsers || 0}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
            <Users size={18} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-800/20 border border-slate-700/30 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Public Wisdoms</div>
            <div className="text-2xl font-extrabold text-slate-200 mt-1">{stats.totalPublicLessons || 0}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
            <BookOpen size={18} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-800/20 border border-slate-700/30 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Reported Content</div>
            <div className="text-2xl font-extrabold text-rose-400 mt-1">{stats.totalReportedCount || 0}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
            <AlertTriangle size={18} />
          </div>
        </div>
      </div>

      {/* Growth charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Line Chart */}
        <div className="p-5 rounded-2xl bg-slate-800/20 border border-slate-700/30 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">User Registration Growth</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} />
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
                <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lessons Growth Bar Chart */}
        <div className="p-5 rounded-2xl bg-slate-800/20 border border-slate-700/30 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Public Lessons Growth</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.lessonGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} />
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
                <Bar dataKey="lessons" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Contributors and Today's Lessons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Active Contributors */}
        <div className="p-5 rounded-2xl bg-slate-800/20 border border-slate-700/30 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <UserCheck size={14} className="text-indigo-400" /> Platform Top Contributors
          </h3>
          {stats.contributors?.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No contributors logged.</p>
          ) : (
            <div className="divide-y divide-slate-800/30">
              {stats.contributors?.map((contrib) => (
                <div key={contrib._id} className="flex items-center justify-between py-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center text-white text-xs font-bold">
                      {contrib.photo ? (
                        <img src={contrib.photo} alt={contrib.name} className="w-full h-full object-cover" />
                      ) : (
                        contrib.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span className="text-xs font-semibold text-slate-200">{contrib.name}</span>
                  </div>
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-300 font-bold px-2 py-0.5 rounded-full">
                    {contrib.lessonCount} entries
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Today's Lessons */}
        <div className="p-5 rounded-2xl bg-slate-800/20 border border-slate-700/30 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Calendar size={14} className="text-cyan-400" /> New Lessons Today
          </h3>
          {stats.todaysLessons?.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No lessons added today yet.</p>
          ) : (
            <div className="divide-y divide-slate-800/30 max-h-[220px] overflow-y-auto pr-2">
              {stats.todaysLessons?.map((l) => (
                <div key={l._id} className="flex items-center justify-between py-2.5">
                  <div className="flex flex-col space-y-0.5 truncate max-w-[75%]">
                    <h4 className="text-xs font-bold truncate text-slate-200">{l.title}</h4>
                    <span className="text-[9px] text-slate-400">By {l.creatorName}</span>
                  </div>
                  <a
                    href={`/lessons/${l._id}`}
                    className="p-1 rounded bg-slate-800 hover:bg-indigo-500 text-slate-400 hover:text-white transition-colors"
                  >
                    <ArrowRight size={10} />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
