import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, ArrowRight, ShieldCheck, Ticket as TicketIcon } from 'lucide-react';
import { MatchEvent } from '../types';

interface HeroSectionProps {
  event: MatchEvent;
  onBookTickets: () => void;
  onExploreStadium: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ event, onBookTickets, onExploreStadium }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(event.eventDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [event.eventDate]);

  const formattedDate = new Date(event.eventDate).toLocaleDateString('en-KE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950">
      {/* Background Stadium Photography with contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_football_stadium_1793884336463.jpg"
          alt="Talanta Sports City Stadium Nairobi Matchday Background"
          className="h-full w-full object-cover object-center filter brightness-40"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.12)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* Match Header Label & 61 Days Countdown Tag */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-950/70 px-4 py-1.5 text-xs font-black text-red-200 backdrop-blur-md mb-4 shadow-lg shadow-red-900/40">
            <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-amber-300 font-extrabold uppercase tracking-widest">61 DAYS TO GO!</span>
            <span className="text-slate-400">·</span>
            <span>TUESDAY, 5 JANUARY 2027</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl text-balance">
            {event.title}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Tuesday, 5 January 2027 at the new <strong className="text-white">Raila Odinga International Stadium (Talanta Stadium)</strong>, Nairobi. Gates open at <strong className="text-white">11:00 AM</strong> with kick-off at <strong className="text-white">8:15 PM Kenyan time</strong>.
          </p>
        </div>

        {/* CLUBS SHOWDOWN - Left: Home Club, Center: VS & Countdown, Right: Away Club */}
        <div className="my-8 sm:my-12 rounded-2xl border border-slate-800/90 bg-slate-900/70 p-6 sm:p-10 backdrop-blur-md shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-11 items-center gap-6 sm:gap-8">
            
            {/* HOME CLUB (Left) */}
            <div className="md:col-span-4 flex flex-col items-center md:items-end text-center md:text-right group">
              <div className="relative mb-4 flex h-32 w-32 sm:h-40 sm:w-40 items-center justify-center rounded-2xl p-2 bg-gradient-to-br from-white/10 to-transparent border border-white/10 shadow-lg group-hover:scale-105 transition-transform">
                <img
                  src={event.homeTeam.crestUrl}
                  alt={`${event.homeTeam.name} Official Club Crest`}
                  className="h-full w-full object-contain filter drop-shadow-[0_8px_16px_rgba(220,5,45,0.4)]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {event.homeTeam.name}
              </h2>
              <p className="text-sm font-semibold text-red-400">
                {event.homeTeam.country} · {event.homeTeam.squadHighlights?.[0] || 'European Champions'}
              </p>
              <div className="mt-2 text-xs text-slate-400 hidden sm:block">
                {event.homeTeam.squadHighlights?.[1] || 'Elite Continental Heavyweights'}
              </div>
            </div>

            {/* CENTER: VS BADGE & LIVE COUNTDOWN TIMER */}
            <div className="md:col-span-3 flex flex-col items-center justify-center text-center">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-600 via-rose-600 to-amber-500 shadow-[0_0_30px_rgba(220,38,38,0.5)]">
                <span className="text-2xl font-black italic tracking-widest text-white">
                  VS
                </span>
              </div>

              {/* 61 Days Countdown Notice */}
              <div className="mt-4 inline-block rounded-md bg-red-600/20 border border-red-500/40 px-3 py-1 text-[11px] font-extrabold text-amber-300">
                61 DAYS TO GO!
              </div>

              {/* Countdown Grid */}
              <div className="mt-3 w-full">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Matchday Countdown (Kickoff 8:15 PM EAT)
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="rounded-lg bg-slate-950/80 border border-slate-800 p-2">
                    <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
                      {String(timeLeft.days || 61).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] uppercase text-slate-400 font-semibold">Days</div>
                  </div>
                  <div className="rounded-lg bg-slate-950/80 border border-slate-800 p-2">
                    <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] uppercase text-slate-400 font-semibold">Hours</div>
                  </div>
                  <div className="rounded-lg bg-slate-950/80 border border-slate-800 p-2">
                    <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] uppercase text-slate-400 font-semibold">Mins</div>
                  </div>
                  <div className="rounded-lg bg-slate-950/80 border border-slate-800 p-2">
                    <div className="text-xl sm:text-2xl font-bold font-mono text-red-400 tabular-nums">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] uppercase text-slate-400 font-semibold">Secs</div>
                  </div>
                </div>
              </div>
            </div>

            {/* AWAY CLUB: FC BAYERN MUNICH (Right) */}
            <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left group">
              <div className="relative mb-4 flex h-32 w-32 sm:h-40 sm:w-40 items-center justify-center rounded-2xl p-2 bg-gradient-to-br from-white/10 to-transparent border border-white/10 shadow-lg group-hover:scale-105 transition-transform">
                <img
                  src={event.awayTeam.crestUrl}
                  alt="FC Bayern Munich Official Club Crest"
                  className="h-full w-full object-contain filter drop-shadow-[0_8px_16px_rgba(220,5,45,0.4)]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {event.awayTeam.name}
              </h2>
              <p className="text-sm font-semibold text-sky-400">
                Munich, Germany · 6x European Champions
              </p>
              <div className="mt-2 text-xs text-slate-400 hidden sm:block">
                German Bundesliga Dominance · Record Treble Winners
              </div>
            </div>

          </div>
        </div>

        {/* MATCH DETAILS STRIP: Date, Venue, Gates, Capacity */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="flex items-center gap-3 rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5 backdrop-blur-sm">
            <Calendar className="h-5 w-5 text-red-500 shrink-0" />
            <div>
              <div className="text-xs text-slate-400 font-medium">Proposed Date</div>
              <div className="font-semibold text-white">{formattedDate}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5 backdrop-blur-sm">
            <Clock className="h-5 w-5 text-red-500 shrink-0" />
            <div>
              <div className="text-xs text-slate-400 font-medium">Kickoff & Gates</div>
              <div className="font-semibold text-white">{event.kickoffTime} (Gates: {event.gatesOpenTime})</div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5 backdrop-blur-sm">
            <MapPin className="h-5 w-5 text-red-500 shrink-0" />
            <div>
              <div className="text-xs text-slate-400 font-medium">Stadium & City</div>
              <div className="font-semibold text-white">{event.venueName}, {event.venueCity}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5 backdrop-blur-sm">
            <TicketIcon className="h-5 w-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs text-slate-400 font-medium">Capacity & Entry</div>
              <div className="font-semibold text-white">60,000 All-Seater · QR E-Ticket</div>
            </div>
          </div>
        </div>

        {/* PRIMARY CALL TO ACTIONS */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onBookTickets}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-xl bg-red-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-red-600/30 hover:bg-red-500 active:scale-95 transition-all cursor-pointer"
          >
            <span>BOOK YOUR TICKETS NOW</span>
            <ArrowRight className="h-5 w-5" />
          </button>
          <button
            onClick={onExploreStadium}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-4 text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-all cursor-pointer"
          >
            <span>Explore Talanta Stadium & Seating</span>
          </button>
        </div>

      </div>
    </section>
  );
};
