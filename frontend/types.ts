export type UserRole = 'USER' | 'ADMIN' | 'MEMBER' | 'TRAINER';
export type UserStatus = 'ACTIVE' | 'INACTIVE';
export type MembershipStatus = 'ACTIVE' | 'PENDING' | 'EXPIRED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
export type PaymentMethod = 'bKash' | 'Nagad' | 'Rocket' | 'VISA' | 'Mastercard';

export const isAdminRole = (role?: string | null): boolean => {
  if (!role) return false;
  const r = role.toUpperCase();
  return r === 'ADMIN' || r === 'DIRECTOR';
};

export const isMemberRole = (role?: string | null): boolean => {
  if (!role) return false;
  const r = role.toUpperCase();
  return r === 'USER' || r === 'MEMBER';
};

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  profileImage: string;
  address?: string;
  bio?: string;
  emergencyContact?: string;
  createdAt: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  price: number; // in BDT ৳
  durationDays: number;
  intervalLabel: string; // e.g. "/ month", "/ 3 months", "/ year"
  features: string[];
  unavailableFeatures?: string[];
  isPopular?: boolean;
  badge?: string; // e.g. "Standard", "Recommended", "VIP Status"
  isActive: boolean;
  createdAt?: string;
}

export interface Membership {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  startDate: string;
  endDate: string;
  status: MembershipStatus;
  priceAtPurchase: number;
  qrCodeToken: string;
  lockerNumber?: string;
  isPaused?: boolean;
  pausedUntil?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  membershipId: string;
  planId: string;
  planName: string;
  transactionId: string;
  amount: number;
  currency: 'BDT';
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  gatewayResponse: string;
  createdAt: string;
  verifiedAt?: string;
}

export interface Trainer {
  id: string;
  name: string;
  image: string;
  specialization: string;
  badge: string;
  experience: string;
  certifications: string[];
  bio: string;
  athletesMentored: number;
  isActive: boolean;
  rating: number;
  schedule?: string[];
}

export interface Facility {
  id: string;
  name: string;
  zoneCode: string;
  tag: string;
  description: string;
  image: string;
  floor: number;
  category: 'iron' | 'weights' | 'cardio' | 'recovery' | 'nutrition';
  features: string[];
  equipmentList: string[];
  isActive: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'membership' | 'payment' | 'facilities' | 'rules';
  isActive: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'PAYMENT' | 'MEMBERSHIP' | 'SYSTEM';
  isRead: boolean;
  createdAt: string;
}

export interface GymStats {
  occupancyRate: number;
  activeRfidAthletes: number;
  aqiPercentage: number;
  totalMembers: number;
  certifiedCoaches: number;
  floorAreaSqFt: number;
  operatingHours: string;
}
