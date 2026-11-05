import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Menu, X, Settings } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenScanner: () => void;
  onOpenCustomerDashboard: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenScanner,
  onOpenCustomerDashboard,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand title wordmark */}
        <a href="#" className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-white whitespace-nowrap shrink-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 font-black text-white text-base">
            KP
          </span>
          <span className="text-white">KICKPASS</span>
          <span className="text-red-500 font-semibold">KENYA</span>
        </a>

        {/* Zone 2: 4-5 single-line clean text links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <a href="#match-details" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Match Details
          </a>
          <a href="#talanta-stadium" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Talanta Stadium
          </a>
          <a href="#ticket-categories" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Tickets & Pricing
          </a>
          <button
            onClick={onOpenScanner}
            className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer text-left"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Gate Scanner
          </button>
          <button
            onClick={onOpenCustomerDashboard}
            className="flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer text-left"
          >
            <UserCheck className="h-4 w-4 text-slate-400" />
            My Tickets
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAdmin}
            title="Open Admin Dashboard"
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs font-medium text-slate-300 hover:border-slate-700 hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            <Settings className="h-3.5 w-3.5" />
            <span>Admin</span>
          </button>
          <button
            onClick={onOpenBooking}
            className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-700 active:scale-95 transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            Book Tickets
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-lg p-2 text-slate-400 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-3">
          <a
            href="#match-details"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-200 hover:text-red-400"
          >
            Match Details
          </a>
          <a
            href="#talanta-stadium"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-200 hover:text-red-400"
          >
            Talanta Stadium
          </a>
          <a
            href="#ticket-categories"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-200 hover:text-red-400"
          >
            Tickets & Pricing
          </a>
          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenScanner();
              }}
              className="flex items-center gap-2 py-2 text-sm font-medium text-emerald-400"
            >
              <ShieldCheck className="h-4 w-4" /> Gate Scanner & Verifier
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCustomerDashboard();
              }}
              className="flex items-center gap-2 py-2 text-sm font-medium text-slate-200"
            >
              <UserCheck className="h-4 w-4" /> My Bookings & Tickets
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex items-center gap-2 py-2 text-sm font-medium text-slate-400"
            >
              <Settings className="h-4 w-4" /> Admin Control Panel
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
