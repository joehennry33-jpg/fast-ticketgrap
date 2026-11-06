import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Download, Printer, ShieldCheck, MapPin, Calendar, CheckCircle2, Loader2, FileText, Image as ImageIcon } from 'lucide-react';
import { Ticket } from '../types';
import { TeamCrest } from './TeamCrest';

interface ElectronicTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
}

export const ElectronicTicketModal: React.FC<ElectronicTicketModalProps> = ({ isOpen, onClose, ticket }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ticket) {
      QRCode.toDataURL(
        ticket.qrCodeSignature || ticket.ticketNumber,
        {
          width: 300,
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

  const formattedDate = new Date(ticket.eventDate).toLocaleDateString('en-KE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Direct High-Resolution Graphic Ticket Download (.PNG)
  const handleDownloadImage = () => {
    if (!ticket) return;
    setIsDownloading(true);

    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 680;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsDownloading(false);
      return;
    }

    // Background Dark Slate / Navy Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 680);
    bgGrad.addColorStop(0, '#070b16');
    bgGrad.addColorStop(0.5, '#0b132b');
    bgGrad.addColorStop(1, '#111827');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 680);

    // Red & Gold Outer Border
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 6;
    ctx.strokeRect(16, 16, 1168, 648);

    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(26, 26, 1148, 628);

    // Perforated Stub Divider Line at X = 830
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(830, 30);
    ctx.lineTo(830, 650);
    ctx.stroke();
    ctx.setLineDash([]);

    // Header Zone
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.roundRect(50, 48, 44, 44, 8);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('KP', 58, 80);

    ctx.font = '800 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('KICKPASS KENYA', 108, 72);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('OFFICIAL DIGITAL MATCH PASS · RAILA ODINGA INTERNATIONAL STADIUM', 108, 92);

    // Match Showdown Title
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 34px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('FC BAYERN MUNICH vs AFC AJAX', 50, 150);

    // Event Date & Venue
    ctx.fillStyle = '#ef4444';
    ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`DATE: ${formattedDate.toUpperCase()} · KICKOFF 8:15 PM EAT`, 50, 185);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`VENUE: ${ticket.venueName}, Nairobi (Gates open 11:00 AM)`, 50, 212);

    // Category Box
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(50, 235, 740, 60, 10);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#eab308';
    ctx.font = '800 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(ticket.categoryName.toUpperCase(), 70, 272);

    // Dedicated Full-Width Seat Allocation Banner (NEVER overlaps with QR code)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(50, 310, 740, 75, 12);
    ctx.fill();
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Red left accent indicator
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.roundRect(52, 312, 8, 71, 4);
    ctx.fill();

    ctx.fillStyle = '#f87171';
    ctx.font = '700 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('RESERVED SEAT ALLOCATION & SECTION:', 75, 335);

    ctx.fillStyle = '#ffffff';
    // Dynamically scale font if seat string is long to prevent crossing divider line
    const seatFontSize = ticket.seatIdentifier.length > 35 ? 17 : 21;
    ctx.font = `800 ${seatFontSize}px monospace`;
    ctx.fillText(ticket.seatIdentifier, 75, 365);

    // Attendee & Gate Entrance Info
    ctx.fillStyle = '#64748b';
    ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('TICKET HOLDER:', 50, 415);
    ctx.fillText('DESIGNATED ENTRANCE GATE:', 430, 415);

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 19px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(ticket.attendeeName, 50, 442);

    ctx.fillStyle = '#10b981';
    ctx.font = '800 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(ticket.gateEntrance, 430, 442);

    // Serial & Security Status
    ctx.fillStyle = '#64748b';
    ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('SERIAL NUMBER:', 50, 485);
    ctx.fillText('SECURITY STATUS:', 430, 485);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '700 17px monospace';
    ctx.fillText(ticket.ticketNumber, 50, 510);

    ctx.fillStyle = '#34d399';
    ctx.font = '700 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('ISSUED & VERIFIED · 100% AUTHENTIC', 430, 510);

    // Terms / Watermark at bottom
    ctx.fillStyle = '#475569';
    ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('1. National ID / Passport required at turnstile security.', 50, 560);
    ctx.fillText('2. QR code is single-entry. Duplicate scans trigger instant turnstile denial.', 50, 580);
    ctx.fillText(`3. Cryptographic Signature: ${ticket.securityHash.slice(0, 42)}...`, 50, 600);

    // Right Stub: Isolated QR Code & Turnstile Scanner Area
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('TURNSTILE SCANNER', 870, 75);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('HOLD PASS TO OPTICAL READER', 870, 95);

    // Draw QR code image on right stub
    const qrImg = new Image();
    qrImg.onload = () => {
      // White container for QR on stub
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(870, 115, 260, 260, 16);
      ctx.fill();

      // Centered QR image inside container
      ctx.drawImage(qrImg, 885, 130, 230, 230);

      // Dedicated Seat summary box on right stub underneath QR
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(870, 395, 260, 85, 10);
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('STUB SEAT ALLOCATION:', 885, 418);

      ctx.fillStyle = '#ffffff';
      const stubSeatText = ticket.seatIdentifier.length > 25 ? ticket.seatIdentifier.slice(0, 25) + '...' : ticket.seatIdentifier;
      ctx.font = '800 13px monospace';
      ctx.fillText(stubSeatText, 885, 440);

      ctx.fillStyle = '#10b981';
      ctx.font = '700 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(ticket.gateEntrance, 885, 463);

      // Ticket ID on stub
      ctx.fillStyle = '#ef4444';
      ctx.font = '800 15px monospace';
      ctx.fillText(ticket.ticketNumber, 870, 510);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Raila Odinga Stadium Nairobi', 870, 535);

      // Convert canvas to download link
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `KickPass_Ticket_${ticket.ticketNumber}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          setIsDownloading(false);
          setDownloadSuccess(true);
          setTimeout(() => setDownloadSuccess(false), 3000);
        }
      }, 'image/png');
    };

    qrImg.src = qrDataUrl || '';
  };

  // Direct Printable PDF / HTML Document Download
  const handleDownloadDocument = () => {
    if (!ticket) return;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>KickPass Kenya - Ticket ${ticket.ticketNumber}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0b132b; color: #fff; margin: 0; padding: 40px; }
    .ticket-card { max-width: 800px; margin: 0 auto; background: #070b16; border: 2px solid #dc2626; border-radius: 16px; padding: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; padding-bottom: 20px; margin-bottom: 24px; }
    .brand { font-size: 22px; font-weight: 900; color: #fff; }
    .badge { color: #10b981; font-weight: bold; font-size: 13px; }
    .match-title { font-size: 28px; font-weight: 900; margin: 12px 0 6px; }
    .meta { font-size: 14px; color: #94a3b8; line-height: 1.6; }
    .seat-banner { background: #0f172a; border: 2px solid #dc2626; border-radius: 12px; padding: 16px 20px; margin: 20px 0; }
    .seat-label { font-size: 11px; font-weight: bold; text-transform: uppercase; color: #f87171; letter-spacing: 1px; }
    .seat-val { font-size: 20px; font-weight: 900; color: #fff; font-family: monospace; margin-top: 4px; }
    .category-box { background: #1e293b; border-radius: 12px; padding: 16px 20px; margin-bottom: 20px; border: 1px solid #334155; }
    .cat-name { font-size: 18px; font-weight: 800; color: #eab308; }
    .gate { font-size: 14px; color: #10b981; font-weight: bold; margin-top: 4px; }
    .grid { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; margin-bottom: 24px; }
    .details-col { flex: 1; }
    .qr-container { text-align: center; background: #fff; padding: 16px; border-radius: 12px; display: inline-block; shrink: 0; }
    .qr-container img { width: 190px; height: 190px; }
    .qr-subtext { color: #000; font-weight: bold; font-family: monospace; font-size: 14px; margin-top: 8px; }
    .footer { border-top: 1px solid #1e293b; padding-top: 16px; font-size: 11px; color: #64748b; line-height: 1.5; }
    @media print { body { background: #fff; color: #000; padding: 0; } .ticket-card { border-color: #000; box-shadow: none; color: #000; } }
  </style>
</head>
<body>
  <div class="ticket-card">
    <div class="header">
      <div class="brand">KICKPASS KENYA</div>
      <div class="badge">OFFICIAL ELECTRONIC TICKET · ${ticket.status}</div>
    </div>
    <div class="match-title">${ticket.eventTitle}</div>
    <div class="meta">
      <strong>Date:</strong> ${formattedDate} · Kickoff: 8:15 PM EAT<br>
      <strong>Venue:</strong> ${ticket.venueName}, Nairobi (Gates Open: 11:00 AM)
    </div>

    <!-- Dedicated Full-Width Seat Banner -->
    <div class="seat-banner">
      <div class="seat-label">Reserved Seat Allocation</div>
      <div class="seat-val">${ticket.seatIdentifier}</div>
    </div>

    <div class="category-box">
      <div class="cat-name">${ticket.categoryName}</div>
      <div class="gate">Designated Entrance: ${ticket.gateEntrance}</div>
    </div>

    <div class="grid">
      <div class="details-col">
        <p><strong>Ticket Holder:</strong><br>${ticket.attendeeName}</p>
        <p><strong>Serial Number:</strong><br><span style="font-family: monospace; color: #38bdf8;">${ticket.ticketNumber}</span></p>
        <p><strong>Security Hash:</strong><br><span style="font-family: monospace; font-size: 10px; color: #94a3b8;">${ticket.securityHash}</span></p>
      </div>
      <div class="qr-container">
        <img src="${qrDataUrl}" alt="Ticket QR">
        <div class="qr-subtext">${ticket.ticketNumber}</div>
      </div>
    </div>
    <div class="footer">
      1. Every attendee must present this authentic electronic ticket (digital on smartphone or printed).<br>
      2. Original National ID or Passport required at Raila Odinga International Stadium turnstiles.<br>
      3. QR Code is verified upon first scan. Duplicate entries will be automatically denied.
    </div>
  </div>
  <script>
    window.onload = function() { window.print(); }
  </script>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KickPass_Ticket_${ticket.ticketNumber}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-black/40 text-slate-400 hover:text-white cursor-pointer"
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
          <div className="rounded-xl bg-gradient-to-br from-slate-900 via-slate-900 to-red-950/30 p-5 border border-slate-800 mb-4 relative overflow-hidden">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 p-0.5 rounded-lg bg-white/5 border border-white/10">
                  <TeamCrest teamIdOrName="Bayern" className="h-full w-full object-contain" />
                </div>
                <span className="text-xs font-bold text-white tracking-wide">BAYERN</span>
              </div>
              <div className="text-xs font-black italic text-red-500 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 shadow">
                VS
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-white tracking-wide">AJAX</span>
                <div className="h-10 w-10 p-0.5 rounded-lg bg-white/5 border border-white/10">
                  <TeamCrest teamIdOrName="Ajax" className="h-full w-full object-contain" />
                </div>
              </div>
            </div>

            <h3 className="text-base font-extrabold text-white leading-tight mb-2">
              {ticket.eventTitle}
            </h3>

            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-red-400 shrink-0" />
                <span>{formattedDate} · Kickoff: 8:15 PM EAT</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-red-400 shrink-0" />
                <span>{ticket.venueName}, Nairobi (Gates Open: 11:00 AM)</span>
              </div>
            </div>
          </div>

          {/* DEDICATED PROMINENT SEAT ALLOCATION CARD (Balanced & Distinct from QR Code) */}
          <div className="rounded-xl border border-red-500/40 bg-gradient-to-r from-red-950/50 via-slate-900 to-slate-900 p-4 mb-4 shadow-lg shadow-red-950/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <span>Reserved Seat Allocation & Stand</span>
                </div>
                <div className="text-lg sm:text-xl font-black text-white font-mono mt-0.5 tracking-wide">
                  {ticket.seatIdentifier}
                </div>
              </div>
              <div className="shrink-0 bg-slate-950/80 px-3.5 py-2 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Turnstile Entrance</div>
                <div className="text-xs font-bold text-emerald-400">{ticket.gateEntrance}</div>
              </div>
            </div>
          </div>

          {/* Attendee Details & Category Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 mb-4">
            <div>
              <span className="text-slate-500 block text-[11px]">Category</span>
              <span className="font-bold text-white">{ticket.categoryName}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Ticket Holder</span>
              <span className="font-semibold text-white truncate block">{ticket.attendeeName}</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-slate-500 block text-[11px]">ID / Passport</span>
              <span className="font-mono text-slate-300">{ticket.attendeeIdNumber || 'Verified at Gate'}</span>
            </div>
          </div>

          {/* BALANCED SEPARATE OPTICAL QR CODE SECTION (Never blocks seat details) */}
          <div className="rounded-xl bg-white p-4 text-slate-950 mb-4 shadow-md">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Turnstile Optical Entry Code
                </div>
                <div className="font-mono font-black text-base text-slate-900 tracking-wider my-0.5">
                  {ticket.ticketNumber}
                </div>
                <p className="text-[11px] text-slate-600 max-w-[220px] leading-tight">
                  Hold this high-density barcode to the turnstile optical scanner at {ticket.gateEntrance}.
                </p>
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
          </div>

          {/* Entry Rules & Disclaimers */}
          <div className="text-[10px] text-slate-400 space-y-1 border-t border-slate-800 pt-3">
            <p>· Original National ID or Passport required along with this ticket at turnstile security.</p>
            <p>· Strict zero-tolerance for ticket duplication. Scanned barcodes immediately lock in stadium gate database.</p>
            <p>· Backed by KickPass Kenya Customer Protection & FKF Match Event Sanctioning.</p>
          </div>
        </div>

        {/* Action Controls: Direct Download & Print */}
        <div className="p-4 sm:p-6 bg-slate-900/90 rounded-b-2xl border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            {downloadSuccess && (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> Ticket file downloaded successfully!
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>Print A4</span>
            </button>

            <button
              onClick={handleDownloadDocument}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
            >
              <FileText className="h-4 w-4" />
              <span>Download PDF/HTML</span>
            </button>

            <button
              onClick={handleDownloadImage}
              disabled={isDownloading}
              className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-500 transition-colors cursor-pointer shadow-md disabled:opacity-50"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating Image...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Download Ticket (PNG)</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
