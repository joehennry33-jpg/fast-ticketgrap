import React, { useState } from 'react';
import { X, Check, ArrowRight, ShieldCheck, Phone, Mail, User, CreditCard, AlertCircle, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TicketCategory, Booking, MatchEvent } from '../types';
import { api } from '../services/api';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: MatchEvent;
  categories: TicketCategory[];
  initialCategoryId?: string;
  onBookingSuccess: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  event,
  categories,
  initialCategoryId,
  onBookingSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    initialCategoryId || (categories[1]?.id ?? categories[0]?.id)
  );
  const [quantity, setQuantity] = useState<number>(1);

  // Customer form details
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerIdNumber, setCustomerIdNumber] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'MPESA_STK_PUSH' | 'MPESA_PAYBILL' | 'CARD_PAYMENT'>('MPESA_STK_PUSH');
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [stkPushActive, setStkPushActive] = useState(false);
  const [stkCountdown, setStkCountdown] = useState(15);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);

  if (!isOpen) return null;

  const currentCategory = categories.find(c => c.id === selectedCategoryId) || categories[0];
  const totalAmountKes = currentCategory ? currentCategory.priceKes * quantity : 0;

  // Validate Step 1
  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!customerName.trim()) errors.name = 'Full name is required';
    if (!customerEmail.trim() || !customerEmail.includes('@')) errors.email = 'Valid email is required';
    if (!customerPhone.trim() || customerPhone.length < 9) errors.phone = 'Valid Kenyan phone number is required';

    if (quantity > currentCategory.availableQuota) {
      errors.quantity = `Only ${currentCategory.availableQuota} tickets left in this tier`;
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    if (!mpesaNumber) {
      setMpesaNumber(customerPhone);
    }
    setStep(2);
  };

  // Step 2: Confirm Order & Go to Payment
  const handleProceedToPayment = async () => {
    setIsProcessing(true);
    try {
      const booking = await api.createBooking({
        customerName,
        customerEmail,
        customerPhone,
        customerIdNumber,
        items: [{ categoryId: selectedCategoryId, quantity }]
      });
      setCurrentBooking(booking);
      setStep(3);
    } catch (err: any) {
      alert(err.message || 'Failed to create booking');
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 3: Trigger Payment (M-PESA STK Push or Card)
  const handlePayNow = async () => {
    if (!currentBooking) return;
    setIsProcessing(true);

    if (paymentMethod === 'MPESA_STK_PUSH') {
      try {
        await api.initiateMpesaStkPush(currentBooking.bookingReference, mpesaNumber || customerPhone, totalAmountKes);
        setStkPushActive(true);
        setStkCountdown(10);

        // Countdown simulation for STK Prompt on phone
        const timer = setInterval(() => {
          setStkCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              completePaymentVerification('MPESA_STK_PUSH');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } catch (err: any) {
        setIsProcessing(false);
        alert(err.message || 'M-PESA STK Push failed to initiate');
      }
    } else {
      // Card or Manual Paybill
      setTimeout(() => {
        completePaymentVerification(paymentMethod);
      }, 1500);
    }
  };

  // Complete Payment Verification
  const completePaymentVerification = async (method: string) => {
    if (!currentBooking) return;
    try {
      const confirmedBooking = await api.verifyPayment(
        currentBooking.bookingReference,
        method,
        mpesaNumber || customerPhone,
        cardNumber ? cardNumber.slice(-4) : undefined
      );

      setCurrentBooking(confirmedBooking);
      setStkPushActive(false);
      setIsProcessing(false);
      setStep(4);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }

      onBookingSuccess(confirmedBooking);
    } catch (err: any) {
      setIsProcessing(false);
      setStkPushActive(false);
      alert(err.message || 'Payment confirmation failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8 shadow-2xl text-slate-100 my-8">
        
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-slate-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 border-b border-slate-800 pb-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-red-500 mb-1">
            Ajax vs Bayern Munich · Talanta Stadium Ticket Booking
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {step === 1 && '1. Select Category & Attendee Info'}
            {step === 2 && '2. Review Booking Summary'}
            {step === 3 && '3. Complete Payment via M-PESA / Card'}
            {step === 4 && '4. Booking Confirmed · Electronic Tickets Ready'}
          </h2>
          {/* Progress Indicator */}
          <div className="mt-3 flex items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  s <= step ? 'bg-red-600' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: CATEGORY SELECTION & ATTENDEE FORM */}
        {step === 1 && (
          <form onSubmit={handleProceedToReview} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                Ticket Category
              </label>
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white focus:border-red-500 focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} disabled={cat.availableQuota <= 0}>
                    {cat.name} — KES {cat.priceKes.toLocaleString()} ({cat.availableQuota > 0 ? `${cat.availableQuota} left` : 'SOLD OUT'})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                  Number of Tickets (Max 10)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    max={Math.min(10, currentCategory.availableQuota || 1)}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white font-mono focus:border-red-500 focus:outline-none"
                  />
                  <div className="text-xs text-slate-400 shrink-0">
                    Total: <strong className="text-white font-mono">KES {(currentCategory.priceKes * quantity).toLocaleString()}</strong>
                  </div>
                </div>
                {formErrors.quantity && (
                  <p className="mt-1 text-xs text-red-400">{formErrors.quantity}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                  National ID or Passport No.
                </label>
                <input
                  type="text"
                  placeholder="e.g. 32984102 or A128394"
                  value={customerIdNumber}
                  onChange={(e) => setCustomerIdNumber(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                  Full Customer Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kelvin Omwamba"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-10 pr-4 py-3 text-sm text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
                {formErrors.name && <p className="mt-1 text-xs text-red-400">{formErrors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                  Email Address (For E-Ticket delivery) *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. kelvin@gmail.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-10 pr-4 py-3 text-sm text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
                {formErrors.email && <p className="mt-1 text-xs text-red-400">{formErrors.email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                Kenyan Phone Number (M-PESA active) *
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0712345678 or 254712345678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-10 pr-4 py-3 text-sm text-white focus:border-red-500 focus:outline-none"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                This number will receive the M-PESA STK Push prompt and SMS ticket confirmation.
              </p>
              {formErrors.phone && <p className="mt-1 text-xs text-red-400">{formErrors.phone}</p>}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-800 px-5 py-3 text-xs font-semibold text-slate-300 hover:bg-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-xs font-bold text-white hover:bg-red-500 active:scale-95"
              >
                <span>Review Booking</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: REVIEW ORDER SUMMARY */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <div>
                  <div className="text-xs text-slate-400">Selected Match</div>
                  <div className="text-base font-bold text-white">{event.title}</div>
                  <div className="text-xs text-slate-400">{event.venueName}, Nairobi · {event.kickoffTime}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Category</div>
                  <div className="text-sm font-bold text-red-400">{currentCategory.name}</div>
                  <div className="text-xs text-slate-400">{currentCategory.gateDesignation}</div>
                </div>
              </div>

              {/* Attendee Info Breakdown */}
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-slate-500 block">Lead Attendee:</span>
                  <span className="font-semibold text-white">{customerName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Contact Phone:</span>
                  <span className="font-mono text-white">{customerPhone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Delivery Email:</span>
                  <span className="text-white">{customerEmail}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">ID / Passport:</span>
                  <span className="text-white">{customerIdNumber || 'Recorded at Gate'}</span>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>{currentCategory.name} (KES {currentCategory.priceKes.toLocaleString()} × {quantity})</span>
                  <span className="font-mono">KES {(currentCategory.priceKes * quantity).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>M-PESA / Processing Surcharge:</span>
                  <span className="text-emerald-400 font-mono">KES 0 (Promotional Waiver)</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
                  <span>Total Payable:</span>
                  <span className="font-mono text-red-400">KES {totalAmountKes.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/40 p-3 rounded-lg border border-slate-800">
              <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>
                Your ticket inventory is held for 15 minutes while completing payment. Instant refund guarantee in case of rescheduling.
              </span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setStep(1)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ← Back to Edit Details
              </button>
              <button
                disabled={isProcessing}
                onClick={handleProceedToPayment}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 text-xs font-bold text-white hover:bg-red-500 active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Reserving Seats...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Payment</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PAYMENT INTEGRATION (M-PESA STK PUSH & CARDS) */}
        {step === 3 && currentBooking && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400">Booking Reference:</span>
                <span className="font-mono font-bold text-white ml-2">{currentBooking.bookingReference}</span>
              </div>
              <div>
                <span className="text-slate-400">Amount Due:</span>
                <span className="font-mono font-bold text-red-400 ml-2">KES {totalAmountKes.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
                Select Kenyan Payment Gateway
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('MPESA_STK_PUSH')}
                  className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border transition-all ${
                    paymentMethod === 'MPESA_STK_PUSH'
                      ? 'border-emerald-500 bg-emerald-950/30 text-white'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <img src="/src/assets/mpesa.svg" alt="M-PESA" className="h-6 object-contain" />
                  <span className="text-[11px] font-bold">M-PESA STK Push</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('MPESA_PAYBILL')}
                  className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border transition-all ${
                    paymentMethod === 'MPESA_PAYBILL'
                      ? 'border-emerald-500 bg-emerald-950/30 text-white'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-base font-black text-emerald-400">522522</span>
                  <span className="text-[11px] font-bold">M-PESA Paybill</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD_PAYMENT')}
                  className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border transition-all ${
                    paymentMethod === 'CARD_PAYMENT'
                      ? 'border-blue-500 bg-blue-950/30 text-white'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <CreditCard className="h-6 w-6 text-blue-400" />
                  <span className="text-[11px] font-bold">Credit / Debit Card</span>
                </button>
              </div>
            </div>

            {/* M-PESA STK PUSH FORM */}
            {paymentMethod === 'MPESA_STK_PUSH' && (
              <div className="space-y-4 rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-5">
                <div>
                  <label className="block text-xs font-semibold text-emerald-300 mb-1">
                    M-PESA Phone Number for STK Push
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-emerald-500" />
                    <input
                      type="tel"
                      value={mpesaNumber}
                      onChange={(e) => setMpesaNumber(e.target.value)}
                      placeholder="07XX XXX XXX or 254..."
                      className="w-full rounded-xl border border-emerald-500/40 bg-slate-900 pl-10 pr-4 py-3 text-sm text-white focus:border-emerald-400 focus:outline-none font-mono"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Safaricom will display a popup on this phone asking for your M-PESA PIN to authorize <strong>KES {totalAmountKes.toLocaleString()}</strong>.
                  </p>
                </div>

                {/* Simulated Phone STK Push Modal / Status */}
                {stkPushActive && (
                  <div className="rounded-xl border border-emerald-500/50 bg-slate-900 p-4 text-center animate-pulse">
                    <Loader2 className="h-8 w-8 text-emerald-400 animate-spin mx-auto mb-2" />
                    <div className="text-sm font-bold text-white">
                      M-PESA STK Prompt Sent to {mpesaNumber}
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Please unlock your phone and enter your 4-digit M-PESA PIN to complete transaction.
                    </p>
                    <div className="mt-3 text-xs font-mono text-emerald-400 font-semibold">
                      Awaiting PIN confirmation... ({stkCountdown}s)
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* M-PESA MANUAL PAYBILL */}
            {paymentMethod === 'MPESA_PAYBILL' && (
              <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900 p-5 text-xs text-slate-300">
                <div className="font-bold text-white text-sm mb-1">Manual M-PESA Paybill Instructions:</div>
                <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed">
                  <li>Open M-PESA menu on your phone and select <strong>Lipa na M-PESA</strong>.</li>
                  <li>Select <strong>Paybill</strong>.</li>
                  <li>Enter Business Number: <strong className="text-white font-mono bg-slate-800 px-1.5 py-0.5 rounded">522522</strong>.</li>
                  <li>Enter Account Number: <strong className="text-red-400 font-mono bg-slate-800 px-1.5 py-0.5 rounded">{currentBooking.bookingReference}</strong>.</li>
                  <li>Enter Amount: <strong className="text-white font-mono">KES {totalAmountKes.toLocaleString()}</strong>.</li>
                  <li>Enter your M-PESA PIN and press Send.</li>
                </ol>
              </div>
            )}

            {/* CARD PAYMENT */}
            {paymentMethod === 'CARD_PAYMENT' && (
              <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900 p-5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Card Number</label>
                  <input
                    type="text"
                    maxLength={19}
                    placeholder="4000 1234 5678 9010"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      maxLength={5}
                      placeholder="12/28"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white font-mono focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">CVV Security Code</label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="•••"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white font-mono focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setStep(2)}
                disabled={isProcessing}
                className="text-xs text-slate-400 hover:text-white disabled:opacity-50"
              >
                ← Back
              </button>

              <button
                disabled={isProcessing}
                onClick={handlePayNow}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-7 py-3.5 text-xs font-bold text-white hover:bg-emerald-500 active:scale-95 disabled:opacity-50 cursor-pointer shadow-lg shadow-emerald-900/30"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <span>Pay KES {totalAmountKes.toLocaleString()} Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: INSTANT CONFIRMATION & ELECTRONIC TICKET READY */}
        {step === 4 && currentBooking && (
          <div className="text-center space-y-6 py-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <Check className="h-8 w-8" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">Payment Confirmed!</h3>
              <p className="mt-1 text-sm text-slate-300">
                Your booking for <strong>{currentBooking.totalTickets} ticket(s)</strong> has been successfully confirmed.
              </p>
              <div className="mt-2 text-xs text-slate-400 font-mono">
                M-PESA Receipt: <strong className="text-emerald-400">{currentBooking.mpesaReceiptNumber}</strong> · Ref: <strong className="text-white">{currentBooking.bookingReference}</strong>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Match:</span>
                <span className="font-semibold text-white">{event.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Venue & Gate:</span>
                <span className="font-semibold text-white">{event.venueName} ({currentCategory.gateDesignation})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Attendee:</span>
                <span className="font-semibold text-white">{currentBooking.customerName}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Your verified electronic tickets with unique security QR codes are generated and ready for immediate gate entry.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="w-full sm:w-auto rounded-xl bg-red-600 px-8 py-3.5 text-xs font-bold text-white hover:bg-red-500 cursor-pointer shadow-lg shadow-red-900/30"
              >
                View & Download Electronic Tickets
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
