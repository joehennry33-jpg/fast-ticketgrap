import React, { useState, useEffect } from 'react';
import { X, Settings, DollarSign, Users, Ticket, BarChart3, Edit3, Save, Download, RotateCcw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { MatchEvent, TicketCategory, Booking } from '../types';
import { api } from '../services/api';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: MatchEvent;
  categories: TicketCategory[];
  bookings: Booking[];
  onUpdateEvent: (updated: MatchEvent) => void;
  onUpdateCategories: (updated: TicketCategory[]) => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  event,
  categories,
  bookings,
  onUpdateEvent,
  onUpdateCategories,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'event' | 'categories' | 'bookings'>('overview');

  // Form states for Event
  const [eventTitle, setEventTitle] = useState(event.title);
  const [eventDate, setEventDate] = useState(event.eventDate);
  const [kickoffTime, setKickoffTime] = useState(event.kickoffTime);
  const [gatesOpenTime, setGatesOpenTime] = useState(event.gatesOpenTime);
  const [venueName, setVenueName] = useState(event.venueName);
  const [stadiumCapacity, setStadiumCapacity] = useState(event.stadiumCapacity);
  const [eventStatus, setEventStatus] = useState(event.status);
  const [disclaimerText, setDisclaimerText] = useState(event.disclaimerText);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Editable Categories
  const [editableCategories, setEditableCategories] = useState<TicketCategory[]>(categories);

  useEffect(() => {
    setEditableCategories(categories);
    setEventTitle(event.title);
    setEventDate(event.eventDate);
    setKickoffTime(event.kickoffTime);
    setGatesOpenTime(event.gatesOpenTime);
    setVenueName(event.venueName);
    setStadiumCapacity(event.stadiumCapacity);
    setEventStatus(event.status);
    setDisclaimerText(event.disclaimerText);
  }, [event, categories]);

  if (!isOpen) return null;

  // Real-time Revenue Calculations
  const confirmedBookings = bookings.filter(b => b.paymentStatus === 'PAID');
  const totalRevenueKes = confirmedBookings.reduce((sum, b) => sum + b.totalAmountKes, 0);
  const totalTicketsSold = confirmedBookings.reduce((sum, b) => sum + b.totalTickets, 0);
  const occupancyPercentage = ((totalTicketsSold / stadiumCapacity) * 100).toFixed(1);

  // Save Event Updates
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await api.updateEvent(event.id, {
        title: eventTitle,
        eventDate,
        kickoffTime,
        gatesOpenTime,
        venueName,
        stadiumCapacity: Number(stadiumCapacity),
        status: eventStatus as any,
        disclaimerText
      });
      onUpdateEvent(updated);
      setSaveSuccessMsg('Event configuration saved successfully!');
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    } catch (err: any) {
      alert('Failed to save event updates');
    }
  };

  // Save Category Updates
  const handleCategoryFieldChange = (id: string, field: 'priceKes' | 'availableQuota' | 'totalQuota', value: number) => {
    setEditableCategories(prev =>
      prev.map(cat => (cat.id === id ? { ...cat, [field]: value } : cat))
    );
  };

  const handleSaveCategories = async () => {
    try {
      for (const cat of editableCategories) {
        await api.updateCategory(cat.id, {
          priceKes: Number(cat.priceKes),
          totalQuota: Number(cat.totalQuota),
          availableQuota: Number(cat.availableQuota)
        });
      }
      onUpdateCategories([...editableCategories]);
      setSaveSuccessMsg('Ticket tier prices and quotas updated successfully!');
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    } catch (err: any) {
      alert('Failed to save category updates');
    }
  };

  // Export Bookings CSV (Anonymized / Operational Only)
  const handleExportCSV = () => {
    const headers = ['Booking Ref', 'Ticket Category', 'Quantity', 'Total Amount (KES)', 'Booking Status', 'Payment Method', 'Gateway Receipt', 'Date'];
    const rows = bookings.map(b => [
      b.bookingReference,
      `"${b.items?.[0]?.categoryName || 'General'}"`,
      b.totalTickets,
      b.totalAmountKes,
      b.bookingStatus,
      b.paymentMethod || 'MPESA_STK_PUSH',
      b.mpesaReceiptNumber || 'N/A',
      `"${new Date(b.createdAt).toLocaleDateString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kickpass_operations_ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 shadow-2xl p-6 sm:p-8 my-6">
        
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
              Operations Control Center
            </div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Settings className="h-6 w-6 text-red-500" />
              <span>Platform Administrator Dashboard</span>
            </h2>
          </div>
          {saveSuccessMsg && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-500/30">
              <CheckCircle2 className="h-4 w-4" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 border-b border-slate-800 pb-3 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'overview' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Sales & Revenue Analytics
          </button>
          <button
            onClick={() => setActiveTab('event')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'event' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Match & Venue Configurations
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'categories' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Ticket Pricing & Quotas
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'bookings' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Bookings Ledger ({bookings.length})
          </button>
        </div>

        {/* TAB 1: OVERVIEW METRICS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                <div className="text-xs text-slate-400 mb-1">Confirmed Revenue</div>
                <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
                  KES {totalRevenueKes.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">M-PESA & Card Settled</div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                <div className="text-xs text-slate-400 mb-1">Total Passes Sold</div>
                <div className="text-xl sm:text-2xl font-black font-mono text-white">
                  {totalTicketsSold.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Across 5 Ticket Categories</div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                <div className="text-xs text-slate-400 mb-1">Stadium Occupancy</div>
                <div className="text-xl sm:text-2xl font-black font-mono text-sky-400">
                  {occupancyPercentage}%
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Of 60,000 Capacity</div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                <div className="text-xs text-slate-400 mb-1">Confirmed Bookings</div>
                <div className="text-xl sm:text-2xl font-black font-mono text-amber-400">
                  {confirmedBookings.length}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">100% Unique Serialized</div>
              </div>
            </div>

            {/* Category Breakdown Table */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
              <h3 className="text-sm font-bold text-white mb-3">Live Tier Breakdown & Sales</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 text-slate-400">
                    <tr>
                      <th className="pb-2">Category</th>
                      <th className="pb-2">Price (KES)</th>
                      <th className="pb-2">Sold / Quota</th>
                      <th className="pb-2">Available</th>
                      <th className="pb-2">Revenue (KES)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {categories.map((c) => {
                      const sold = c.totalQuota - c.availableQuota;
                      const rev = sold * c.priceKes;
                      return (
                        <tr key={c.id}>
                          <td className="py-2.5 font-sans font-semibold text-white">{c.name}</td>
                          <td className="py-2.5 text-slate-300">{c.priceKes.toLocaleString()}</td>
                          <td className="py-2.5 text-slate-300">{sold.toLocaleString()} / {c.totalQuota.toLocaleString()}</td>
                          <td className="py-2.5 text-emerald-400 font-bold">{c.availableQuota.toLocaleString()}</td>
                          <td className="py-2.5 text-emerald-400 font-bold">{rev.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MATCH & VENUE CONFIGURATIONS */}
        {activeTab === 'event' && (
          <form onSubmit={handleSaveEvent} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Event Title</label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Venue Name</label>
                <input
                  type="text"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs text-white focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Event Date (ISO/Datetime)</label>
                <input
                  type="text"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs text-white font-mono focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Kickoff Time</label>
                <input
                  type="text"
                  value={kickoffTime}
                  onChange={(e) => setKickoffTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Gates Open Time</label>
                <input
                  type="text"
                  value={gatesOpenTime}
                  onChange={(e) => setGatesOpenTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs text-white focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Event Status</label>
                <select
                  value={eventStatus}
                  onChange={(e) => setEventStatus(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs text-white focus:border-red-500 focus:outline-none"
                >
                  <option value="CONFIRMED">CONFIRMED (Tickets On Sale)</option>
                  <option value="UPCOMING">UPCOMING (Pending Final Schedule)</option>
                  <option value="POSTPONED">POSTPONED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Stadium Capacity</label>
                <input
                  type="number"
                  value={stadiumCapacity}
                  onChange={(e) => setStadiumCapacity(parseInt(e.target.value) || 60000)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs text-white font-mono focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Official Event Advisory / Disclaimer Text
              </label>
              <textarea
                rows={2}
                value={disclaimerText}
                onChange={(e) => setDisclaimerText(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-xs text-white focus:border-red-500 focus:outline-none leading-relaxed"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-red-500 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>Save Event Configurations</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: TICKET PRICING & QUOTAS */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              Adjust prices in Kenyan Shillings (KES) and control ticket quotas. Changes take effect on the booking portal immediately.
            </p>

            <div className="space-y-3">
              {editableCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center rounded-xl border border-slate-800 bg-slate-900 p-4 text-xs"
                >
                  <div className="sm:col-span-1">
                    <div className="font-bold text-white text-sm">{cat.name}</div>
                    <div className="text-[11px] text-slate-400">{cat.gateDesignation}</div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Price (KES)</label>
                    <input
                      type="number"
                      value={cat.priceKes}
                      onChange={(e) => handleCategoryFieldChange(cat.id, 'priceKes', parseInt(e.target.value) || 0)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 font-mono text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Total Quota</label>
                    <input
                      type="number"
                      value={cat.totalQuota}
                      onChange={(e) => handleCategoryFieldChange(cat.id, 'totalQuota', parseInt(e.target.value) || 0)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 font-mono text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Available Seats</label>
                    <input
                      type="number"
                      value={cat.availableQuota}
                      onChange={(e) => handleCategoryFieldChange(cat.id, 'availableQuota', parseInt(e.target.value) || 0)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 font-mono text-emerald-400 font-bold"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSaveCategories}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-red-500 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>Save Pricing & Quota Updates</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: BOOKINGS LEDGER & CSV EXPORT */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3.5 flex items-center justify-between gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
                <span>
                  <strong className="text-white">Privacy Protected:</strong> In compliance with ticketing privacy regulations, individual customer names, phone numbers, and identity credentials are encrypted and excluded from the administrative operations ledger.
                </span>
              </div>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:text-white shrink-0 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export Ledger CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                  <tr>
                    <th className="p-3">Reference</th>
                    <th className="p-3">Category Tier</th>
                    <th className="p-3">Pass Count</th>
                    <th className="p-3">Amount (KES)</th>
                    <th className="p-3">Payment Method</th>
                    <th className="p-3">Payment Status</th>
                    <th className="p-3">Gateway Receipt</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-900/60">
                      <td className="p-3 font-bold text-white">{b.bookingReference}</td>
                      <td className="p-3 font-sans text-slate-200">{b.items?.[0]?.categoryName || 'General Admission'}</td>
                      <td className="p-3 text-slate-300">{b.totalTickets} pass(es)</td>
                      <td className="p-3 text-emerald-400 font-bold">{b.totalAmountKes.toLocaleString()}</td>
                      <td className="p-3 font-sans text-slate-300">
                        {b.paymentMethod === 'CARD_PAYMENT' ? 'Debit/Credit Card' : 'M-PESA STK Push'}
                      </td>
                      <td className="p-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          b.paymentStatus === 'PAID' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                        }`}>
                          {b.paymentStatus}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{b.mpesaReceiptNumber || '—'}</td>
                      <td className="p-3 text-slate-400">{new Date(b.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
