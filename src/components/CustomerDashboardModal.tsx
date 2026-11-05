import React, { useState } from 'react';
import { X, Ticket as TicketIcon, Calendar, Download, CheckCircle2, User, Phone, Mail, Receipt, ExternalLink, Video } from 'lucide-react';
import { Booking, Ticket } from '../types';
import { AnimatedStadiumShowcase } from './AnimatedStadiumShowcase';

interface CustomerDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onViewTicket: (ticket: Ticket) => void;
}

export const CustomerDashboardModal: React.FC<CustomerDashboardModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onViewTicket,
}) => {
  const [activeTab, setActiveTab] = useState<'tickets' | 'stadium' | 'bookings' | 'profile'>('tickets');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  // Flatten tickets
  const allTickets: Ticket[] = bookings.flatMap(b => b.tickets || []);

  const filteredTickets = allTickets.filter(t =>
    t.attendeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 shadow-2xl p-6 sm:p-8 my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-red-500 mb-0.5">
              Customer Portal · KickPass Kenya
            </div>
            <h2 className="text-2xl font-black text-white">
              My Match Tickets & Bookings
            </h2>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1 border-b border-slate-800 pb-3 mb-6">
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'tickets'
                ? 'bg-red-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            My Electronic Tickets ({allTickets.length})
          </button>
          <button
            onClick={() => setActiveTab('stadium')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'stadium'
                ? 'bg-red-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Video className="h-3.5 w-3.5 text-amber-400" />
            <span>Talanta Stadium Live Perspectives</span>
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'bookings'
                ? 'bg-red-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Booking History ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'profile'
                ? 'bg-red-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Account & Security
          </button>
        </div>

        {/* TAB: STADIUM PERSPECTIVE FEEDS */}
        {activeTab === 'stadium' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-red-500 mb-1">
                Raila Odinga International Stadium (Talanta Stadium)
              </div>
              <h3 className="text-base font-bold text-white">
                Venue Sightlines & Gate Entry Navigation
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Gates open early at 11:00 AM. Kickoff is at 8:15 PM Kenyan time on Tuesday, 5 January 2027. Browse 360° architectural views and executive hospitality suites below:
              </p>
            </div>
            <AnimatedStadiumShowcase />
          </div>
        )}

        {/* TAB 1: TICKETS */}
        {activeTab === 'tickets' && (
          <div className="space-y-4">
            {allTickets.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <TicketIcon className="h-12 w-12 mx-auto text-slate-600 mb-3" />
                <p className="text-sm font-semibold text-white">No tickets found yet</p>
                <p className="text-xs mt-1">Book your tickets for Ajax vs Bayern Munich to see them here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 flex flex-col justify-between hover:border-slate-700 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-mono text-slate-400 font-semibold">{ticket.ticketNumber}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          ticket.status === 'CHECKED_IN' ? 'bg-amber-950 text-amber-400' : 'bg-emerald-950 text-emerald-400'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white mb-1">
                        {ticket.attendeeName}
                      </h4>
                      <div className="text-xs text-red-400 font-semibold mb-2">
                        {ticket.categoryName} · {ticket.gateEntrance}
                      </div>

                      <div className="text-xs text-slate-400 space-y-1 mb-4">
                        <div>Seat: <span className="text-white font-mono">{ticket.seatIdentifier}</span></div>
                        <div>Venue: <span className="text-white">{ticket.venueName}</span></div>
                      </div>
                    </div>

                    <button
                      onClick={() => onViewTicket(ticket)}
                      className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30 py-2 text-xs font-bold hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>View & Download E-Ticket</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3"
              >
                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-slate-500">Reference: </span>
                    <strong className="text-white font-mono">{booking.bookingReference}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-semibold font-mono">
                      KES {booking.totalAmountKes.toLocaleString()}
                    </span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-bold">
                      {booking.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-500 block">Lead Name:</span>
                    <span>{booking.customerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Phone:</span>
                    <span className="font-mono">{booking.customerPhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Total Tickets:</span>
                    <span>{booking.totalTickets} pass(es)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Receipt:</span>
                    <span className="font-mono text-emerald-400">{booking.mpesaReceiptNumber || 'M-PESA Paid'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: PROFILE */}
        {activeTab === 'profile' && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4 text-xs text-slate-300">
            <h4 className="text-sm font-bold text-white mb-2">Customer Credentials & Safety</h4>
            <p className="leading-relaxed">
              All bookings made under your verified Kenyan mobile phone and email are protected by KickPass Kenya encrypted authentication.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-500 block">Primary M-PESA Line</span>
                <span className="text-white font-mono font-semibold">+254 (0) 712 345 678</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-500 block">KYC Verification</span>
                <span className="text-emerald-400 font-semibold">National ID / Passport Verified</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
