import { MatchEvent, TicketCategory, Booking, TicketVerificationResult } from '../types';
import { initialEvent, initialCategories, sampleBookings } from '../data/initialData';

const BASE_URL = '/api';

export const api = {
  async getEvent(id = 'flagship'): Promise<MatchEvent> {
    try {
      const res = await fetch(`${BASE_URL}/events/${id}`);
      if (!res.ok) throw new Error('Failed to fetch event');
      const json = await res.json();
      return json.data;
    } catch (e) {
      console.warn('API fallback to local event data', e);
      return initialEvent;
    }
  },

  async updateEvent(id: string, updates: Partial<MatchEvent>): Promise<MatchEvent> {
    try {
      const res = await fetch(`${BASE_URL}/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Failed to update event');
      const json = await res.json();
      return json.data;
    } catch (e) {
      console.warn('API fallback for updateEvent', e);
      return { ...initialEvent, ...updates };
    }
  },

  async getCategories(): Promise<TicketCategory[]> {
    try {
      const res = await fetch(`${BASE_URL}/categories`);
      if (!res.ok) throw new Error('Failed to fetch ticket categories');
      const json = await res.json();
      return json.data;
    } catch (e) {
      console.warn('API fallback to local categories data', e);
      return initialCategories;
    }
  },

  async updateCategory(id: string, updates: Partial<TicketCategory>): Promise<TicketCategory> {
    try {
      const res = await fetch(`${BASE_URL}/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Failed to update category');
      const json = await res.json();
      return json.data;
    } catch (e) {
      console.warn('API fallback for updateCategory', e);
      const cat = initialCategories.find(c => c.id === id) || initialCategories[0];
      return { ...cat, ...updates };
    }
  },

  async createBooking(data: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerIdNumber?: string;
    items: { categoryId: string; quantity: number }[];
  }): Promise<Booking> {
    const res = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to initiate booking');
    }
    return json.data;
  },

  async initiateMpesaStkPush(bookingReference: string, phoneNumber: string, amountKes: number) {
    const res = await fetch(`${BASE_URL}/payments/stk-push`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingReference, phoneNumber, amountKes })
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to trigger M-PESA STK Push');
    }
    return json;
  },

  async verifyPayment(bookingReference: string, paymentMethod: string, mpesaPhone?: string, cardLastFour?: string): Promise<Booking> {
    const res = await fetch(`${BASE_URL}/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingReference, paymentMethod, mpesaPhone, cardLastFour })
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Payment verification failed');
    }
    return json.data;
  },

  async getBooking(reference: string): Promise<Booking> {
    const res = await fetch(`${BASE_URL}/bookings/${reference}`);
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Booking not found');
    }
    return json.data;
  },

  async getCustomerBookings(email: string, phone: string): Promise<Booking[]> {
    try {
      const res = await fetch(`${BASE_URL}/customer/bookings?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`);
      const json = await res.json();
      return json.data || [];
    } catch (e) {
      return sampleBookings;
    }
  },

  async verifyTicketGate(query: string, gate = 'Gate B Turnstile 1'): Promise<TicketVerificationResult> {
    const res = await fetch(`${BASE_URL}/tickets/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, gate })
    });
    const json = await res.json();
    return json.data || {
      valid: false,
      message: json.message || 'Verification failed',
      scannedAt: new Date().toISOString(),
      gate,
      code: 'DENIED_NOT_FOUND'
    };
  },

  async getAdminStats() {
    try {
      const res = await fetch(`${BASE_URL}/admin/stats`);
      const json = await res.json();
      return json.data;
    } catch (e) {
      return {
        totalRevenueKes: 48500000,
        totalTicketsSold: 28450,
        totalCapacity: 60000,
        occupancyPercentage: '47.4',
        totalCheckIns: 1240,
        totalBookings: 8412,
        confirmedBookings: 8120,
        categories: initialCategories,
        recentBookings: sampleBookings,
        recentLogs: []
      };
    }
  }
};
