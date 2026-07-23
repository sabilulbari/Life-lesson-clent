"use client";

import Link from "next/link";
import { Check, Sparkles, ArrowRight, Download, ShieldCheck, Home, Mail } from "lucide-react";

export default function PaymentSuccess({
  transactionId = "TXN_9876543210",
  amount = "$39.99",
  planName = "Life Lessons Premium",
  customerEmail = "",
  paymentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }),
}) {
  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg glass rounded-3xl p-8 border border-[var(--card-border)] relative overflow-hidden text-center shadow-2xl">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Animated Success Icon Container */}
        <div className="relative mx-auto mb-6 w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 opacity-20 animate-ping" />
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 relative z-10">
            <Check size={40} className="stroke-[3]" />
          </div>
        </div>

        {/* Header Badge & Title */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
          <Sparkles size={14} /> Payment Successful
        </div>

        <h1 className="text-3xl font-extrabold font-display bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-300 bg-clip-text text-transparent">Welcome to Premium!</h1>

        <p className="text-slate-400 text-sm mt-2 max-w-sm mx-auto">Thank you for upgrading. Your account now has full access to all exclusive feature suites and lessons.</p>

        {/* Email Notification Note */}
        {customerEmail && (
          <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs text-slate-300">
            <Mail size={14} className="text-cyan-400" />
            <span>
              Receipt sent to <strong className="text-white">{customerEmail}</strong>
            </span>
          </div>
        )}

        {/* Transaction Details Box */}
        <div className="mt-6 p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50 text-left space-y-3.5 text-sm">
          <div className="flex justify-between items-center pb-3 border-b border-slate-700/40">
            <span className="text-slate-400">Plan Upgrade</span>
            <span className="font-semibold text-indigo-400">{planName}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Amount Paid</span>
            <span className="font-semibold text-white">{amount}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Transaction ID</span>
            <span className="font-mono text-xs text-slate-300 bg-slate-900/60 px-2 py-1 rounded-md border border-slate-700/30">{transactionId}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Date</span>
            <span className="text-slate-300">{paymentDate}</span>
          </div>
        </div>

        {/* Security / Guarantee Micro Note */}
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-400">
          <ShieldCheck size={16} className="text-emerald-400" />
          <span>Secured payment & instant access activated</span>
        </div>

        {/* CTA Action Buttons */}
        <div className="mt-8 space-y-3">
          <Link
            href="/dashboard"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 font-semibold text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all flex items-center justify-center space-x-2 group active:scale-[0.98]"
          >
            <span>Go to Dashboard</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/"
              className="py-2.5 rounded-xl border border-slate-700/50 bg-slate-800/40 text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all flex items-center justify-center space-x-2 font-medium text-xs"
            >
              <Home size={15} />
              <span>Back Home</span>
            </Link>

            <button
              onClick={() => window.print()}
              type="button"
              className="py-2.5 rounded-xl border border-slate-700/50 bg-slate-800/40 text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all flex items-center justify-center space-x-2 font-medium text-xs"
            >
              <Download size={15} />
              <span>Print Receipt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
