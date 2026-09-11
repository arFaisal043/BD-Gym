export interface IMembershipPlan {
  id: string;
  name: string;
  durationMonths: number;
  price: number;
  features: string[];
  badge?: string;
}

export interface ISubscribePayload {
  userId: string;
  planId: string;
  planName: string;
  price: number;
  durationMonths: number;
  paymentMethod?: string;
}
