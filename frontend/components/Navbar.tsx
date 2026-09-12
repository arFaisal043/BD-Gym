import React, { useState } from 'react';
import { Bell, Menu, X, CheckCircle, Shield, User as UserIcon, LogOut, RefreshCw, ChevronDown, Bot, Sparkles } from 'lucide-react';
import type { User, Notification } from '../types';
import { isAdminRole } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  notifications: Notification[];
  onSwitchPersona: (userId: string) => void;
  onLogout: () => void;
  onOpenAuthModal: () => void;
  onOpenCheckout: (planId?: string) => void;
  onMarkNotificationRead: (id: string) => void;
  onOpenGeminiChat?: () => void;
  hasActiveMembership?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  notifications,
  onSwitchPersona,
  onLogout,
  onOpenAuthModal,
  onOpenCheckout,
  onMarkNotificationRead,
  onOpenGeminiChat,
  hasActiveMembership,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const publicNavItems = [
    { id: 'home', label: 'Home' },
    { id: 'plans-and-pricing', label: 'Plans & Pricing' },
    { id: 'facilities', label: 'Facilities' },
    { id: 'trainers', label: 'Trainers' },
  ];

  let navItems = [...publicNavItems];
  if (isAdminRole(currentUser?.role)) {
    navItems.push({ id: 'admin-portal', label: 'Admin Portal' });
  } else if (currentUser && hasActiveMembership) {
    navItems.push({ id: 'member-dashboard', label: 'Member Dashboard' });
  }

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-[#0d0e13]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="h-20 w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#10b981] to-[#4cd7f6] p-[2px] shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <div className="w-full h-full bg-[#121318] rounded-[6px] flex items-center justify-center">
                <span className="font-extrabold text-[#4edea3] text-sm tracking-tighter">GF</span>
              </div>
            </div>
            <span className="font-bold text-xl tracking-tight text-[#e3e1e9] group-hover:text-white transition-colors">
              GymFlow <span className="text-[#4edea3] font-black">BD</span>
            </span>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 p-1 rounded-full bg-[#1e1f25]/70 border border-white/[0.06] backdrop-blur-md">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#292a2f] text-[#4edea3] font-bold shadow-[0_0_16px_rgba(78,222,163,0.2)]'
                    : 'text-[#bbcabf] hover:text-[#e3e1e9] hover:bg-white/[0.04]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons & Persona Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Coach Flow AI Concierge Button */}
          {onOpenGeminiChat && (
            <button
              onClick={onOpenGeminiChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#10b981]/20 to-[#4cd7f6]/20 border border-[#10b981]/40 text-[#4edea3] hover:text-white hover:border-[#4edea3] transition-all text-xs font-bold shadow-sm"
              title="Open Coach Flow AI Concierge"
            >
              <Bot className="w-3.5 h-3.5 text-[#4edea3]" />
              <span className="hidden md:inline">AI Coach</span>
              <Sparkles className="w-3 h-3 text-[#4cd7f6]" />
            </button>
          )}

          {/* Currency Pill */}
          <div className="hidden sm:flex items-center px-2.5 py-1 rounded-full bg-[#1e1f25] border border-white/[0.08] text-[#e3e1e9] text-xs font-semibold">
            <span className="text-[#4cd7f6] mr-1 font-bold">৳</span>
            <span>BDT</span>
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              aria-label="Notifications"
              className="relative p-2 rounded-full bg-[#292a2f] hover:bg-[#38393f] text-[#bbcabf] hover:text-[#e3e1e9] transition-colors border border-white/[0.06]"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#4edea3] ring-2 ring-[#121318] animate-pulse" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-[#1a1b21] border border-white/10 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#e3e1e9]">Club Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#4edea3] text-[10px] font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-[#bbcabf] hover:text-white text-xs"
                  >
                    Close
                  </button>
                </div>
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-[#bbcabf] text-center py-4">No notifications yet</p>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => onMarkNotificationRead(notif.id)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          notif.isRead
                            ? 'bg-[#121318]/50 border-white/[0.04] opacity-75'
                            : 'bg-[#1e1f25] border-[#10b981]/30 shadow-md'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-xs font-bold text-[#e3e1e9]">{notif.title}</p>
                          <span className="text-[10px] text-[#bbcabf] shrink-0">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#bbcabf] leading-relaxed">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {isAdminRole(currentUser?.role) ? (
            // Admins don't need a Renew Plan button in the navbar
            <div className="hidden md:block w-[100px]" /> 
          ) : currentUser ? (
            <button
              onClick={() => onOpenCheckout()}
              className="hidden md:inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#10b981] text-[#00422b] text-xs font-bold shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_26px_rgba(16,185,129,0.55)] hover:scale-[1.02] transition-all tracking-wide cursor-pointer"
            >
              {hasActiveMembership ? 'Renew Plan' : 'Join Now'}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-[#e3e1e9] hover:text-white border border-white/10 transition-all text-xs font-semibold cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#4edea3]" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => onOpenCheckout()}
                className="flex items-center justify-center px-4 py-1.5 rounded-full bg-[#10b981] hover:bg-[#4edea3] text-[#00422b] text-xs font-bold shadow-[0_0_16px_rgba(16,185,129,0.35)] hover:scale-[1.02] transition-all tracking-wide cursor-pointer"
              >
                <span>Join Now</span>
              </button>
            </div>
          )}

          {/* User Profile & Menu (only if currentUser) */}
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 p-1 pl-1.5 rounded-full bg-[#1e1f25] border border-white/[0.08] hover:border-white/[0.2] transition-all cursor-pointer"
                title={`${currentUser.name} (${currentUser.role})`}
              >
                <img
                  src={currentUser.profileImage || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}
                  alt={currentUser.name}
                  className={`w-7 h-7 rounded-full object-cover ring-1 ${
                    isAdminRole(currentUser.role) ? 'ring-[#c0c1ff]/60' : 'ring-[#4edea3]/40'
                  }`}
                />
                <span className="hidden lg:inline text-xs font-semibold text-[#e3e1e9] max-w-[100px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
                {isAdminRole(currentUser.role) && (
                  <span className="hidden xl:inline text-[9px] px-1.5 py-0.5 rounded-md bg-[#c0c1ff]/20 text-[#c0c1ff] font-bold">
                    ADMIN
                  </span>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-[#bbcabf] mr-1" />
              </button>

            {/* Persona Switcher Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-72 rounded-2xl bg-[#1a1b21] border border-white/10 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                {currentUser ? (
                  <>
                    <div className="pb-3 border-b border-white/[0.08] mb-3">
                      <p className="text-xs font-bold text-[#e3e1e9]">{currentUser.name}</p>
                      <p className="text-[11px] text-[#bbcabf] truncate">{currentUser.email}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${
                          isAdminRole(currentUser.role)
                            ? 'bg-[#c0c1ff]/20 text-[#c0c1ff] border border-[#c0c1ff]/30'
                            : 'bg-[#10b981]/20 text-[#4edea3] border border-[#10b981]/30'
                        }`}>
                          {isAdminRole(currentUser.role) ? 'DIRECTOR / ADMIN' : 'CLUB MEMBER'}
                        </span>
                        <span className="text-[10px] text-[#4cd7f6] flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Banani Club
                        </span>
                      </div>
                    </div>

                    {/* Role-based navigation options */}
                    {isAdminRole(currentUser.role) ? (
                      <div className="space-y-1.5 mb-3">
                        <p className="text-[10px] uppercase font-bold text-[#c0c1ff]/80 tracking-wider">
                          Admin Management
                        </p>
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            setActiveTab('admin-portal');
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-all ${
                            activeTab === 'admin-portal'
                              ? 'bg-[#c0c1ff]/20 text-[#c0c1ff] font-bold border border-[#c0c1ff]/30'
                              : 'bg-[#121318] text-[#e3e1e9] hover:bg-[#292a2f]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Shield className="w-3.5 h-3.5 text-[#c0c1ff]" />
                            <span>Director Command Center</span>
                          </div>
                          <span className="text-[10px] text-[#c0c1ff] font-mono">FR-008</span>
                        </button>


                      </div>
                    ) : (
                      <div className="space-y-1.5 mb-3">
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            setActiveTab('member-dashboard');
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-all ${
                            activeTab === 'member-dashboard'
                              ? 'bg-[#10b981]/15 text-[#4edea3] font-bold border border-[#10b981]/30'
                              : 'bg-[#121318] text-[#e3e1e9] hover:bg-[#292a2f]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <UserIcon className="w-3.5 h-3.5 text-[#4edea3]" />
                            <span>My Member Dashboard</span>
                          </div>
                          <span className="text-[10px] text-[#4edea3] font-mono">RFID</span>
                        </button>
                      </div>
                    )}

                    <div className="pt-2 border-t border-white/[0.08] flex flex-col gap-1.5">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onOpenAuthModal();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-[#bbcabf] hover:text-white hover:bg-white/[0.05]"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Login with another account</span>
                      </button>

                      {/* Genuine Logout Button */}
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onLogout();
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <LogOut className="w-3.5 h-3.5 text-red-400" />
                          <span>Log Out ({isAdminRole(currentUser.role) ? 'Admin' : 'Member'})</span>
                        </div>
                        <span className="text-[10px] text-red-400/70">End session</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="py-2 text-center space-y-3">
                    <p className="text-xs text-[#bbcabf]">You are currently signed out.</p>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenAuthModal();
                      }}
                      className="w-full py-2 rounded-xl bg-[#10b981] text-[#00422b] text-xs font-bold"
                    >
                      Sign In to Account
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl bg-[#292a2f] text-[#bbcabf] hover:text-white border border-white/[0.06]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0d0e13]/98 border-b border-white/[0.08] px-6 py-4 space-y-2 backdrop-blur-2xl">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === item.id
                  ? 'bg-[#10b981]/15 text-[#4edea3] font-bold border border-[#10b981]/30'
                  : 'text-[#bbcabf] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {item.label}
            </button>
          ))}

          {onOpenGeminiChat && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenGeminiChat();
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold bg-[#10b981]/10 text-[#4edea3] border border-[#10b981]/30 hover:bg-[#10b981]/20 transition-all"
            >
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                <span>Coach Flow AI Concierge</span>
              </div>
              <Sparkles className="w-3.5 h-3.5 text-[#4cd7f6]" />
            </button>
          )}

          <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-2">
            {currentUser ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#1a1b21] border border-white/[0.06]">
                <div>
                  <p className="text-xs font-bold text-[#e3e1e9]">{currentUser.name}</p>
                  <p className="text-[10px] text-[#bbcabf]">{isAdminRole(currentUser.role) ? 'Director / Admin' : 'Club Member'}</p>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 text-xs font-semibold hover:bg-red-500/25 flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal();
                }}
                className="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-bold text-center text-[#e3e1e9]"
              >
                Sign In / Register
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCheckout();
              }}
              className="w-full py-2.5 rounded-full bg-[#10b981] text-[#00422b] text-xs font-bold text-center shadow-lg"
            >
              Join Now & Choose Plan
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
