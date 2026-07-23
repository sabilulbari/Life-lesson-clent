"use client";

import { authClient } from "@/lib/auth-client";
import { Button, Card, Chip } from "@heroui/react";
import { Check, Sparkles, Zap, Award } from "lucide-react";

const PRICING_PLANS = [
  {
    id: "free",
    name: "free Tier",
    subtext: "Standard digital diary features",
    price: "৳ 0",
    period: "/ forever",
    recommended: false,
    features: ["Write unlimited public/private lessons", "Browse public Free lessons", "Comment and like public lessons", "Save favorites and search/filter"],
  },
  {
    id: "premium",
    name: "Premium Tier",
    subtext: "Unlock global collective wisdom",
    price: "৳ 1,500",
    period: "/ one-time",
    recommended: true,
    features: ["Read all Free & Premium public lessons", "Create Premium (paid-locked) lessons", "Export life lessons as PDF documents", "Premium Star badge displayed on profile"],
  },
];

export default function Pricing() {
  const { data: session } = authClient.useSession();
  const isPremium = session?.user?.plan === "premium";

  return (
    <div className="grow flex flex-col items-center justify-center py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <Chip variant="soft" color="primary" size="sm" startContent={<Sparkles size={12} />} className="uppercase font-bold tracking-wider">
          Pricing Tiers
        </Chip>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display">Elevate Your Wisdom Journey</h1>
        <p className="text-sm text-slate-400">Choose a plan that fits your growth needs. Unlock premium insights and store paid content.</p>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full px-4">
        {PRICING_PLANS.map((plan) => {
          const isPremiumCard = plan.id === "premium";

          return (
            <Card
              key={plan.id}
              className={`p-8 relative overflow-hidden flex flex-col justify-between transition-all ${
                isPremiumCard ? "border-2 border-indigo-500/50 shadow-2xl shadow-indigo-500/10 bg-slate-900/60" : "border border-slate-600 bg-slate-900/30"
              }`}
            >
              {/* Recommended Chip */}
              {plan.recommended && (
                <Chip color="secondary" size="sm" variant="flat" startContent={<Zap size={10} />} className="absolute top-4 right-4 text-[10px] uppercase font-bold tracking-wider">
                  Recommended
                </Chip>
              )}

              <div className="space-y-6">
                {/* Card Header & Title */}
                <Card.Header className="flex-col items-start gap-1 p-0">
                  <Card.Title
                    className={`text-xl font-extrabold ${isPremiumCard ? "bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent" : "text-slate-200"}`}
                  >
                    {plan.name}
                  </Card.Title>
                  <Card.Description className="text-xs text-slate-400">{plan.subtext}</Card.Description>
                </Card.Header>

                {/* Price Display */}
                <div className="flex items-baseline">
                  <span className="text-4xl font-black text-slate-100">{plan.price}</span>
                  <span className="text-xs text-slate-400 ml-1">{plan.period}</span>
                </div>

                {/* Features List */}
                <div className={`space-y-3.5 pt-4 border-t text-xs text-slate-300 ${isPremiumCard ? "border-indigo-500/20" : "border-slate-800/60"}`}>
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2.5">
                      <Check size={14} className="text-indigo-400 shrink-0" />
                      <span className={isPremiumCard && index < 2 ? "font-bold text-slate-200" : ""}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <Card.Footer className="pt-8 p-0">
                {isPremiumCard ? (
                  isPremium ? (
                    <Button isDisabled variant="soft" color="secondary" className="w-full font-bold text-xs" startContent={<Award size={14} />}>
                      Active Premium Member
                    </Button>
                  ) : (
                    <form action="/api/checkout_sessions" method="POST" className="w-full">
                      <input type="hidden" name="plan_id" value={plan.id} />
                      <Button
                        type="submit"
                        color="primary"
                        className="w-full font-semibold text-xs bg-linear-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white shadow-lg shadow-indigo-500/20"
                        startContent={<Zap size={14} />}
                      >
                        Upgrade to Premium
                      </Button>
                    </form>
                  )
                ) : (
                  <Button isDisabled variant="bordered" className="w-full border-slate-800 text-slate-500 font-semibold text-xs">
                    {session && !isPremium ? "Active Basic Plan" : "Included"}
                  </Button>
                )}
              </Card.Footer>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
