import React, { useState, useEffect } from 'react';
import { initialEvent, initialCategories, sampleBookings } from './data/initialData';
import { MatchEvent, TicketCategory, Booking, Ticket } from './types';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { EventDisclaimerBanner } from './components/EventDisclaimerBanner';
import { HeroSection } from './components/HeroSection';
import { TalantaStadiumSection } from './components/TalantaStadiumSection';
import { InteractiveStadiumMap } from './components/InteractiveStadiumMap';
import { TicketSelectionSection } from './components/TicketSelectionSection';
import { WhyBookWithUs } from './components/WhyBookWithUs';
import { MatchRulesSection } from './components/MatchRulesSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { ElectronicTicketModal } from './components/ElectronicTicketModal';
import { GateScannerModal } from './components/GateScannerModal';
import { CustomerDashboardModal } from './components/CustomerDashboardModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { Trophy, Calendar, MapPin, Users, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [event, setEvent] = useState<MatchEvent>(initialEvent);
  const [categories, setCategories] = useState<TicketCategory[]>(initialCategories);
  const [bookings, setBookings] = useState<Booking[]>(sampleBookings);
  const [selectedMapCategory, setSelectedMapCategory] = useState<string>(initialCategories[1]?.id || 'cat-vip');

  // Modals state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingCategoryToOpen, setBookingCategoryToOpen] = useState<string | undefined>(undefined);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isCustomerDashboardOpen, setIsCustomerDashboardOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Load from API on mount
  useEffect(() => {
    async function loadData() {
      try {
        const fetchedEvent = await api.getEvent();
        if (fetchedEvent) setEvent(fetchedEvent);

        const fetchedCats = await api.getCategories();
        if (fetchedCats && fetchedCats.length) setCategories(fetchedCats);

        const adminStats = await api.getAdminStats();
        if (adminStats && adminStats.recentBookings) {
          setBookings(adminStats.recentBookings);
        }
      } catch (e) {
        console.warn('Using local fallback state', e);
      }
    }
    loadData();
  }, []);

  // Handlers
  const handleOpenBooking = (categoryId?: string) => {
    setBookingCategoryToOpen(categoryId || selectedMapCategory);
    setIsBookingOpen(true);
  };

  const handleBookingSuccess = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    // If tickets exist, open first ticket
    if (newBooking.tickets && newBooking.tickets.length > 0) {
      setActiveTicket(newBooking.tickets[0]);
      setIsTicketModalOpen(true);
    }
    // Refresh categories inventory
    api.getCategories().then(setCategories).catch(() => {});
  };

  const handleViewTicket = (ticket: Ticket) => {
    setActiveTicket(ticket);
    setIsTicketModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      
      {/* 1. Official Event Advisory / Sanctioning Notice */}
      <EventDisclaimerBanner
        disclaimerText={event.disclaimerText}
        status={event.status}
      />

      {/* 2. Top Bar Navigation Contract */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenCustomerDashboard={() => setIsCustomerDashboardOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 3. Hero Section: Ajax vs Bayern Munich + Live Countdown */}
      <main className="flex-1">
        <HeroSection
          event={event}
          onBookTickets={() => handleOpenBooking()}
          onExploreStadium={() => {
            const el = document.getElementById('talanta-stadium');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 4. Match Details & Team Pedigree Spotlight */}
        <section id="match-details" className="border-b border-slate-800 bg-slate-900/30 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              
              {/* Ajax Amsterdam Profile */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={event.homeTeam.crestUrl}
                      alt={event.homeTeam.name}
                      className="h-16 w-16 object-contain"
                    />
                    <div>
                      <div className="text-xs text-red-400 font-bold uppercase tracking-wider">Dutch Football Royalty</div>
                      <h3 className="text-2xl font-black text-white">{event.homeTeam.name}</h3>
                      <p className="text-xs text-slate-400">Founded 1900 · Johan Cruyff Arena, Amsterdam</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                    Renowned globally for pioneering "Total Football", AFC Ajax boasts 4 European Champions League titles, 36 Eredivisie championships, and one of world football's most celebrated academies (De Toekomst).
                  </p>
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-slate-400">Club Legacy Highlights:</div>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {event.homeTeam.squadHighlights?.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-red-500 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bayern Munich Profile */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={event.awayTeam.crestUrl}
                      alt={event.awayTeam.name}
                      className="h-16 w-16 object-contain"
                    />
                    <div>
                      <div className="text-xs text-sky-400 font-bold uppercase tracking-wider">German Football Powerhouse</div>
                      <h3 className="text-2xl font-black text-white">{event.awayTeam.name}</h3>
                      <p className="text-xs text-slate-400">Founded 1900 · Allianz Arena, Munich</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                    Germany’s most decorated sporting institution. FC Bayern Munich has conquered Europe 6 times and claimed 33 German league titles, known worldwide for tactical precision and attacking football.
                  </p>
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-slate-400">Club Legacy Highlights:</div>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {event.awayTeam.squadHighlights?.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 5. Dedicated Talanta Stadium Information & Gallery Section */}
        <TalantaStadiumSection />

        {/* 6. Interactive Stadium Seating Map */}
        <section className="border-b border-slate-800 bg-slate-950 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <InteractiveStadiumMap
              categories={categories}
              selectedCategoryId={selectedMapCategory}
              onSelectCategory={(id) => {
                setSelectedMapCategory(id);
                handleOpenBooking(id);
              }}
            />
          </div>
        </section>

        {/* 7. Complete Ticket Selection & Pricing Grid */}
        <TicketSelectionSection
          categories={categories}
          onOpenBooking={handleOpenBooking}
        />

        {/* 8. Why Book With Us (Trust & Safeguards) */}
        <WhyBookWithUs />

        {/* 9. Match Rules & Stadium Safety */}
        <MatchRulesSection rules={event.rulesAndEntry} />

        {/* 10. Frequently Asked Questions */}
        <FaqSection />
      </main>

      {/* 11. Quiet Professional Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenCustomerDashboard={() => setIsCustomerDashboardOpen(true)}
      />

      {/* MODALS */}
      {/* 1. Multi-Step Ticket Booking & M-PESA Payment Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        event={event}
        categories={categories}
        initialCategoryId={bookingCategoryToOpen}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* 2. Official Electronic Ticket Modal with Scannable QR */}
      <ElectronicTicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        ticket={activeTicket}
      />

      {/* 3. Gate Scanner & Steward Verification Console */}
      <GateScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />

      {/* 4. Customer Account & Bookings Dashboard */}
      <CustomerDashboardModal
        isOpen={isCustomerDashboardOpen}
        onClose={() => setIsCustomerDashboardOpen(false)}
        bookings={bookings}
        onViewTicket={handleViewTicket}
      />

      {/* 5. Administrator Control Console */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        event={event}
        categories={categories}
        bookings={bookings}
        onUpdateEvent={(updated) => setEvent(updated)}
        onUpdateCategories={(updated) => setCategories(updated)}
      />

    </div>
  );
}
