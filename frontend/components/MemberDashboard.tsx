import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Calendar, 
  PauseCircle, 
  PlayCircle, 
  CheckCircle, 
  FileText, 
  ArrowUpRight, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Printer, 
  X, 
  Bot, 
  Sparkles, 
  LogOut,
  Edit3,
  Save,
  Check
} from 'lucide-react';
import type { User, Membership, Payment } from '../types';
import { isAdminRole } from '../types';
import { api } from '../services/api';

interface MemberDashboardProps {
  currentUser: User | null;
  activeMembership: Membership | null;
  payments: Payment[];
  onOpenCheckout: (planId?: string) => void;
  onRefreshData: () => void;
  onLogout?: () => void;
  onOpenGeminiChat?: (prompt?: string) => void;
  onOpenAuthModal?: () => void;
  onSwitchPersona?: (userId: string) => void;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({
  currentUser,
  activeMembership,
  payments,
  onOpenCheckout,
  onRefreshData,
  onLogout,
  onOpenGeminiChat,
  onOpenAuthModal,
  onSwitchPersona,
}) => {
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [selectedInvoicePayment, setSelectedInvoicePayment] = useState<Payment | null>(null);

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || 'Banani, Dhaka',
    emergencyContact: currentUser?.emergencyContact || '+880 1819-998877',
    bio: currentUser?.bio || 'Training for functional fitness & wellness.',
  });

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        address: currentUser.address || 'House 24, Road 11, Banani, Dhaka-1213',
        emergencyContact: currentUser.emergencyContact || '+880 1711-998877',
        bio: currentUser.bio || 'Training for functional fitness & wellness.',
      });
    }
  }, [currentUser]);

  const handlePauseToggle = async () => {
    if (!activeMembership) return;
    try {
      await api.togglePauseMembership(activeMembership.id);
      onRefreshData();
    } catch (e) {
      console.error('Failed to toggle pause membership:', e);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      await api.updateProfile(profileData);
      setProfileSuccessMsg('Profile updated successfully!');
      setIsEditMode(false);
      setTimeout(() => setProfileSuccessMsg(''), 3500);
      onRefreshData();
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Remaining days calculation
  const getDaysRemaining = () => {
    if (!activeMembership) return 0;
    const end = new Date(activeMembership.endDate).getTime();
    const now = new Date().getTime();
    const diff = Math.ceil((end - now) / (1000 * 3600 * 24));
    return Math.max(0, diff);
  };

  const daysRemaining = getDaysRemaining();
  const totalDays = activeMembership?.durationDays || 90;
  const progressPercent = Math.min(100, Math.max(5, (daysRemaining / totalDays) * 100));

  // If user is not logged in, show a clean, simple sign-in prompt
  if (!currentUser) {
    return (
      <div className="w-full max-w-lg mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#10b981]/15 border border-[#10b981]/30 text-[#4edea3] mx-auto flex items-center justify-center shadow-lg">
          <UserIcon className="w-8 h-8" />
        </div>
        <div>
          <span className="text-[11px] text-[#4edea3] uppercase font-bold tracking-widest">
            Member Portal
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#e3e1e9] mt-2">
            Sign In to View Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-[#bbcabf] mt-2 leading-relaxed">
            Manage your active subscriptions, review payment receipts, update athlete contact details, and access member perks.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#1a1b21] border border-white/[0.08] space-y-3 shadow-xl">
          <div className="flex flex-col sm:flex-row gap-3">
            {onOpenAuthModal && (
              <button
                onClick={onOpenAuthModal}
                className="flex-1 py-3 px-4 rounded-xl bg-[#10b981] hover:bg-[#4edea3] text-[#003824] text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Sign In to Account
              </button>
            )}
            <button
              onClick={() => onOpenCheckout()}
              className="flex-1 py-3 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-bold border border-white/10 transition-all cursor-pointer"
            >
              Join Now & Choose Plan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-10 space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] text-[#4edea3] uppercase font-bold tracking-widest">
              Banani Flagship Club
            </span>
            {isAdminRole(currentUser.role) && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#c0c1ff]/20 text-[#c0c1ff] border border-[#c0c1ff]/30">
                ADMIN
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#e3e1e9] mt-1 tracking-tight">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs text-[#bbcabf] mt-1">
            Member ID: <span className="font-mono text-[#4cd7f6]">{currentUser.id}</span> | Email: <span className="text-[#e3e1e9]">{currentUser.email}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenCheckout()}
            className="px-5 py-2.5 rounded-full bg-[#10b981] text-[#003824] text-xs font-bold hover:bg-[#4edea3] transition-all shadow-[0_0_18px_rgba(16,185,129,0.3)] cursor-pointer"
          >
            Renew / Change Plan
          </button>
          {onLogout && (
            <button
              onClick={onLogout}
              className="px-4 py-2.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold border border-red-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Log Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Membership Details + Other Club Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Active Subscription Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl bg-[#1a1b21] border border-white/10 p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-[11px] uppercase font-bold text-[#4edea3] tracking-wider">
                  Active Membership Tier
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#e3e1e9] mt-1">
                  {activeMembership?.planName || '3-Month Pro Athlete Tier'}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${
                  activeMembership?.status === 'PAUSED'
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'bg-[#10b981]/20 text-[#4edea3] border border-[#10b981]/30'
                }`}>
                  {activeMembership?.status || 'ACTIVE'}
                </span>
              </div>
            </div>

            {/* Validity Timeline */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#bbcabf]">Remaining Validity</span>
                <span className="text-[#4edea3] font-bold">{daysRemaining} Days Left</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#292a2f] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#10b981] to-[#4cd7f6] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#bbcabf]/80 pt-1">
                <span>Start: {activeMembership ? new Date(activeMembership.startDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Jan 15, 2025'}</span>
                <span>Expiry: {activeMembership ? new Date(activeMembership.endDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Apr 15, 2025'}</span>
              </div>
            </div>

            {/* Included Features List */}
            <div className="space-y-3 pt-2 pb-6 border-y border-white/[0.06]">
              <p className="text-[11px] font-bold text-[#bbcabf] uppercase tracking-wider">
                Plan Inclusions & Benefits
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#e3e1e9]">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#4edea3] shrink-0" />
                  <span>Unlimited Gym Floor & Cardio Suite Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#4edea3] shrink-0" />
                  <span>Nordic Finnish Sauna & Steam Suites</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#4edea3] shrink-0" />
                  <span>Complimentary Day Locker Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#4edea3] shrink-0" />
                  <span>1-on-1 Certified Coach Assessment</span>
                </div>
              </div>
            </div>

            {/* Actions: Pause & Renew */}
            <div className="flex flex-wrap items-center gap-3 pt-6">
              <button
                onClick={handlePauseToggle}
                className="px-4 py-2.5 rounded-xl bg-[#292a2f] hover:bg-[#38393f] text-[#e3e1e9] text-xs font-semibold border border-white/[0.08] transition-all flex items-center gap-2 cursor-pointer"
              >
                {activeMembership?.status === 'PAUSED' ? (
                  <>
                    <PlayCircle className="w-4 h-4 text-[#4edea3]" />
                    <span>Resume Subscription</span>
                  </>
                ) : (
                  <>
                    <PauseCircle className="w-4 h-4 text-yellow-400" />
                    <span>Pause Membership (Up to 14 Days)</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onOpenCheckout()}
                className="px-5 py-2.5 rounded-xl bg-[#10b981]/15 hover:bg-[#10b981]/25 text-[#4edea3] text-xs font-bold border border-[#10b981]/30 transition-all flex items-center gap-1.5 ml-auto cursor-pointer"
              >
                <span>Renew / Extend Subscription</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Ask AI Coach Prompt Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-[#1a1b22] to-[#121318] border border-white/10 p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#10b981]/15 border border-[#10b981]/30 flex items-center justify-center text-[#4edea3] shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#e3e1e9]">Ask Coach Flow (AI Fitness Coach)</p>
                <p className="text-xs text-[#bbcabf]">Tailored workout plans & Dhaka grocery nutrition advice.</p>
              </div>
            </div>
            <button
              onClick={() => onOpenGeminiChat?.()}
              className="px-4 py-2 rounded-xl bg-[#10b981] hover:bg-[#4edea3] text-[#003824] font-bold text-xs shrink-0 transition-all cursor-pointer"
            >
              Open AI Coach
            </button>
          </div>
        </div>

        {/* Right Column: Other Details & Club Information */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-[#1a1b21] border border-white/10 p-6 sm:p-8 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-[#e3e1e9]">Club & Facility Details</h3>
              <span className="text-[11px] text-[#4edea3] font-semibold">Active Member</span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#4cd7f6] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#e3e1e9] block">Banani Flagship Club</span>
                  <span className="text-[#bbcabf]">Plot 42, Road 11, Block D, Banani, Dhaka-1213</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#4cd7f6] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#e3e1e9] block">Gym Hours</span>
                  <span className="text-[#bbcabf]">Open Daily: 6:00 AM – 11:00 PM (All 7 Days)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#4cd7f6] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#e3e1e9] block">Front Desk & Concierge</span>
                  <span className="text-[#bbcabf]">+880 1711-000000 | concierge@gymflow.bd</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#e3e1e9] block">Assigned Day Locker</span>
                  <span className="text-[#bbcabf]">Locker Unit: <strong className="text-white font-mono">{currentUser.assignedLocker || 'B-14'}</strong> (Banani Locker Hub)</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#121318] border border-white/[0.06] text-xs text-[#bbcabf] leading-relaxed">
              Show your Member ID (<span className="font-mono font-bold text-white">{currentUser.id}</span>) or registered phone number at the Banani reception desk for towel service and sauna induction.
            </div>
          </div>
        </div>
      </div>

      {/* Athlete Profile & Edit Profile Section */}
      <div className="rounded-3xl bg-[#1a1b21] border border-white/10 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4cd7f6]/15 text-[#4cd7f6] flex items-center justify-center">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#e3e1e9]">Athlete Profile & Contact</h3>
              <p className="text-xs text-[#bbcabf]">Manage your personal contact details and emergency records.</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className="px-4 py-2 rounded-xl bg-[#292a2f] hover:bg-[#34353b] text-white text-xs font-semibold border border-white/10 flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#4edea3]" />
            <span>{isEditMode ? 'Cancel Editing' : 'Edit Profile'}</span>
          </button>
        </div>

        {profileSuccessMsg && (
          <div className="mb-6 p-3 rounded-xl bg-[#10b981]/15 border border-[#10b981]/30 text-xs text-[#4edea3] flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{profileSuccessMsg}</span>
          </div>
        )}

        {isEditMode ? (
          /* Profile Edit Form */
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#bbcabf] uppercase tracking-wider block mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#24252c] border border-white/10 text-xs text-[#e3e1e9] focus:outline-none focus:border-[#4edea3]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#bbcabf] uppercase tracking-wider block mb-1.5">
                  Mobile Phone (+880)
                </label>
                <input
                  type="text"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#24252c] border border-white/10 text-xs text-[#e3e1e9] focus:outline-none focus:border-[#4edea3]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#bbcabf] uppercase tracking-wider block mb-1.5">
                  Residential Address (Dhaka)
                </label>
                <input
                  type="text"
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#24252c] border border-white/10 text-xs text-[#e3e1e9] focus:outline-none focus:border-[#4edea3]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#bbcabf] uppercase tracking-wider block mb-1.5">
                  Emergency Contact Phone
                </label>
                <input
                  type="text"
                  value={profileData.emergencyContact}
                  onChange={(e) => setProfileData({ ...profileData, emergencyContact: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#24252c] border border-white/10 text-xs text-[#e3e1e9] focus:outline-none focus:border-[#4edea3]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-[#bbcabf] uppercase tracking-wider block mb-1.5">
                  Fitness Bio & Wellness Goals
                </label>
                <input
                  type="text"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#24252c] border border-white/10 text-xs text-[#e3e1e9] focus:outline-none focus:border-[#4edea3]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsEditMode(false)}
                className="px-4 py-2.5 rounded-xl bg-[#24252c] text-[#bbcabf] text-xs font-semibold hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="px-6 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#4edea3] text-[#003824] text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isUpdatingProfile ? 'Saving Changes...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        ) : (
          /* Profile Read-only View */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs">
            <div className="p-4 rounded-2xl bg-[#121318] border border-white/[0.04]">
              <span className="text-[10px] font-bold text-[#bbcabf] uppercase tracking-wider block mb-1">Full Name</span>
              <p className="font-bold text-[#e3e1e9] text-sm">{currentUser.name}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#121318] border border-white/[0.04]">
              <span className="text-[10px] font-bold text-[#bbcabf] uppercase tracking-wider block mb-1">Primary Email</span>
              <p className="font-bold text-[#e3e1e9] text-sm truncate">{currentUser.email}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#121318] border border-white/[0.04]">
              <span className="text-[10px] font-bold text-[#bbcabf] uppercase tracking-wider block mb-1">Mobile Phone</span>
              <p className="font-mono font-bold text-[#e3e1e9] text-sm">{currentUser.phone || '+880 1711-223344'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#121318] border border-white/[0.04]">
              <span className="text-[10px] font-bold text-[#bbcabf] uppercase tracking-wider block mb-1">Address</span>
              <p className="text-[#e3e1e9]">{currentUser.address || 'House 24, Road 11, Banani, Dhaka-1213'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#121318] border border-white/[0.04]">
              <span className="text-[10px] font-bold text-[#bbcabf] uppercase tracking-wider block mb-1">Emergency Contact</span>
              <p className="font-mono text-[#4cd7f6]">{currentUser.emergencyContact || '+880 1711-998877'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#121318] border border-white/[0.04]">
              <span className="text-[10px] font-bold text-[#bbcabf] uppercase tracking-wider block mb-1">Fitness Goal</span>
              <p className="text-[#bbcabf] truncate">{currentUser.bio || 'Training for functional fitness & wellness.'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Payment History & SSLCOMMERZ Records */}
      <div className="rounded-3xl bg-[#1a1b21] border border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-[#e3e1e9] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#4edea3]" />
              <span>Payment History & Invoices</span>
            </h3>
            <p className="text-xs text-[#bbcabf] mt-0.5">
              Verified records of your subscription transactions and SSLCOMMERZ payments in BDT (৳).
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-white/[0.08] text-[11px] uppercase tracking-wider text-[#bbcabf]">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Transaction ID</th>
                <th className="py-3 px-3">Method</th>
                <th className="py-3 px-3">Amount (BDT)</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Tax Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-xs">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-xs text-[#bbcabf]">
                    No recorded transactions yet. When you subscribe or renew, receipts appear here.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-3 text-[#e3e1e9]">
                      {new Date(p.createdAt).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-xs text-[#4cd7f6]">
                      {p.transactionId}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#292a2f] text-[11px] font-bold text-[#e3e1e9]">
                        {p.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-[#e3e1e9]">
                      ৳ {p.amount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#10b981]/20 text-[#4edea3] text-[10px] font-bold">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => setSelectedInvoicePayment(p)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#292a2f] hover:bg-[#38393f] text-[#4edea3] text-xs font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Invoice</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Digital Tax Invoice Modal */}
      {selectedInvoicePayment && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-3xl bg-[#1a1b21] border border-white/15 p-6 sm:p-8 shadow-2xl text-[#e3e1e9] relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedInvoicePayment(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#292a2f] text-[#bbcabf] hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Invoice Header */}
            <div className="flex items-start justify-between border-b border-white/[0.08] pb-6 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded bg-[#10b981] flex items-center justify-center text-[10px] font-black text-black">
                    GF
                  </div>
                  <span className="font-bold text-lg text-[#e3e1e9]">GymFlow BD Limited</span>
                </div>
                <p className="text-xs text-[#bbcabf]">Plot 42, Road 11, Block D, Banani, Dhaka-1213</p>
                <p className="text-[11px] text-[#bbcabf]">BIN/VAT Reg: 002948291-0101 | +880 1711-000000</p>
              </div>

              <div className="text-right">
                <span className="px-3 py-1 rounded-full bg-[#10b981]/20 text-[#4edea3] text-xs font-bold border border-[#10b981]/30 block mb-1">
                  TAX INVOICE / RECEIPT
                </span>
                <p className="text-xs font-mono text-[#bbcabf]">INV-{selectedInvoicePayment.id.slice(0, 8).toUpperCase()}</p>
                <p className="text-[11px] text-[#bbcabf]">
                  Date: {new Date(selectedInvoicePayment.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Customer & Gateway Info */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#121318] border border-white/[0.06] text-xs mb-6">
              <div>
                <span className="text-[10px] font-bold text-[#bbcabf] uppercase tracking-wider block">Billed To:</span>
                <p className="font-bold text-[#e3e1e9] mt-0.5">{currentUser?.name}</p>
                <p className="text-[#bbcabf]">{currentUser?.email}</p>
                <p className="text-[#bbcabf]">{currentUser?.phone}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-[#bbcabf] uppercase tracking-wider block">Gateway Details:</span>
                <p className="font-semibold text-[#4cd7f6] mt-0.5">SSLCOMMERZ Merchant Gateway</p>
                <p className="text-[#bbcabf]">Method: <span className="font-bold text-white">{selectedInvoicePayment.paymentMethod}</span></p>
                <p className="font-mono text-[10px] text-[#4edea3]">{selectedInvoicePayment.transactionId}</p>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-xs font-bold text-[#bbcabf] uppercase border-b border-white/[0.06] pb-2">
                <span>Description</span>
                <span>Amount (BDT)</span>
              </div>
              <div className="flex justify-between text-xs text-[#e3e1e9] py-1">
                <span>GymFlow BD Banani Club Membership Subscription</span>
                <span className="font-semibold">৳ {selectedInvoicePayment.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-[#bbcabf] py-1">
                <span>Day Locker & Club Access</span>
                <span>Included</span>
              </div>
              <div className="flex justify-between text-xs text-[#bbcabf] py-1">
                <span>Government VAT (15% inclusive)</span>
                <span>৳ {Math.round(selectedInvoicePayment.amount * 0.1304).toLocaleString()}</span>
              </div>
              <div className="border-t border-white/[0.08] pt-3 flex justify-between text-base font-bold text-[#e3e1e9]">
                <span>Total Paid (৳ BDT)</span>
                <span className="text-[#4edea3]">৳ {selectedInvoicePayment.amount.toLocaleString()}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-[#292a2f] hover:bg-[#38393f] text-[#e3e1e9] text-xs font-semibold flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => setSelectedInvoicePayment(null)}
                className="px-5 py-2 rounded-xl bg-[#10b981] text-[#003824] text-xs font-bold hover:bg-[#4edea3] cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
