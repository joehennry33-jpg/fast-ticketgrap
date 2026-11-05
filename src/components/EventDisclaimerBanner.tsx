import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';

interface EventDisclaimerBannerProps {
  disclaimerText: string;
  status: string;
}

export const EventDisclaimerBanner: React.FC<EventDisclaimerBannerProps> = ({ disclaimerText, status }) => {
  return (
    <div className="border-b border-amber-500/20 bg-amber-950/40 px-4 py-2.5 text-xs text-amber-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
          <p className="leading-snug">
            <strong className="font-semibold text-amber-300">Official Event Advisory:</strong>{' '}
            {disclaimerText || 'Proposed event date and venue are subject to final sanctioning, scheduling approval, and match authorization by the Football Kenya Federation (FKF) and participating clubs.'}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 shrink-0 text-amber-300 font-medium">
          <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
          <span>Status: {status}</span>
        </div>
      </div>
    </div>
  );
};
