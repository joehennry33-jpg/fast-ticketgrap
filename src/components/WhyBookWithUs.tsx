import React from 'react';
import { Smartphone, ShieldCheck, QrCode, RefreshCcw } from 'lucide-react';

export const WhyBookWithUs: React.FC = () => {
  const features = [
    {
      icon: Smartphone,
      title: 'Seamless M-PESA STK Push',
      description: 'Pay instantly via Safaricom M-PESA STK PIN prompt directly on your mobile device. Zero manual input errors, zero hassle.'
    },
    {
      icon: QrCode,
      title: 'Encrypted Anti-Counterfeit QR',
      description: 'Each electronic pass features a signed cryptographic hash that permanently invalidates after the first turnstile scan to prevent duplication.'
    },
    {
      icon: ShieldCheck,
      title: 'Official Stadium & FKF Sanctioning',
      description: 'Direct integration with Talanta Sports City turnstile access systems and compliant with national sports event safety protocols.'
    },
    {
      icon: RefreshCcw,
      title: '100% Refund Protection Guarantee',
      description: 'Should the event date, time, or venue be postponed or rescheduled, all bookings are fully protected with instant M-PESA reversal guarantees.'
    }
  ];

  return (
    <section className="border-b border-slate-800 bg-slate-900/30 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-red-500 mb-1">
            Trust & Security Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            WHY BOOK WITH KICKPASS KENYA
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Engineered for high-throughput matchdays and unmatched spectator peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 hover:border-slate-700 transition-colors"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-600/10 text-red-500 border border-red-500/20 mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
