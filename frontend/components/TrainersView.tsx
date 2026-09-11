import React from 'react';
import { Award, Calendar, ChevronRight, Star, ShieldCheck, Dumbbell, Clock } from 'lucide-react';
import type { Trainer } from '../types';

interface TrainersViewProps {
  trainers: Trainer[];
  onBookTrainer: (trainer: Trainer) => void;
}

export const TrainersView: React.FC<TrainersViewProps> = ({ trainers, onBookTrainer }) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1e1f25] border border-white/[0.08]">
          <Award className="w-3.5 h-3.5 text-[#4cd7f6]" />
          <span className="text-[11px] text-[#4cd7f6] uppercase font-bold tracking-widest">
            FR-005 Coaching Faculty & Mentorship
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#e3e1e9] tracking-tight">
          Elite Strength & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4edea3] via-[#4cd7f6] to-[#c0c1ff]">Conditioning Mentors</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#bbcabf] max-w-xl mx-auto leading-relaxed">
          Internationally certified master coaches specializing in kinetic biomechanics, injury prevention, athletic hypertrophy, and metabolic longevity.
        </p>
      </div>

      {/* Trainers Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {trainers.map((trainer) => (
          <div
            key={trainer.id}
            className="rounded-2xl bg-[#1a1b21] border border-white/[0.08] overflow-hidden shadow-xl flex flex-col justify-between group hover:border-white/20 transition-all"
          >
            <div>
              {/* Photo */}
              <div className="relative h-80 w-full overflow-hidden bg-[#121318]">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${trainer.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1b21] via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#10b981]/25 backdrop-blur-md text-[#4edea3] text-[10px] font-bold border border-[#10b981]/30">
                    {trainer.badge}
                  </span>
                  <span className="text-[#e3e1e9] text-[10px] font-semibold bg-[#0d0e13]/85 px-2.5 py-1 rounded-md border border-white/[0.06]">
                    {trainer.experience}
                  </span>
                </div>
              </div>

              {/* Bio & Details */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-[#e3e1e9]">{trainer.name}</h3>
                  <div className="flex items-center gap-1 text-[#4edea3] text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{trainer.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-[#bbcabf] leading-relaxed">
                  {trainer.bio}
                </p>

                <div>
                  <h4 className="text-[11px] font-bold text-[#e3e1e9] uppercase tracking-wider mb-2">
                    Verified Credentials
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {trainer.certifications.map((cert, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-[#292a2f] border border-white/[0.04] text-[10px] text-[#4cd7f6] font-medium"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                {trainer.schedule && (
                  <div className="p-3 rounded-xl bg-[#0d0e13]/60 border border-white/[0.04] space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#bbcabf]">
                      <Clock className="w-3.5 h-3.5 text-[#4cd7f6]" />
                      <span>On-Floor Coaching Hours:</span>
                    </div>
                    {trainer.schedule.map((slot, sIdx) => (
                      <p key={sIdx} className="text-[10px] text-[#bbcabf]/80 pl-5">
                        • {slot}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="p-6 pt-0 border-t border-white/[0.04] mt-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#e3e1e9] block">
                  {trainer.athletesMentored}+
                </span>
                <span className="text-[10px] text-[#bbcabf]">Athletes Mentored</span>
              </div>
              <button
                onClick={() => onBookTrainer(trainer)}
                className="px-4 py-2 rounded-full bg-[#10b981] text-[#003824] hover:bg-[#4edea3] text-xs font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Induction</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Free Induction Notice Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1e1f25] via-[#292a2f] to-[#1e1f25] border border-white/[0.08] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#10b981]/15 flex items-center justify-center text-[#4edea3] shrink-0 border border-[#10b981]/30">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#e3e1e9]">
              1-on-1 Fitness Assessment Included With All Pro & Elite Tiers
            </h3>
            <p className="text-xs text-[#bbcabf] mt-1">
              Your induction includes InBody 770 composition scan, movement screen, and 6-week personalized program roadmapping.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
