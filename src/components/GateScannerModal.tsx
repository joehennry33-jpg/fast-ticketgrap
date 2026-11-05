import React, { useState } from 'react';
import { X, ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, Scan, Search, Loader2 } from 'lucide-react';
import { TicketVerificationResult } from '../types';
import { api } from '../services/api';

interface GateScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GateScannerModal: React.FC<GateScannerModalProps> = ({ isOpen, onClose }) => {
  const [ticketInput, setTicketInput] = useState('');
  const [selectedGate, setSelectedGate] = useState('Gate B (Executive West Stand)');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<TicketVerificationResult | null>(null);

  if (!isOpen) return null;

  const handleScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketInput.trim()) return;

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const res = await api.verifyTicketGate(ticketInput.trim(), selectedGate);
      setVerificationResult(res);
    } catch (err: any) {
      setVerificationResult({
        valid: false,
        message: err.message || 'System verification error',
        scannedAt: new Date().toISOString(),
        gate: selectedGate,
        code: 'DENIED_NOT_FOUND'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleQuickDemoTest = (sampleCode: string) => {
    setTicketInput(sampleCode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 shadow-2xl p-6 sm:p-8 my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
            <Scan className="h-4 w-4" />
            <span>Talanta Stadium · Turnstile Security Scanner</span>
          </div>
          <h2 className="text-2xl font-black text-white">
            Gate Ticket Scanner & Verification
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Used by matchday stewards and access control turnstiles to validate electronic QR codes and prevent duplicate entry.
          </p>
        </div>

        {/* Gate Selection */}
        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
            Active Turnstile / Gate Checkpoint
          </label>
          <select
            value={selectedGate}
            onChange={(e) => setSelectedGate(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="Gate A (VIP Royal Pavilion Turnstile)">Gate A · VIP Royal Pavilion</option>
            <option value="Gate B (Executive West Stand)">Gate B · Executive West Stand</option>
            <option value="Gate C (East Lower Deck)">Gate C · East Lower Deck</option>
            <option value="Gate D (Family & Accessibility Ramp)">Gate D · Family & Accessibility</option>
            <option value="Gate G (North Goal Ultras Curve)">Gate G · North Goal Ultras</option>
          </select>
        </div>

        {/* Input Form for QR payload or Ticket ID */}
        <form onSubmit={handleScanSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
              Enter Ticket Serial Number or Scan QR Code
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="e.g. TKT-2026-AJXBYN-7741 or paste QR string"
                value={ticketInput}
                onChange={(e) => setTicketInput(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-10 pr-4 py-3 text-sm text-white font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            {/* Quick Demo Pre-fills */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Quick tests:</span>
              <button
                type="button"
                onClick={() => handleQuickDemoTest('TKT-2026-AJXBYN-7741')}
                className="text-[11px] font-mono underline hover:text-emerald-400"
              >
                Sample 1 (Valid)
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => handleQuickDemoTest('TKT-2026-AJXBYN-7742')}
                className="text-[11px] font-mono underline hover:text-red-400"
              >
                Sample 2 (Already Scanned)
              </button>
            </div>

            <button
              type="submit"
              disabled={isVerifying || !ticketInput.trim()}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>Verify Ticket</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* VERIFICATION FEEDBACK DISPLAY */}
        {verificationResult && (
          <div
            className={`rounded-2xl border p-5 transition-all ${
              verificationResult.valid
                ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-200'
                : 'border-red-500/50 bg-red-950/30 text-red-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {verificationResult.valid ? (
                <CheckCircle2 className="h-8 w-8 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert className="h-8 w-8 text-red-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="text-base font-extrabold text-white">
                  {verificationResult.valid ? 'TICKET VALID — ADMISSION GRANTED' : 'ACCESS DENIED'}
                </div>
                <p className="text-xs leading-relaxed text-slate-300">
                  {verificationResult.message}
                </p>
                {verificationResult.ticket && (
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                    <div>
                      <span className="text-slate-500 block">Attendee:</span>
                      <strong className="text-white">{verificationResult.ticket.attendeeName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Category:</span>
                      <strong className="text-white">{verificationResult.ticket.categoryName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Gate Access:</span>
                      <strong className="text-emerald-400">{verificationResult.ticket.gateEntrance}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Seat ID:</span>
                      <span className="font-mono text-white">{verificationResult.ticket.seatIdentifier}</span>
                    </div>
                  </div>
                )}
                <div className="mt-2 text-[10px] text-slate-400 font-mono">
                  Timestamp: {new Date(verificationResult.scannedAt).toLocaleTimeString()} · Turnstile: {verificationResult.gate}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
