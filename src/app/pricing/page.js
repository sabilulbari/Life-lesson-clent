"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { getStripeSession, mockUpgradePremium } from "@/actions/users";
import { Check, Sparkles, Zap, Award, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function Pricing() {
  const { data: session, update } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const mockSuccess = searchParams.get("mock-success");

  // Intercept mock checkout return
  useEffect(() => {
    async function triggerMockUpgrade() {
      if (mockSuccess && session?.user && session.user.plan !== "premium") {
        setLoading(true);
        try {
          const res = await mockUpgradePremium();
          if (res.success) {
            toast.success("Congratulations! You are now a Premium Member!");
            // Refresh Better Auth session locally
            await update({
              plan: "premium"
            });
            router.push("/dashboard/profile?success=true");
          } else {
            toast.error(res.error || "Upgrade failed");
          }
        } catch (err) {
          toast.error("Failed to upgrade account");
        } finally {
          setLoading(false);
        }
      }
    }
    triggerMockUpgrade();
  }, [mockSuccess, session]);

  const handleUpgrade = async () => {
    if (!session) {
      toast.error("Please log in to upgrade to Premium.");
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await getStripeSession();
      if (res.error) {
        toast.error(res.error);
      } else if (res.url) {
        toast.loading("Redirecting to checkout...");
        window.location.href = res.url;
      }
    } catch (err) {
      toast.error("Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  const isPremium = session?.user?.plan === "premium";

  return (
    <div className="flex-grow flex flex-col items-center justify-center py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles size={12} /> Pricing Tiers
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display">
          Elevate Your Wisdom Journey
        </h1>
        <p className="text-sm text-slate-400">
          Choose a plan that fits your growth needs. Unlock premium insights and store paid content.
        </p>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full px-4">
        {/* Free Plan */}
        <div className="glass p-8 rounded-3xl border border-[var(--card-border)] flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-6">
            <div>
              <h3 className="font-extrabold text-xl text-slate-200">Basic Tier</h3>
              <p className="text-xs text-slate-400 mt-1">Standard digital diary features</p>
            </div>
            
            <div className="flex items-baseline">
              <span className="text-4xl font-black text-slate-100">$0</span>
              <span className="text-xs text-slate-400 ml-1">/ forever</span>
            </div>

            <div className="space-y-3.5 pt-4 border-t border-slate-800/40 text-xs text-slate-300">
              <div className="flex items-center space-x-2.5">
                <Check size={14} className="text-indigo-400" />
                <span>Write unlimited public/private lessons</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Check size={14} className="text-indigo-400" />
                <span>Browse public Free lessons</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Check size={14} className="text-indigo-400" />
                <span>Comment and like public lessons</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Check size={14} className="text-indigo-400" />
                <span>Save favorites and search/filter</span>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <button
              disabled
              className="w-full py-3 rounded-xl border border-slate-700/50 bg-slate-800/20 text-slate-500 font-semibold text-xs text-center cursor-not-allowed"
            >
              {session && !isPremium ? "Active Basic Plan" : "Included"}
            </button>
          </div>
        </div>

        {/* Premium Plan */}
        <div className="glass p-8 rounded-3xl border border-indigo-500/35 relative overflow-hidden flex flex-col justify-between shadow-xl shadow-indigo-500/5">
          {/* Top banner tag */}
          <div className="absolute top-4 right-4 bg-indigo-500/20 text-indigo-300 text-[9px] font-bold px-2 py-0.5 rounded-full border border-indigo-500/20 uppercase tracking-wider flex items-center gap-1">
            <Zap size={10} /> Recommended
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-extrabold text-xl text-gradient">Premium Tier</h3>
              <p className="text-xs text-slate-400 mt-1">Unlock global collective wisdom</p>
            </div>

            <div className="flex items-baseline">
              <span className="text-4xl font-black text-slate-100">$19.99</span>
              <span className="text-xs text-slate-400 ml-1">/ one-time</span>
            </div>

            <div className="space-y-3.5 pt-4 border-t border-indigo-500/20 text-xs text-slate-300">
              <div className="flex items-center space-x-2.5">
                <Check size={14} className="text-indigo-400" />
                <span className="font-bold text-slate-200">Read all Free & Premium public lessons</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Check size={14} className="text-indigo-400" />
                <span className="font-bold text-slate-200">Create Premium (paid-locked) lessons</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Check size={14} className="text-indigo-400" />
                <span>Export life lessons as PDF documents</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Check size={14} className="text-indigo-400" />
                <span>Premium Star badge displayed on profile</span>
              </div>
            </div>
          </div>

          <div className="pt-8">
            {isPremium ? (
              <button
                disabled
                className="w-full py-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-extrabold text-xs flex items-center justify-center space-x-1.5 cursor-not-allowed"
              >
                <Award size={14} />
                <span>Active Premium Member</span>
              </button>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 font-semibold text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all flex items-center justify-center space-x-1.5 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Processing Checkout...</span>
                  </>
                ) : (
                  <>
                    <Zap size={14} />
                    <span>Upgrade to Premium</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
