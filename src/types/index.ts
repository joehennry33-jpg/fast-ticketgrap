export type EventStatus = 'UPCOMING' | 'CONFIRMED' | 'POSTPONED' | 'CANCELLED' | 'COMPLETED';
export type PaymentStatus = 'UNPAID' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type BookingStatus = 'PENDING' | 'PAYMENT_PENDING' | 'CONFIRMED' | 'CANCELLED';
export type TicketStatus = 'ISSUED' | 'CHECKED_IN' | 'REVOKED' | 'CANCELLED';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  country: string;
  foundedYear: number;
  crestUrl: string;
  primaryColor: string;
  secondaryColor: string;
  squadHighlights?: string[];
}

export interface MatchEvent {
  id: string;
  title: string;
  slug: string;
  homeTeam: Team;
  awayTeam: Team;
  eventDate: string; // ISO date string or formatted date
  kickoffTime: string;
  gatesOpenTime: string;
  venueName: string;
  venueCity: string;
  venueCountry: string;
  stadiumCapacity: number;
  status: EventStatus;
  isFlagship: boolean;
  disclaimerText: string;
  bannerImageUrl: string;
  description: string;
  rulesAndEntry: string[];
}

export interface TicketCategory {
  id: string;
  eventId: string;
  name: string;
  code: string;
  priceKes: number;
  totalQuota: number;
  availableQuota: number;
  reservedQuota: number;
  gateDesignation: string;
  seatingArea: string;
  description: string;
  perks: string[];
  isActive: boolean;
  sortOrder: number;
  colorHex?: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  bookingId: string;
  categoryId: string;
  categoryName: string;
  eventId: string;
  eventTitle: string;
  attendeeName: string;
  attendeePhone?: string;
  attendeeIdNumber?: string;
  seatIdentifier: string;
  gateEntrance: string;
  qrCodeSignature: string;
  securityHash: string;
  status: TicketStatus;
  checkedInAt?: string;
  checkedInGate?: string;
  priceKes: number;
  eventDate: string;
  venueName: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  bookingReference: string;
  eventId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerIdNumber?: string;
  totalTickets: number;
  subtotalKes: number;
  serviceFeeKes: number;
  totalAmountKes: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: 'MPESA_STK_PUSH' | 'MPESA_PAYBILL' | 'CARD_PAYMENT';
  mpesaReceiptNumber?: string;
  items: {
    categoryId: string;
    categoryName: string;
    quantity: number;
    unitPriceKes: number;
    subtotalKes: number;
  }[];
  tickets?: Ticket[];
  createdAt: string;
}

export interface TicketVerificationResult {
  valid: boolean;
  ticket?: Ticket;
  message: string;
  scannedAt: string;
  gate: string;
  code: 'SUCCESS_FIRST_ENTRY' | 'DENIED_DUPLICATE_ENTRY' | 'DENIED_NOT_FOUND' | 'DENIED_REVOKED';
}
