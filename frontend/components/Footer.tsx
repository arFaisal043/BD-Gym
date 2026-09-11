import React from 'react';
import { MapPin, Phone, Clock, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#0d0e13]/95 backdrop-blur-xl relative z-10 mt-20 border-t border-white/[0.08]">
      {/* Aurora glow top border */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#4edea3] via-[#4cd7f6] to-[#c0c1ff] opacity-40"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#10b981] to-[#4cd7f6] p-[2px]">
                <div className="w-full h-full bg-[#121318] rounded-[6px] flex items-center justify-center">
                  <span className="font-extrabold text-[#4edea3] text-sm tracking-tighter">GF</span>
                </div>
              </div>
              <span className="font-bold text-xl tracking-tight text-[#e3e1e9]">
                GymFlow <span className="text-[#4edea3]">BD</span>
              </span>
            </div>
            <p className="text-xs text-[#bbcabf] leading-relaxed">
              Empowering Dhaka's elite fitness community with intelligent performance tracking, athletic recovery, and seamless digital club management.
            </p>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#1e1f25] border border-white/[0.06] text-[#4edea3] text-[11px] font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
                Live Gym Access (FR-001)
              </span>
            </div>
          </div>

          {/* Location & Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-[#e3e1e9] tracking-wide">Dhaka Flagship Hub</h4>
            <div className="space-y-2.5 text-xs text-[#bbcabf]">
              <p className="flex items-start gap-2 leading-relaxed">
                <MapPin className="w-4 h-4 text-[#4cd7f6] shrink-0 mt-0.5" />
                <span>Plot 42, Road 11, Block D, Banani, Dhaka-1213, Bangladesh</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#4cd7f6] shrink-0" />
                <span>+880 1711-000000</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#4cd7f6] shrink-0" />
                <span>Open Daily: 6:00 AM – 11:00 PM</span>
              </p>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-[#e3e1e9] tracking-wide">Quick Navigation</h4>
            <ul className="space-y-2 text-xs text-[#bbcabf]">
              <li>
                <button
                  onClick={() => onNavigate('plans-and-pricing')}
                  className="hover:text-[#4edea3] transition-colors flex items-center gap-1 text-left"
                >
                  <span>Membership Packages</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('facilities')}
                  className="hover:text-[#4edea3] transition-colors flex items-center gap-1 text-left"
                >
                  <span>Recovery & Sauna Suites</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('trainers')}
                  className="hover:text-[#4edea3] transition-colors flex items-center gap-1 text-left"
                >
                  <span>Certified Personal Trainers</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('member-dashboard')}
                  className="hover:text-[#4edea3] transition-colors flex items-center gap-1 text-left"
                >
                  <span>Member Dashboard & Invoices</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </button>
              </li>
            </ul>
          </div>

          {/* Verified Payments via SSLCOMMERZ */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-[#e3e1e9] tracking-wide">Verified Payments</h4>
            <p className="text-xs text-[#bbcabf]">
              Instant automated renewals powered by SSLCOMMERZ gateway:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center justify-center py-2 px-3 rounded-lg bg-[#1e1f25] border border-white/[0.06] text-xs font-bold text-[#e3e1e9] tracking-wide">
                bKash
              </div>
              <div className="flex items-center justify-center py-2 px-3 rounded-lg bg-[#1e1f25] border border-white/[0.06] text-xs font-bold text-[#e3e1e9] tracking-wide">
                Nagad
              </div>
              <div className="flex items-center justify-center py-2 px-3 rounded-lg bg-[#1e1f25] border border-white/[0.06] text-xs font-bold text-[#4cd7f6] tracking-wide">
                VISA
              </div>
              <div className="flex items-center justify-center py-2 px-3 rounded-lg bg-[#1e1f25] border border-white/[0.06] text-xs font-bold text-[#4edea3] tracking-wide">
                Mastercard
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#bbcabf]/70">
          <p>© 2025 GymFlow BD Limited. All rights reserved. High-Performance Digital Fitness.</p>
          <div className="flex items-center gap-6 text-[11px]">
            <span className="hover:text-[#e3e1e9] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#e3e1e9] cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#e3e1e9] cursor-pointer">Refund & BDT Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
