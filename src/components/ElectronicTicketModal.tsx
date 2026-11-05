import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Download, Printer, ShieldCheck, MapPin, Calendar, Clock, Ticket as TicketIcon, CheckCircle2 } from 'lucide-react';
import { Ticket } from '../types';

interface ElectronicTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
}

export const ElectronicTicketModal: React.FC<ElectronicTicketModalProps> = ({ isOpen, onClose, ticket }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ticket) {
      QRCode.toDataURL(
        ticket.qrCodeSignature || ticket.ticketNumber,
        {
          width: 250,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        },
        (err, url) => {
          if (!err && url) {
            setQrDataUrl(url);
          }
        }
      );
    }
  }, [ticket]);

  if (!isOpen || !ticket) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(ticket.eventDate).toLocaleDateString('en-KE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-black/40 text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Printable Ticket Container */}
        <div ref={printRef} className="p-6 sm:p-8 bg-slate-950 rounded-2xl border border-slate-800/80">
          
          {/* Header Ticket Brand */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded bg-red-600 font-black text-white text-xs">
                KP
              </span>
              <span className="font-extrabold text-sm tracking-wider text-white">KICKPASS KENYA</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>OFFICIAL E-TICKET · {ticket.status}</span>
            </div>
          </div>

          {/* Ticket Body: Match Graphic / Details */}
          <div className="rounded-xl bg-gradient-to-br from-slate-900 via-slate-900 to-red-950/30 p-5 border border-slate-800 mb-5 relative overflow-hidden">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2">
                <img src="/src/assets/teams/ajax.svg" alt="Ajax" className="h-10 w-10 object-contain drop-shadow" />
                <span className="text-xs font-bold text-white">AJAX</span>
              </div>
              <div className="text-sm font-black italic text-red-500 px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                VS
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">BAYERN</span>
                <img src="/src/assets/teams/bayern.svg" alt="Bayern" className="h-10 w-10 object-contain drop-shadow" />
              </div>
            </div>

            <h3 className="text-base font-extrabold text-white leading-tight mb-2">
              {ticket.eventTitle}
            </h3>

            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-red-400" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-red-400" />
                <span>{ticket.venueName}, Nairobi, Kenya</span>
              </div>
            </div>
          </div>

          {/* Seating & Gate Allocation Card */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 mb-5">
            <div>
              <span className="text-slate-500 block">Ticket Category</span>
              <span className="font-bold text-white text-sm">{ticket.categoryName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Designated Entrance</span>
              <span className="font-bold text-emerald-400 text-sm">{ticket.gateEntrance}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Seat Identifier</span>
              <span className="font-semibold text-white">{ticket.seatIdentifier}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Attendee Name</span>
              <span className="font-semibold text-white">{ticket.attendeeName}</span>
            </div>
          </div>

          {/* Genuine Scannable QR Code & Cryptographic Hash */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 bg-white p-5 rounded-xl text-slate-950 mb-5">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Gate Steward Optical QR Code
              </div>
              <div className="font-mono font-black text-lg text-slate-900 tracking-wider my-0.5">
                {ticket.ticketNumber}
              </div>
              <div className="text-[11px] text-slate-600 max-w-[200px] leading-tight">
                Scan this high-density QR at turnstile reader or gate steward handheld scanner.
              </div>
              <div className="mt-2 text-[9px] font-mono text-slate-400 break-all">
                Hash: {ticket.securityHash.slice(0, 24)}...
              </div>
            </div>

            {qrDataUrl ? (
              <div className="shrink-0 p-1.5 bg-white rounded-lg border border-slate-300 shadow-sm">
                <img
                  src={qrDataUrl}
                  alt={`QR Code for Ticket ${ticket.ticketNumber}`}
                  className="h-32 w-32 object-contain"
                />
              </div>
            ) : (
              <div className="h-32 w-32 bg-slate-200 animate-pulse rounded-lg" />
            )}
          </div>

          {/* Entry Rules & Disclaimers */}
          <div className="text-[10px] text-slate-400 space-y-1 border-t border-slate-800 pt-3">
            <p>· Original National ID or Passport required along with this ticket at turnstile security.</p>
            <p>· Strict zero-tolerance for ticket duplication. Scanned barcodes immediately lock in stadium gate database.</p>
            <p>· Backed by KickPass Kenya Customer Protection & FKF Match Event Sanctioning.</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="p-4 sm:p-6 bg-slate-900/90 rounded-b-2xl border-t border-slate-800 flex justify-end gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Print A4 Ticket</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-500 transition-colors cursor-pointer shadow-md"
          >
            <Download className="h-4 w-4" />
            <span>Download Ticket PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
};
