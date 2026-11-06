import React from 'react';

export const BayernCrest: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg
    viewBox="0 0 200 200"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="FC Bayern München Official Club Crest"
  >
    <defs>
      <pattern id="crestBavarianRauten" width="22" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
        <rect width="22" height="18" fill="#FFFFFF"/>
        <polygon points="0,9 11,0 22,9 11,18" fill="#0066B2"/>
      </pattern>
      <filter id="crestBayernShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.35"/>
      </filter>
    </defs>

    {/* Outer Circle Border */}
    <circle cx="100" cy="100" r="96" fill="#DC052D" stroke="#0066B2" strokeWidth="4" filter="url(#crestBayernShadow)" />
    <circle cx="100" cy="100" r="92" fill="#DC052D" stroke="#FFFFFF" strokeWidth="3" />

    {/* White Ring Band for Text */}
    <circle cx="100" cy="100" r="85" fill="#FFFFFF" />
    <circle cx="100" cy="100" r="62" fill="#DC052D" />

    {/* Inner Bavarian Center Circle */}
    <circle cx="100" cy="100" r="54" fill="url(#crestBavarianRauten)" stroke="#0066B2" strokeWidth="2.5" />

    {/* Top: FC BAYERN */}
    <path id="crestBayernTopArc" d="M 28 100 A 72 72 0 1 1 172 100" fill="none" />
    <text fontFamily="'Plus Jakarta Sans', Arial, sans-serif" fontSize="14.5" fontWeight="900" fill="#DC052D" letterSpacing="2">
      <textPath href="#crestBayernTopArc" startOffset="50%" textAnchor="middle">FC BAYERN</textPath>
    </text>

    {/* Bottom: MÜNCHEN */}
    <path id="crestBayernBottomArc" d="M 172 100 A 72 72 0 0 1 28 100" fill="none" />
    <text fontFamily="'Plus Jakarta Sans', Arial, sans-serif" fontSize="13" fontWeight="900" fill="#0066B2" letterSpacing="2.5">
      <textPath href="#crestBayernBottomArc" startOffset="50%" textAnchor="middle">MÜNCHEN</textPath>
    </text>
    
    {/* Side stars/dividers in the text ring */}
    <circle cx="30" cy="98" r="2.5" fill="#0066B2" />
    <circle cx="170" cy="98" r="2.5" fill="#0066B2" />
  </svg>
);

export const AjaxCrest: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg
    viewBox="0 0 200 200"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="AFC Ajax Amsterdam Official Club Crest"
  >
    <defs>
      <radialGradient id="crestAjaxGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffffff"/>
        <stop offset="100%" stopColor="#f4f4f4"/>
      </radialGradient>
      <filter id="crestAjaxShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
      </filter>
    </defs>

    {/* Outer circular border */}
    <circle cx="100" cy="100" r="95" fill="#FFFFFF" stroke="#D2122E" strokeWidth="6" filter="url(#crestAjaxShadow)" />
    <circle cx="100" cy="100" r="88" fill="none" stroke="#D2122E" strokeWidth="1.5" strokeDasharray="3,2" />

    {/* Central Red Shield / Flag Bar */}
    <path d="M 62 38 L 138 38 C 142 65 140 120 100 162 C 60 120 58 65 62 38 Z" fill="#D2122E" />

    {/* Ajax Warrior Head with 11 lines representing 11 players */}
    <g fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 98 48 C 108 48 116 52 120 58" />
      <path d="M 94 56 C 106 58 118 66 122 76" />
      <path d="M 88 65 C 98 64 114 74 116 88" />
      <path d="M 85 75 L 94 85 L 88 98 L 94 100" />
      <path d="M 92 104 C 95 110 98 114 96 120" />
      <path d="M 93 122 C 90 128 85 130 80 132" />
      <path d="M 102 124 C 108 128 114 130 118 132" />
      <path d="M 116 96 C 122 108 122 118 120 126" />
      <path d="M 104 88 C 108 88 110 92 108 96 C 106 100 102 100 100 96 Z" fill="#FFFFFF" />
      <path d="M 112 60 C 124 64 128 72 130 82" />
      <path d="M 82 82 L 86 86" />
    </g>

    {/* 3 St. Andrew Crosses (XXX) - Amsterdam City Symbol */}
    <g fill="#FFFFFF">
      <path d="M 97 142 L 100 145 L 103 142 L 105 144 L 102 147 L 105 150 L 103 152 L 100 149 L 97 152 L 95 150 L 98 147 L 95 144 Z" />
      <path d="M 87 137 L 90 140 L 93 137 L 95 139 L 92 142 L 95 145 L 93 147 L 90 144 L 87 147 L 85 145 L 88 142 L 85 139 Z" />
      <path d="M 107 137 L 110 140 L 113 137 L 115 139 L 112 142 L 115 145 L 113 147 L 110 144 L 107 147 L 105 145 L 108 142 L 105 139 Z" />
    </g>

    {/* Text: AFC AJAX AMSTERDAM */}
    <path id="crestAjaxTopArc" d="M 28 100 A 72 72 0 1 1 172 100" fill="none" />
    <text fontFamily="'Plus Jakarta Sans', Arial, sans-serif" fontSize="12" fontWeight="800" fill="#D2122E" letterSpacing="2">
      <textPath href="#crestAjaxTopArc" startOffset="50%" textAnchor="middle">AFC AJAX</textPath>
    </text>
    
    <path id="crestAjaxBottomArc" d="M 172 100 A 72 72 0 0 1 28 100" fill="none" />
    <text fontFamily="'Plus Jakarta Sans', Arial, sans-serif" fontSize="10" fontWeight="700" fill="#1E293B" letterSpacing="3">
      <textPath href="#crestAjaxBottomArc" startOffset="50%" textAnchor="middle">AMSTERDAM</textPath>
    </text>
  </svg>
);

export const TeamCrest: React.FC<{
  teamIdOrName: string;
  className?: string;
  imgFallbackUrl?: string;
}> = ({ teamIdOrName, className = 'h-full w-full object-contain', imgFallbackUrl }) => {
  const norm = (teamIdOrName || '').toLowerCase();
  if (norm.includes('bayern') || norm.includes('munich') || norm.includes('münchen')) {
    return <BayernCrest className={className} />;
  }
  if (norm.includes('ajax') || norm.includes('amsterdam')) {
    return <AjaxCrest className={className} />;
  }

  if (imgFallbackUrl) {
    return (
      <img
        src={imgFallbackUrl}
        alt={teamIdOrName}
        className={className}
        onError={(e) => {
          (e.currentTarget as HTMLElement).style.display = 'none';
        }}
      />
    );
  }

  return (
    <div className={`flex items-center justify-center font-bold text-white text-xs ${className}`}>
      {teamIdOrName.slice(0, 3).toUpperCase()}
    </div>
  );
};
