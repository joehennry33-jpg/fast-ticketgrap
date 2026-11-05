import React from 'react';
import { AlertCircle, ShieldAlert, CheckCircle, Clock, Ban } from 'lucide-react';

interface MatchRulesSectionProps {
  rules: string[];
}

export const MatchRulesSection: React.FC<MatchRulesSectionProps> = ({ rules }) => {
  return (
    <section id="match-rules" className="border-b border-slate-800 bg-slate-950 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="text-xs font-bold uppercase tracking-wider text-red-500 mb-1">
            Stadium Guidelines & Safety
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            MATCH RULES & ENTRY REQUIREMENTS
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Please review the official Raila Odinga International Stadium (Talanta Stadium) entry conditions before arriving on matchday.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* Rules List */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-7">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
              <span>Mandatory Spectator Protocols</span>
            </h3>
            <ul className="space-y-3.5 text-xs text-slate-300">
              {rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                  <span className="font-mono font-bold text-red-400 shrink-0">0{idx + 1}.</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Prohibited Items & Turnstile Closure */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Ban className="h-5 w-5 text-red-500" />
                <span>Prohibited Items at Turnstiles</span>
              </h3>
              <div className="grid grid-cols-2 gap-2.5 text-xs text-slate-300">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  <strong className="text-white block">Glass & Cans</strong>
                  <span className="text-slate-500 text-[11px]">Sealed plastic water cups permitted only</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  <strong className="text-white block">Pyrotechnics & Flares</strong>
                  <span className="text-slate-500 text-[11px]">Strict criminal offense under Kenya Sports Act</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  <strong className="text-white block">Pro Camera Lenses</strong>
                  <span className="text-slate-500 text-[11px]">Telephoto &gt;200mm requires media press pass</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  <strong className="text-white block">Hard Poles / Weapons</strong>
                  <span className="text-slate-500 text-[11px]">Flagpoles must be flexible hollow plastic</span>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 flex items-center gap-3 text-xs text-amber-200">
              <Clock className="h-5 w-5 text-amber-400 shrink-0" />
              <span>
                <strong>Turnstiles Cut-off:</strong> Gates open at 11:00 AM and close strictly 30 minutes before kickoff (7:45 PM Kenyan time). Arrive early to enjoy stadium fan zones!
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
