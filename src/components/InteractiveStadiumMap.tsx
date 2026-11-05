import React, { useState } from 'react';
import { TicketCategory } from '../types';
import { Eye, Check, ChevronRight } from 'lucide-react';

interface InteractiveStadiumMapProps {
  categories: TicketCategory[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

export const InteractiveStadiumMap: React.FC<InteractiveStadiumMapProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  const activeCategory = categories.find(c => c.id === (hoveredZone || selectedCategoryId)) || categories[0];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Raila Odinga International Stadium (Talanta Stadium) Interactive Seating Map</span>
          </h3>
          <p className="text-xs text-slate-400">
            Click on any stadium stand or section below to preview sightlines, gate entrances, and select tickets.
          </p>
        </div>
        
        {/* Tier Legend Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {categories.map((cat) => {
            const isSelected = cat.id === selectedCategoryId;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all ${
                  isSelected
                    ? 'border-white bg-slate-800 text-white shadow'
                    : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: cat.colorHex || '#3B82F6' }}
                />
                <span>{cat.code}</span>
                <span className="font-mono text-slate-400 text-[11px]">KES {cat.priceKes.toLocaleString()}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* SVG Stadium Map Canvas */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="relative w-full max-w-[540px] aspect-square">
            <svg
              viewBox="0 0 600 600"
              className="w-full h-full drop-shadow-2xl select-none"
            >
              <defs>
                <radialGradient id="pitchGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#15803d" />
                  <stop offset="100%" stop-color="#166534" />
                </radialGradient>
                <filter id="zoneGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#ffffff" flood-opacity="0.4" />
                </filter>
              </defs>

              {/* Outer Stadium Concrete Oval Perimeter */}
              <ellipse cx="300" cy="300" rx="285" ry="260" fill="#0f172a" stroke="#1e293b" stroke-width="4" />
              <ellipse cx="300" cy="300" rx="270" ry="245" fill="#1e293b" stroke="#334155" stroke-width="2" />

              {/* ZONE 1: Regular Upper Tier (Outer Perimeter Ring) */}
              <ellipse
                cx="300"
                cy="300"
                rx="250"
                ry="225"
                fill={selectedCategoryId === 'cat-regular' || hoveredZone === 'cat-regular' ? '#06b6d4' : '#0891b2'}
                fillOpacity={selectedCategoryId === 'cat-regular' || hoveredZone === 'cat-regular' ? '0.85' : '0.4'}
                stroke="#06b6d4"
                strokeWidth={selectedCategoryId === 'cat-regular' ? 4 : 1.5}
                className="cursor-pointer transition-all duration-200 hover:fill-opacity-80"
                onClick={() => onSelectCategory('cat-regular')}
                onMouseEnter={() => setHoveredZone('cat-regular')}
                onMouseLeave={() => setHoveredZone(null)}
              />

              {/* ZONE 2: North & South General Admission Curves (Behind the goals) */}
              {/* North Curve */}
              <path
                d="M 120 180 Q 300 80 480 180 L 440 210 Q 300 130 160 210 Z"
                fill={selectedCategoryId === 'cat-general' || hoveredZone === 'cat-general' ? '#10b981' : '#059669'}
                fillOpacity={selectedCategoryId === 'cat-general' || hoveredZone === 'cat-general' ? '0.9' : '0.5'}
                stroke="#10b981"
                strokeWidth={selectedCategoryId === 'cat-general' ? 3 : 1}
                className="cursor-pointer transition-all duration-200"
                onClick={() => onSelectCategory('cat-general')}
                onMouseEnter={() => setHoveredZone('cat-general')}
                onMouseLeave={() => setHoveredZone(null)}
              />
              {/* South Curve */}
              <path
                d="M 120 420 Q 300 520 480 420 L 440 390 Q 300 470 160 390 Z"
                fill={selectedCategoryId === 'cat-general' || hoveredZone === 'cat-general' ? '#10b981' : '#059669'}
                fillOpacity={selectedCategoryId === 'cat-general' || hoveredZone === 'cat-general' ? '0.9' : '0.5'}
                stroke="#10b981"
                strokeWidth={selectedCategoryId === 'cat-general' ? 3 : 1}
                className="cursor-pointer transition-all duration-200"
                onClick={() => onSelectCategory('cat-general')}
                onMouseEnter={() => setHoveredZone('cat-general')}
                onMouseLeave={() => setHoveredZone(null)}
              />

              {/* ZONE 3: Premium Lower Bowl (East & West Lower Decks) */}
              {/* East Stand (Right) */}
              <path
                d="M 440 215 Q 490 300 440 385 L 390 365 Q 430 300 390 235 Z"
                fill={selectedCategoryId === 'cat-premium' || hoveredZone === 'cat-premium' ? '#3b82f6' : '#2563eb'}
                fillOpacity={selectedCategoryId === 'cat-premium' || hoveredZone === 'cat-premium' ? '0.9' : '0.5'}
                stroke="#3b82f6"
                strokeWidth={selectedCategoryId === 'cat-premium' ? 3 : 1}
                className="cursor-pointer transition-all duration-200"
                onClick={() => onSelectCategory('cat-premium')}
                onMouseEnter={() => setHoveredZone('cat-premium')}
                onMouseLeave={() => setHoveredZone(null)}
              />
              {/* West Stand Lower Deck (Left) */}
              <path
                d="M 160 215 Q 110 300 160 385 L 210 365 Q 170 300 210 235 Z"
                fill={selectedCategoryId === 'cat-premium' || hoveredZone === 'cat-premium' ? '#3b82f6' : '#2563eb'}
                fillOpacity={selectedCategoryId === 'cat-premium' || hoveredZone === 'cat-premium' ? '0.9' : '0.5'}
                stroke="#3b82f6"
                strokeWidth={selectedCategoryId === 'cat-premium' ? 3 : 1}
                className="cursor-pointer transition-all duration-200"
                onClick={() => onSelectCategory('cat-premium')}
                onMouseEnter={() => setHoveredZone('cat-premium')}
                onMouseLeave={() => setHoveredZone(null)}
              />

              {/* ZONE 4: VIP Main Grandstand (West Center Halfway line) */}
              <rect
                x="165"
                y="260"
                width="42"
                height="80"
                rx="6"
                fill={selectedCategoryId === 'cat-vip' || hoveredZone === 'cat-vip' ? '#ef4444' : '#dc2626'}
                fillOpacity={selectedCategoryId === 'cat-vip' || hoveredZone === 'cat-vip' ? '0.95' : '0.6'}
                stroke="#ef4444"
                strokeWidth={selectedCategoryId === 'cat-vip' ? 3 : 1.5}
                className="cursor-pointer transition-all duration-200"
                onClick={() => onSelectCategory('cat-vip')}
                onMouseEnter={() => setHoveredZone('cat-vip')}
                onMouseLeave={() => setHoveredZone(null)}
              />

              {/* ZONE 5: VVIP Presidential Box (Top Center Midfield Suites) */}
              <rect
                x="250"
                y="155"
                width="100"
                height="40"
                rx="6"
                fill={selectedCategoryId === 'cat-vvip' || hoveredZone === 'cat-vvip' ? '#eab308' : '#ca8a04'}
                fillOpacity={selectedCategoryId === 'cat-vvip' || hoveredZone === 'cat-vvip' ? '1' : '0.7'}
                stroke="#fef08a"
                strokeWidth={selectedCategoryId === 'cat-vvip' ? 3 : 1.5}
                className="cursor-pointer transition-all duration-200"
                onClick={() => onSelectCategory('cat-vvip')}
                onMouseEnter={() => setHoveredZone('cat-vvip')}
                onMouseLeave={() => setHoveredZone(null)}
              />

              {/* CENTRAL FOOTBALL PITCH */}
              <rect x="220" y="210" width="160" height="180" rx="4" fill="url(#pitchGrad)" stroke="#ffffff" stroke-width="2" />
              {/* Halfway line */}
              <line x1="220" y1="300" x2="380" y2="300" stroke="#ffffff" stroke-width="1.5" />
              {/* Center Circle */}
              <circle cx="300" cy="300" r="26" fill="none" stroke="#ffffff" stroke-width="1.5" />
              <circle cx="300" cy="300" r="2" fill="#ffffff" />
              {/* North Penalty Box */}
              <rect x="260" y="210" width="80" height="32" fill="none" stroke="#ffffff" stroke-width="1.5" />
              <rect x="280" y="210" width="40" height="14" fill="none" stroke="#ffffff" stroke-width="1.5" />
              {/* South Penalty Box */}
              <rect x="260" y="348" width="80" height="42" fill="none" stroke="#ffffff" stroke-width="1.5" />
              <rect x="280" y="376" width="40" height="14" fill="none" stroke="#ffffff" stroke-width="1.5" />

              {/* Label Text Overlays */}
              <text x="300" y="180" font-size="11" font-weight="bold" fill="#000000" text-anchor="middle">VVIP ROYAL BOX</text>
              <text x="186" y="305" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle" transform="rotate(-90 186 305)">VIP MAIN</text>
              <text x="300" y="145" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">NORTH CURVA</text>
              <text x="300" y="465" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">SOUTH CURVA</text>
              <text x="418" y="305" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle" transform="rotate(90 418 305)">EAST LOWER</text>
            </svg>
          </div>
        </div>

        {/* Selected Category Details Card */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded"
                style={{
                  backgroundColor: `${activeCategory.colorHex}20`,
                  color: activeCategory.colorHex || '#3b82f6',
                  border: `1px solid ${activeCategory.colorHex}40`
                }}
              >
                {activeCategory.code} · {activeCategory.gateDesignation}
              </span>
              <span className="text-xs text-emerald-400 font-semibold">
                {activeCategory.availableQuota.toLocaleString()} tickets remaining
              </span>
            </div>

            <h4 className="text-2xl font-bold text-white mb-1">
              {activeCategory.name}
            </h4>
            <div className="text-2xl font-black text-white font-mono mb-4">
              KES {activeCategory.priceKes.toLocaleString()}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {activeCategory.description}
            </p>

            <div className="border-t border-slate-800 pt-3 mb-5">
              <div className="text-xs font-semibold text-slate-400 mb-2">Category Inclusions:</div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeCategory.perks.map((perk, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => onSelectCategory(activeCategory.id)}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-500 transition-colors cursor-pointer"
            >
              <span>Book {activeCategory.name}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
