// Vercel Serverless Function: /api/events
export default function handler(_req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({
    success: true,
    data: [
      {
        id: 'event-ajax-bayern-nairobi',
        title: 'Ajax Amsterdam vs Bayern Munich – Kenya Football Spectacle',
        slug: 'ajax-amsterdam-vs-bayern-munich-kenya',
        homeTeam: {
          id: 'team-ajax',
          name: 'AFC Ajax Amsterdam',
          shortName: 'AJAX',
          country: 'Netherlands',
          crestUrl: '/src/assets/teams/ajax.svg'
        },
        awayTeam: {
          id: 'team-bayern',
          name: 'FC Bayern Munich',
          shortName: 'BAYERN',
          country: 'Germany',
          crestUrl: '/src/assets/teams/bayern.svg'
        },
        eventDate: '2026-12-12T17:00:00.000Z',
        kickoffTime: '17:00 EAT (Nairobi Time)',
        gatesOpenTime: '13:00 EAT',
        venueName: 'Talanta Sports City Stadium',
        venueCity: 'Nairobi',
        venueCountry: 'Kenya',
        stadiumCapacity: 60000,
        status: 'CONFIRMED',
        isFlagship: true,
        disclaimerText: 'PROPOSED EVENT DATE & VENUE: Subject to final scheduling validation and official authorization by match organizers, Football Kenya Federation (FKF), and participating clubs.',
        rulesAndEntry: [
          'Every attendee must present a valid, scannable KickPass QR electronic ticket.',
          'Original National ID or Passport is required for verification at security turnstiles.',
          'Gates open 4 hours prior to kickoff (13:00 EAT).'
        ]
      }
    ]
  });
}
