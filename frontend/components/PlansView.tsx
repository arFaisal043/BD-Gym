import React, { useState } from 'react';
import { Check, X, Shield, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import type { MembershipPlan } from '../types';

interface PlansViewProps {
  plans: MembershipPlan[];
  onSelectPlan: (plan: MembershipPlan) => void;
}

export const PlansView: React.FC<PlansViewProps> = ({ plans, onSelectPlan }) => {
  const [billingCycle, setBillingCycle] = useState<'all' | 'monthly' | 'quarterly' | 'annual'>('all');

  const filteredPlans = plans.filter(p => {
    if (billingCycle === 'monthly') return p.durationDays <= 30;
    if (billingCycle === 'quarterly') return p.durationDays > 30 && p.durationDays <= 90;
    if (billingCycle === 'annual') return p.durationDays > 90;
    return true;
  });

  const comparisonFeatures = [
    { name: 'Gym Floor & Free Weights Access', starter: true, pro: true, elite: true },
    { name: 'Technogym Biometric Cardio Theater', starter: true, pro: true, elite: true },
    { name: 'RFID Mobile QR Turnstile Pass', starter: true, pro: true, elite: true },
    { name: 'Standard Day Lockers & Showers', starter: true, pro: true, elite: true },
    { name: 'Nordic Finnish Sauna & Eucalyptus Steam Suite', starter: false, pro: true, elite: true },
    { name: 'Free 1-on-1 Certified Coach Induction', starter: false, pro: true, elite: true },
    { name: 'Certified Sports Nutrition Consultation', starter: false, pro: true, elite: true },
    { name: 'In-app Body Composition & Macro Tracking', starter: false, pro: true, elite: true },
    { name: 'Complimentary VIP Guest Day Passes', starter: false, pro: false, elite: '12 Passes / Year' },
    { name: 'Private 1-on-1 Coaching Sessions Included', starter: false, pro: false, elite: '2 Free Sessions' },
    { name: 'Official GymFlow BD Athlete Apparel Kit', starter: false, pro: false, elite: true },
    { name: 'Membership Freeze / Pause Option', starter: false, pro: '14 Days', elite: '30 Days' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1e1f25] border border-white/[0.08]">
          <Sparkles className="w-3.5 h-3.5 text-[#4edea3]" />
          <span className="text-[11px] text-[#4edea3] uppercase font-bold tracking-widest">
            FR-003 Dynamic Membership Plans
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#e3e1e9] tracking-tight">
          Invest in Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4edea3] via-[#4cd7f6] to-[#c0c1ff]">Physical Prime</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#bbcabf] max-w-xl mx-auto leading-relaxed">
          Transparent subscriptions in Bangladeshi Taka (৳ BDT) with zero hidden maintenance fees. Instant activation through SSLCOMMERZ gateway.
        </p>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 pt-4">
          {(['all', 'monthly', 'quarterly', 'annual'] as const).map((cycle) => (
            <button
              key={cycle}
              onClick={() => setBillingCycle(cycle)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                billingCycle === cycle
                  ? 'bg-[#4edea3] text-[#003824] font-bold shadow-[0_0_16px_rgba(78,222,163,0.3)]'
                  : 'bg-[#1e1f25] text-[#bbcabf] hover:text-white border border-white/[0.06]'
              }`}
            >
              {cycle === 'all' ? 'All Packages' : cycle}
            </button>
          ))}
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {filteredPlans.map((plan) => {
          const isPro = plan.isPopular;
          return (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                isPro
                  ? 'bg-[#1e1f25]/95 border-2 border-[#10b981] shadow-[0_0_40px_rgba(16,185,129,0.25)] lg:-translate-y-2'
                  : 'bg-[#1a1b21]/80 border border-white/[0.08] shadow-xl hover:bg-[#292a2f]/60'
              }`}
            >
              {isPro && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#10b981] to-[#4cd7f6] text-[#003824] text-[10px] font-black uppercase tracking-wider shadow-lg">
                  Most Popular Choice
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4 mt-1">
                  <h3 className={`text-xl font-bold ${isPro ? 'text-[#4edea3]' : 'text-[#e3e1e9]'}`}>
                    {plan.name}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isPro 
                      ? 'bg-[#10b981]/20 text-[#4edea3]' 
                      : plan.badge === 'VIP Status'
                      ? 'bg-[#c0c1ff]/20 text-[#c0c1ff]'
                      : 'bg-[#34343a] text-[#bbcabf]'
                  }`}>
                    {plan.badge || 'Standard'}
                  </span>
                </div>

                <p className="text-xs text-[#bbcabf] mb-6 leading-relaxed">
                  {plan.description}
                </p>

                <div className="flex items-baseline gap-1.5 mb-6">
                  <span className="text-4xl font-black text-[#e3e1e9] tracking-tight">
                    ৳ {plan.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#bbcabf]">{plan.intervalLabel}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#0d0e13]/60 border border-white/[0.04] mb-6 flex items-center justify-between text-xs">
                  <span className="text-[#bbcabf]">Effective Daily Cost</span>
                  <span className="font-bold text-[#4cd7f6]">
                    ৳ {Math.round(plan.price / plan.durationDays)} / day
                  </span>
                </div>

                <ul className="space-y-3 text-xs text-[#e3e1e9] mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#4edea3] shrink-0 mt-0.5" />
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                  {plan.unavailableFeatures?.map((unfeat, idx) => (
                    <li key={`un-${idx}`} className="flex items-start gap-2.5 text-[#bbcabf]/50 line-through">
                      <X className="w-4 h-4 text-[#86948a] shrink-0 mt-0.5" />
                      <span className="leading-snug">{unfeat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onSelectPlan(plan)}
                className={`w-full py-3.5 px-4 rounded-full font-bold text-xs tracking-wide transition-all shadow-md flex items-center justify-center gap-2 ${
                  isPro
                    ? 'bg-[#4edea3] text-[#003824] hover:bg-[#10b981] shadow-[0_0_24px_rgba(78,222,163,0.4)] hover:scale-[1.02]'
                    : 'bg-[#292a2f] text-[#e3e1e9] hover:bg-[#38393f] border border-white/[0.06]'
                }`}
              >
                <span>Select & Pay via SSLCOMMERZ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Feature Comparison Matrix */}
      <div className="rounded-2xl bg-[#1a1b21] border border-white/[0.08] p-6 sm:p-8 shadow-2xl overflow-x-auto">
        <h3 className="text-xl font-bold text-[#e3e1e9] mb-6">Detailed Plan Comparison</h3>
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-white/[0.08] text-xs uppercase tracking-wider text-[#bbcabf]">
              <th className="py-4 pr-4 font-bold">Included Feature</th>
              <th className="py-4 px-4 text-center font-bold">Monthly Starter</th>
              <th className="py-4 px-4 text-center font-bold text-[#4edea3]">3-Month Pro</th>
              <th className="py-4 pl-4 text-center font-bold text-[#c0c1ff]">Annual Elite</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04] text-xs">
            {comparisonFeatures.map((row, i) => (
              <tr key={i} className="hover:bg-white/[0.02]">
                <td className="py-3.5 pr-4 text-[#e3e1e9] font-medium">{row.name}</td>
                <td className="py-3.5 px-4 text-center">
                  {typeof row.starter === 'boolean' ? (
                    row.starter ? <Check className="w-4 h-4 text-[#4edea3] mx-auto" /> : <X className="w-4 h-4 text-[#86948a] mx-auto" />
                  ) : (
                    <span className="text-[#bbcabf] font-semibold">{row.starter}</span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-center bg-[#10b981]/5">
                  {typeof row.pro === 'boolean' ? (
                    row.pro ? <Check className="w-4 h-4 text-[#4edea3] mx-auto" /> : <X className="w-4 h-4 text-[#86948a] mx-auto" />
                  ) : (
                    <span className="text-[#4edea3] font-bold">{row.pro}</span>
                  )}
                </td>
                <td className="py-3.5 pl-4 text-center">
                  {typeof row.elite === 'boolean' ? (
                    row.elite ? <Check className="w-4 h-4 text-[#c0c1ff] mx-auto" /> : <X className="w-4 h-4 text-[#86948a] mx-auto" />
                  ) : (
                    <span className="text-[#c0c1ff] font-bold">{row.elite}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Trust & Guarantee Box */}
      <div className="p-6 rounded-2xl bg-[#1e1f25]/60 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#bbcabf]">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-[#4edea3] shrink-0" />
          <div>
            <p className="font-bold text-[#e3e1e9]">7-Day Athletic Guarantee</p>
            <p className="text-[11px] mt-0.5">
              Not completely satisfied with the Banani club equipment or coaches? Full refund within your first 7 days, no questions asked.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <HelpCircle className="w-4 h-4 text-[#4cd7f6]" />
          <span>Need custom corporate memberships? Call +880 1711-000000</span>
        </div>
      </div>
    </div>
  );
};
