import type { 
  User, 
  MembershipPlan, 
  Membership, 
  Payment, 
  Trainer, 
  Facility, 
  FAQ, 
  Notification,
  GymStats 
} from '../types';

export const api = {
  // Auth & User
  async getCurrentUser(): Promise<{ user: User }> {
    const res = await fetch('/api/auth/me');
    if (!res.ok) throw new Error('Not authenticated');
    return res.json();
  },

  async switchPersona(userId: string): Promise<{ success: boolean; user: User }> {
    const res = await fetch('/api/auth/switch-persona', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    return res.json();
  },

  async logout(): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return res.json();
  },

  async login(email: string, password: string): Promise<{ success: boolean; user: User; token: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  async register(data: { name: string; email: string; phone: string; password: string }): Promise<{ success: boolean; user: User }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  async updateProfile(data: Partial<User>): Promise<{ success: boolean; user: User }> {
    const res = await fetch('/api/users/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Plans
  async getPlans(): Promise<{ plans: MembershipPlan[] }> {
    const res = await fetch('/api/membership-plans');
    return res.json();
  },

  async createPlan(data: Partial<MembershipPlan>): Promise<{ success: boolean; plan: MembershipPlan }> {
    const res = await fetch('/api/membership-plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updatePlan(id: string, data: Partial<MembershipPlan>): Promise<{ success: boolean; plan: MembershipPlan }> {
    const res = await fetch(`/api/membership-plans/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Memberships
  async getMyMemberships(): Promise<{ memberships: Membership[]; activeMembership: Membership | null }> {
    const res = await fetch('/api/memberships/me');
    return res.json();
  },

  async togglePauseMembership(id: string): Promise<{ success: boolean; membership: Membership }> {
    const res = await fetch(`/api/memberships/${id}/pause`, { method: 'POST' });
    return res.json();
  },

  // Payments & SSLCOMMERZ
  async createPaymentSession(data: { planId: string; paymentMethod: string; customerName?: string; customerPhone?: string }) {
    const res = await fetch('/api/payments/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Payment initiation failed');
    }
    return res.json();
  },

  async verifyPayment(transactionId: string, simulationSuccess: boolean = true) {
    const res = await fetch('/api/payments/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactionId, simulationSuccess }),
    });
    return res.json();
  },

  async getMyPayments(): Promise<{ payments: Payment[] }> {
    const res = await fetch('/api/payments/me');
    return res.json();
  },

  // Admin
  async getAdminDashboard() {
    const res = await fetch('/api/admin/dashboard');
    return res.json();
  },

  async getAdminUsers(): Promise<{ users: Array<User & { membership: Membership | null }> }> {
    const res = await fetch('/api/admin/users');
    return res.json();
  },

  async updateMemberStatus(id: string, status: 'ACTIVE' | 'INACTIVE') {
    const res = await fetch(`/api/admin/users/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  async updateMemberRole(id: string, role: 'USER' | 'ADMIN') {
    const res = await fetch(`/api/admin/users/${id}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    return res.json();
  },

  async getAdminPayments(): Promise<{ payments: Payment[] }> {
    const res = await fetch('/api/admin/payments');
    return res.json();
  },

  async refundPayment(id: string) {
    const res = await fetch(`/api/admin/payments/${id}/refund`, { method: 'POST' });
    return res.json();
  },

  // Trainers, Facilities, FAQs
  async getTrainers(): Promise<{ trainers: Trainer[] }> {
    const res = await fetch('/api/trainers');
    return res.json();
  },

  async bookTrainerInduction(id: string) {
    const res = await fetch(`/api/trainers/${id}/book-induction`, { method: 'POST' });
    return res.json();
  },

  async getFacilities(): Promise<{ facilities: Facility[] }> {
    const res = await fetch('/api/facilities');
    return res.json();
  },

  async getFaqs(): Promise<{ faqs: FAQ[] }> {
    const res = await fetch('/api/faqs');
    return res.json();
  },

  async getNotifications(): Promise<{ notifications: Notification[] }> {
    const res = await fetch('/api/notifications');
    return res.json();
  },

  async markNotificationRead(id: string) {
    const res = await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
    return res.json();
  },

  async sendContactInquiry(data: { name: string; phone: string; email: string; message: string }) {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getGymSensorStats(): Promise<{ stats: GymStats }> {
    const res = await fetch('/api/gym-sensor');
    return res.json();
  },

  // Gemini AI Coach Chat
  async sendChatMessage(messages: Array<{ role: 'user' | 'assistant' | 'model'; content: string }>): Promise<{ reply: string; fallback?: string }> {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to communicate with Coach Flow');
    }
    return res.json();
  },

  // Free Notification Dispatch Simulator
  async testDispatchNotification(data: { type: 'email' | 'sms'; recipient: string; planName?: string; amount?: number; txnId?: string }) {
    const res = await fetch('/api/notifications/dispatch-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  }
};
