// Vercel Serverless Function: /api/events
export default function handler(_req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({
    success: true,
    data: [
      {
        id: 'event-bayern-ajax-nairobi',
        title: 'Bayern Munich vs Ajax Amsterdam – Kenya Football Spectacle',
        slug: 'bayern-munich-vs-ajax-amsterdam-kenya-2027',
        homeTeam: {
          id: 'team-bayern',
          name: 'FC Bayern Munich',
          shortName: 'BAYERN',
          country: 'Germany',
          crestUrl: '/teams/bayern.svg'
        },
        awayTeam: {
          id: 'team-ajax',
          name: 'AFC Ajax Amsterdam',
          shortName: 'AJAX',
          country: 'Netherlands',
          crestUrl: '/teams/ajax.svg'
        },
        eventDate: '2027-01-05T17:15:00.000Z',
        kickoffTime: '8:15 PM (Kenyan time)',
        gatesOpenTime: '11:00 AM (Kenyan time)',
        venueName: 'Raila Odinga International Stadium (Talanta Stadium)',
        venueCity: 'Nairobi',
        venueCountry: 'Kenya',
        stadiumCapacity: 60000,
        status: 'CONFIRMED',
        isFlagship: true,
        disclaimerText: 'CONFIRMED EVENT: Scheduled for Tuesday, 5 January 2027 at the new Raila Odinga International Stadium (Talanta Stadium), Nairobi. Gates open early at 11:00 AM with kickoff at 8:15 PM Kenyan time. All ticket purchases protected by KickPass Kenya Guarantee.',
        rulesAndEntry: [
          'Every attendee must present a valid, scannable KickPass QR electronic ticket.',
          'Original National ID or Passport is required for verification at security turnstiles.',
          'Stadium gates open at 11:00 AM Kenyan time. Kick-off is scheduled for 8:15 PM Kenyan time.'
        ]
      }
    ]
  });
}
