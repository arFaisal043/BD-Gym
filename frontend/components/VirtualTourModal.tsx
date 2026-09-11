import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Eye, Sparkles, Volume2, VolumeX, Maximize2 } from 'lucide-react';

interface VirtualTourModalProps {
  onClose: () => void;
}

export const VirtualTourModal: React.FC<VirtualTourModalProps> = ({ onClose }) => {
  const [currentZoneIdx, setCurrentZoneIdx] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const zones = [
    {
      title: 'Floor 1 • Olympic Iron & Powerlifting Arena',
      badge: 'Zone 01',
      description: '5 competition-grade Eleiko lifting platforms, calibrated steel plates, monolifts, and acoustic dampening rubber flooring in Banani.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCikR6E09fGLcTdu1kyMEVs9al1JGGb0hGcJUyHGih4GhQZy3lYD-NBOXXNaX1rOHOAMXHfUzHMrNv8YBO98tBLo7NCz2Yoo5y6YygxhghOF9VTVeNIqj-BNbQgugzHTO9RHZTQhT3ybztcvLAcyLerTXMu1tFKBHcHy5C7zphF5yuam1ekRfYtE41ujg_l5kFiobn86v8V3UVStxJamOfdqyf6atYziG3Y1M4WZGqMpytJ1pkn1QDfGQ',
      spots: [
        { label: 'Eleiko Competition Rack', x: '25%', y: '45%' },
        { label: 'Calibrated Rogue Plates', x: '68%', y: '60%' },
        { label: 'Deadlift Anti-Shock Platform', x: '45%', y: '80%' },
      ],
    },
    {
      title: 'Floor 2 • Technogym Cardio Biometric Theater',
      badge: 'Zone 02',
      description: 'Skillmills, curved treadmills, Concept2 ergometers with live telemetry display screens syncing heart-rate bands.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2gUhFUOsryN_NRnWhUpSe4H5IQhGaYUwi6tyeFQiTzTankDgHwTChC-JwCrbmM4U8yj__u-fAMxfxtpNhSSWTbX4g_2zR-PvfZjIiY2clDb8k4JZU6-uXedIc-y6sDJHxwUWfOfSNirIG42F6-S7loGDktS4fMn7cLS4VewNUjQO9Zy-RnApJHcp6WyB-KhlbsDg64kMJ7eWPux2mlGK_rZX38at5YBuc7yFsgEyVXxG7C9jnLbASGw',
      spots: [
        { label: 'Technogym Curved Sprint Track', x: '35%', y: '50%' },
        { label: 'Concept2 Rowers Hub', x: '70%', y: '40%' },
      ],
    },
    {
      title: 'Floor 3 • Scandinavian Recovery Spa & Cold Plunge',
      badge: 'Zone 03',
      description: 'Finnish natural timber dry saunas, 8°C cold plunge baths, and private digital biometric RFID lockers.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbsOQtd3y7SbrwDkVL10-xYKBYlWqQBuiP_iNVlCYBVjNhvA0jrGAecM_pY4R5XUmZDnzdFPNyAtNvICpxCFd0JWG5cnYLIAN1FD74BUv10GCifnzmJ-KS4Ag2BfCiw0mPqSn3357z7xc34XXMgZzdWvF08HSfiWl-ManwcHICIEJYxu2aIMDBt2xVl8utZf44GErbPRT18LsW74OStXdCB97Z4JlwktWlgsw4ZvFNqHeQUGmK39A_Pg',
      spots: [
        { label: 'Finnish 90°C Dry Sauna', x: '30%', y: '45%' },
        { label: 'Circulation Plunge Bath', x: '65%', y: '65%' },
      ],
    },
  ];

  const currentZone = zones[currentZoneIdx];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="w-full max-w-5xl rounded-3xl bg-[#121318] border border-white/20 shadow-2xl overflow-hidden flex flex-col relative text-[#e3e1e9]">
        {/* Top Control Bar */}
        <div className="p-4 px-6 border-b border-white/[0.08] flex items-center justify-between bg-[#1a1b21]">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full bg-[#10b981]/20 text-[#4edea3] text-[10px] font-bold">
              360° CLUB INSPECTION
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#e3e1e9]">
              {currentZone.title}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-xl bg-[#292a2f] text-[#bbcabf] hover:text-white"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#4edea3]" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#292a2f] text-[#bbcabf] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Panoramic Viewer Stage */}
        <div className="relative w-full h-[460px] bg-black overflow-hidden group">
          <img
            src={currentZone.image}
            alt={currentZone.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121318] via-transparent to-black/30"></div>

          {/* Interactive Inspection Hotspots */}
          {currentZone.spots.map((spot, idx) => (
            <div
              key={idx}
              className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group/spot"
              style={{ left: spot.x, top: spot.y }}
            >
              <div className="w-4 h-4 rounded-full bg-[#4edea3] ring-4 ring-[#4edea3]/40 animate-ping"></div>
              <div className="w-4 h-4 rounded-full bg-[#4edea3] flex items-center justify-center absolute inset-0"></div>
              <div className="absolute left-6 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-[#0d0e13]/90 border border-white/10 text-[11px] font-bold text-white whitespace-nowrap opacity-90 group-hover/spot:opacity-100 shadow-lg">
                {spot.label}
              </div>
            </div>
          ))}

          {/* Left / Right Nav Arrows */}
          <button
            onClick={() => setCurrentZoneIdx((prev) => (prev === 0 ? zones.length - 1 : prev - 1))}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black text-white backdrop-blur-md transition-all border border-white/10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentZoneIdx((prev) => (prev === zones.length - 1 ? 0 : prev + 1))}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black text-white backdrop-blur-md transition-all border border-white/10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Details & Zone Selectors */}
        <div className="p-6 bg-[#1a1b21] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold text-[#4edea3] uppercase tracking-wider">
              {currentZone.badge} Details
            </span>
            <p className="text-xs text-[#bbcabf] max-w-xl">
              {currentZone.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {zones.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentZoneIdx(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentZoneIdx === i ? 'bg-[#4edea3] w-7' : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
