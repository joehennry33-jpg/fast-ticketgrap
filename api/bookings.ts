// Vercel Serverless Function: /api/bookings
export default function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const bookingRef = `KP-NAI-${Math.floor(10000 + Math.random() * 90000)}`;

    const items = body.items || [{ categoryId: 'cat-vip', categoryName: 'VIP Main Stand', quantity: 1, unitPriceKes: 12500, subtotalKes: 12500 }];
    const subtotal = items.reduce((sum: number, it: any) => sum + (it.unitPriceKes * it.quantity || 12500), 0);

    const booking = {
      id: `bkg-${Date.now()}`,
      bookingReference: bookingRef,
      eventId: 'event-ajax-bayern-nairobi',
      customerName: body.customerName || 'Football Fan',
      customerEmail: body.customerEmail || 'fan@kickpass.co.ke',
      customerPhone: body.customerPhone || '0712345678',
      customerIdNumber: body.customerIdNumber || 'N/A',
      totalTickets: items.reduce((sum: number, it: any) => sum + (it.quantity || 1), 0),
      subtotalKes: subtotal,
      serviceFeeKes: 0,
      totalAmountKes: subtotal,
      bookingStatus: 'PAYMENT_PENDING',
      paymentStatus: 'UNPAID',
      items,
      createdAt: new Date().toISOString()
    };

    return res.status(200).json({
      success: true,
      message: 'Booking initiated successfully. Please complete payment.',
      data: booking
    });
  }

  return res.status(200).json({ success: true, message: 'KickPass Bookings API' });
}
