import React, { useState, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  ShieldAlert, 
  Plus, 
  Edit, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  Sliders,
  Mail,
  Lock,
  Tag,
  Shield,
  LogOut,
  Activity
} from 'lucide-react';
import type { MembershipPlan, Payment, User } from '../types';
import { isAdminRole } from '../types';
import { api } from '../services/api';

interface AdminPortalProps {
  plans: MembershipPlan[];
  currentUser?: User | null;
  onLogout?: () => void;
  onRefreshData: () => void;
  onSwitchPersona?: (userId: string) => void;
  onOpenAuthModal?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ 
  plans, 
  currentUser,
  onLogout,
  onRefreshData,
  onSwitchPersona,
  onOpenAuthModal,
}) => {
  const [adminTab, setAdminTab] = useState<'overview' | 'members' | 'plans' | 'payments' | 'inquiries'>('overview');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [paymentsList, setPaymentsList] = useState<Payment[]>([]);
  const [inquiriesList, setInquiriesList] = useState<any[]>([]);
  const [searchMember, setSearchMember] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // New Plan form state
  const [showNewPlanModal, setShowNewPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [planForm, setPlanForm] = useState({
    name: '',
    price: 5000,
    durationDays: 30,
    intervalLabel: '/ month',
    description: '',
    badge: 'Special Tier',
    featuresText: 'All zone access\nRFID Turnstile\nShowers',
    isPopular: false,
    isActive: true,
  });

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [dash, usersRes, payRes] = await Promise.all([
        api.getAdminDashboard(),
        api.getAdminUsers(),
        api.getAdminPayments(),
      ]);
      setDashboardData(dash);
      setUsersList(usersRes.users || []);
      setPaymentsList(payRes.payments || []);
      if (dash.inquiries) {
        setInquiriesList(dash.inquiries);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminRole(currentUser?.role)) {
      loadAdminData();
    }
  }, [currentUser?.role]);

  const handleToggleMemberStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await api.updateMemberStatus(userId, nextStatus as any);
      loadAdminData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleMemberRole = async (userId: string, currentRole: string) => {
    const nextRole = isAdminRole(currentRole) ? 'USER' : 'ADMIN';
    try {
      await api.updateMemberRole(userId, nextRole as any);
      loadAdminData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRefund = async (paymentId: string) => {
    if (!window.confirm('Are you sure you want to issue a refund for this SSLCOMMERZ transaction?')) return;
    try {
      await api.refundPayment(paymentId);
      loadAdminData();
      onRefreshData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    const features = planForm.featuresText.split('\n').filter(f => f.trim().length > 0);
    const payload = {
      name: planForm.name,
      price: Number(planForm.price),
      durationDays: Number(planForm.durationDays),
      intervalLabel: planForm.intervalLabel,
      description: planForm.description,
      badge: planForm.badge,
      features,
      isPopular: planForm.isPopular,
      isActive: planForm.isActive,
    };

    try {
      if (editingPlan) {
        await api.updatePlan(editingPlan.id, payload);
      } else {
        await api.createPlan(payload);
      }
      setShowNewPlanModal(false);
      setEditingPlan(null);
      onRefreshData();
      loadAdminData();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredMembers = usersList.filter(u => 
    u.name?.toLowerCase().includes(searchMember.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchMember.toLowerCase()) ||
    u.phone?.includes(searchMember) ||
    u.memberId?.toLowerCase().includes(searchMember.toLowerCase())
  );

  // If user is not an admin, render the Director Access Gatekeeper
  if (!isAdminRole(currentUser?.role)) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#c0c1ff]/10 border border-[#c0c1ff]/30 text-[#c0c1ff] mx-auto flex items-center justify-center shadow-lg">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <span className="text-[11px] text-[#c0c1ff] uppercase font-bold tracking-widest">
            Restricted System Access
          </span>
          <h2 className="text-2xl font-bold text-[#e3e1e9] mt-2">
            Director & Admin Credentials Required
          </h2>
          <p className="text-xs text-[#bbcabf] mt-2 leading-relaxed">
            The Banani Command Center is restricted to authorized Club Directors and IT Administrators.
            {currentUser ? ` You are currently signed in as ${currentUser.name} (${currentUser.role}).` : ' You are currently not signed in.'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#1a1b21] border border-white/[0.08] text-center space-y-3 shadow-xl">
          {onOpenAuthModal && (
            <button
              onClick={onOpenAuthModal}
              className="w-full py-2.5 px-4 rounded-xl bg-[#c0c1ff]/15 hover:bg-[#c0c1ff]/25 text-[#c0c1ff] text-xs font-bold border border-[#c0c1ff]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Shield className="w-4 h-4 text-[#c0c1ff]" />
              <span>Sign In with Admin Credentials</span>
            </button>
          )}
          {currentUser && onLogout && (
            <div className="pt-2 border-t border-white/[0.06] text-center">
              <button
                onClick={onLogout}
                className="text-xs text-red-400 hover:text-red-300 font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out Current Account</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12 space-y-8">
      {/* Hero Header Banner */}
      <div className="relative rounded-3xl overflow-hidden mb-8 border border-white/[0.08] bg-[#1a1b22]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#c0c1ff]/10 to-[#10b981]/10 opacity-50 mix-blend-screen pointer-events-none" />
        <div className="relative p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2.5 py-1 rounded-md bg-[#c0c1ff]/15 text-[#c0c1ff] text-[10px] font-black uppercase tracking-widest border border-[#c0c1ff]/20">
                Command Center
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
              </span>
              <span className="text-[10px] text-[#4edea3] font-bold uppercase tracking-wider">Live System Telemetry</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#bbcabf] tracking-tight">
              Banani Flagship Management
            </h1>
            <p className="text-sm text-[#bbcabf] mt-2 max-w-xl leading-relaxed">
              Real-time SSLCOMMERZ gateway auditing, athlete lifecycle orchestration, and dynamic subscription tier pricing control.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={loadAdminData}
              disabled={isLoading}
              className="px-5 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-[#e3e1e9] text-xs font-bold flex items-center gap-2 border border-white/10 transition-all cursor-pointer backdrop-blur-md shadow-lg"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#4edea3]' : 'text-[#c0c1ff]'}`} />
              <span>Refresh Telemetry</span>
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="px-5 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold flex items-center gap-2 border border-red-500/20 transition-all cursor-pointer shadow-lg"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modern KPI Stats Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1a1b22] to-[#121318] border border-white/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.4)] group hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#4edea3]/15 flex items-center justify-center border border-[#4edea3]/20 text-[#4edea3] group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="px-2 py-1 rounded-full bg-[#10b981]/15 text-[#4edea3] text-[10px] font-bold flex items-center gap-1 border border-[#10b981]/20">
              <TrendingUp className="w-3 h-3" />
              <span>+18.4%</span>
            </div>
          </div>
          <p className="text-sm text-[#bbcabf] font-semibold">Total Gross Revenue</p>
          <p className="text-3xl font-black text-white mt-1 tracking-tight">
            ৳ {dashboardData?.metrics?.totalRevenueBDT ? dashboardData.metrics.totalRevenueBDT.toLocaleString() : '128,500'}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1a1b22] to-[#121318] border border-white/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.4)] group hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#4cd7f6]/15 flex items-center justify-center border border-[#4cd7f6]/20 text-[#4cd7f6] group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm text-[#bbcabf] font-semibold">Active Athletes</p>
          <p className="text-3xl font-black text-white mt-1 tracking-tight">
            {dashboardData?.metrics?.activeMembers ?? 28}
          </p>
          <p className="text-[10px] text-[#4cd7f6] mt-2 font-semibold">RFID Badges Distributed</p>
        </div>

        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1a1b22] to-[#121318] border border-white/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.4)] group hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#c0c1ff]/15 flex items-center justify-center border border-[#c0c1ff]/20 text-[#c0c1ff] group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c0c1ff] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#c0c1ff]"></span>
            </span>
          </div>
          <p className="text-sm text-[#bbcabf] font-semibold">Banani Floor Capacity</p>
          <p className="text-3xl font-black text-white mt-1 tracking-tight">63%</p>
          <p className="text-[10px] text-[#c0c1ff] mt-2 font-semibold">Optimal Operating Range</p>
        </div>

        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1a1b22] to-[#121318] border border-white/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.4)] group hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-2xl bg-yellow-500/15 flex items-center justify-center border border-yellow-500/20 text-yellow-400 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm text-[#bbcabf] font-semibold">Pending / Expired</p>
          <p className="text-3xl font-black text-white mt-1 tracking-tight">
            {dashboardData?.metrics?.expiredMembers ?? 3}
          </p>
          <p className="text-[10px] text-yellow-400 mt-2 font-semibold">SMS Reminders Dispatched</p>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/[0.08] pb-3">
        {[
          { id: 'overview', label: 'Club Overview' },
          { id: 'members', label: `Athletes & Members (${usersList.length})` },
          { id: 'plans', label: `Subscription Tiers (${plans.length})` },
          { id: 'payments', label: `SSLCOMMERZ Audit (${paymentsList.length})` },
          { id: 'inquiries', label: `Contact Messages (${inquiriesList.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setAdminTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              adminTab === tab.id
                ? 'bg-[#10b981] text-[#003824] shadow-md'
                : 'bg-[#1e1f25] text-[#bbcabf] hover:text-white border border-white/[0.04]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Registrations */}
            <div className="p-6 rounded-2xl bg-[#1a1b21] border border-white/[0.08]">
              <h3 className="text-base font-bold text-[#e3e1e9] mb-4 flex items-center justify-between">
                <span>Recent Club Enrollments</span>
                <span className="text-xs text-[#4edea3]">Real-time feed</span>
              </h3>
              <div className="space-y-3">
                {usersList.slice(0, 5).map((u) => (
                  <div key={u.id} className="p-3 rounded-xl bg-[#292a2f]/50 border border-white/[0.04] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.profileImage || 'https://api.dicebear.com/7.x/initials/svg?seed=SH'}
                        alt={u.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="font-bold text-[#e3e1e9]">{u.name}</p>
                        <p className="text-[11px] text-[#bbcabf]">{u.phone}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      u.status === 'ACTIVE' ? 'bg-[#10b981]/20 text-[#4edea3]' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {u.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gateway Verification Stream */}
            <div className="p-6 rounded-2xl bg-[#1a1b21] border border-white/[0.08]">
              <h3 className="text-base font-bold text-[#e3e1e9] mb-4 flex items-center justify-between">
                <span>SSLCOMMERZ Verified Transactions</span>
                <span className="text-xs text-[#4cd7f6]">Direct API Status</span>
              </h3>
              <div className="space-y-3">
                {paymentsList.slice(0, 5).map((p) => (
                  <div key={p.id} className="p-3 rounded-xl bg-[#292a2f]/50 border border-white/[0.04] flex items-center justify-between text-xs">
                    <div>
                      <p className="font-mono text-xs text-[#4cd7f6]">{p.transactionId}</p>
                      <p className="text-[11px] text-[#bbcabf]">Via {p.paymentMethod} • {new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#e3e1e9]">৳ {p.amount.toLocaleString()}</p>
                      <span className="text-[10px] text-[#4edea3] font-semibold">{p.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Members Management (FR-029) */}
      {adminTab === 'members' && (
        <div className="p-6 rounded-2xl bg-[#1a1b21] border border-white/[0.08] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#bbcabf] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
                placeholder="Search by name, phone, or Member ID..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#292a2f] border border-white/[0.08] text-xs text-[#e3e1e9] focus:outline-none focus:border-[#4edea3]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-white/[0.08] text-[11px] uppercase tracking-wider text-[#bbcabf]">
                  <th className="py-3 px-3">Athlete</th>
                  <th className="py-3 px-3">Member ID</th>
                  <th className="py-3 px-3">Phone & Email</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-xs">
                {filteredMembers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={user.profileImage || 'https://api.dicebear.com/7.x/initials/svg?seed=SH'}
                          alt={user.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="font-bold text-[#e3e1e9]">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-xs text-[#4cd7f6]">
                      {user.memberId}
                    </td>
                    <td className="py-3.5 px-3 text-[#bbcabf]">
                      <p>{user.phone}</p>
                      <p className="text-[11px] text-[#bbcabf]/70">{user.email}</p>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isAdminRole(user.role) ? 'bg-[#c0c1ff]/20 text-[#c0c1ff]' : 'bg-[#292a2f] text-[#bbcabf]'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        user.status === 'ACTIVE' ? 'bg-[#10b981]/20 text-[#4edea3]' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right space-x-2">
                      <button
                        onClick={() => handleToggleMemberStatus(user.id, user.status)}
                        className="px-2.5 py-1 rounded-lg bg-[#292a2f] hover:bg-[#38393f] text-xs text-[#e3e1e9]"
                      >
                        {user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleToggleMemberRole(user.id, user.role)}
                        className="px-2.5 py-1 rounded-lg bg-[#292a2f] hover:bg-[#38393f] text-xs text-[#4cd7f6]"
                      >
                        {isAdminRole(user.role) ? 'Demote' : 'Make Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Plans Management (FR-030) */}
      {adminTab === 'plans' && (
        <div className="p-6 rounded-2xl bg-[#1a1b21] border border-white/[0.08] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#e3e1e9]">Membership Subscription Tiers</h3>
              <p className="text-xs text-[#bbcabf]">Create, re-price, and update club offerings in BDT (৳).</p>
            </div>
            <button
              onClick={() => {
                setEditingPlan(null);
                setPlanForm({
                  name: '',
                  price: 6500,
                  durationDays: 30,
                  intervalLabel: '/ month',
                  description: '',
                  badge: 'Standard',
                  featuresText: 'Full gym access\nRFID Pass',
                  isPopular: false,
                  isActive: true,
                });
                setShowNewPlanModal(true);
              }}
              className="px-4 py-2 rounded-full bg-[#10b981] text-[#003824] text-xs font-bold hover:bg-[#4edea3] flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Plan</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((p) => (
              <div key={p.id} className="p-6 rounded-2xl bg-[#1e1f25] border border-white/[0.06] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-[#e3e1e9]">{p.name}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#292a2f] text-[#4edea3]">
                      {p.badge || 'Active'}
                    </span>
                  </div>
                  <p className="text-xs text-[#bbcabf] mb-4">{p.description}</p>
                  <p className="text-2xl font-black text-[#e3e1e9]">
                    ৳ {p.price.toLocaleString()} <span className="text-xs text-[#bbcabf] font-normal">{p.intervalLabel}</span>
                  </p>
                  <div className="mt-4 space-y-1.5 text-xs text-[#bbcabf]">
                    {p.features.slice(0, 4).map((f, idx) => (
                      <p key={idx}>• {f}</p>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.06] mt-4 flex items-center justify-between">
                  <span className="text-[11px] text-[#4cd7f6]">{p.durationDays} Days Duration</span>
                  <button
                    onClick={() => {
                      setEditingPlan(p);
                      setPlanForm({
                        name: p.name,
                        price: p.price,
                        durationDays: p.durationDays,
                        intervalLabel: p.intervalLabel,
                        description: p.description,
                        badge: p.badge || '',
                        featuresText: p.features.join('\n'),
                        isPopular: !!p.isPopular,
                        isActive: p.isActive,
                      });
                      setShowNewPlanModal(true);
                    }}
                    className="px-3 py-1 rounded-lg bg-[#292a2f] hover:bg-[#38393f] text-xs text-[#e3e1e9] flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Plan</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: SSLCOMMERZ Payments Ledger (FR-031) */}
      {adminTab === 'payments' && (
        <div className="p-6 rounded-2xl bg-[#1a1b21] border border-white/[0.08] space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[#e3e1e9]">SSLCOMMERZ Gateway Audit Ledger</h3>
            <p className="text-xs text-[#bbcabf]">Direct transaction status logs with one-click refund triggering.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="border-b border-white/[0.08] text-[11px] uppercase tracking-wider text-[#bbcabf]">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Transaction ID</th>
                  <th className="py-3 px-3">User ID</th>
                  <th className="py-3 px-3">Channel</th>
                  <th className="py-3 px-3">Amount (BDT)</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Audit Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-xs">
                {paymentsList.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-3 text-[#e3e1e9]">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-xs text-[#4cd7f6]">
                      {p.transactionId}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-xs text-[#bbcabf]">
                      {p.userId}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-[#292a2f] text-[11px] font-bold text-white">
                        {p.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-[#e3e1e9]">
                      ৳ {p.amount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'COMPLETED'
                          ? 'bg-[#10b981]/20 text-[#4edea3]'
                          : p.status === 'REFUNDED'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      {p.status === 'COMPLETED' && (
                        <button
                          onClick={() => handleRefund(p.id)}
                          className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold inline-flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Issue Refund</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Inquiries (Contact Messages) */}
      {adminTab === 'inquiries' && (
        <div className="p-6 rounded-2xl bg-[#1a1b21] border border-white/[0.08] space-y-4">
          <h3 className="text-lg font-bold text-[#e3e1e9]">Banani Club Inquiries</h3>
          {inquiriesList.length === 0 ? (
            <p className="text-xs text-[#bbcabf] py-4">No pending inquiries.</p>
          ) : (
            <div className="space-y-3">
              {inquiriesList.map((inq, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#292a2f]/60 border border-white/[0.06] text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#e3e1e9]">{inq.name} ({inq.phone})</span>
                    <span className="text-[10px] text-[#bbcabf]">{new Date(inq.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-[#4cd7f6] mb-2">{inq.email}</p>
                  <p className="text-[#bbcabf] leading-relaxed">{inq.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create / Edit Plan Modal */}
      {showNewPlanModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-[#1a1b21] border border-white/15 p-6 sm:p-8 shadow-2xl text-[#e3e1e9] max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingPlan ? 'Edit Membership Plan' : 'Create New Membership Plan'}
            </h3>

            <form onSubmit={handleSavePlan} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#bbcabf] block mb-1">Plan Name</label>
                <input
                  type="text"
                  value={planForm.name}
                  onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                  placeholder="e.g. 6-Month Semi-Annual Elite"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#292a2f] border border-white/[0.08] text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#bbcabf] block mb-1">Price (৳ BDT)</label>
                  <input
                    type="number"
                    value={planForm.price}
                    onChange={(e) => setPlanForm({ ...planForm, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#292a2f] border border-white/[0.08] text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#bbcabf] block mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    value={planForm.durationDays}
                    onChange={(e) => setPlanForm({ ...planForm, durationDays: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#292a2f] border border-white/[0.08] text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#bbcabf] block mb-1">Interval Display Label</label>
                <input
                  type="text"
                  value={planForm.intervalLabel}
                  onChange={(e) => setPlanForm({ ...planForm, intervalLabel: e.target.value })}
                  placeholder="/ month or / 6 months"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#292a2f] border border-white/[0.08] text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#bbcabf] block mb-1">Description</label>
                <textarea
                  value={planForm.description}
                  onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#292a2f] border border-white/[0.08] text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#bbcabf] block mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={planForm.badge}
                  onChange={(e) => setPlanForm({ ...planForm, badge: e.target.value })}
                  placeholder="e.g. VIP Status or Recommended"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#292a2f] border border-white/[0.08] text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#bbcabf] block mb-1">Features (One per line)</label>
                <textarea
                  value={planForm.featuresText}
                  onChange={(e) => setPlanForm({ ...planForm, featuresText: e.target.value })}
                  rows={4}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#292a2f] border border-white/[0.08] text-xs text-white"
                  required
                />
              </div>

              <div className="flex items-center gap-4 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={planForm.isPopular}
                    onChange={(e) => setPlanForm({ ...planForm, isPopular: e.target.checked })}
                    className="accent-[#10b981]"
                  />
                  <span>Mark as Most Popular</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={planForm.isActive}
                    onChange={(e) => setPlanForm({ ...planForm, isActive: e.target.checked })}
                    className="accent-[#10b981]"
                  />
                  <span>Publish Active</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setShowNewPlanModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#292a2f] text-xs font-semibold hover:bg-[#38393f]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#10b981] text-[#003824] text-xs font-bold hover:bg-[#4edea3]"
                >
                  Save Tier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
