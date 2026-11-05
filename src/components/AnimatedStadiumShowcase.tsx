import React, { useState, useEffect } from 'react';
import { Camera, Eye, MapPin, Sparkles, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface AnimatedStadiumShowcaseProps {
  className?: string;
  showDetails?: boolean;
}

export const AnimatedStadiumShowcase: React.FC<AnimatedStadiumShowcaseProps> = ({
  className = '',
  showDetails = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const stadiumSlides = [
    {
      id: 'aerial-exterior',
      src: '/src/assets/images/talanta_stadium_exterior_1793884338380.jpg',
      label: 'Aerial Architectural Exterior',
      title: 'Raila Odinga International Stadium · Aerial Twilight View',
      description: 'The iconic aerodynamic shield roof inspired by Kenyan athletic heritage along Ngong Road, Nairobi.',
      stat: '60,000 All-Seater Capacity'
    },
    {
      id: 'interior-pitch',
      src: '/src/assets/images/talanta_stadium_interior_1793884339280.jpg',
      label: 'Main Pitch & Grandstand Bowl',
      title: 'Spectator Seating & Hybrid Grass Pitch',
      description: 'FIFA Category 4 reinforced hybrid natural turf pitch with unobstructed 360° grandstand sightlines.',
      stat: 'Hybrid Reinforced Turf Pitch'
    },
    {
      id: 'vvip-hospitality',
      src: '/src/assets/images/stadium_vip_hospitality_1793884338239.jpg',
      label: 'VVIP Presidential Hospitality',
      title: 'Climate-Controlled Executive Hospitality Suites',
      description: 'Floor-to-ceiling panoramic pitch glass windows, 5-course gourmet dining, and private tunnel club access.',
      stat: 'Four VIP Hospitality Tiers'
    },
    {
      id: 'matchday-atmosphere',
      src: '/src/assets/images/hero_football_stadium_1793884336463.jpg',
      label: 'Matchday Floodlight Atmosphere',
      title: 'High-Intensity Night Match Lighting',
      description: 'State-of-the-art 2,400 Lux broadcast-ready LED floodlight towers for optimal evening kickoff clarity.',
      stat: '2,400 Lux LED Floodlights'
    }
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % stadiumSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPlaying, stadiumSlides.length]);

  const currentSlide = stadiumSlides[currentIndex];

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl ${className}`}>
      
      {/* Animated Image Container with Ken Burns effect */}
      <div className="relative aspect-video sm:aspect-21/9 w-full overflow-hidden bg-slate-950">
        {stadiumSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.src}
              alt={slide.title}
              className={`h-full w-full object-cover transition-transform duration-7000 ease-linear ${
                index === currentIndex ? 'scale-105' : 'scale-100'
              }`}
              referrerPolicy="no-referrer"
            />
            {/* Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.15)_0%,transparent_75%)]" />
          </div>
        ))}

        {/* Live Badge & Camera Perspective Indicator */}
        <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-red-600/90 px-3 py-1 text-[11px] font-bold text-white shadow backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-white animate-ping" />
            <span>LIVE VENUE MONITOR</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[11px] font-semibold text-slate-200 backdrop-blur-sm">
            <Camera className="h-3.5 w-3.5 text-amber-400" />
            <span>Camera {currentIndex + 1}/4 · {currentSlide.label}</span>
          </div>
        </div>

        {/* Play/Pause & Navigation Controls */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 text-slate-300 hover:text-white backdrop-blur-sm border border-white/10"
            title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + stadiumSlides.length) % stadiumSlides.length)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 text-slate-300 hover:text-white backdrop-blur-sm border border-white/10"
            title="Previous perspective"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % stadiumSlides.length)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 text-slate-300 hover:text-white backdrop-blur-sm border border-white/10"
            title="Next perspective"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Bottom Banner Information */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 mb-1">
              <MapPin className="h-3.5 w-3.5 text-red-500" />
              <span>Raila Odinga International Stadium (Talanta Stadium) · Nairobi</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white leading-tight drop-shadow-md">
              {currentSlide.title}
            </h3>
            {showDetails && (
              <p className="hidden sm:block text-xs text-slate-300 mt-1 leading-relaxed">
                {currentSlide.description}
              </p>
            )}
          </div>

          {/* Quick Perspective Selector Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {stadiumSlides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentIndex(idx)}
                className={`flex h-8 px-2.5 items-center justify-center rounded-lg text-[10px] font-bold transition-all backdrop-blur-sm cursor-pointer ${
                  idx === currentIndex
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 border border-red-500'
                    : 'bg-black/60 text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                0{idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
