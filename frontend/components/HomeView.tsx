import React, { useState } from 'react';
import { 
  ArrowRight, 
  Play, 
  Users, 
  Award, 
  Maximize2, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  ChevronDown, 
  ShieldCheck, 
  Lock, 
  Star,
  Bot,
  Sparkles,
  Zap,
  BrainCircuit
} from 'lucide-react';
import type { MembershipPlan, Trainer, Facility, FAQ, GymStats, Testimonial } from '../types';
import { ScrollReveal } from './ScrollReveal';

interface HomeViewProps {
  plans: MembershipPlan[];
  trainers: Trainer[];
  facilities: Facility[];
  faqs: FAQ[];
  stats: GymStats | null;
  testimonials: Testimonial[];
  onSelectPlan: (plan: MembershipPlan) => void;
  onBookTrainer: (trainer: Trainer) => void;
  onOpenVirtualTour: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenGeminiChat?: (prompt?: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  plans,
  trainers,
  facilities,
  faqs,
  stats,
  testimonials,
  onSelectPlan,
  onBookTrainer,
  onOpenVirtualTour,
  onNavigateTab,
  onOpenGeminiChat,
}) => {
  const [openFaqId, setOpenFaqId] = useState<string | null>(faqs[0]?.id || 'faq_1');

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Dynamic Atmospheric Hero Bleed Section */}
      <section className="relative w-full pt-12 pb-20 overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-tr from-[#10b981]/20 via-[#4cd7f6]/15 to-[#c0c1ff]/15 rounded-full blur-[140px] opacity-70"></div>
          <div className="absolute -top-10 right-10 w-96 h-96 bg-[#10b981]/15 rounded-full blur-[110px]"></div>
          <div className="absolute -bottom-32 left-1/4 w-[500px] h-96 bg-[#03b5d3]/10 rounded-full blur-[140px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 relative z-10">
          {/* Tag Pill */}
          <div className="flex items-center justify-center md:justify-start mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1e1f25]/80 border border-white/[0.08] backdrop-blur-xl shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
              <span className="text-[11px] text-[#4edea3] uppercase tracking-widest font-bold">
                Banani Flagship Club • Dhaka
              </span>
              <span className="text-[#bbcabf] text-[11px] hidden sm:inline">
                | FR-001 Live Enrollment
              </span>
            </div>
          </div>

          {/* Main Asymmetric Headline & Copy */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-12">
            <div className="lg:col-span-8 space-y-6 text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-[#e3e1e9] leading-[1.12]">
                Ignite Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4edea3] via-[#4cd7f6] to-[#c0c1ff]">
                  Peak Performance
                </span>{' '}
                in Dhaka
              </h1>
              <p className="text-base sm:text-lg text-[#bbcabf] max-w-2xl leading-relaxed mx-auto md:mx-0">
                Bangladesh's premier tech-enabled fitness center. State-of-the-art equipment, certified strength trainers, and frictionless online membership activation via SSLCOMMERZ.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                <a
                  href="#plans-section"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#10b981] text-[#00422b] text-sm font-bold shadow-[0_0_28px_rgba(16,185,129,0.45)] hover:shadow-[0_0_36px_rgba(16,185,129,0.65)] hover:scale-[1.02] transition-all"
                >
                  <span>Explore Membership Plans</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <button
                  onClick={onOpenVirtualTour}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#292a2f]/80 hover:bg-[#38393f] text-[#e3e1e9] text-sm font-semibold transition-all border border-white/[0.08] shadow-md hover:border-white/20"
                >
                  <Play className="w-4 h-4 text-[#4cd7f6] fill-current" />
                  <span>Take Virtual Tour</span>
                </button>
              </div>
            </div>

            {/* Hero Glass Graphic Visual: Live Occupancy Radial Card */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="w-full max-w-sm rounded-2xl bg-[#1a1b21]/90 border border-white/10 backdrop-blur-2xl p-6 shadow-[0_16px_40px_rgba(0,0,0,0.6)] relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#4edea3] via-[#4cd7f6] to-[#c0c1ff]"></div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-gradient-to-tr from-[#10b981] to-[#4cd7f6] flex items-center justify-center text-[10px] font-black text-black">
                      GF
                    </div>
                    <span className="text-sm font-bold text-[#e3e1e9]">GymFlow Sensor</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#10b981]/20 text-[#4edea3] text-[10px] font-bold tracking-wider border border-[#10b981]/30 animate-pulse">
                    LIVE
                  </span>
                </div>

                {/* SVG Radial Occupancy Dial */}
                <div className="flex flex-col items-center justify-center py-2">
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                      <circle
                        className="text-[#34343a] stroke-current"
                        cx="60"
                        cy="60"
                        fill="transparent"
                        r="48"
                        strokeWidth="9"
                      />
                      <circle
                        className="text-[#4edea3] stroke-current transition-all duration-1000 ease-out"
                        cx="60"
                        cy="60"
                        fill="transparent"
                        r="48"
                        strokeDasharray="301.6"
                        strokeDashoffset="112"
                        strokeLinecap="round"
                        strokeWidth="9"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center text-center">
                      <span className="text-3xl font-black text-[#e3e1e9] tracking-tight">{stats?.occupancyRate || 63}%</span>
                      <span className="text-[11px] uppercase tracking-wider text-[#bbcabf] font-semibold">
                        Floor Density
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-[#e3e1e9] font-bold">Optimal Workout Window</p>
                    <p className="text-xs text-[#bbcabf] mt-1">Cardio floor open • Free weights calm</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 grid grid-cols-2 gap-2 text-center bg-[#0d0e13]/60 rounded-xl p-2.5 border border-white/[0.04]">
                  <div>
                    <p className="text-[11px] text-[#bbcabf]">Active RFID Badges</p>
                    <p className="text-sm font-bold text-[#4cd7f6] mt-0.5">{stats?.activeRfidAthletes || 87} Athletes</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#bbcabf]">HVAC Clean Air</p>
                    <p className="text-sm font-bold text-[#4edea3] mt-0.5">{stats?.aqiPercentage || 99.4}% AQI</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Stat Highlights Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 bg-[#1e1f25]/70 border border-white/[0.08] backdrop-blur-xl p-4 rounded-2xl shadow-xl">
            <div className="p-3.5 rounded-xl bg-[#292a2f]/40 border border-white/[0.04] flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#10b981]/15 flex items-center justify-center text-[#4edea3]">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-black text-[#e3e1e9]">{stats?.totalMembers ? `${stats.totalMembers}+` : '2,500+'}</p>
                <p className="text-xs text-[#bbcabf]">Active Members</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#292a2f]/40 border border-white/[0.04] flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#4cd7f6]/15 flex items-center justify-center text-[#4cd7f6]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-black text-[#e3e1e9]">{stats?.certifiedCoaches ? `${stats.certifiedCoaches}+` : '18+'}</p>
                <p className="text-xs text-[#bbcabf]">Certified Coaches</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#292a2f]/40 border border-white/[0.04] flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#c0c1ff]/15 flex items-center justify-center text-[#c0c1ff]">
                <Maximize2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-black text-[#e3e1e9]">{stats?.floorAreaSqFt?.toLocaleString() || '15,000'}</p>
                <p className="text-xs text-[#bbcabf]">Sq Ft Luxury Floor</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#292a2f]/40 border border-white/[0.04] flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#10b981]/15 flex items-center justify-center text-[#4edea3]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-black text-[#e3e1e9]">{stats?.operatingHours || '6am - 11pm'}</p>
                <p className="text-xs text-[#bbcabf]">Open Daily In Banani</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Showcase Section */}
      <section className="w-full py-16 relative">
        <ScrollReveal>
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[11px] text-[#4edea3] uppercase font-bold tracking-widest">
                Built For Athletes
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#e3e1e9] mt-1 tracking-tight">
                World-Class Facilities Across 3 Floors
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#bbcabf] max-w-md">
              Custom calibrated Eleiko barbells, premium Technogym biometric tracks, and private Nordic wellness recovery suites.
            </p>
          </div>

          {/* Facilities Bento Grid (Matching Exact Screenshot Layout) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Zone 01: Strength & Powerlifting Zone */}
            <div 
              onClick={() => onNavigateTab('facilities')}
              className="md:col-span-8 group relative rounded-2xl overflow-hidden bg-[#1a1b21] min-h-[360px] flex flex-col justify-end p-8 border border-white/[0.08] shadow-lg transition-transform hover:-translate-y-1 cursor-pointer"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCikR6E09fGLcTdu1kyMEVs9al1JGGb0hGcJUyHGih4GhQZy3lYD-NBOXXNaX1rOHOAMXHfUzHMrNv8YBO98tBLo7NCz2Yoo5y6YygxhghOF9VTVeNIqj-BNbQgugzHTO9RHZTQhT3ybztcvLAcyLerTXMu1tFKBHcHy5C7zphF5yuam1ekRfYtE41ujg_l5kFiobn86v8V3UVStxJamOfdqyf6atYziG3Y1M4WZGqMpytJ1pkn1QDfGQ')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e13] via-[#0d0e13]/70 to-transparent"></div>
              <div className="relative z-10 space-y-2">
                <span className="px-3 py-1 rounded-full bg-[#10b981]/25 text-[#4edea3] text-[10px] font-bold uppercase tracking-wider border border-[#10b981]/40">
                  Zone 01 • Heavy Iron
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#e3e1e9]">Strength & Powerlifting Zone</h3>
                <p className="text-xs text-[#bbcabf] max-w-xl">
                  5 dedicated competition-grade platforms, calibrated Rogue and Eleiko plates, monolifts, and specialized power bars for high-performance lifters.
                </p>
              </div>
            </div>

            {/* Zone 02: Olympic Free Weights */}
            <div 
              onClick={() => onNavigateTab('facilities')}
              className="md:col-span-4 group relative rounded-2xl overflow-hidden bg-[#1a1b21] min-h-[360px] flex flex-col justify-end p-6 border border-white/[0.08] shadow-lg transition-transform hover:-translate-y-1 cursor-pointer"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDSj0zOa_4z3GmS7ecJ7j1Wf98U8ctFyg2zNu3WVNf_0VAFWB9svz-X6mMBrha-vFKVHMu-49bGeM6WQLo-X8h9ZoTRCSD7BBdCdUCrC69cvazbGPiswMM6um2ooaPGoBGfsGgXvSNXVz8xnArC-x9O8gsm6Pre5ZiMyu9BLLUeIZaZKMWXi-45UCJ_-onunD4r-rdumI-1uC3xBxmjrZo5xcWhx2uw9C-9ikpqqzWH-cYxKR74BepYNw')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e13] via-[#0d0e13]/80 to-transparent"></div>
              <div className="relative z-10 space-y-2">
                <span className="px-3 py-1 rounded-full bg-[#4cd7f6]/20 text-[#4cd7f6] text-[10px] font-bold uppercase tracking-wider border border-[#4cd7f6]/40">
                  Zone 02
                </span>
                <h3 className="text-lg font-bold text-[#e3e1e9]">Olympic Free Weights</h3>
                <p className="text-xs text-[#bbcabf]">
                  Dumbbells scaling to 60kg, incline benches, and ergonomic cable towers.
                </p>
              </div>
            </div>

            {/* Zone 03: Cardio & HIIT Theater */}
            <div 
              onClick={() => onNavigateTab('facilities')}
              className="md:col-span-4 group relative rounded-2xl overflow-hidden bg-[#1a1b21] min-h-[320px] flex flex-col justify-end p-6 border border-white/[0.08] shadow-lg transition-transform hover:-translate-y-1 cursor-pointer"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC2gUhFUOsryN_NRnWhUpSe4H5IQhGaYUwi6tyeFQiTzTankDgHwTChC-JwCrbmM4U8yj__u-fAMxfxtpNhSSWTbX4g_2zR-PvfZjIiY2clDb8k4JZU6-uXedIc-y6sDJHxwUWfOfSNirIG42F6-S7loGDktS4fMn7cLS4VewNUjQO9Zy-RnApJHcp6WyB-KhlbsDg64kMJ7eWPux2mlGK_rZX38at5YBuc7yFsgEyVXxG7C9jnLbASGw')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e13] via-[#0d0e13]/85 to-transparent"></div>
              <div className="relative z-10 space-y-2">
                <span className="px-3 py-1 rounded-full bg-[#c0c1ff]/20 text-[#c0c1ff] text-[10px] font-bold uppercase tracking-wider border border-[#c0c1ff]/40">
                  Zone 03
                </span>
                <h3 className="text-lg font-bold text-[#e3e1e9]">Cardio & HIIT Theater</h3>
                <p className="text-xs text-[#bbcabf]">
                  Curved manual sprinters, Concept2 Rowers, and real-time heart metrics.
                </p>
              </div>
            </div>

            {/* Zone 04: Luxury Steam & Locker Suites */}
            <div 
              onClick={() => onNavigateTab('facilities')}
              className="md:col-span-4 group relative rounded-2xl overflow-hidden bg-[#1a1b21] min-h-[320px] flex flex-col justify-end p-6 border border-white/[0.08] shadow-lg transition-transform hover:-translate-y-1 cursor-pointer"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDbsOQtd3y7SbrwDkVL10-xYKBYlWqQBuiP_iNVlCYBVjNhvA0jrGAecM_pY4R5XUmZDnzdFPNyAtNvICpxCFd0JWG5cnYLIAN1FD74BUv10GCifnzmJ-KS4Ag2BfCiw0mPqSn3357z7xc34XXMgZzdWvF08HSfiWl-ManwcHICIEJYxu2aIMDBt2xVl8utZf44GErbPRT18LsW74OStXdCB97Z4JlwktWlgsw4ZvFNqHeQUGmK39A_Pg')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e13] via-[#0d0e13]/85 to-transparent"></div>
              <div className="relative z-10 space-y-2">
                <span className="px-3 py-1 rounded-full bg-[#10b981]/20 text-[#4edea3] text-[10px] font-bold uppercase tracking-wider border border-[#10b981]/40">
                  Zone 04 • Recovery
                </span>
                <h3 className="text-lg font-bold text-[#e3e1e9]">Steam & Locker Suites</h3>
                <p className="text-xs text-[#bbcabf]">
                  Finnish dry saunas, cold plunge baths, and digital biometric RFID personal lockers.
                </p>
              </div>
            </div>

            {/* Zone 05: Juice & Nutrition Hub */}
            <div 
              onClick={() => onNavigateTab('facilities')}
              className="md:col-span-4 group relative rounded-2xl overflow-hidden bg-[#1a1b21] min-h-[320px] flex flex-col justify-end p-6 border border-white/[0.08] shadow-lg transition-transform hover:-translate-y-1 cursor-pointer"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCZifffRw_-JYPoYAdZj8ZgMCC-ms-9Pk_HBs_eACnrSH-gPvF_IYB2wSMO3ay4kMxc58k12VKzfjQsWEF1uA7HWwg5uh20pW3wZwn-XuGQekVwVLeJeM5CF3nWdWfYx4Cnxh5EjAgtEytj522yB2j8OaxPoB_Nz41o6c4q9U6p5Kvc7X5YF5x-IFMzdVHNQlRcrPSwHHMBw5ALgNRO3FsISO7t3B9riYP0Xb99eFb3QVryR1m8mAuHlA')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e13] via-[#0d0e13]/85 to-transparent"></div>
              <div className="relative z-10 space-y-2">
                <span className="px-3 py-1 rounded-full bg-[#4cd7f6]/20 text-[#4cd7f6] text-[10px] font-bold uppercase tracking-wider border border-[#4cd7f6]/40">
                  Zone 05
                </span>
                <h3 className="text-lg font-bold text-[#e3e1e9]">Juice & Nutrition Hub</h3>
                <p className="text-xs text-[#bbcabf]">
                  Fresh cold-pressed juices, isolate protein smoothies, and sports electrolyte bars.
                </p>
              </div>
            </div>
          </div>
        </div>
        </ScrollReveal>
      </section>

      {/* Coach Flow AI Concierge Showcase */}
      <section className="w-full py-16 relative overflow-hidden bg-gradient-to-b from-[#121318] via-[#16171d] to-[#121318]">
        <ScrollReveal>
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="rounded-3xl p-8 sm:p-12 bg-[#1a1b21]/90 border border-emerald-500/20 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <Bot className="w-3.5 h-3.5" />
                  <span>Google Gemini-Powered AI Coach</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4edea3] to-[#4cd7f6]">Coach Flow</span>
                </h2>
                <p className="text-sm text-[#bbcabf] leading-relaxed">
                  Your 24/7 intelligent training partner and Banani club concierge. Built directly with Google's Gemini models to formulate science-backed periodization splits, Dhaka-friendly meal prep advice (with local protein sources), and live guidance on our Scandinavian saunas and cold plunges.
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-3 py-1 rounded-lg bg-[#24252c] border border-white/[0.08] text-[11px] text-[#bbcabf] flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-[#10b981]" /> Instant form cues & technique
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-[#24252c] border border-white/[0.08] text-[11px] text-[#bbcabf] flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#4edea3]" /> Science-backed workout splits
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-[#24252c] border border-white/[0.08] text-[11px] text-[#bbcabf] flex items-center gap-1.5">
                    <BrainCircuit className="w-3 h-3 text-[#4cd7f6]" /> Dhaka meal prep & recovery protocols
                  </span>
                </div>

                <div className="pt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => onOpenGeminiChat?.()}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#10b981] hover:bg-[#4edea3] text-[#003824] font-bold text-sm shadow-lg shadow-emerald-900/30 transition-all hover:scale-105"
                  >
                    <Bot className="w-4 h-4" />
                    <span>Chat with Coach Flow Now</span>
                  </button>
                  <button
                    onClick={() => onOpenGeminiChat?.('Create a 4-day Push-Pull-Legs routine tailored for the Eleiko equipment at GymFlow Banani.')}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#24252c] hover:bg-[#2d2f38] text-white text-xs font-semibold border border-white/10 transition-all"
                  >
                    <span>⚡ Try: 4-Day Strength Routine</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#121318]/95 rounded-2xl border border-white/10 p-5 shadow-inner space-y-3">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Coach Flow Preview</h4>
                      <p className="text-[10px] text-emerald-400">Online • Ready to coach</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400/80 font-mono font-medium">AI Concierge</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="bg-[#24252c] text-[#bbcabf] p-3 rounded-xl rounded-tl-sm border border-white/[0.06] text-[11px] leading-relaxed">
                    <p className="font-semibold text-emerald-400 mb-1">Coach Flow:</p>
                    "For hypertrophy in Dhaka's climate, pair our Eleiko monolift squats with 140g clean daily protein. Local sources like 4 whole eggs + 300g deshi chicken breast + 1 cup daal will hit your macro targets without imported supplements."
                  </div>
                  <div className="flex flex-col gap-1.5 pt-1">
                    <p className="text-[10px] text-[#757780] font-semibold uppercase tracking-wider">Tap to ask instantly:</p>
                    <button
                      onClick={() => onOpenGeminiChat?.('How does the 8°C Scandinavian cold plunge accelerate hypertrophy recovery?')}
                      className="text-left text-[11px] p-2 rounded-lg bg-[#1a1b21] hover:bg-[#24252c] text-[#bbcabf] hover:text-white border border-white/[0.04] transition-all flex items-center justify-between"
                    >
                      <span>🧊 Science behind our 8°C Cold Plunge</span>
                      <ArrowRight className="w-3 h-3 text-emerald-400" />
                    </button>
                    <button
                      onClick={() => onOpenGeminiChat?.('Give me a meal plan with local Bangladeshi food to stay lean and energized.')}
                      className="text-left text-[11px] p-2 rounded-lg bg-[#1a1b21] hover:bg-[#24252c] text-[#bbcabf] hover:text-white border border-white/[0.04] transition-all flex items-center justify-between"
                    >
                      <span>🍲 High-protein Dhaka daily meal prep</span>
                      <ArrowRight className="w-3 h-3 text-emerald-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </ScrollReveal>
      </section>

      {/* Membership Plans Section (In BDT ৳ with SSLCOMMERZ) */}
      <section className="w-full py-16 relative" id="plans-section">
        <ScrollReveal>
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] text-[#4edea3] uppercase font-bold tracking-widest">
              Transparent Subscriptions
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#e3e1e9] mt-1 tracking-tight">
              Select Your Performance Tier
            </h2>
            <p className="text-xs sm:text-sm text-[#bbcabf] mt-2">
              All packages include instant app-based RFID access, digital locker keys, and immediate checkout via SSLCOMMERZ.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan) => {
              const isPro = plan.isPopular;
              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                    isPro
                      ? 'bg-[#1e1f25]/95 border-2 border-[#10b981] shadow-[0_0_40px_rgba(16,185,129,0.22)] lg:-translate-y-3'
                      : 'bg-[#1a1b21]/80 border border-white/[0.08] shadow-xl hover:bg-[#292a2f]/60'
                  }`}
                >
                  {isPro && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#10b981] to-[#4cd7f6] text-[#003824] text-[10px] font-black uppercase tracking-wider shadow-lg">
                      Most Popular
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-4 mt-1">
                      <h3 className={`text-lg font-bold ${isPro ? 'text-[#4edea3]' : 'text-[#e3e1e9]'}`}>
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
                      <span className="text-3xl sm:text-4xl font-black text-[#e3e1e9] tracking-tight">
                        ৳ {plan.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-[#bbcabf]">{plan.intervalLabel}</span>
                    </div>

                    <ul className="space-y-3 text-xs text-[#e3e1e9] mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[#4edea3] shrink-0 mt-0.5" />
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                      {plan.unavailableFeatures?.map((unfeat, idx) => (
                        <li key={`un-${idx}`} className="flex items-start gap-2.5 text-[#bbcabf]/50 line-through">
                          <XCircle className="w-4 h-4 text-[#86948a] shrink-0 mt-0.5" />
                          <span className="leading-snug">{unfeat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => onSelectPlan(plan)}
                    className={`w-full py-3 px-4 rounded-full font-bold text-xs tracking-wide transition-all shadow-md ${
                      isPro
                        ? 'bg-[#4edea3] text-[#003824] hover:bg-[#10b981] shadow-[0_0_24px_rgba(78,222,163,0.4)] hover:scale-[1.02]'
                        : 'bg-[#292a2f] text-[#e3e1e9] hover:bg-[#38393f] border border-white/[0.06]'
                    }`}
                  >
                    Select Plan & Pay
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        </ScrollReveal>
      </section>

      {/* Elite Trainers Showcase Section */}
      <section className="w-full py-16 relative bg-[#0d0e13]/50">
        <ScrollReveal>
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[11px] text-[#4cd7f6] uppercase font-bold tracking-widest">
                Coaching Faculty
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#e3e1e9] mt-1 tracking-tight">
                Elite Strength & Conditioning Mentors
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#bbcabf] max-w-md">
              Internationally certified specialists dedicated to injury prevention, athletic hypertrophy, and metabolic longevity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trainers.map((trainer) => (
              <div
                key={trainer.id}
                className="group rounded-2xl bg-[#1a1b21] border border-white/[0.08] overflow-hidden shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-72 w-full overflow-hidden bg-[#121318]">
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url('${trainer.image}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1b21] via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-[#10b981]/25 backdrop-blur-md text-[#4edea3] text-[10px] font-bold border border-[#10b981]/30">
                        {trainer.badge}
                      </span>
                      <span className="text-[#e3e1e9] text-[10px] font-semibold bg-[#0d0e13]/80 px-2.5 py-1 rounded-md border border-white/[0.06]">
                        {trainer.experience}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-[#e3e1e9]">{trainer.name}</h3>
                    <p className="text-xs text-[#bbcabf] mt-1.5 leading-relaxed">
                      {trainer.specialization}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-white/[0.04] mt-2 flex items-center justify-between">
                  <span className="text-[11px] text-[#bbcabf]">
                    {trainer.athletesMentored}+ Athletes Mentored
                  </span>
                  <button
                    onClick={() => onBookTrainer(trainer)}
                    className="text-xs text-[#4edea3] font-bold inline-flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>Book Induction</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        </ScrollReveal>
      </section>

      {/* Trust & Payment Security Banner */}
      <section className="w-full py-8 relative">
        <ScrollReveal>
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="rounded-2xl bg-gradient-to-r from-[#1a1b21] via-[#1e1f25] to-[#1a1b21] border border-white/10 p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#10b981]/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#10b981]/15 flex items-center justify-center text-[#4edea3] shrink-0 border border-[#10b981]/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-bold text-[#e3e1e9]">
                    Instant Membership Activation via SSLCOMMERZ
                  </span>
                  <Lock className="w-3.5 h-3.5 text-[#4edea3]" />
                </div>
                <p className="text-xs text-[#bbcabf] mt-1 max-w-xl">
                  bKash, Nagad, Rocket, Visa, and Mastercard accepted securely. Instant digital receipt and QR access card generated.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 justify-center md:justify-end shrink-0">
              <span className="px-3.5 py-1.5 rounded-lg bg-[#292a2f] border border-white/[0.08] text-[#e3e1e9] text-xs font-black tracking-wide">
                bKash
              </span>
              <span className="px-3.5 py-1.5 rounded-lg bg-[#292a2f] border border-white/[0.08] text-[#e3e1e9] text-xs font-black tracking-wide">
                Nagad
              </span>
              <span className="px-3.5 py-1.5 rounded-lg bg-[#292a2f] border border-white/[0.08] text-[#e3e1e9] text-xs font-black tracking-wide">
                Rocket
              </span>
              <span className="px-3.5 py-1.5 rounded-lg bg-[#292a2f] border border-white/[0.08] text-[#4cd7f6] text-xs font-black tracking-wide">
                VISA
              </span>
              <span className="px-3.5 py-1.5 rounded-lg bg-[#292a2f] border border-white/[0.08] text-[#4edea3] text-xs font-black tracking-wide">
                Mastercard
              </span>
            </div>
          </div>
        </div>
        </ScrollReveal>
      </section>

      {/* Athlete Stories & FAQ Section */}
      <section className="w-full py-16 relative">
        <ScrollReveal>
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Athlete Stories */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-[11px] text-[#4edea3] uppercase font-bold tracking-widest">
                  Athlete Stories
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#e3e1e9] mt-1 tracking-tight">
                  Real Transformations in Dhaka
                </h2>
              </div>

              {/* Dynamic Testimonials */}
              {testimonials.map((testimonial) => {
                const colorHex = testimonial.themeColor === 'cyan' ? '#4cd7f6' : '#4edea3';
                const bgHex = testimonial.themeColor === 'cyan' ? '#4cd7f6' : '#10b981';
                return (
                  <div key={testimonial.id} className="p-6 rounded-2xl bg-[#1a1b21]/90 border border-white/[0.08] backdrop-blur-xl shadow-lg relative">
                    <div className="flex items-center gap-1 mb-3" style={{ color: colorHex }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-[#e3e1e9] italic leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: `${bgHex}33`, borderColor: `${bgHex}4D`, color: colorHex, borderWidth: '1px' }}
                      >
                        {testimonial.initials}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#e3e1e9]">{testimonial.name}</p>
                        <p className="text-[11px] text-[#bbcabf]">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: FAQ Accordion */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-[11px] text-[#c0c1ff] uppercase font-bold tracking-widest">
                  Everything You Need To Know
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#e3e1e9] mt-1 tracking-tight">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-3">
                {faqs.map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="rounded-xl bg-[#1a1b21] border border-white/[0.06] overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full p-4 flex items-center justify-between text-left focus:outline-none hover:bg-white/[0.02]"
                      >
                        <span className="text-xs sm:text-sm font-bold text-[#e3e1e9] pr-4">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#bbcabf] transition-transform duration-300 shrink-0 ${
                            isOpen ? 'rotate-180 text-[#4edea3]' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 text-xs text-[#bbcabf] leading-relaxed border-t border-white/[0.04]">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        </ScrollReveal>
      </section>
    </div>
  );
};
