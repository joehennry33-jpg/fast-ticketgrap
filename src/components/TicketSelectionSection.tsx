import React from 'react';
import { TicketCategory } from '../types';
import { Check, ShieldCheck, ArrowRight, AlertTriangle } from 'lucide-react';

interface TicketSelectionSectionProps {
  categories: TicketCategory[];
  onOpenBooking: (categoryId?: string) => void;
}

export const TicketSelectionSection: React.FC<TicketSelectionSectionProps> = ({ categories, onOpenBooking }) => {
  return (
    <section id="ticket-categories" className="border-b border-slate-800 bg-slate-950 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-red-500 mb-2">
            Official Ticket Categories · KES Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            SELECT YOUR MATCH TICKET
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            From the electric energy behind the goalposts to five-course presidential hospitality, choose your preferred matchday experience. Guaranteed authentic tickets with instant M-PESA STK Push checkout.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {categories.map((category) => {
            const isSoldOut = category.availableQuota <= 0;
            const isLowStock = category.availableQuota > 0 && category.availableQuota < 500;
            const percentageLeft = Math.round((category.availableQuota / category.totalQuota) * 100);

            return (
              <div
                key={category.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-7 transition-all duration-200 hover:border-slate-700 hover:bg-slate-900"
              >
                <div>
                  {/* Category Header Metadata without pills */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>{category.gateDesignation}</span>
                    <span>·</span>
                    <span className="font-semibold text-slate-300">{category.code}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    {category.name}
                  </h3>

                  {/* Price in KES */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl sm:text-3xl font-black text-white font-mono tabular-nums">
                      KES {category.priceKes.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400">/ ticket</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-6">
                    {category.description}
                  </p>

                  {/* Inventory Capacity Indicator */}
                  <div className="mb-6 rounded-lg bg-slate-950 p-3 border border-slate-800/80">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-400">Live Inventory:</span>
                      <span className={`font-mono font-semibold ${isSoldOut ? 'text-red-400' : isLowStock ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {isSoldOut ? 'SOLD OUT' : `${category.availableQuota.toLocaleString()} available`}
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isSoldOut ? 'bg-red-500' : isLowStock ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(5, percentageLeft))}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 text-right">
                      Seating: {category.seatingArea}
                    </div>
                  </div>

                  {/* Category Inclusions */}
                  <div className="space-y-2 mb-8">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Included Privileges:
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {category.perks.map((perk, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Booking Button */}
                <button
                  disabled={isSoldOut}
                  onClick={() => onOpenBooking(category.id)}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 px-4 text-sm font-bold transition-all cursor-pointer ${
                    isSoldOut
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-red-600 text-white shadow-md hover:bg-red-500 active:scale-95'
                  }`}
                >
                  {isSoldOut ? (
                    <span>Category Sold Out</span>
                  ) : (
                    <>
                      <span>Select & Book Tickets</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Security & Authenticity Trust Assurance */}
        <div className="mt-12 rounded-xl border border-slate-800 bg-slate-900/50 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0" />
            <span>
              <strong className="text-white">KickPass Kenya Guarantee:</strong> All tickets are digitally watermarked, uniquely serialized, and cryptographically verified at Talanta Stadium turnstiles.
            </span>
          </div>
          <div className="flex items-center gap-3 font-mono text-slate-400 text-[11px] shrink-0">
            <span>M-PESA STK PUSH INSTANT ISSUANCE</span>
            <span>·</span>
            <span>NO HIDDEN SURCHARGES</span>
          </div>
        </div>

      </div>
    </section>
  );
};
