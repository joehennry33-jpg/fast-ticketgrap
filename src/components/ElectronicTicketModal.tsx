import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Download, Printer, ShieldCheck, MapPin, Calendar, CheckCircle2, Loader2, FileText, Image as ImageIcon } from 'lucide-react';
import { Ticket } from '../types';

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
    ctx.roundRect(50, 245, 740, 95, 12);
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#eab308';
    ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(ticket.categoryName.toUpperCase(), 75, 285);

    ctx.fillStyle = '#10b981';
    ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`ENTRANCE: ${ticket.gateEntrance.toUpperCase()}`, 75, 318);

    // Attendee & Seat Info
    ctx.fillStyle = '#64748b';
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('TICKET HOLDER:', 50, 380);
    ctx.fillText('SEAT ALLOCATION:', 430, 380);

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(ticket.attendeeName, 50, 412);
    ctx.fillText(ticket.seatIdentifier, 430, 412);

    // Serial & Security
    ctx.fillStyle = '#64748b';
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('SERIAL NUMBER:', 50, 465);
    ctx.fillText('SECURITY STATUS:', 430, 465);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '700 18px monospace';
    ctx.fillText(ticket.ticketNumber, 50, 495);

    ctx.fillStyle = '#34d399';
    ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('ISSUED & VERIFIED · 100% AUTHENTIC', 430, 495);

    // Terms / Watermark at bottom
    ctx.fillStyle = '#475569';
    ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('1. National ID / Passport required at security turnstiles.', 50, 560);
    ctx.fillText('2. QR code is single-entry. Duplicate scans trigger instant turnstile alarm & denial.', 50, 580);
    ctx.fillText(`3. Cryptographic Signature: ${ticket.securityHash.slice(0, 42)}...`, 50, 600);

    // Right Stub: QR Code & Turnstile Scanner Area
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('TURNSTILE SCANNER', 860, 80);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('HOLD STEADY TO READER', 860, 102);

    // Draw QR code image
    const qrImg = new Image();
    qrImg.onload = () => {
      // White container for QR
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(860, 130, 280, 280, 16);
      ctx.fill();

      ctx.drawImage(qrImg, 875, 145, 250, 250);

      // Ticket ID on stub
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 18px monospace';
      ctx.fillText(ticket.ticketNumber, 870, 450);

      ctx.fillStyle = '#ef4444';
      ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(ticket.categoryName, 870, 480);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Talanta Stadium Nairobi', 870, 505);

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
    .category-box { background: #1e293b; border-radius: 12px; padding: 20px; margin: 24px 0; border: 1px solid #334155; }
    .cat-name { font-size: 20px; font-weight: 800; color: #eab308; }
    .gate { font-size: 14px; color: #10b981; font-weight: bold; margin-top: 4px; }
    .grid { display: flex; justify-content: space-between; margin-bottom: 24px; }
    .qr-container { text-align: center; background: #fff; padding: 16px; border-radius: 12px; display: inline-block; }
    .qr-container img { width: 200px; height: 200px; }
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
      <strong>Date:</strong> ${formattedDate} · Kickoff 17:00 EAT<br>
      <strong>Venue:</strong> ${ticket.venueName}, Nairobi, Kenya (Gates Open 13:00 EAT)
    </div>
    <div class="category-box">
      <div class="cat-name">${ticket.categoryName}</div>
      <div class="gate">Gate Entrance: ${ticket.gateEntrance}</div>
      <div style="font-size: 13px; color: #cbd5e1; margin-top: 4px;">Seat: ${ticket.seatIdentifier}</div>
    </div>
    <div class="grid">
      <div>
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
      2. Original National ID or Passport required at Talanta Stadium turnstiles.<br>
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
