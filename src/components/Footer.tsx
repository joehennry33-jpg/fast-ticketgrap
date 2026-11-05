import React from 'react';
import { Phone, Mail, MapPin, Shield } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenScanner: () => void;
  onOpenCustomerDashboard: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onOpenScanner, onOpenCustomerDashboard }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded bg-red-600 font-black text-white text-xs">
                KP
              </span>
              <span className="font-extrabold text-sm tracking-wider text-white">KICKPASS KENYA</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Kenya’s premier digital football & sports ticketing gateway. Secure M-PESA payment integration and optical turnstile QR admission.
            </p>
            <div className="text-[11px] text-slate-500">
              Licensed Sports Event Ticketing Provider · Nairobi, Kenya
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">Event Navigation</h4>
            <ul className="space-y-2">
              <li><a href="#match-details" className="hover:text-white transition-colors">Ajax vs Bayern Munich</a></li>
              <li><a href="#talanta-stadium" className="hover:text-white transition-colors">Talanta Stadium Guide</a></li>
              <li><a href="#ticket-categories" className="hover:text-white transition-colors">Ticket Categories & Prices</a></li>
              <li><a href="#match-rules" className="hover:text-white transition-colors">Entry Rules & Prohibited Items</a></li>
            </ul>
          </div>

          {/* Customer & Steward Tools */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">Support & Turnstiles</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={onOpenCustomerDashboard} className="hover:text-white transition-colors cursor-pointer text-left">
                  My Bookings & E-Tickets
                </button>
              </li>
              <li>
                <button onClick={onOpenScanner} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Turnstile QR Gate Scanner
                </button>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="hover:text-white transition-colors cursor-pointer text-left">
                  Admin Operations Console
                </button>
              </li>
              <li><a href="#faq" className="hover:text-white transition-colors">Help & FAQ</a></li>
            </ul>
          </div>

          {/* Nairobi Office & Hotline */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">Customer Support</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-red-500 shrink-0" />
                <span className="font-mono text-slate-300">+254 (0) 700 123 456 / 020 892 000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-red-500 shrink-0" />
                <span className="text-slate-300">tickets@kickpass.co.ke</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <span className="text-slate-400">Delta Corner Tower, Westlands, Nairobi, Kenya</span>
              </div>
            </div>
          </div>

        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 KickPass Kenya Ltd. All rights reserved. AFC Ajax and FC Bayern Munich logos and crests are registered trademarks of their respective clubs used for event ticketing identification.</p>
          <div className="flex items-center gap-4 shrink-0">
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Ticketing Terms</span>
            <span>·</span>
            <span>Security Statement</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
