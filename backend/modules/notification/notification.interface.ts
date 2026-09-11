export interface INotificationPayload {
  type: 'email' | 'sms';
  recipient: string;
  planName?: string;
  amount?: number;
  txnId?: string;
}
