// Vercel Serverless Function: /api/categories
export default function handler(_req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({
    success: true,
    data: [
      {
        id: 'cat-vvip',
        eventId: 'event-ajax-bayern-nairobi',
        name: 'VVIP Presidential Hospitality',
        code: 'VVIP',
        priceKes: 25000,
        totalQuota: 500,
        availableQuota: 388,
        reservedQuota: 12,
        gateDesignation: 'Gate A (Presidential Pavilion)',
        seatingArea: 'Presidential Suites & Tier 1 Center Box',
        description: 'The premier luxury football hospitality experience.',
        perks: ['Private valet parking', '5-course banquet', 'Tunnel club access'],
        isActive: true,
        sortOrder: 1,
        colorHex: '#EAB308'
      },
      {
        id: 'cat-vip',
        eventId: 'event-ajax-bayern-nairobi',
        name: 'VIP Main Stand',
        code: 'VIP',
        priceKes: 12500,
        totalQuota: 2500,
        availableQuota: 1840,
        reservedQuota: 45,
        gateDesignation: 'Gate B (Executive West Stand)',
        seatingArea: 'Main Grandstand Lower Tier',
        description: 'Prime central halfway-line view with lounge access.',
        perks: ['Halfway line view', 'Lounge access', 'Express gate entry'],
        isActive: true,
        sortOrder: 2,
        colorHex: '#EF4444'
      },
      {
        id: 'cat-premium',
        eventId: 'event-ajax-bayern-nairobi',
        name: 'Premium Lower Bowl',
        code: 'PREMIUM',
        priceKes: 5500,
        totalQuota: 10000,
        availableQuota: 7820,
        reservedQuota: 120,
        gateDesignation: 'Gate C & E',
        seatingArea: 'Lower Deck Covered Stand',
        description: 'Intense pitch-side perspective.',
        perks: ['Pitch-level view', 'Covered seating', 'Rapid kiosks'],
        isActive: true,
        sortOrder: 3,
        colorHex: '#3B82F6'
      },
      {
        id: 'cat-regular',
        eventId: 'event-ajax-bayern-nairobi',
        name: 'Regular Upper Tier',
        code: 'REGULAR',
        priceKes: 2500,
        totalQuota: 22000,
        availableQuota: 16950,
        reservedQuota: 200,
        gateDesignation: 'Gate D & F',
        seatingArea: 'Upper Bowl Grandstand',
        description: 'Commanding tactical panoramic overview.',
        perks: ['Panoramic stadium view', 'Concourse access'],
        isActive: true,
        sortOrder: 4,
        colorHex: '#06B6D4'
      },
      {
        id: 'cat-general',
        eventId: 'event-ajax-bayern-nairobi',
        name: 'General Admission (Curva Nets)',
        code: 'GENERAL',
        priceKes: 1000,
        totalQuota: 25000,
        availableQuota: 19400,
        reservedQuota: 350,
        gateDesignation: 'Gate G & H',
        seatingArea: 'Behind Goal Terraces',
        description: 'The roaring heartbeat of the stadium.',
        perks: ['Behind-the-goal action', 'Ultras atmosphere'],
        isActive: true,
        sortOrder: 5,
        colorHex: '#10B981'
      }
    ]
  });
}
