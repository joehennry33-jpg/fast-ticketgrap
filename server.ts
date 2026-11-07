import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { initialEvent, initialCategories, sampleBookings } from './src/data/initialData.ts';
import { MatchEvent, TicketCategory, Booking, Ticket, TicketVerificationResult } from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database Store for State Persistence during runtime
let eventData: MatchEvent = { ...initialEvent };
let categoriesData: TicketCategory[] = initialCategories.map(c => ({ ...c }));
let bookingsData: Booking[] = [...sampleBookings];

// Generate initial tickets for sample booking
let ticketsData: Ticket[] = [
  {
    id: 'tkt-demo-001',
    ticketNumber: 'TKT-2026-AJXBYN-7741',
    bookingId: 'bkg-demo-001',
    categoryId: 'cat-vip',
    categoryName: 'VIP Main Stand',
    eventId: 'event-ajax-bayern-nairobi',
    eventTitle: initialEvent.title,
    attendeeName: 'Brian Kipchoge',
    attendeePhone: '0712345678',
    attendeeIdNumber: '32984102',
    seatIdentifier: 'Main Stand Tier 1, Row 14, Seat 42',
    gateEntrance: 'Gate B (Executive West Stand)',
    qrCodeSignature: JSON.stringify({
      tkt: 'TKT-2026-AJXBYN-7741',
      evt: 'event-ajax-bayern-nairobi',
      cat: 'VIP Main Stand',
      name: 'Brian Kipchoge',
      gate: 'Gate B',
      seat: 'Row 14, Seat 42'
    }),
    securityHash: 'sha256-vip-brian-7741-auth-valid',
    status: 'ISSUED',
    priceKes: 12500,
    eventDate: initialEvent.eventDate,
    venueName: initialEvent.venueName,
    createdAt: new Date().toISOString()
  },
  {
    id: 'tkt-demo-002',
    ticketNumber: 'TKT-2026-AJXBYN-7742',
    bookingId: 'bkg-demo-001',
    categoryId: 'cat-vip',
    categoryName: 'VIP Main Stand',
    eventId: 'event-ajax-bayern-nairobi',
    eventTitle: initialEvent.title,
    attendeeName: 'Grace Kipchoge',
    attendeePhone: '0712345678',
    attendeeIdNumber: '34821093',
    seatIdentifier: 'Main Stand Tier 1, Row 14, Seat 43',
    gateEntrance: 'Gate B (Executive West Stand)',
    qrCodeSignature: JSON.stringify({
      tkt: 'TKT-2026-AJXBYN-7742',
      evt: 'event-ajax-bayern-nairobi',
      cat: 'VIP Main Stand',
      name: 'Grace Kipchoge',
      gate: 'Gate B',
      seat: 'Row 14, Seat 43'
    }),
    securityHash: 'sha256-vip-grace-7742-auth-valid',
    status: 'CHECKED_IN',
    checkedInAt: '2026-11-04T15:20:00.000Z',
    checkedInGate: 'Gate B Turnstile 2',
    priceKes: 12500,
    eventDate: initialEvent.eventDate,
    venueName: initialEvent.venueName,
    createdAt: new Date().toISOString()
  }
];

// Attach sample tickets to sample booking
bookingsData[0].tickets = ticketsData;

// Verification log
let verificationLogs: any[] = [
  {
    id: 'log-001',
    ticketNumber: 'TKT-2026-AJXBYN-7742',
    attendeeName: 'Grace Kipchoge',
    category: 'VIP Main Stand',
    gate: 'Gate B Turnstile 2',
    verifiedAt: '2026-11-04T15:20:00.000Z',
    result: 'SUCCESS_FIRST_ENTRY',
    verifiedBy: 'Security Steward 04'
  }
];

// ==========================================
// REST API ROUTES
// ==========================================

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    system: 'KickPass Kenya Match Ticketing Engine',
    timestamp: new Date().toISOString()
  });
});

// GET Flagship / Events
app.get('/api/events', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: [eventData]
  });
});

app.get('/api/events/:id', (req: Request, res: Response) => {
  if (req.params.id === eventData.id || req.params.id === 'flagship') {
    res.json({ success: true, data: eventData });
  } else {
    res.status(404).json({ success: false, message: 'Event not found' });
  }
});

// Admin update event
app.put('/api/events/:id', (req: Request, res: Response) => {
  const updates = req.body;
  eventData = {
    ...eventData,
    ...updates,
    homeTeam: updates.homeTeam || eventData.homeTeam,
    awayTeam: updates.awayTeam || eventData.awayTeam
  };
  res.json({
    success: true,
    message: 'Event configurations updated successfully',
    data: eventData
  });
});

// GET Ticket Categories with live inventory
app.get('/api/categories', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: categoriesData
  });
});

// Admin update category price/quota
app.put('/api/categories/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const index = categoriesData.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  categoriesData[index] = {
    ...categoriesData[index],
    ...updates
  };

  res.json({
    success: true,
    message: 'Category updated successfully',
    data: categoriesData[index]
  });
});

// Create Booking
app.post('/api/bookings', (req: Request, res: Response) => {
  const { customerName, customerEmail, customerPhone, customerIdNumber, items } = req.body;

  if (!customerName || !customerEmail || !customerPhone || !items || !items.length) {
    return res.status(400).json({
      success: false,
      message: 'Missing required customer or ticket information'
    });
  }

  // Check inventory
  let subtotalKes = 0;
  let totalTickets = 0;
  const enrichedItems = [];

  for (const item of items) {
    const category = categoriesData.find(c => c.id === item.categoryId);
    if (!category) {
      return res.status(400).json({ success: false, message: `Category ${item.categoryId} not found` });
    }
    if (category.availableQuota < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient ticket quota for ${category.name}. Only ${category.availableQuota} remaining.`
      });
    }

    const itemSubtotal = category.priceKes * item.quantity;
    subtotalKes += itemSubtotal;
    totalTickets += item.quantity;

    enrichedItems.push({
      categoryId: category.id,
      categoryName: category.name,
      quantity: item.quantity,
      unitPriceKes: category.priceKes,
      subtotalKes: itemSubtotal
    });
  }

  const bookingRef = `KP-NAI-${Math.floor(10000 + Math.random() * 90000)}`;
  const newBooking: Booking = {
    id: `bkg-${crypto.randomUUID()}`,
    bookingReference: bookingRef,
    eventId: eventData.id,
    customerName,
    customerEmail,
    customerPhone,
    customerIdNumber: customerIdNumber || 'N/A',
    totalTickets,
    subtotalKes,
    serviceFeeKes: 0,
    totalAmountKes: subtotalKes,
    bookingStatus: 'PAYMENT_PENDING',
    paymentStatus: 'UNPAID',
    items: enrichedItems,
    createdAt: new Date().toISOString()
  };

  bookingsData.unshift(newBooking);

  res.status(201).json({
    success: true,
    message: 'Booking initiated successfully. Please complete payment.',
    data: newBooking
  });
});

// Fortpesa Transaction Memory Store
interface FortpesaTxRecord {
  uuid: string;
  bookingReference: string;
  phone: string;
  amount: number;
  channel_id: number;
  status: 'pending' | 'processing' | 'success' | 'failed' | 'cancelled' | 'expired';
  receipt_number?: string;
  result_description?: string;
  createdAt: string;
  updatedAt: string;
  isSimulated?: boolean;
}

let fortpesaTransactions: FortpesaTxRecord[] = [];

function formatKenyanPhone(phone: string): string {
  let clean = (phone || '').replace(/[^0-9]/g, '');
  if (clean.startsWith('0') && clean.length === 10) {
    clean = '254' + clean.slice(1);
  } else if ((clean.startsWith('7') || clean.startsWith('1')) && clean.length === 9) {
    clean = '254' + clean;
  }
  return clean;
}

// ==========================================
// FORTPESA M-PESA GATEWAY ROUTES (https://fortpesa.co.ke/skill)
// ==========================================

// 1. FORTPESA STK PUSH INITIATION
app.post('/api/payments/fortpesa/stk', async (req: Request, res: Response) => {
  try {
    const { bookingReference, phoneNumber, amountKes, description } = req.body;
    if (!phoneNumber || !bookingReference) {
      return res.status(400).json({ success: false, message: 'Phone number and booking reference are required.' });
    }

    const phone = formatKenyanPhone(phoneNumber);
    if (!phone || phone.length !== 12 || !phone.startsWith('254')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone format. Please enter a valid 10-digit Kenyan phone number (e.g. 0712345678).'
      });
    }

    const amount = Math.max(1, Math.round(Number(amountKes) || 1000));
    const channelId = Number(process.env.FORTPESA_CHANNEL_ID || 42);
    const accountRef = String(bookingReference || 'KP-NAI-001').replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
    const desc = String(description || 'AjaxBayern').replace(/[^a-zA-Z0-9]/g, '').slice(0, 13);
    const apiKey = process.env.FORTPESA_API_KEY;

    // Live Fortpesa API call if live key is present
    if (apiKey && apiKey.startsWith('pb_live_')) {
      const idempotencyKey = `idemp-${bookingReference}-${Date.now()}`;
      const fortpesaRes = await fetch('https://fortpesa.co.ke/api/v1/payments/stk', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey
        },
        body: JSON.stringify({
          amount,
          phone,
          channel_id: channelId,
          account_reference: accountRef,
          description: desc
        })
      });

      const responseText = await fortpesaRes.text();
      let responseData: any = {};
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        responseData = { message: responseText };
      }

      if (!fortpesaRes.ok) {
        const errorMsg = responseData?.message || responseData?.error || `Fortpesa error (HTTP ${fortpesaRes.status})`;
        return res.status(fortpesaRes.status).json({
          success: false,
          message: errorMsg,
          details: responseData
        });
      }

      const tx = responseData.data || responseData;
      fortpesaTransactions.unshift({
        uuid: tx.uuid,
        bookingReference,
        phone,
        amount,
        channel_id: channelId,
        status: tx.status || 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isSimulated: false
      });

      return res.status(201).json({
        success: true,
        message: `M-PESA prompt initiated via Fortpesa. Check your phone (${phone}).`,
        data: tx
      });
    }

    // Graceful Sandbox simulation mode for local dev & testing
    const simUuid = `fp-sim-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const simTx: FortpesaTxRecord = {
      uuid: simUuid,
      bookingReference,
      phone,
      amount,
      channel_id: channelId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isSimulated: true
    };
    fortpesaTransactions.unshift(simTx);

    // Auto-advance simulated transaction after 7 seconds
    setTimeout(() => {
      const found = fortpesaTransactions.find(t => t.uuid === simUuid);
      if (found && found.status === 'pending') {
        found.status = 'success';
        found.receipt_number = `MP${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(10000000 + Math.random() * 90000000)}`;
        found.result_description = 'The service request is processed successfully.';
        found.updatedAt = new Date().toISOString();
      }
    }, 7000);

    return res.status(201).json({
      success: true,
      message: `Fortpesa M-PESA STK push sent. Please enter your PIN on phone (${phone}).`,
      data: {
        uuid: simUuid,
        status: 'pending',
        amount,
        phone,
        account_reference: accountRef,
        isSimulated: true
      }
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err?.message || 'Error communicating with Fortpesa gateway.'
    });
  }
});

// 2. FORTPESA STATUS POLLING
app.get('/api/payments/fortpesa/status/:uuid', async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;
    const apiKey = process.env.FORTPESA_API_KEY;

    if (apiKey && apiKey.startsWith('pb_live_') && !uuid.startsWith('fp-sim-')) {
      const fortpesaRes = await fetch(`https://fortpesa.co.ke/api/v1/transactions/${uuid}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      const data = await fortpesaRes.json();
      return res.json(data);
    }

    const found = fortpesaTransactions.find(t => t.uuid === uuid);
    if (!found) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    return res.json({
      success: true,
      data: {
        uuid: found.uuid,
        status: found.status,
        amount: found.amount,
        phone: found.phone,
        receipt_number: found.receipt_number,
        result_description: found.result_description || 'Pending PIN confirmation',
        isSimulated: found.isSimulated
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err?.message || 'Status query failed' });
  }
});

// 3. FORTPESA WALLET BALANCE
app.get('/api/payments/fortpesa/wallet', async (_req: Request, res: Response) => {
  try {
    const apiKey = process.env.FORTPESA_API_KEY;
    if (apiKey && apiKey.startsWith('pb_live_')) {
      const fortpesaRes = await fetch('https://fortpesa.co.ke/api/v1/wallet/balance', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      const data = await fortpesaRes.json();
      return res.json(data);
    }

    return res.json({
      success: true,
      data: {
        balance: 4850,
        currency: 'KES',
        channel_id: Number(process.env.FORTPESA_CHANNEL_ID || 42),
        isConfigured: false,
        message: 'Sandbox / Demo Wallet'
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err?.message || 'Wallet check failed' });
  }
});

// 4. FORTPESA WEBHOOK
app.post('/api/payments/fortpesa-webhook', (req: Request, res: Response) => {
  const signature = req.headers['x-fortpesa-signature'] as string;
  const timestamp = req.headers['x-fortpesa-timestamp'] as string;
  const secret = process.env.FORTPESA_WEBHOOK_SECRET;

  const payload = req.body;
  const tx = payload?.data;

  if (secret && signature && timestamp) {
    const hmac = crypto.createHmac('sha256', secret);
    const expected = hmac.update(`${timestamp}.${JSON.stringify(payload)}`).digest('hex');
    if (expected !== signature) {
      return res.status(401).json({ success: false, message: 'Invalid signature' });
    }
  }

  if (tx && tx.uuid) {
    const existing = fortpesaTransactions.find(t => t.uuid === tx.uuid);
    if (existing) {
      existing.status = tx.status;
      existing.receipt_number = tx.receipt_number;
      existing.updatedAt = new Date().toISOString();
    }
  }

  return res.status(200).json({ success: true, message: 'Webhook received' });
});

// Safaricom Legacy Direct STK Push
app.post('/api/payments/stk-push', (req: Request, res: Response) => {
  const { bookingReference, phoneNumber, amountKes } = req.body;

  if (!phoneNumber || !bookingReference) {
    return res.status(400).json({ success: false, message: 'Phone number and booking reference required' });
  }

  const checkoutRequestId = `ws_CO_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
  const merchantRequestId = `${Math.floor(1000000 + Math.random() * 9000000)}`;

  res.json({
    success: true,
    MerchantRequestID: merchantRequestId,
    CheckoutRequestID: checkoutRequestId,
    ResponseCode: "0",
    ResponseDescription: "Success. Request accepted for processing",
    CustomerMessage: `Success. An STK PIN prompt of KES ${amountKes} has been sent to ${phoneNumber}. Please enter your M-PESA PIN to authorize.`
  });
});

// Verify & Settle Payment + Generate Electronic Tickets with QR
app.post('/api/payments/verify', (req: Request, res: Response) => {
  const { bookingReference, paymentMethod, mpesaPhone, cardLastFour } = req.body;

  const booking = bookingsData.find(b => b.bookingReference === bookingReference);
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking reference not found' });
  }

  if (booking.paymentStatus === 'PAID') {
    return res.json({
      success: true,
      message: 'Payment already confirmed for this booking',
      data: booking
    });
  }

  // Generate Receipt
  const receiptNumber = paymentMethod === 'CARD_PAYMENT'
    ? `CARD-${Date.now().toString().slice(-6)}`
    : `MP-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(1000000 + Math.random() * 9000000)}`;

  booking.paymentStatus = 'PAID';
  booking.bookingStatus = 'CONFIRMED';
  booking.paymentMethod = paymentMethod || 'MPESA_STK_PUSH';
  booking.mpesaReceiptNumber = receiptNumber;

  // Deduct quota & Generate Electronic Tickets
  const generatedTickets: Ticket[] = [];

  for (const item of booking.items) {
    const category = categoriesData.find(c => c.id === item.categoryId);
    if (category) {
      category.availableQuota = Math.max(0, category.availableQuota - item.quantity);
      category.reservedQuota = (category.reservedQuota || 0) + item.quantity;
    }

    for (let i = 1; i <= item.quantity; i++) {
      const ticketNum = `TKT-2026-AJXBYN-${Math.floor(1000 + Math.random() * 9000)}`;
      const seatId = `${item.categoryName} - Section ${String.fromCharCode(65 + (i % 6))}, Row ${Math.floor(1 + Math.random() * 25)}, Seat ${Math.floor(1 + Math.random() * 50)}`;
      
      const payload = {
        tkt: ticketNum,
        evt: eventData.title,
        venue: eventData.venueName,
        cat: item.categoryName,
        name: booking.customerName,
        gate: category?.gateDesignation || 'Gate B',
        seat: seatId,
        ref: booking.bookingReference,
        receipt: receiptNumber
      };

      const securityHash = crypto.createHash('sha256').update(JSON.stringify(payload) + 'KICKPASS_SECRET_KEY_2026').digest('hex');

      const ticket: Ticket = {
        id: `tkt-${crypto.randomUUID()}`,
        ticketNumber: ticketNum,
        bookingId: booking.id,
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        eventId: eventData.id,
        eventTitle: eventData.title,
        attendeeName: `${booking.customerName} ${item.quantity > 1 ? `(Guest ${i})` : ''}`.trim(),
        attendeePhone: booking.customerPhone,
        attendeeIdNumber: booking.customerIdNumber,
        seatIdentifier: seatId,
        gateEntrance: category?.gateDesignation || 'Gate B',
        qrCodeSignature: JSON.stringify(payload),
        securityHash,
        status: 'ISSUED',
        priceKes: item.unitPriceKes,
        eventDate: eventData.eventDate,
        venueName: eventData.venueName,
        createdAt: new Date().toISOString()
      };

      ticketsData.unshift(ticket);
      generatedTickets.push(ticket);
    }
  }

  booking.tickets = generatedTickets;

  res.json({
    success: true,
    message: 'Payment confirmed and electronic tickets issued!',
    data: booking
  });
});

// GET Booking by Reference
app.get('/api/bookings/:reference', (req: Request, res: Response) => {
  const booking = bookingsData.find(b => b.bookingReference === req.params.reference);
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }
  res.json({ success: true, data: booking });
});

// GET Customer Bookings by Email or Phone
app.get('/api/customer/bookings', (req: Request, res: Response) => {
  const { email, phone } = req.query;
  const filtered = bookingsData.filter(b => {
    if (email && b.customerEmail.toLowerCase() === String(email).toLowerCase()) return true;
    if (phone && b.customerPhone.includes(String(phone))) return true;
    return false;
  });
  res.json({ success: true, data: filtered });
});

// GATE SCANNER API - Ticket Verification & Anti-Duplicate Admission
app.post('/api/tickets/verify', (req: Request, res: Response) => {
  const { query, gate } = req.body; // query can be ticket number or JSON QR payload string

  if (!query) {
    return res.status(400).json({ success: false, message: 'Ticket identifier or QR code data is required' });
  }

  let ticketNum = String(query).trim();
  try {
    const parsed = JSON.parse(ticketNum);
    if (parsed.tkt) {
      ticketNum = parsed.tkt;
    }
  } catch (e) {
    // query is plain text ticket number
  }

  const ticket = ticketsData.find(t => t.ticketNumber.toUpperCase() === ticketNum.toUpperCase());

  if (!ticket) {
    const result: TicketVerificationResult = {
      valid: false,
      message: `INVALID TICKET: Ticket "${ticketNum}" was not found in the official registry. Access denied.`,
      scannedAt: new Date().toISOString(),
      gate: gate || 'Gate Turnstile 1',
      code: 'DENIED_NOT_FOUND'
    };
    return res.status(404).json({ success: false, data: result });
  }

  if (ticket.status === 'CHECKED_IN') {
    const result: TicketVerificationResult = {
      valid: false,
      ticket,
      message: `ALERT - DUPLICATE ENTRY DENIED! This ticket was ALREADY SCANNED at ${ticket.checkedInAt ? new Date(ticket.checkedInAt).toLocaleTimeString() : 'earlier'} at ${ticket.checkedInGate || 'Gate Turnstile'}. Duplication attempt flagged.`,
      scannedAt: new Date().toISOString(),
      gate: gate || 'Gate Turnstile',
      code: 'DENIED_DUPLICATE_ENTRY'
    };
    return res.status(409).json({ success: false, data: result });
  }

  if (ticket.status === 'REVOKED' || ticket.status === 'CANCELLED') {
    const result: TicketVerificationResult = {
      valid: false,
      ticket,
      message: `ACCESS DENIED: Ticket ${ticket.ticketNumber} has been revoked or cancelled by organizers.`,
      scannedAt: new Date().toISOString(),
      gate: gate || 'Gate Turnstile',
      code: 'DENIED_REVOKED'
    };
    return res.status(403).json({ success: false, data: result });
  }

  // Mark as checked in
  ticket.status = 'CHECKED_IN';
  ticket.checkedInAt = new Date().toISOString();
  ticket.checkedInGate = gate || 'Gate Main Turnstile';

  verificationLogs.unshift({
    id: `log-${Date.now()}`,
    ticketNumber: ticket.ticketNumber,
    attendeeName: ticket.attendeeName,
    category: ticket.categoryName,
    gate: ticket.checkedInGate,
    verifiedAt: ticket.checkedInAt,
    result: 'SUCCESS_FIRST_ENTRY',
    verifiedBy: 'Security Steward Turnstile'
  });

  const result: TicketVerificationResult = {
    valid: true,
    ticket,
    message: `ENTRY GRANTED! Welcome to Talanta Stadium, ${ticket.attendeeName}. Category: ${ticket.categoryName}. Entrance: ${ticket.gateEntrance}.`,
    scannedAt: ticket.checkedInAt || new Date().toISOString(),
    gate: ticket.checkedInGate || gate || 'Gate Main Turnstile',
    code: 'SUCCESS_FIRST_ENTRY'
  };

  res.json({ success: true, data: result });
});

// Admin Stats Endpoint
app.get('/api/admin/stats', (_req: Request, res: Response) => {
  const totalRevenue = bookingsData
    .filter(b => b.paymentStatus === 'PAID')
    .reduce((acc, b) => acc + b.totalAmountKes, 0);

  const totalTicketsSold = bookingsData
    .filter(b => b.paymentStatus === 'PAID')
    .reduce((acc, b) => acc + b.totalTickets, 0);

  const totalCheckIns = ticketsData.filter(t => t.status === 'CHECKED_IN').length;

  res.json({
    success: true,
    data: {
      totalRevenueKes: totalRevenue,
      totalTicketsSold,
      totalCapacity: eventData.stadiumCapacity,
      occupancyPercentage: ((totalTicketsSold / eventData.stadiumCapacity) * 100).toFixed(1),
      totalCheckIns,
      totalBookings: bookingsData.length,
      confirmedBookings: bookingsData.filter(b => b.paymentStatus === 'PAID').length,
      categories: categoriesData,
      recentBookings: bookingsData.slice(0, 50).map(b => ({
        ...b,
        customerName: 'Protected Spectator',
        customerEmail: 'protected@anonymized.local',
        customerPhone: '***-***-****',
        customerIdNumber: '********'
      })),
      recentLogs: verificationLogs.slice(0, 10),
      fortpesaGateway: {
        isConfigured: !!(process.env.FORTPESA_API_KEY && process.env.FORTPESA_API_KEY.startsWith('pb_live_')),
        channelId: Number(process.env.FORTPESA_CHANNEL_ID || 42),
        recentTransactions: fortpesaTransactions.slice(0, 20)
      }
    }
  });
});

// Reset / Seed helper
app.post('/api/admin/reset-data', (_req: Request, res: Response) => {
  eventData = { ...initialEvent };
  categoriesData = initialCategories.map(c => ({ ...c }));
  bookingsData = [...sampleBookings];
  res.json({ success: true, message: 'Platform demo data reset to default successfully' });
});

// ==========================================
// VITE DEV MIDDLEWARE / STATIC PRODUCTION
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`⚽ KickPass Kenya Platform Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
