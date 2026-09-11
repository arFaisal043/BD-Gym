import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { PlansView } from './components/PlansView';
import { FacilitiesView } from './components/FacilitiesView';
import { TrainersView } from './components/TrainersView';
import { MemberDashboard } from './components/MemberDashboard';
import { AdminPortal } from './components/AdminPortal';
import { CheckoutModal } from './components/CheckoutModal';
import { InductionModal } from './components/InductionModal';
import { VirtualTourModal } from './components/VirtualTourModal';
import { AuthModal } from './components/AuthModal';
import { GeminiChatModal } from './components/GeminiChatModal';
import { Bot, Sparkles } from 'lucide-react';
import { api } from './services/api';
import { isAdminRole } from './types';
import type { 
  User, 
  MembershipPlan, 
  Membership, 
  Payment, 
  Trainer, 
  Facility, 
  FAQ, 
  Notification 
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeMembership, setActiveMembership] = useState<Membership | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);

  // Modals
  const [checkoutPlan, setCheckoutPlan] = useState<MembershipPlan | null>(null);
  const [inductionTrainer, setInductionTrainer] = useState<Trainer | null>(null);
  const [showVirtualTour, setShowVirtualTour] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showGeminiChat, setShowGeminiChat] = useState(false);
  const [initialChatPrompt, setInitialChatPrompt] = useState<string | undefined>(undefined);

  // Initial Data Fetching
  const loadData = async () => {
    try {
      const [userRes, plansRes, trainersRes, facRes, faqRes, notifRes, memRes, payRes] = await Promise.all([
        api.getCurrentUser().catch(() => ({ user: null as any })),
        api.getPlans().catch(() => ({ plans: [] })),
        api.getTrainers().catch(() => ({ trainers: [] })),
        api.getFacilities().catch(() => ({ facilities: [] })),
        api.getFaqs().catch(() => ({ faqs: [] })),
        api.getNotifications().catch(() => ({ notifications: [] })),
        api.getMyMemberships().catch(() => ({ memberships: [], activeMembership: null })),
        api.getMyPayments().catch(() => ({ payments: [] })),
      ]);

      if (userRes?.user) setCurrentUser(userRes.user);
      if (plansRes?.plans) setPlans(plansRes.plans);
      if (trainersRes?.trainers) setTrainers(trainersRes.trainers);
      if (facRes?.facilities) setFacilities(facRes.facilities);
      if (faqRes?.faqs) setFaqs(faqRes.faqs);
      if (notifRes?.notifications) setNotifications(notifRes.notifications);
      if (memRes?.activeMembership) setActiveMembership(memRes.activeMembership);
      if (payRes?.payments) setPayments(payRes.payments);
    } catch (e) {
      console.error('Error loading GymFlow BD data:', e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Strict route protection: 
  // 1. Normal users cannot view or remain on admin-portal
  // 2. Admins cannot view or remain on member-dashboard
  useEffect(() => {
    if (activeTab === 'admin-portal' && !isAdminRole(currentUser?.role)) {
      setActiveTab(currentUser ? 'member-dashboard' : 'home');
    } else if (activeTab === 'member-dashboard' && isAdminRole(currentUser?.role)) {
      setActiveTab('admin-portal');
    }
  }, [activeTab, currentUser?.role]);

  const handleSwitchPersona = async (userId: string) => {
    try {
      const res = await api.switchPersona(userId);
      if (res.user) {
        setCurrentUser(res.user);
        const [memRes, payRes] = await Promise.all([
          api.getMyMemberships().catch(() => ({ memberships: [], activeMembership: null })),
          api.getMyPayments().catch(() => ({ payments: [] })),
        ]);
        setActiveMembership(memRes.activeMembership || null);
        setPayments(payRes.payments || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkNotificationRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (e) {
      console.error('Logout error:', e);
    }
    setCurrentUser(null);
    setActiveMembership(null);
    setPayments([]);
    if (activeTab === 'admin-portal' || activeTab === 'member-dashboard') {
      setActiveTab('home');
    }
  };

  const handleOpenCheckout = (planId?: string) => {
    if (planId) {
      const found = plans.find(p => p.id === planId);
      if (found) {
        setCheckoutPlan(found);
        return;
      }
    }
    // Default to the popular Pro tier if none specified
    const defaultPlan = plans.find(p => p.isPopular) || plans[0];
    if (defaultPlan) setCheckoutPlan(defaultPlan);
  };

  const handleCheckoutSuccess = async () => {
    await loadData();
    setActiveTab('member-dashboard');
  };

  return (
    <div className="min-h-screen bg-[#121318] text-[#e3e1e9] flex flex-col font-sans selection:bg-[#10b981]/30 selection:text-[#4edea3]">
      {/* Fixed Header Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        hasActiveMembership={!!activeMembership && (activeMembership.status === 'ACTIVE' || activeMembership.status === 'PAUSED')}
        notifications={notifications}
        onSwitchPersona={handleSwitchPersona}
        onLogout={handleLogout}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onOpenCheckout={handleOpenCheckout}
        onMarkNotificationRead={handleMarkNotificationRead}
        onOpenGeminiChat={() => {
          setInitialChatPrompt(undefined);
          setShowGeminiChat(true);
        }}
      />

      {/* Main Content Area (padded for fixed header) */}
      <main className="flex-1 pt-20 flex flex-col">
        {activeTab === 'home' && (
          <HomeView
            plans={plans}
            trainers={trainers}
            facilities={facilities}
            faqs={faqs}
            onSelectPlan={(plan) => setCheckoutPlan(plan)}
            onBookTrainer={(trainer) => setInductionTrainer(trainer)}
            onOpenVirtualTour={() => setShowVirtualTour(true)}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenGeminiChat={(prompt) => {
              setInitialChatPrompt(prompt);
              setShowGeminiChat(true);
            }}
          />
        )}

        {activeTab === 'plans-and-pricing' && (
          <PlansView
            plans={plans}
            onSelectPlan={(plan) => setCheckoutPlan(plan)}
          />
        )}

        {activeTab === 'facilities' && (
          <FacilitiesView
            facilities={facilities}
            onOpenVirtualTour={() => setShowVirtualTour(true)}
          />
        )}

        {activeTab === 'trainers' && (
          <TrainersView
            trainers={trainers}
            onBookTrainer={(trainer) => setInductionTrainer(trainer)}
          />
        )}

        {activeTab === 'member-dashboard' && (
          <MemberDashboard
            currentUser={currentUser}
            activeMembership={activeMembership}
            payments={payments}
            onOpenCheckout={handleOpenCheckout}
            onRefreshData={loadData}
            onLogout={handleLogout}
            onOpenGeminiChat={(prompt) => {
              setInitialChatPrompt(prompt);
              setShowGeminiChat(true);
            }}
            onOpenAuthModal={() => setShowAuthModal(true)}
            onSwitchPersona={handleSwitchPersona}
          />
        )}

        {activeTab === 'admin-portal' && isAdminRole(currentUser?.role) && (
          <AdminPortal
            plans={plans}
            currentUser={currentUser}
            onLogout={handleLogout}
            onRefreshData={loadData}
            onSwitchPersona={handleSwitchPersona}
            onOpenAuthModal={() => setShowAuthModal(true)}
          />
        )}
      </main>

      {/* Rich Footer */}
      <Footer onNavigate={(tab) => setActiveTab(tab)} />

      {/* Checkout & SSLCOMMERZ Simulation Modal */}
      {checkoutPlan && (
        <CheckoutModal
          plan={checkoutPlan}
          currentUser={currentUser}
          onClose={() => setCheckoutPlan(null)}
          onSuccess={handleCheckoutSuccess}
        />
      )}

      {/* Trainer Induction Booking Modal */}
      {inductionTrainer && (
        <InductionModal
          trainer={inductionTrainer}
          onClose={() => setInductionTrainer(null)}
          onSuccess={loadData}
        />
      )}

      {/* 360° Virtual Walkthrough Modal */}
      {showVirtualTour && (
        <VirtualTourModal
          onClose={() => setShowVirtualTour(false)}
        />
      )}

      {/* Authentication Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={(user) => {
            setCurrentUser(user);
            loadData();
          }}
        />
      )}

      {/* Gemini AI Fitness Coach Modal */}
      <GeminiChatModal
        isOpen={showGeminiChat}
        onClose={() => setShowGeminiChat(false)}
        initialPrompt={initialChatPrompt}
      />

      {/* Floating Action Button for Coach Flow AI */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            setInitialChatPrompt(undefined);
            setShowGeminiChat(true);
          }}
          aria-label="Open Coach Flow AI Concierge"
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#10b981] to-[#059669] text-black font-bold text-xs sm:text-sm shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:shadow-[0_0_35px_rgba(16,185,129,0.8)] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[#4edea3]/40"
        >
          <div className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center">
            <Bot className="w-3.5 h-3.5 text-black" />
          </div>
          <span className="tracking-tight font-black">Coach Flow AI</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
          </span>
        </button>
      </div>
    </div>
  );
}
