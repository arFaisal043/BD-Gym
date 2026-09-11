import React, { useState } from 'react';
import { Layers, CheckCircle, Sparkles, Dumbbell, HeartPulse, Bath, Coffee, Shield } from 'lucide-react';
import type { Facility } from '../types';

interface FacilitiesViewProps {
  facilities: Facility[];
  onOpenVirtualTour: () => void;
}

export const FacilitiesView: React.FC<FacilitiesViewProps> = ({ facilities, onOpenVirtualTour }) => {
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
  const [activeFacilityId, setActiveFacilityId] = useState<string>(facilities[0]?.id || 'fac_1');

  const filteredFacilities = facilities.filter(
    (f) => selectedFloor === 'all' || f.floor === selectedFloor
  );

  const activeFacility = facilities.find((f) => f.id === activeFacilityId) || facilities[0];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'iron':
      case 'weights':
        return <Dumbbell className="w-4 h-4 text-[#4edea3]" />;
      case 'cardio':
        return <HeartPulse className="w-4 h-4 text-[#4cd7f6]" />;
      case 'recovery':
        return <Bath className="w-4 h-4 text-[#c0c1ff]" />;
      case 'nutrition':
        return <Coffee className="w-4 h-4 text-[#10b981]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#4edea3]" />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1e1f25] border border-white/[0.08]">
          <Layers className="w-3.5 h-3.5 text-[#4cd7f6]" />
          <span className="text-[11px] text-[#4cd7f6] uppercase font-bold tracking-widest">
            FR-004 15,000 Sq Ft Athletic Floor
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#e3e1e9] tracking-tight">
          Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4edea3] via-[#4cd7f6] to-[#c0c1ff]">High Output</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#bbcabf] max-w-xl mx-auto leading-relaxed">
          Spread across 3 specialized floors in Banani, featuring Olympic-spec Eleiko lifting platforms, Technogym cardio biometrics, and Scandinavian thermal recovery.
        </p>

        {/* Floor Filter Buttons */}
        <div className="flex items-center justify-center gap-2 pt-3">
          <button
            onClick={() => setSelectedFloor('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedFloor === 'all'
                ? 'bg-[#4edea3] text-[#003824] font-bold shadow-[0_0_16px_rgba(78,222,163,0.3)]'
                : 'bg-[#1e1f25] text-[#bbcabf] hover:text-white border border-white/[0.06]'
            }`}
          >
            All Floors
          </button>
          <button
            onClick={() => setSelectedFloor(1)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedFloor === 1
                ? 'bg-[#4edea3] text-[#003824] font-bold shadow-[0_0_16px_rgba(78,222,163,0.3)]'
                : 'bg-[#1e1f25] text-[#bbcabf] hover:text-white border border-white/[0.06]'
            }`}
          >
            Floor 1: Heavy Iron & Free Weights
          </button>
          <button
            onClick={() => setSelectedFloor(2)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedFloor === 2
                ? 'bg-[#4cd7f6] text-[#003640] font-bold shadow-[0_0_16px_rgba(76,215,246,0.3)]'
                : 'bg-[#1e1f25] text-[#bbcabf] hover:text-white border border-white/[0.06]'
            }`}
          >
            Floor 2: Cardio & HIIT Theater
          </button>
          <button
            onClick={() => setSelectedFloor(3)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedFloor === 3
                ? 'bg-[#c0c1ff] text-[#1000a9] font-bold shadow-[0_0_16px_rgba(192,193,255,0.3)]'
                : 'bg-[#1e1f25] text-[#bbcabf] hover:text-white border border-white/[0.06]'
            }`}
          >
            Floor 3: Recovery Spa & Nutrition
          </button>
        </div>
      </div>

      {/* Interactive Detail Showcase */}
      {activeFacility && (
        <div className="rounded-2xl bg-[#1a1b21] border border-white/10 overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 relative min-h-[360px] lg:min-h-[480px]">
            <img
              src={activeFacility.image}
              alt={activeFacility.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1b21] via-transparent to-transparent lg:hidden"></div>
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#0d0e13]/80 backdrop-blur-md text-[#4edea3] text-[10px] font-bold tracking-wider border border-[#10b981]/30">
                {activeFacility.zoneCode}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#0d0e13]/80 backdrop-blur-md text-[#4cd7f6] text-[10px] font-bold">
                Floor {activeFacility.floor}
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#4cd7f6]">
                {getCategoryIcon(activeFacility.category)}
                <span className="capitalize">{activeFacility.category} Engineering</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#e3e1e9]">
                {activeFacility.name}
              </h2>
              <p className="text-xs sm:text-sm text-[#bbcabf] leading-relaxed">
                {activeFacility.description}
              </p>

              <div className="pt-2">
                <h4 className="text-xs font-bold text-[#e3e1e9] uppercase tracking-wider mb-2">
                  Key Zone Features
                </h4>
                <div className="space-y-2">
                  {activeFacility.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#bbcabf]">
                      <CheckCircle className="w-3.5 h-3.5 text-[#4edea3] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <h4 className="text-xs font-bold text-[#e3e1e9] uppercase tracking-wider mb-2">
                  Calibrated Hardware & Equipment
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeFacility.equipmentList.map((eq, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[#292a2f] border border-white/[0.06] text-[11px] text-[#e3e1e9]"
                    >
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={onOpenVirtualTour}
              className="w-full py-3 rounded-full bg-[#292a2f] hover:bg-[#38393f] text-[#4edea3] text-xs font-bold border border-[#10b981]/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Explore 360° Walkthrough</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Facilities Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFacilities.map((facility) => {
          const isCurrent = facility.id === activeFacilityId;
          return (
            <div
              key={facility.id}
              onClick={() => setActiveFacilityId(facility.id)}
              className={`rounded-2xl overflow-hidden bg-[#1a1b21] border transition-all cursor-pointer group p-5 flex flex-col justify-between ${
                isCurrent
                  ? 'border-[#10b981] shadow-[0_0_30px_rgba(16,185,129,0.2)] bg-[#1e1f25]'
                  : 'border-white/[0.08] hover:border-white/20'
              }`}
            >
              <div className="space-y-3">
                <div className="relative h-44 rounded-xl overflow-hidden">
                  <img
                    src={facility.image}
                    alt={facility.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#0d0e13]/85 text-[#4edea3] text-[9px] font-bold border border-white/[0.08]">
                      {facility.zoneCode}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#e3e1e9] group-hover:text-[#4edea3] transition-colors">
                    {facility.name}
                  </h3>
                  <p className="text-xs text-[#bbcabf] line-clamp-2 mt-1">
                    {facility.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.06] mt-4 flex items-center justify-between text-xs">
                <span className="text-[#bbcabf]">Floor {facility.floor}</span>
                <span className="text-[#4edea3] font-bold group-hover:underline">
                  View Specifications →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hygiene & Standards Box */}
      <div className="p-6 rounded-2xl bg-[#1e1f25]/50 border border-white/[0.08] grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#bbcabf]">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-[#4edea3] shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-[#e3e1e9]">99.4% AQI Clean Air</p>
            <p className="text-[11px] mt-0.5">HEPA 13 medical grade continuous air exchange across all 3 floors.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Bath className="w-5 h-5 text-[#4cd7f6] shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-[#e3e1e9]">Hospital Grade Sanitization</p>
            <p className="text-[11px] mt-0.5">Barbells and benches sterilized every 90 minutes with antibacterial mist.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[#c0c1ff] shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-[#e3e1e9]">Biometric Lockers</p>
            <p className="text-[11px] mt-0.5">RFID silicone wristband access with private charging hubs inside lockers.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
