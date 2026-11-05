import { MatchEvent, Team, TicketCategory, Booking } from '../types';

export const initialTeams: Record<string, Team> = {
  bayern: {
    id: 'team-bayern',
    name: 'FC Bayern Munich',
    shortName: 'BAYERN',
    country: 'Germany',
    foundedYear: 1900,
    crestUrl: '/src/assets/teams/bayern.svg',
    primaryColor: '#DC052D',
    secondaryColor: '#0066B2',
    squadHighlights: ['UEFA Champions League Winners (6x)', 'German Bundesliga Giants', 'Record-Breaking Treble Winners']
  },
  ajax: {
    id: 'team-ajax',
    name: 'AFC Ajax Amsterdam',
    shortName: 'AJAX',
    country: 'Netherlands',
    foundedYear: 1900,
    crestUrl: '/src/assets/teams/ajax.svg',
    primaryColor: '#D2122E',
    secondaryColor: '#FFFFFF',
    squadHighlights: ['European Champions (4x)', 'Legendary Total Football Heritage', 'World-Class Youth Academy']
  }
};

export const initialEvent: MatchEvent = {
  id: 'event-bayern-ajax-nairobi',
  title: 'Bayern Munich vs Ajax Amsterdam – Kenya Football Spectacle',
  slug: 'bayern-munich-vs-ajax-amsterdam-kenya-2027',
  homeTeam: initialTeams.bayern,
  awayTeam: initialTeams.ajax,
  eventDate: '2027-01-05T17:15:00.000Z', // 8:15 PM EAT on Tuesday, 5 January 2027 (exactly 61 days from 5 Nov 2026)
  kickoffTime: '8:15 PM (Kenyan time)',
  gatesOpenTime: '11:00 AM (Kenyan time)',
  venueName: 'Raila Odinga International Stadium (Talanta Stadium)',
  venueCity: 'Nairobi',
  venueCountry: 'Kenya',
  stadiumCapacity: 60000,
  status: 'CONFIRMED',
  isFlagship: true,
  disclaimerText: 'CONFIRMED EVENT: Scheduled for Tuesday, 5 January 2027 at the new Raila Odinga International Stadium (Talanta Stadium), Nairobi. Gates open early at 11:00 AM with kickoff at 8:15 PM Kenyan time. All ticket purchases protected by KickPass Kenya Guarantee.',
  bannerImageUrl: '/src/assets/images/hero_football_stadium_1793884336463.jpg',
  description: 'European champions clash in Nairobi! FC Bayern Munich take on AFC Ajax Amsterdam on Tuesday, 5 January 2027 at the state-of-the-art 60,000-seater Raila Odinga International Stadium (Talanta Stadium) along Ngong Road. Experience unforgettable matchday intensity under the stadium floodlights.',
  rulesAndEntry: [
    'Every attendee must present a valid, scannable KickPass QR electronic ticket (mobile screen or printed A4 page).',
    'Original National ID or Passport is required for verification at security turnstiles.',
    'Stadium gates open at 11:00 AM Kenyan time. Turnstiles close strictly 30 minutes before the 8:15 PM kickoff.',
    'No weapons, pyrotechnics, glassware, or unauthorized commercial recording equipment permitted.',
    'Dedicated accessibility ramps and family hospitality bays are located at Gate D.'
  ]
};

export const initialCategories: TicketCategory[] = [
  {
    id: 'cat-vvip',
    eventId: 'event-bayern-ajax-nairobi',
    name: 'VVIP Presidential Hospitality',
    code: 'VVIP',
    priceKes: 25000,
    totalQuota: 500,
    availableQuota: 388,
    reservedQuota: 12,
    gateDesignation: 'Gate A (Presidential Pavilion)',
    seatingArea: 'Presidential Suites & Tier 1 Center Box',
    description: 'The premier luxury football hospitality experience at Raila Odinga Stadium. Elevated midfield vantage point with luxury padded seating and elite networking.',
    perks: [
      'Private valet parking with secure VIP badge',
      '5-course gourmet banquet & executive bar',
      'Pre-match player tunnel observation lounge',
      'Exclusive commemorative collectors match kit & scarf',
      'Post-match press conference gallery access'
    ],
    isActive: true,
    sortOrder: 1,
    colorHex: '#EAB308' // Gold
  },
  {
    id: 'cat-vip',
    eventId: 'event-bayern-ajax-nairobi',
    name: 'VIP Main Stand',
    code: 'VIP',
    priceKes: 12500,
    totalQuota: 2500,
    availableQuota: 1840,
    reservedQuota: 45,
    gateDesignation: 'Gate B (Executive West Stand)',
    seatingArea: 'Main Grandstand Lower Tier (Halfway Line)',
    description: 'Prime central halfway-line view. High-comfort padded seating with dedicated executive bar and expedited security turnstiles.',
    perks: [
      'Halfway line center grandstand sightlines',
      'Access to exclusive VIP indoor lounge & refreshments',
      'Dedicated express security entry lanes (Gate B)',
      'Complimentary official matchday glossy programme'
    ],
    isActive: true,
    sortOrder: 2,
    colorHex: '#EF4444' // Red
  },
  {
    id: 'cat-premium',
    eventId: 'event-bayern-ajax-nairobi',
    name: 'Premium Lower Bowl',
    code: 'PREMIUM',
    priceKes: 5500,
    totalQuota: 10000,
    availableQuota: 7820,
    reservedQuota: 120,
    gateDesignation: 'Gate C & E (East & West Lower)',
    seatingArea: 'Lower Deck Covered Stand (Rows 10-30)',
    description: 'Intense pitch-side perspective allowing you to feel every pass, tackle, and strike. Covered lower deck with great stadium acoustics.',
    perks: [
      'Pitch-level view of player action and bench tactics',
      'Fully sheltered seating against rain/sun',
      'Rapid concourse beverage and food kiosks',
      'Souvenir lanyard match pass'
    ],
    isActive: true,
    sortOrder: 3,
    colorHex: '#3B82F6' // Blue
  },
  {
    id: 'cat-regular',
    eventId: 'event-bayern-ajax-nairobi',
    name: 'Regular Upper Tier',
    code: 'REGULAR',
    priceKes: 2500,
    totalQuota: 22000,
    availableQuota: 16950,
    reservedQuota: 200,
    gateDesignation: 'Gate D & F (Upper Concourse)',
    seatingArea: 'Upper Bowl Elevated Grandstand',
    description: 'Commanding tactical overview of the entire pitch. Watch defensive formations and attacks unfold from great panoramic height.',
    perks: [
      'Panoramic 360-degree stadium atmosphere view',
      'Designated seat zone allocation',
      'Multiple food concourses and restroom banks'
    ],
    isActive: true,
    sortOrder: 4,
    colorHex: '#06B6D4' // Cyan
  },
  {
    id: 'cat-general',
    eventId: 'event-bayern-ajax-nairobi',
    name: 'General Admission (Curva Nets)',
    code: 'GENERAL',
    priceKes: 1000,
    totalQuota: 25000,
    availableQuota: 19400,
    reservedQuota: 350,
    gateDesignation: 'Gate G & H (North & South Curves)',
    seatingArea: 'Behind Goal Terraces (North & South Ends)',
    description: 'The roaring heartbeat of Raila Odinga Stadium. Stand shoulder-to-shoulder with thousands of passionate fans chanting throughout the 90 minutes.',
    perks: [
      'Unmatched chanting fan ultras atmosphere',
      'Direct view into goal nets and penalty boxes',
      'Budget-friendly entry for students & youth clubs'
    ],
    isActive: true,
    sortOrder: 5,
    colorHex: '#10B981' // Green
  }
];

export const sampleBookings: Booking[] = [
  {
    id: 'bkg-demo-001',
    bookingReference: 'KP-NAI-78921',
    eventId: 'event-bayern-ajax-nairobi',
    customerName: 'Brian Kipchoge',
    customerEmail: 'brian.k@gmail.com',
    customerPhone: '0712345678',
    customerIdNumber: '32984102',
    totalTickets: 2,
    subtotalKes: 25000,
    serviceFeeKes: 0,
    totalAmountKes: 25000,
    bookingStatus: 'CONFIRMED',
    paymentStatus: 'PAID',
    paymentMethod: 'MPESA_STK_PUSH',
    mpesaReceiptNumber: 'QL89X4M29P',
    items: [
      {
        categoryId: 'cat-vip',
        categoryName: 'VIP Main Stand',
        quantity: 2,
        unitPriceKes: 12500,
        subtotalKes: 25000
      }
    ],
    createdAt: '2026-11-04T14:32:00.000Z'
  }
];
