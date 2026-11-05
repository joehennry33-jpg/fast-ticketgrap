import React, { useState } from 'react';
import { MapPin, Navigation, Car, Bus, Plane, CheckCircle2, Maximize2, X, Users, Sparkles, Shield } from 'lucide-react';

interface TalantaStadiumSectionProps {
  onSelectCategoryFromMap?: (categoryId: string) => void;
}

export const TalantaStadiumSection: React.FC<TalantaStadiumSectionProps> = ({ onSelectCategoryFromMap }) => {
  const [activePhotoModal, setActivePhotoModal] = useState<string | null>(null);

  const stadiumGallery = [
    {
      id: 'ext-1',
      title: 'Talanta Sports City Stadium - Aerial Architectural Render',
      category: 'Exterior Architecture',
      src: '/src/assets/images/talanta_stadium_exterior_1793884338380.jpg',
      caption: 'Aerial rendering of the 60,000-seat flagship stadium along Ngong Road, Nairobi, highlighting its aerodynamic shield-inspired canopy roof.'
    },
    {
      id: 'int-1',
      title: 'Interior Pitch & Grandstand Spectator Seating',
      category: 'Spectator Bowl',
      src: '/src/assets/images/talanta_stadium_interior_1793884339280.jpg',
      caption: 'Full-bowl sightlines, hybrid reinforced natural grass pitch, and two-tier covered grandstands engineered for optimal acoustic energy.'
    },
    {
      id: 'vip-1',
      title: 'Presidential & Executive Hospitality Lounges',
      category: 'VVIP Experience',
      src: '/src/assets/images/stadium_vip_hospitality_1793884338239.jpg',
      caption: 'Panoramic climate-controlled presidential suites offering pitch views, gourmet catering, and private lounge areas.'
    },
    {
      id: 'action-1',
      title: 'Elite Football Action & Stadium Atmosphere',
      category: 'Matchday Energy',
      src: '/src/assets/images/football_action_match_1793884339014.jpg',
      caption: 'State-of-the-art match floodlights designed to FIFA Category 4 broadcast standards for night match spectacles.'
    }
  ];

  return (
    <section id="talanta-stadium" className="relative border-b border-slate-800 bg-slate-900/40 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-400 mb-2">
            <MapPin className="h-4 w-4 text-red-500" />
            <span>Official Proposed Venue · Nairobi, Kenya</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            THE STAGE IS SET – TALANTA STADIUM
          </h2>
          <p className="mt-4 text-base text-slate-300">
            Purpose-built to anchor Kenya’s sporting future and host AFCON 2027, Talanta Sports City Stadium is an ultra-modern 60,000-seat cathedral of football in the heart of Nairobi.
          </p>
        </div>

        {/* Stadium Architectural Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Main Featured Stadium Exterior Photograph */}
          <div className="lg:col-span-7 group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
            <div className="relative aspect-video w-full overflow-hidden">
              <img
                src="/src/assets/images/talanta_stadium_exterior_1793884338380.jpg"
                alt="Talanta Sports City Stadium Nairobi Aerial Exterior"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <button
                onClick={() => setActivePhotoModal('/src/assets/images/talanta_stadium_exterior_1793884338380.jpg')}
                className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-lg bg-black/60 text-white hover:bg-red-600 transition-colors"
                title="View Full Resolution"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">
                  Aerodynamic Shield Architecture
                </span>
                <h3 className="text-xl font-bold text-white">
                  Exterior Twilight Panorama · Talanta Sports City
                </h3>
              </div>
            </div>
            <div className="p-5 text-sm text-slate-300 leading-relaxed border-t border-slate-800/80">
              Inspired by the traditional Kenyan warrior shield and modern aerodynamic curves, the stadium features a lightweight cantilevered canopy sheltering all 60,000 spectator seats with integrated rainwater harvesting and solar harvesting panels.
            </div>
          </div>

          {/* Key Venue Specifications & Architectural Highlights */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-400" />
                World-Class Venue Specifications
              </h3>
              
              <ul className="space-y-3.5 text-sm">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">60,000 All-Seater Capacity:</strong>
                    <p className="text-slate-400 text-xs">Unobstructed sightlines from every seat; zero pillars or blind spots throughout the bowl.</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Hybrid Natural Turf Pitch:</strong>
                    <p className="text-slate-400 text-xs">Reinforced stitched hybrid grass surface meeting FIFA Category 4 & UEFA Elite standards.</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Four Tiered Hospitality Lounges:</strong>
                    <p className="text-slate-400 text-xs">Includes Presidential Suite, Tunnel Club, Executive Business Boxes, and Premium Lower Tier Lounges.</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Smart Security Turnstiles:</strong>
                    <p className="text-slate-400 text-xs">High-throughput optical QR scanners capable of processing 1,000 spectators per minute across 8 gates.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Stadium Location & Address */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/10 text-red-500 border border-red-500/20">
                  <Navigation className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Venue Address</div>
                  <div className="text-sm font-semibold text-white">Jamhuri Park / Ngong Road Sports Complex</div>
                  <div className="text-xs text-slate-400">Nairobi, Kenya · Coordinates: -1.3032° S, 36.7583° E</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Stadium Photo Gallery Grid */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">Talanta Stadium Official Visual Gallery</h3>
              <p className="text-xs text-slate-400">Click any image to view full high-resolution photographic details.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stadiumGallery.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setActivePhotoModal(photo.src)}
                className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition-all hover:border-red-500/50 hover:shadow-lg"
              >
                <div className="aspect-4/3 overflow-hidden">
                  <img
                    src={photo.src}
                    alt={photo.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-3">
                  <div className="text-[11px] font-semibold text-red-400">{photo.category}</div>
                  <div className="text-xs font-bold text-white truncate">{photo.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Directions & Spectator Transport Information */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Car className="h-5 w-5 text-red-500" />
            Matchday Spectator Transport & Entry Guide
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="flex gap-3">
              <Bus className="h-5 w-5 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-1">From Nairobi CBD & City Center</strong>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Dedicated matchday express shuttle buses operate every 5 minutes from Kencom, Railways Station, and Nyayo National Stadium direct to Talanta Bus Plaza. Commute time: ~20 minutes via Ngong Road bypass.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Plane className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-1">From Jomo Kenyatta Airport (JKIA)</strong>
                <p className="text-xs text-slate-300 leading-relaxed">
                  International fans traveling via JKIA or Wilson Airport can connect via the Southern Bypass in approximately 25-30 minutes directly into the stadium perimeter gates.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-1">Parking & Security Access</strong>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Secure multi-tier parking available with pre-booked parking passes. VVIP & VIP ticketholders enter through Gate A & B. General Admission through Gates G & H with biometric turnstiles.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Full Resolution Photo Modal */}
      {activePhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
          <div className="relative max-w-5xl w-full">
            <button
              onClick={() => setActivePhotoModal(null)}
              className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={activePhotoModal}
              alt="Talanta Stadium Full Size"
              className="max-h-[80vh] w-full rounded-2xl object-contain shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </section>
  );
};
