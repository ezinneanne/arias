import React, { useState } from 'react';
import { ShieldCheck, CreditCard, Lock, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { motion } from 'motion/react';
import { formatCurrency } from '../lib/utils';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const CheckoutPage = () => {
  const { user } = useApp();
  const [step, setStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian-900 pt-20">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white rounded-3xl p-12 text-center shadow-2xl"
        >
          <div className="mb-8 mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">You're In!</h2>
          <p className="text-slate-600 mb-8 text-lg">Your tickets for <span className="font-bold">Masters League Finals</span> have been secured and sent to your wallet.</p>
          <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left border border-slate-100">
            <div className="flex justify-between mb-2">
              <span className="text-slate-500 text-sm">Order ID</span>
              <span className="font-mono font-bold text-slate-900">#ARS-992381</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 text-sm">Transfer Status</span>
              <span className="inline-flex items-center text-green-600 text-sm font-bold">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2" /> Complete
              </span>
            </div>
          </div>
          <Link to="/dashboard">
            <Button size="lg" className="w-full">View My Tickets</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian-900 pt-32 pb-20">
      <div className="mx-auto max-w-4xl px-6">
        
        <div className="mb-12 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Checkout</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">1</div>
              <span className="text-xs font-bold text-blue-400">PAYMENT</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-700" />
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center text-xs font-bold">2</div>
              <span className="text-xs font-bold text-slate-600 uppercase">Confirm</span>
            </div>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-5">
          
          {/* Payment Section - Light theme for trust as requested */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center">
                <CreditCard className="mr-3 h-6 w-6 text-blue-600" /> Payment Details
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Cardholder Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter full name"
                    defaultValue={user?.name || ''}
                    className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600 transition-all text-slate-900"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Card Number</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="XXXX XXXX XXXX XXXX"
                      className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600 transition-all text-slate-900"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex space-x-1">
                      <div className="h-4 w-6 bg-slate-200 rounded-sm" />
                      <div className="h-4 w-6 bg-slate-200 rounded-sm" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Expiry Date</label>
                    <input 
                      type="text" 
                      placeholder="MM/YY"
                      className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600 transition-all text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">CVC</label>
                    <input 
                      type="text" 
                      placeholder="123"
                      className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600 transition-all text-slate-900"
                    />
                  </div>
                </div>

              </div>

              <div className="mt-8 rounded-xl bg-blue-50 p-4 border border-blue-100 flex items-start space-x-3">
                <Lock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800 leading-normal">
                  Your payment is processed through a secure, AES-256 encrypted gateway. 
                  Arias never stores your original credit card numbers.
                </p>
              </div>
            </div>

            <div className="bg-blue-600/10 border border-blue-500/20 rounded-3xl p-6 flex items-center justify-between">
              <div className="flex items-center">
                <ShieldCheck className="h-8 w-8 text-blue-500 mr-4" />
                <div>
                  <h4 className="font-bold text-white text-lg">Safe Checkout</h4>
                  <p className="text-sm text-slate-400">Guaranteed secure tickets or your money back.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-8">
              <h3 className="text-lg font-bold text-white mb-6">Order Summary</h3>
              <div className="space-y-4 mb-6">
                <div className="flex space-x-4">
                  <div className="h-16 w-16 bg-obsidian-800 rounded-xl overflow-hidden flex-shrink-0">
                    <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" alt="Event" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm">Masters League Finals</h4>
                    <p className="text-xs text-slate-500">Premium Middle x 2</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-slate-800 mb-8">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Tickets</span>
                  <span>{formatCurrency(300)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Fees</span>
                  <span>{formatCurrency(15)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-white pt-3">
                  <span>Total Due</span>
                  <span>{formatCurrency(315)}</span>
                </div>
              </div>

              <Button size="lg" className="w-full" onClick={handleComplete}>
                Pay Securely &rarr;
              </Button>
              
              <p className="mt-6 text-center text-[10px] text-slate-600 uppercase tracking-widest font-bold">
                Arias Official Partner • SSL Encrypted
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
