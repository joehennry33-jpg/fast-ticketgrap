# KickPass Kenya - Ajax vs Bayern Munich Football Event Ticketing Platform

A full-stack, secure, production-grade football ticket booking and event management platform targeting football fans in Kenya.

Flagship Event: **AFC Ajax Amsterdam vs FC Bayern Munich – Kenya Football Spectacle**
Proposed Venue: **Talanta Sports City Stadium, Ngong Road, Nairobi, Kenya** (60,000 capacity).

---

## Key Features

1. **Brand Identity & UI/UX**
   - Athletic typography, deep navy/slate design language, and high-resolution official club and stadium assets.
   - Official SVG crests for **AFC Ajax Amsterdam** (with the traditional 11-line hero profile) and **FC Bayern Munich** (with Bavarian blue/white rhomboid center).
   - Authentic architectural and aerial photography of **Talanta Sports City Stadium**.
   - Live kickoff countdown timer.

2. **Interactive Seating Map**
   - Color-coded interactive SVG layout of Talanta Sports City Stadium.
   - Visual highlighting for VVIP Presidential Hospitality, VIP Main Stand, Premium Lower Bowl, Regular Upper Tier, and General Admission Curves.

3. **Kenyan Payment Integration**
   - Safaricom **M-PESA STK Push** simulation with real phone prompt handling and transaction reference.
   - M-PESA manual Paybill alternative (`522522`, Account `KP-REF`).
   - Credit & Debit Card payments with 3D Secure verification.

4. **Electronic Tickets & Gate QR Verification**
   - Dynamic high-density QR code generation using `qrcode` library.
   - Unique serial numbers (e.g., `TKT-2026-AJXBYN-XXXX`) and cryptographic SHA-256 signatures.
   - Dedicated **Turnstile Gate Scanner** tool for matchday stewards that detects and prevents duplicate entry in real time.
   - Printable and downloadable ticket format.

5. **Customer Dashboard**
   - Account login and customer portal.
   - Access to active tickets, QR code downloads, and booking payment receipts.

6. **Administrator Operations Console**
   - Update event title, match date, kickoff time, gates open time, venue, and status.
   - Adjust ticket prices (KES), total quotas, and live inventory.
   - Real-time revenue analytics (Total KES, tickets sold, stadium occupancy %).
   - Export bookings to CSV.

7. **Database Architecture**
   - Complete relational MySQL schema file `database.sql` with foreign keys, indexes, and initial seeds.
   - Step-by-step XAMPP & phpMyAdmin import documentation in `XAMPP_SETUP_GUIDE.md`.

---

## Quick Start (Development)

```bash
# Install dependencies
npm install

# Start development full-stack server (Port 3000)
npm run dev
```

Visit `http://localhost:3000` in your browser.
