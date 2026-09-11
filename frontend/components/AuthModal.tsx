import React, { useState } from 'react';
import { X, Lock, Mail, Phone, User, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+880 1711-000000');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (isRegister) {
        const res = await api.register({ name, email, phone, password });
        onSuccess(res.user);
      } else {
        const res = await api.login(email, password);
        onSuccess(res.user);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-[#1a1b21] border border-white/15 p-6 sm:p-8 shadow-2xl text-[#e3e1e9] relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-[#292a2f] text-[#bbcabf] hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded bg-[#10b981] flex items-center justify-center text-[10px] font-black text-black">
              GF
            </div>
            <span className="font-bold text-sm text-[#4edea3]">GymFlow BD</span>
          </div>
          <h3 className="text-xl font-bold text-[#e3e1e9]">
            {isRegister ? 'Create Athlete Account' : 'Member Club Login'}
          </h3>
          <p className="text-xs text-[#bbcabf] mt-0.5">
            {isRegister
              ? 'Create your GymFlow BD athlete account'
              : 'Enter your email & password, or use the quick demo accounts below'}
          </p>
        </div>

        {/* Quick Demo Accounts Banner for easy sign-in */}
        {!isRegister && (
          <div className="mb-4 p-3 rounded-2xl bg-[#121318] border border-white/[0.08] text-xs space-y-2">
            <span className="text-[10px] uppercase font-bold text-[#4edea3] tracking-wider block">
              Quick Demo Accounts (Password: any password, e.g. 123456)
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('shakib@gymflow.bd');
                  setPassword('123456');
                }}
                className="flex-1 py-1.5 px-2.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-left text-[#e3e1e9] text-[11px] transition-colors border border-white/5 cursor-pointer"
              >
                <span className="font-bold text-[#4edea3] block">Member (Shakib)</span>
                <span className="text-[#bbcabf] text-[10px]">shakib@gymflow.bd</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@gymflow.bd');
                  setPassword('123456');
                }}
                className="flex-1 py-1.5 px-2.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-left text-[#e3e1e9] text-[11px] transition-colors border border-white/5 cursor-pointer"
              >
                <span className="font-bold text-[#c0c1ff] block">Director / Admin</span>
                <span className="text-[#bbcabf] text-[10px]">admin@gymflow.bd</span>
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="text-[11px] font-bold text-[#bbcabf] uppercase block mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#bbcabf] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Shakib Hossain"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#292a2f] border border-white/[0.08] text-xs text-white"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-[#bbcabf] uppercase block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#bbcabf] absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="athlete@gymflow.bd"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#292a2f] border border-white/[0.08] text-xs text-white"
                required
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="text-[11px] font-bold text-[#bbcabf] uppercase block mb-1">
                Phone Number (+880)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#bbcabf] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 1711-000000"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#292a2f] border border-white/[0.08] text-xs text-white"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-[#bbcabf] uppercase block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#bbcabf] absolute left-3 top-2.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#292a2f] border border-white/[0.08] text-xs text-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-full bg-[#10b981] text-[#003824] text-xs font-bold hover:bg-[#4edea3] transition-all shadow-md mt-2"
          >
            {isSubmitting ? 'Authenticating...' : isRegister ? 'Complete Enrollment' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-white/[0.08] text-center text-xs text-[#bbcabf]">
          {isRegister ? (
            <p>
              Already an enrolled member?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="text-[#4edea3] font-bold hover:underline"
              >
                Sign In here
              </button>
            </p>
          ) : (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="text-[#4edea3] font-bold hover:underline"
              >
                Register as Member
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
