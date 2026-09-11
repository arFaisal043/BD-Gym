import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  CreditCard, 
  Smartphone, 
  Building2, 
  AlertTriangle,
  QrCode,
  Sparkles
} from 'lucide-react';
import type { MembershipPlan, User } from '../types';
import { api } from '../services/api';

interface CheckoutModalProps {
  plan: MembershipPlan | null;
  currentUser: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  plan,
  currentUser,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<'details' | 'gateway' | 'processing' | 'success'>('details');
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '+880 1711-000000');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'VISA' | 'Mastercard'>('bKash');
  const [gatewayTab, setGatewayTab] = useState<'mfs' | 'cards' | 'net'>('mfs');
  
  // Gateway interactive fields
  const [walletNumber, setWalletNumber] = useState(currentUser?.phone || '01711000000');
  const [pinOrOtp, setPinOrOtp] = useState('12345');
  const [transactionId, setTransactionId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!plan) return null;

  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage('');

    try {
      const session = await api.createPaymentSession({
        planId: plan.id,
        paymentMethod,
        customerName,
        customerPhone,
      });

      setTransactionId(session.transactionId);
      setStep('gateway');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to initialize payment session.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyGatewayPayment = async () => {
    setStep('processing');
    setErrorMessage('');

    try {
      // Simulate gateway latency (1.2s)
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const result = await api.verifyPayment(transactionId, true);
      if (result.success) {
        setStep('success');
      } else {
        setErrorMessage(result.error || 'Payment validation failed.');
        setStep('gateway');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Gateway verification error.');
      setStep('gateway');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-3xl bg-[#1a1b21] border border-white/15 shadow-2xl text-[#e3e1e9] relative overflow-hidden max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-white/[0.08] flex items-center justify-between bg-[#121318]/70">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#10b981] flex items-center justify-center text-[10px] font-black text-black">
              GF
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#e3e1e9]">
                Membership Activation • Banani Club
              </h3>
              <p className="text-[11px] text-[#bbcabf]">
                Secured by SSLCOMMERZ Payment Gateway
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#292a2f] text-[#bbcabf] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* STEP 1: Details & Summary */}
          {step === 'details' && (
            <form onSubmit={handleInitiatePayment} className="space-y-5">
              {/* Plan Summary Card */}
              <div className="p-4 rounded-2xl bg-[#1e1f25] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#4edea3] uppercase tracking-wider">
                    Selected Tier
                  </span>
                  <h4 className="text-base font-bold text-[#e3e1e9]">{plan.name}</h4>
                  <p className="text-xs text-[#bbcabf]">{plan.durationDays} Days Unlimited Access</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-[#4edea3]">
                    ৳ {plan.price.toLocaleString()}
                  </span>
                  <p className="text-[10px] text-[#bbcabf]">BDT (15% VAT Inc.)</p>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Customer Info */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-[#bbcabf] uppercase tracking-wider">
                  Member Details for Access Pass
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-[#bbcabf] block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Shakib Hossain"
                      className="w-full px-3 py-2 rounded-xl bg-[#292a2f] border border-white/[0.08] text-xs text-[#e3e1e9]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#bbcabf] block mb-1">Phone Number (+880)</label>
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="01711-000000"
                      className="w-full px-3 py-2 rounded-xl bg-[#292a2f] border border-white/[0.08] text-xs text-[#e3e1e9]"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-[#bbcabf] block mb-1">Email (For Digital Invoice)</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="shakib@example.com"
                    className="w-full px-3 py-2 rounded-xl bg-[#292a2f] border border-white/[0.08] text-xs text-[#e3e1e9]"
                    required
                  />
                </div>
              </div>

              {/* Preferred Payment Channel */}
              <div className="space-y-2 pt-1">
                <h5 className="text-xs font-bold text-[#bbcabf] uppercase tracking-wider">
                  Select Payment Method
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'bKash', label: 'bKash', sub: 'Mobile Wallet' },
                    { id: 'Nagad', label: 'Nagad', sub: 'Postal Wallet' },
                    { id: 'Rocket', label: 'Rocket', sub: 'DBBL Wallet' },
                    { id: 'VISA', label: 'VISA', sub: 'Debit / Credit' },
                    { id: 'Mastercard', label: 'Mastercard', sub: 'Debit / Credit' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        paymentMethod === method.id
                          ? 'bg-[#10b981]/20 border-[#10b981] shadow-md'
                          : 'bg-[#292a2f] border-white/[0.06] hover:border-white/20'
                      }`}
                    >
                      <span className="font-bold text-xs text-[#e3e1e9] block">{method.label}</span>
                      <span className="text-[10px] text-[#bbcabf]">{method.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 rounded-full bg-[#10b981] text-[#003824] text-xs font-bold hover:bg-[#4edea3] transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
              >
                <span>Proceed to SSLCOMMERZ Gateway</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: SSLCOMMERZ Simulation Gateway */}
          {step === 'gateway' && (
            <div className="space-y-5">
              {/* Official SSLCOMMERZ Simulator Banner */}
              <div className="rounded-2xl bg-white text-[#121318] p-4 shadow-xl border border-gray-200">
                <div className="flex items-center justify-between border-b pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black tracking-tight text-blue-900">
                      SSLCOMMERZ
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      VERIFIED MERCHANT
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500 block">Payable Amount:</span>
                    <span className="text-base font-black text-gray-900">
                      ৳ {plan.price.toLocaleString()} BDT
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-600 mb-4 bg-gray-50 p-2 rounded-lg">
                  <span>Merchant: <strong className="text-gray-900">GymFlow BD Limited (Banani)</strong></span>
                  <span className="font-mono font-semibold text-blue-700">TXN: {transactionId.slice(0, 16)}</span>
                </div>

                {/* Gateway Tabs */}
                <div className="flex border-b border-gray-200 mb-4">
                  <button
                    type="button"
                    onClick={() => setGatewayTab('mfs')}
                    className={`pb-2 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all ${
                      gatewayTab === 'mfs'
                        ? 'border-emerald-600 text-emerald-700'
                        : 'border-transparent text-gray-400 hover:text-gray-700'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile Banking</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGatewayTab('cards')}
                    className={`pb-2 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all ${
                      gatewayTab === 'cards'
                        ? 'border-emerald-600 text-emerald-700'
                        : 'border-transparent text-gray-400 hover:text-gray-700'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Cards (Visa/MC)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGatewayTab('net')}
                    className={`pb-2 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all ${
                      gatewayTab === 'net'
                        ? 'border-emerald-600 text-emerald-700'
                        : 'border-transparent text-gray-400 hover:text-gray-700'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Internet Banking</span>
                  </button>
                </div>

                {/* Channel Inputs */}
                {gatewayTab === 'mfs' && (
                  <div className="space-y-3">
                    <p className="text-xs text-gray-600">
                      Enter your registered <strong className="text-gray-900">{paymentMethod}</strong> mobile account:
                    </p>
                    <div>
                      <input
                        type="text"
                        value={walletNumber}
                        onChange={(e) => setWalletNumber(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-500 block mb-1">
                        Enter 5-digit Verification PIN / OTP
                      </label>
                      <input
                        type="password"
                        value={pinOrOtp}
                        onChange={(e) => setPinOrOtp(e.target.value)}
                        placeholder="•••••"
                        maxLength={5}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 tracking-widest"
                      />
                    </div>
                  </div>
                )}

                {gatewayTab === 'cards' && (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-[11px] text-gray-500 block mb-1">Card Number</label>
                      <input
                        type="text"
                        defaultValue="4123 •••• •••• 8842"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 font-mono text-xs text-gray-900"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        defaultValue="12/28"
                        placeholder="MM/YY"
                        className="px-3 py-2 rounded-lg border border-gray-300 font-mono text-xs text-gray-900"
                      />
                      <input
                        type="password"
                        defaultValue="•••"
                        placeholder="CVV"
                        className="px-3 py-2 rounded-lg border border-gray-300 font-mono text-xs text-gray-900"
                      />
                    </div>
                  </div>
                )}

                {gatewayTab === 'net' && (
                  <div className="p-3 bg-gray-100 rounded-lg text-xs text-gray-700">
                    City Bank, BRAC Bank, Eastern Bank, and Islami Bank 2FA redirect enabled.
                  </div>
                )}

                <div className="mt-5 pt-3 border-t flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-600" /> 256-Bit SSL Encrypted
                  </span>

                  <button
                    type="button"
                    onClick={handleVerifyGatewayPayment}
                    className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all"
                  >
                    Confirm & Pay ৳ {plan.price.toLocaleString()}
                  </button>
                </div>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="text-xs text-[#bbcabf] hover:text-white underline"
                >
                  ← Back to customer details
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Processing */}
          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="w-14 h-14 rounded-full border-4 border-[#10b981] border-t-transparent animate-spin"></div>
              <h4 className="text-lg font-bold text-[#e3e1e9]">Verifying Payment with SSLCOMMERZ</h4>
              <p className="text-xs text-[#bbcabf] max-w-sm">
                Communicating with banking host and provisioning your RFID biometric access profile in the Banani database...
              </p>
            </div>
          )}

          {/* STEP 4: Success & Activation */}
          {step === 'success' && (
            <div className="py-6 flex flex-col items-center justify-center space-y-5 text-center">
              <div className="w-16 h-16 rounded-full bg-[#10b981]/20 border-2 border-[#10b981] flex items-center justify-center text-[#4edea3] shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-[#10b981]/20 text-[#4edea3] text-xs font-bold border border-[#10b981]/30">
                  MEMBERSHIP ACTIVATED
                </span>
                <h3 className="text-2xl font-black text-[#e3e1e9] mt-2">
                  Welcome to GymFlow BD!
                </h3>
                <p className="text-xs text-[#bbcabf] max-w-sm mt-1 mx-auto">
                  Your payment of <strong className="text-white">৳ {plan.price.toLocaleString()} BDT</strong> was verified via SSLCOMMERZ. Your dynamic RFID access code is live.
                </p>
              </div>

              <div className="w-full p-4 rounded-2xl bg-[#1e1f25] border border-white/[0.08] text-xs text-left space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#bbcabf]">Transaction Ref:</span>
                  <span className="font-mono text-[#4cd7f6]">{transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#bbcabf]">Enrolled Plan:</span>
                  <span className="font-bold text-white">{plan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#bbcabf]">Subscription Status:</span>
                  <span className="text-[#4edea3] font-bold">ACTIVATED</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSuccess();
                }}
                className="w-full py-3.5 rounded-full bg-[#10b981] text-[#003824] text-xs font-bold hover:bg-[#4edea3] shadow-[0_0_24px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Go to Member Dashboard & View Invoice</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
