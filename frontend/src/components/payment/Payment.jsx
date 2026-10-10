import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Uses default axios instance configured in app
import './payment.css';

const BANKS = [
  { id: 'hdfc', name: 'HDFC Bank', icon: '🏦' },
  { id: 'icici', name: 'ICICI Bank', icon: '🏦' },
  { id: 'sbi', name: 'State Bank of India (SBI)', icon: '🏦' },
  { id: 'axis', name: 'Axis Bank', icon: '🏦' },
  { id: 'kotak', name: 'Kotak Mahindra Bank', icon: '🏦' },
  { id: 'yes', name: 'YES Bank', icon: '🏦' },
];

export default function Payment({ onClose, existingOrderId, onPaymentSuccess, checkoutSummary }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const summary = checkoutSummary || {};

  // Integrated Redux Selectors (Adjust keys to match your existing store)
  const cart = useSelector((state) => state.cart || { items: [] });
  const user = useSelector((state) => state.auth?.user || state.user?.user || {});
  const checkout = useSelector((state) => state.checkout || {});

  // Payment UI State
  const [activeTab, setActiveTab] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [paymentState, setPaymentState] = useState('idle'); // 'idle' | 'processing' | 'success' | 'failed'
  const [errorMessage, setErrorMessage] = useState('');
  const [transactionData, setTransactionData] = useState(null);

  // Form States
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    holder: user.name || '',
    expiry: '',
    cvv: '',
  });
  const [selectedBank, setSelectedBank] = useState('');

  // Calculations derived from existing Redux Cart / Checkout
  const items = cart.items || checkout.items || [];
  const subtotal = summary.subtotal ?? items.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);
  const deliveryFee = summary.deliveryFee ?? checkout.deliveryFee ?? (subtotal > 0 ? 49 : 0);
  const taxes = summary.taxes ?? checkout.taxes ?? Math.round(subtotal * 0.05);
  const totalAmount = summary.totalAmount ?? checkout.totalAmount ?? subtotal + deliveryFee + taxes;

  // Formatters & Handlers
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 16);
    let formatted = value.replace(/(.{4})/g, '$1 ').trim();
    setCardDetails({ ...cardDetails, number: formatted });
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setCardDetails({ ...cardDetails, expiry: value });
  };

  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCardDetails({ ...cardDetails, cvv: value });
  };

  const validateForm = () => {
    if (activeTab === 'upi') {
      return /^[\w.-]+@[\w.-]+$/.test(upiId.trim());
    }
    if (activeTab === 'card') {
      const rawNum = cardDetails.number.replace(/\s/g, '');
      return (
        rawNum.length === 16 &&
        cardDetails.holder.trim().length > 0 &&
        cardDetails.expiry.length === 5 &&
        cardDetails.cvv.length === 3
      );
    }
    if (activeTab === 'netbanking') {
      return Boolean(selectedBank);
    }
    return false;
  };

  // Main Payment Execution Flow
  const handlePay = async () => {
    if (!validateForm()) return;

    setPaymentState('processing');
    setErrorMessage('');

    try {
      const fakeTransaction = {
        paymentId: `PAY_FAKE_${Date.now()}`,
        transactionId: `TXN_${Date.now()}`,
        orderId: existingOrderId || checkout.orderId || 'YUMZO-ORDER-12345',
        amount: totalAmount,
      };

      setTransactionData(fakeTransaction);

      setTimeout(() => {
        if (typeof onPaymentSuccess === 'function') {
          onPaymentSuccess(fakeTransaction);
        }

        setPaymentState('success');
      }, 800);
    } catch (err) {
      setErrorMessage('Something went wrong while processing your payment.');
      setPaymentState('failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 yumzo-payment-backdrop transition-all duration-300">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl transition-all border border-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-xl font-bold text-white shadow-md shadow-orange-500/20">
              🍴
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-800 leading-tight">YUMZO</h2>
              <p className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                <span>🔒</span> Yumzo Test Payment Gateway
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
              Sandbox Mode
            </span>
            {onClose && (
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Body Content */}
        {paymentState === 'processing' && (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-pop-in">
            <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-orange-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent animate-spin-custom"></div>
              <span className="text-2xl">🍴</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800">Processing Payment...</h3>
            <p className="mt-2 text-sm text-slate-500">Please don't close this window or press back.</p>
            <div className="mt-6 rounded-lg bg-orange-50 px-4 py-2 text-xs font-medium text-orange-700">
              Simulating secure handshake with backend...
            </div>
          </div>
        )}

        {paymentState === 'success' && (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-pop-in">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
              <svg className="h-10 w-10 animate-checkmark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Payment Successful</h3>
            <p className="mt-2 text-sm font-medium text-emerald-700">Order placed successfully.</p>
            <p className="mt-1 text-3xl font-extrabold text-emerald-600">₹{transactionData?.amount || totalAmount}</p>

            <div className="mt-6 w-full max-w-md space-y-3 rounded-xl bg-slate-50 p-4 text-left text-xs text-slate-600 border border-slate-100">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="font-medium text-slate-500">Transaction ID</span>
                <span className="font-mono font-semibold text-slate-800">{transactionData?.transactionId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="font-medium text-slate-500">Payment ID</span>
                <span className="font-mono font-semibold text-slate-800">{transactionData?.paymentId}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-medium text-slate-500">Order ID</span>
                <span className="font-mono font-semibold text-slate-800">{transactionData?.orderId}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/get-my-orders')}
              className="mt-8 w-full max-w-md rounded-xl bg-orange-500 py-3.5 font-bold text-white shadow-lg shadow-orange-500/30 hover:bg-orange-600 active:scale-[0.99] transition-all"
            >
              View Order
            </button>
          </div>
        )}

        {paymentState === 'failed' && (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-pop-in">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <span className="text-3xl font-extrabold">!</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Payment Failed</h3>
            <p className="mt-2 max-w-sm text-sm text-slate-500">{errorMessage}</p>

            <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setPaymentState('idle')}
                className="flex-1 rounded-xl bg-orange-500 py-3 font-bold text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 transition-all"
              >
                Try Again
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl bg-slate-100 py-3 font-bold text-slate-600 hover:bg-slate-200 transition-all"
                >
                  Back to Checkout
                </button>
              )}
            </div>
          </div>
        )}

        {paymentState === 'idle' && (
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {/* Left Column: Payment Methods */}
            <div className="md:col-span-7 p-6">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Select Payment Method</h3>

              {/* Tabs */}
              <div className="mb-6 flex rounded-xl bg-slate-100 p-1">
                {[
                  { id: 'upi', label: 'UPI', icon: '📱' },
                  { id: 'card', label: 'Cards', icon: '💳' },
                  { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all ${
                      activeTab === tab.id
                        ? 'bg-white text-slate-800 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* UPI Tab */}
              {activeTab === 'upi' && (
                <div className="space-y-4 animate-pop-in">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">Virtual Payment Address (VPA)</label>
                    <input
                      type="text"
                      placeholder="username@upi or mobile@paytm"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Supports Google Pay, PhonePe, Paytm, BHIM and major banking UPI apps.
                  </p>
                </div>
              )}

              {/* Card Tab */}
              {activeTab === 'card' && (
                <div className="space-y-4 animate-pop-in">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">Card Number</label>
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      value={cardDetails.number}
                      onChange={handleCardNumberChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-mono focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="Name on card"
                      value={cardDetails.holder}
                      onChange={(e) => setCardDetails({ ...cardDetails, holder: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">Expiry</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={handleExpiryChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-mono focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">CVV</label>
                      <input
                        type="password"
                        placeholder="***"
                        value={cardDetails.cvv}
                        onChange={handleCvvChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-mono focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Net Banking Tab */}
              {activeTab === 'netbanking' && (
                <div className="space-y-4 animate-pop-in">
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Select Bank</label>
                  <div className="grid grid-cols-1 gap-2">
                    {BANKS.map((bank) => (
                      <button
                        key={bank.id}
                        onClick={() => setSelectedBank(bank.id)}
                        className={`flex items-center justify-between rounded-xl border p-3 text-xs font-medium transition-all ${
                          selectedBank === bank.id
                            ? 'border-orange-500 bg-orange-50/50 text-orange-900 font-bold'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{bank.icon}</span>
                          <span>{bank.name}</span>
                        </span>
                        {selectedBank === bank.id && <span className="text-orange-500">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Order Summary */}
            <div className="md:col-span-5 bg-slate-50/50 p-6 flex flex-col justify-between">
              <div>
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Order Summary</h3>

                <div className="max-h-48 overflow-y-auto space-y-2 pr-1 text-xs">
                  {items.length > 0 ? (
                    items.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-1 text-slate-600">
                        <span className="truncate pr-2">
                          {item.name || 'Food Item'} × {item.quantity || 1}
                        </span>
                        <span className="font-semibold text-slate-800">
                          ₹{(item.price || 0) * (item.quantity || 1)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-between py-1 text-slate-600">
                      <span>Yumzo Special Combo × 1</span>
                      <span className="font-semibold text-slate-800">₹{subtotal || 400}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 space-y-2 border-t border-slate-200 pt-3 text-xs text-slate-500">
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>₹{deliveryFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes & Charges</span>
                    <span>₹{taxes}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-extrabold text-slate-800">
                    <span>Total Amount</span>
                    <span className="text-orange-600">₹{totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6">
                <button
                  disabled={!validateForm()}
                  onClick={handlePay}
                  className="w-full rounded-xl bg-orange-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none active:scale-[0.99]"
                >
                  Pay ₹{totalAmount}
                </button>
                <p className="mt-3 text-center text-[10px] text-slate-400">
                  🔒 No real money will be charged. This is a simulation interface.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}