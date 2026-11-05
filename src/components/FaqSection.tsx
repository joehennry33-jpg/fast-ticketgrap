import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does M-PESA STK Push payment work?',
      a: 'When you select M-PESA STK Push and enter your Safaricom mobile number, our automated gateway sends a secure prompt directly to your phone screen. Simply enter your 4-digit M-PESA PIN to authorize the payment. Once confirmed, your unique QR electronic tickets are generated instantaneously.'
    },
    {
      q: 'Do I need to print my ticket or can I show it on my smartphone?',
      a: 'You can present your electronic ticket directly on your smartphone screen! The high-density QR code is fully compatible with Talanta Stadium optical turnstile readers. You may also download and print a physical A4 paper copy if you prefer.'
    },
    {
      q: 'What is the refund policy if the match schedule changes?',
      a: 'All tickets booked on KickPass Kenya are protected by our 100% Match Guarantee. If the match date or venue is altered, your ticket remains valid for the new date, or you can request an immediate 100% refund directly back to your M-PESA account with no processing deduction.'
    },
    {
      q: 'Can I transfer or buy multiple tickets for family or friends?',
      a: 'Yes, you can purchase up to 10 tickets per transaction. Each ticket in your order will be issued with a distinct serial number and unique QR code so your party can enter together or separately through the designated gates.'
    },
    {
      q: 'Where is Talanta Sports City Stadium and how do I get there?',
      a: 'Talanta Stadium is located in Jamhuri Park along Ngong Road, Nairobi. Matchday express shuttle buses operate continuously from Kencom and Railways bus stations in Nairobi CBD directly into the stadium transport plaza. Secure pre-booked parking is available on-site.'
    }
  ];

  return (
    <section className="border-b border-slate-800 bg-slate-900/40 py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="text-xs font-bold uppercase tracking-wider text-red-500 mb-1">
            Questions & Answers
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Everything Kenyan football supporters need to know about booking and matchday attendance.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-slate-800 bg-slate-950/70 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm font-bold text-white hover:text-red-400 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-180 text-red-500' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs text-slate-300 leading-relaxed border-t border-slate-900 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
