import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle2, User, Award } from 'lucide-react';
import type { Trainer } from '../types';
import { api } from '../services/api';

interface InductionModalProps {
  trainer: Trainer | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const InductionModal: React.FC<InductionModalProps> = ({ trainer, onClose, onSuccess }) => {
  const [selectedSlot, setSelectedSlot] = useState(trainer?.schedule?.[0] || '10:00 AM - 11:30 AM');
  const [goal, setGoal] = useState('Powerlifting & Strength Development');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  if (!trainer) return null;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.bookTrainerInduction(trainer.id);
      setIsBooked(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-3xl bg-[#1a1b21] border border-white/15 p-6 sm:p-8 shadow-2xl text-[#e3e1e9] relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-[#292a2f] text-[#bbcabf] hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {!isBooked ? (
          <form onSubmit={handleBooking} className="space-y-5">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#4edea3] tracking-wider">
                1-on-1 Athlete Induction
              </span>
              <h3 className="text-xl font-bold text-[#e3e1e9] mt-0.5">
                Schedule Induction with {trainer.name}
              </h3>
              <p className="text-xs text-[#bbcabf] mt-1">
                {trainer.specialization} • Banani Flagship Hub
              </p>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#1e1f25] border border-white/[0.06]">
              <img
                src={trainer.image}
                alt={trainer.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div>
                <p className="text-xs font-bold text-[#e3e1e9]">{trainer.name}</p>
                <p className="text-[11px] text-[#4cd7f6]">{trainer.badge}</p>
                <p className="text-[10px] text-[#bbcabf]">{trainer.experience} Coaching Experience</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#bbcabf] block">
                Select Floor Time Slot
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(trainer.schedule || [
                  '07:00 AM - 08:30 AM',
                  '10:00 AM - 11:30 AM',
                  '05:00 PM - 06:30 PM',
                  '07:30 PM - 09:00 PM',
                ]).map((slot, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                      selectedSlot === slot
                        ? 'bg-[#10b981]/20 border-[#10b981] text-[#4edea3]'
                        : 'bg-[#292a2f] border-white/[0.06] text-[#bbcabf] hover:text-white'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{slot}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#bbcabf] block">
                Primary Athletic Focus
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#292a2f] border border-white/[0.08] text-xs text-[#e3e1e9]"
              >
                <option value="Powerlifting & Strength Development">Powerlifting & Barbell Technique</option>
                <option value="Fat Loss & High-Intensity Conditioning">Fat Loss & High-Intensity Conditioning</option>
                <option value="Hypertrophy & Aesthetic Bodybuilding">Hypertrophy & Aesthetic Bodybuilding</option>
                <option value="Mobility, Posture & Injury Prevention">Mobility, Posture & Injury Prevention</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-full bg-[#10b981] text-[#003824] text-xs font-bold hover:bg-[#4edea3] transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Calendar className="w-4 h-4" />
                <span>{isSubmitting ? 'Confirming with Coach...' : 'Confirm Free Induction Session'}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#10b981]/20 border border-[#10b981] flex items-center justify-center text-[#4edea3] mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#e3e1e9]">Induction Confirmed!</h3>
            <p className="text-xs text-[#bbcabf] max-w-sm mx-auto">
              Your 1-on-1 induction with <strong>{trainer.name}</strong> is scheduled for tomorrow at <strong>{selectedSlot}</strong>.
            </p>
            <button
              onClick={() => {
                setIsBooked(false);
                onClose();
                onSuccess();
              }}
              className="px-6 py-2.5 rounded-full bg-[#10b981] text-[#003824] text-xs font-bold hover:bg-[#4edea3]"
            >
              Great, Back to App
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
