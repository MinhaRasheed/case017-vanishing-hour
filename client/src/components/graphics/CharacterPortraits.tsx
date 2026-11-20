import React from 'react';

interface PortraitProps {
  id: string;
  size?: number;
  showBadge?: boolean;
  statusBadge?: string;
  className?: string;
}

export const CharacterPortrait: React.FC<PortraitProps> = ({
  id,
  size = 180,
  showBadge = true,
  statusBadge,
  className = ''
}) => {
  const renderSVG = () => {
    switch (id) {
      // 1. Dr. Eleanor Sterling (Chief Physician / Mastermind)
      case 'dr_eleanor_sterling':
        return (
          <svg viewBox="0 0 200 240" width="100%" height="100%">
            <defs>
              <linearGradient id="bgEleanor" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e1b4b" />
                <stop offset="100%" stopColor="#090d16" />
              </linearGradient>
              <linearGradient id="coatGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e2e8f0" />
                <stop offset="50%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>
              <linearGradient id="hairEleanor" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#171717" />
                <stop offset="100%" stopColor="#262626" />
              </linearGradient>
              <filter id="noirGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#38bdf8" floodOpacity="0.25" />
              </filter>
            </defs>
            <rect width="200" height="240" fill="url(#bgEleanor)" rx="8" />
            {/* Background Medical Chart silhouette */}
            <path d="M 20 40 L 60 40 L 70 50 L 180 50 L 180 200 L 20 200 Z" fill="#1e293b" opacity="0.4" />
            <line x1="30" y1="70" x2="170" y2="70" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="30" y1="95" x2="150" y2="95" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
            {/* Shoulder & Physician Lab Coat */}
            <path d="M 30 240 L 40 180 L 70 170 L 100 185 L 130 170 L 160 180 L 170 240 Z" fill="url(#coatGrad)" />
            {/* Dark Turtleneck Under Coat */}
            <path d="M 75 170 L 100 185 L 125 170 L 120 145 L 80 145 Z" fill="#09090b" />
            {/* Neck */}
            <path d="M 85 145 L 115 145 L 115 125 L 85 125 Z" fill="#d4a373" />
            {/* Stethoscope */}
            <path d="M 65 180 C 65 210, 85 225, 100 225 C 115 225, 135 210, 135 180" fill="none" stroke="#0ea5e9" strokeWidth="4" />
            <circle cx="100" cy="225" r="7" fill="#94a3b8" stroke="#38bdf8" strokeWidth="2" />
            {/* Head & Jawline */}
            <path d="M 72 75 C 72 45, 128 45, 128 75 C 128 115, 120 135, 100 138 C 80 135, 72 115, 72 75 Z" fill="#e0a96d" />
            {/* Sleek Dark Hair with Hairpin Chignon */}
            <path d="M 66 70 C 66 35, 134 35, 134 70 C 134 90, 126 80, 124 65 C 115 45, 85 45, 76 65 C 74 80, 66 90, 66 70 Z" fill="url(#hairEleanor)" />
            <circle cx="100" cy="35" r="14" fill="#171717" />
            <line x1="85" y1="35" x2="115" y2="35" stroke="#94a3b8" strokeWidth="2.5" />
            {/* Eyes & Clinical Glasses */}
            <ellipse cx="88" cy="88" rx="6" ry="3.5" fill="#1e293b" />
            <ellipse cx="112" cy="88" rx="6" ry="3.5" fill="#1e293b" />
            <circle cx="89" cy="87" r="1.5" fill="#fff" />
            <circle cx="113" cy="87" r="1.5" fill="#fff" />
            {/* Thin Surgical Wire Spectacles */}
            <rect x="78" y="80" width="20" height="15" rx="3" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
            <rect x="102" y="80" width="20" height="15" rx="3" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="98" y1="87" x2="102" y2="87" stroke="#94a3b8" strokeWidth="1.5" />
            {/* Nose & Cold Red Lips */}
            <path d="M 100 87 L 98 103 L 104 104" fill="none" stroke="#b08968" strokeWidth="1.5" />
            <path d="M 91 118 C 96 116, 104 116, 109 118 C 105 122, 95 122, 91 118 Z" fill="#9f1239" />
            {/* Subtle Dramatic Shadow on right side */}
            <path d="M 100 45 C 130 50, 130 110, 128 135 L 100 138 Z" fill="#000" opacity="0.18" />
          </svg>
        );

      // 2. Gregory Vance (The Superintendent)
      case 'gregory_vance':
        return (
          <svg viewBox="0 0 200 240" width="100%" height="100%">
            <defs>
              <linearGradient id="bgGreg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1c1917" />
                <stop offset="100%" stopColor="#0c0a09" />
              </linearGradient>
              <linearGradient id="shirtGreg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1e3a5f" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>
            <rect width="200" height="240" fill="url(#bgGreg)" rx="8" />
            {/* Background Boiler Pipe Graphics */}
            <path d="M 20 20 L 20 220 M 180 40 L 180 220 M 20 80 L 180 80" stroke="#44403c" strokeWidth="6" opacity="0.3" fill="none" />
            <circle cx="100" cy="80" r="12" fill="#292524" stroke="#44403c" strokeWidth="2" opacity="0.5" />
            {/* Broad Workman Shoulders & Denim Uniform */}
            <path d="M 20 240 L 35 175 L 70 165 L 100 180 L 130 165 L 165 175 L 180 240 Z" fill="url(#shirtGreg)" />
            {/* Grease Smudges on Collar */}
            <circle cx="55" cy="195" r="5" fill="#09090b" opacity="0.6" />
            <ellipse cx="145" cy="205" rx="8" ry="4" fill="#09090b" opacity="0.5" />
            {/* Name Patch */}
            <rect x="45" y="210" width="38" height="14" rx="2" fill="#f59e0b" opacity="0.8" />
            <text x="48" y="221" fill="#000" fontSize="8" fontFamily="monospace" fontWeight="bold">G.VANCE</text>
            {/* Brass Key Ring on Shoulder Lanyard */}
            <circle cx="150" cy="215" r="8" fill="none" stroke="#eab308" strokeWidth="2" />
            <rect x="148" y="222" width="4" height="12" fill="#ca8a04" />
            {/* Sturdy Neck */}
            <path d="M 80 150 L 120 150 L 120 120 L 80 120 Z" fill="#c68b59" />
            {/* Rugged Jaw, 5 o'clock Shadow */}
            <path d="M 68 70 C 68 40, 132 40, 132 70 C 132 110, 126 138, 100 140 C 74 138, 68 110, 68 70 Z" fill="#d49b6a" />
            <path d="M 72 105 C 72 135, 128 135, 128 105 C 128 135, 120 140, 100 140 C 80 140, 72 135, 72 105 Z" fill="#78350f" opacity="0.25" />
            {/* Graying Receding Hair */}
            <path d="M 66 75 C 64 45, 80 32, 100 32 C 120 32, 136 45, 134 75 C 132 55, 124 45, 100 45 C 76 45, 68 55, 66 75 Z" fill="#71717a" />
            {/* Tired Eyes & Wrinkles */}
            <ellipse cx="86" cy="85" rx="5" ry="3" fill="#1c1917" />
            <ellipse cx="114" cy="85" rx="5" ry="3" fill="#1c1917" />
            <path d="M 80 92 C 86 95, 92 95, 94 92" stroke="#a16207" strokeWidth="1" fill="none" opacity="0.6" />
            <path d="M 106 92 C 112 95, 118 95, 120 92" stroke="#a16207" strokeWidth="1" fill="none" opacity="0.6" />
            {/* Heavy Eyebrows */}
            <path d="M 78 78 Q 88 74 95 78" stroke="#52525b" strokeWidth="3.5" fill="none" />
            <path d="M 105 78 Q 112 74 122 78" stroke="#52525b" strokeWidth="3.5" fill="none" />
            {/* Broad Nose & Frown */}
            <path d="M 100 82 L 97 105 L 105 106" fill="none" stroke="#9a3412" strokeWidth="2" />
            <path d="M 90 120 Q 100 115 110 120" stroke="#7c2d12" strokeWidth="2" fill="none" />
          </svg>
        );

      // 3. Corinne Blake (The VP of Asset Allocation)
      case 'corinne_blake':
        return (
          <svg viewBox="0 0 200 240" width="100%" height="100%">
            <defs>
              <linearGradient id="bgCorinne" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2e1065" />
                <stop offset="100%" stopColor="#090514" />
              </linearGradient>
              <linearGradient id="blazer" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1e1b4b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>
            <rect width="200" height="240" fill="url(#bgCorinne)" rx="8" />
            {/* High-Rise Penthouse Window Blinds in Background */}
            <g stroke="#3b0764" strokeWidth="2" opacity="0.4">
              <line x1="20" y1="30" x2="180" y2="30" />
              <line x1="20" y1="50" x2="180" y2="50" />
              <line x1="20" y1="70" x2="180" y2="70" />
              <line x1="20" y1="90" x2="180" y2="90" />
            </g>
            {/* Tailored Silk Shirt & Designer Blazer */}
            <path d="M 25 240 L 40 180 L 75 168 L 100 188 L 125 168 L 160 180 L 175 240 Z" fill="url(#blazer)" stroke="#4338ca" strokeWidth="1" />
            <path d="M 75 168 L 100 205 L 125 168 L 120 148 L 80 148 Z" fill="#f8fafc" />
            {/* Pearl / Diamond Necklace */}
            <path d="M 85 158 Q 100 170 115 158" fill="none" stroke="#e2e8f0" strokeWidth="2.5" strokeDasharray="3 3" />
            {/* Slender Neck & Sharp Jaw */}
            <path d="M 85 148 L 115 148 L 115 120 L 85 120 Z" fill="#fcd34d" opacity="0.85" />
            <path d="M 72 70 C 72 45, 128 45, 128 70 C 128 110, 118 132, 100 135 C 82 132, 72 110, 72 70 Z" fill="#fde68a" />
            {/* Platinum Blonde / Champagne Styled Bob */}
            <path d="M 64 68 C 64 30, 136 30, 136 68 C 136 100, 132 110, 126 112 C 120 70, 80 70, 74 112 C 68 110, 64 100, 64 68 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
            {/* Diamond Earring */}
            <polygon points="66,95 70,98 66,101 62,98" fill="#38bdf8" />
            <polygon points="134,95 138,98 134,101 130,98" fill="#38bdf8" />
            {/* Fierce Cat-Eye Makeup & Piercing Gaze */}
            <path d="M 78 85 Q 88 80 96 85" stroke="#18181b" strokeWidth="2" fill="none" />
            <ellipse cx="88" cy="86" rx="5" ry="3.5" fill="#047857" />
            <circle cx="89" cy="85" r="1.5" fill="#fff" />
            <path d="M 104 85 Q 112 80 122 85" stroke="#18181b" strokeWidth="2" fill="none" />
            <ellipse cx="112" cy="86" rx="5" ry="3.5" fill="#047857" />
            <circle cx="113" cy="85" r="1.5" fill="#fff" />
            {/* High Cheekbone Blush & Signature Red Lips */}
            <ellipse cx="78" cy="98" rx="6" ry="3" fill="#fda4af" opacity="0.5" />
            <ellipse cx="122" cy="98" rx="6" ry="3" fill="#fda4af" opacity="0.5" />
            <path d="M 100 85 L 98 102 L 103 103" fill="none" stroke="#d97706" strokeWidth="1.5" />
            <path d="M 90 116 Q 100 114 110 116 Q 100 124 90 116 Z" fill="#be123c" />
          </svg>
        );

      // 4. Toby Ray (The Neighbor & Acoustic Engineer)
      case 'toby_ray':
        return (
          <svg viewBox="0 0 200 240" width="100%" height="100%">
            <defs>
              <linearGradient id="bgToby" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#064e3b" />
                <stop offset="100%" stopColor="#022c22" />
              </linearGradient>
            </defs>
            <rect width="200" height="240" fill="url(#bgToby)" rx="8" />
            {/* Sound Wave Frequency Graphic in Background */}
            <path d="M 15 80 L 30 60 L 45 100 L 60 40 L 75 120 L 90 50 L 105 110 L 120 60 L 135 100 L 150 40 L 165 90 L 185 70" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.3" />
            {/* Dark Streetwear Hoodie */}
            <path d="M 25 240 L 35 180 L 65 170 L 100 185 L 135 170 L 165 180 L 175 240 Z" fill="#18181b" />
            {/* Drawstrings */}
            <line x1="85" y1="185" x2="85" y2="225" stroke="#71717a" strokeWidth="2" />
            <line x1="115" y1="185" x2="115" y2="225" stroke="#71717a" strokeWidth="2" />
            {/* Large DJ / Studio Headphones resting around neck */}
            <path d="M 50 170 C 50 205, 150 205, 150 170" fill="none" stroke="#27272a" strokeWidth="14" />
            <rect x="42" y="155" width="22" height="32" rx="6" fill="#3f3f46" stroke="#52525b" strokeWidth="2" />
            <rect x="136" y="155" width="22" height="32" rx="6" fill="#3f3f46" stroke="#52525b" strokeWidth="2" />
            {/* Neck */}
            <path d="M 85 145 L 115 145 L 115 120 L 85 120 Z" fill="#fbcfe8" opacity="0.8" />
            {/* Face & Slender Cheekbones */}
            <path d="M 72 70 C 72 45, 128 45, 128 70 C 128 112, 118 135, 100 137 C 82 135, 72 112, 72 70 Z" fill="#fde047" opacity="0.8" />
            {/* Knit Watch Cap / Beanie pulled over ears */}
            <path d="M 68 65 C 68 25, 132 25, 132 65 L 132 72 L 68 72 Z" fill="#15803d" />
            <rect x="66" y="65" width="68" height="12" rx="3" fill="#166534" />
            {/* Messy Brown Bangs peaking out */}
            <path d="M 75 75 Q 85 85 92 78 Q 100 86 112 77 Q 120 85 125 76" stroke="#451a03" strokeWidth="3" fill="none" />
            {/* Wide, Anxious Dark Circles under Eyes */}
            <ellipse cx="86" cy="90" rx="5" ry="4" fill="#0f172a" />
            <ellipse cx="114" cy="90" rx="5" ry="4" fill="#0f172a" />
            <circle cx="87" cy="89" r="1.5" fill="#fff" />
            <circle cx="115" cy="89" r="1.5" fill="#fff" />
            <path d="M 80 97 Q 86 102 92 97" stroke="#6b7280" strokeWidth="1" fill="none" opacity="0.5" />
            <path d="M 108 97 Q 114 102 120 97" stroke="#6b7280" strokeWidth="1" fill="none" opacity="0.5" />
            {/* Nervous Smile / Lip Bite */}
            <path d="M 100 90 L 98 105 L 103 106" fill="none" stroke="#a16207" strokeWidth="1.5" />
            <line x1="93" y1="120" x2="107" y2="118" stroke="#991b1b" strokeWidth="2" />
          </svg>
        );

      // 5. Timothy C. Vance (The Victim)
      case 'timothy_vance':
      default:
        return (
          <svg viewBox="0 0 200 240" width="100%" height="100%">
            <defs>
              <linearGradient id="bgTimothy" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
            </defs>
            <rect width="200" height="240" fill="url(#bgTimothy)" rx="8" />
            {/* Evidence File Grid & Stamp */}
            <path d="M 15 15 L 185 15 L 185 225 L 15 225 Z" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="6 6" />
            {/* Formal Suit & Blue Tie */}
            <path d="M 25 240 L 40 180 L 75 168 L 100 185 L 125 168 L 160 180 L 175 240 Z" fill="#1e293b" />
            <polygon points="100,185 93,240 107,240" fill="#0284c7" />
            <polygon points="95,178 105,178 102,188 98,188" fill="#0369a1" />
            <path d="M 75 168 L 100 185 L 125 168 L 120 148 L 80 148 Z" fill="#ffffff" />
            {/* Neck */}
            <path d="M 85 148 L 115 148 L 115 120 L 85 120 Z" fill="#fde68a" />
            {/* Face */}
            <path d="M 72 70 C 72 45, 128 45, 128 70 C 128 110, 120 134, 100 136 C 80 134, 72 110, 72 70 Z" fill="#fef08a" />
            {/* Neat Side-Parted Hair */}
            <path d="M 68 70 C 68 35, 132 35, 132 70 C 128 48, 100 42, 68 70 Z" fill="#3f2e1e" />
            {/* Rectangular Eyeglasses */}
            <rect x="76" y="80" width="22" height="14" rx="2" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
            <rect x="102" y="80" width="22" height="14" rx="2" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="98" y1="87" x2="102" y2="87" stroke="#94a3b8" strokeWidth="1.5" />
            <ellipse cx="87" cy="87" rx="4" ry="3" fill="#1e293b" />
            <ellipse cx="113" cy="87" rx="4" ry="3" fill="#1e293b" />
            {/* Serious Calm Mouth */}
            <line x1="92" y1="118" x2="108" y2="118" stroke="#78350f" strokeWidth="2" />
            {/* Diagonal "MISSING" forensic ribbon */}
            <g transform="rotate(-25 100 120)">
              <rect x="-20" y="105" width="240" height="30" fill="rgba(225, 29, 72, 0.85)" />
              <text x="100" y="126" fill="#fff" fontSize="16" fontFamily="monospace" fontWeight="900" letterSpacing="6" textAnchor="middle">
                MISSING
              </text>
            </g>
          </svg>
        );
    }
  };

  return (
    <div
      className={`character-portrait-box ${className}`}
      style={{
        width: `${size}px`,
        height: `${size * 1.2}px`,
        position: 'relative',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '2px solid var(--border-strong)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.8)'
      }}
    >
      {renderSVG()}
      {showBadge && statusBadge && (
        <div style={{
          position: 'absolute',
          bottom: 6,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          textAlign: 'center'
        }}>
          <span className="stamp stamp-red" style={{ fontSize: '0.65rem', padding: '2px 6px', display: 'block' }}>
            {statusBadge}
          </span>
        </div>
      )}
    </div>
  );
};
