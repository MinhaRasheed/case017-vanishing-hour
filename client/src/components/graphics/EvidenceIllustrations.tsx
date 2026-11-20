import React from 'react';

interface EvidenceGraphicProps {
  id: string;
  size?: number;
}

export const EvidenceGraphic: React.FC<EvidenceGraphicProps> = ({ id, size = 160 }) => {
  const renderSVG = () => {
    switch (id) {
      // 1. Brass deadbolt magnetic scuffs
      case 'ev_door_deadbolt_scuffs':
        return (
          <svg viewBox="0 0 160 160" width="100%" height="100%">
            <circle cx="80" cy="80" r="75" fill="#1e1810" stroke="#ca8a04" strokeWidth="4" />
            <circle cx="80" cy="80" r="45" fill="#a16207" stroke="#eab308" strokeWidth="3" />
            {/* Magnetic drag rotation swirl patterns */}
            <path d="M 50 80 A 30 30 0 0 1 110 80" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="3 3" fill="none" />
            <path d="M 40 80 A 40 40 0 0 1 120 80" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" fill="none" />
            {/* Thumbturn Rectangular Bar */}
            <rect x="72" y="55" width="16" height="50" rx="3" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
            <text x="80" y="145" fill="#facc15" fontSize="9" fontFamily="monospace" textAnchor="middle">
              MAGNETIC SCRATCH WHORLS
            </text>
          </svg>
        );

      // 2. Glencairn whiskey glass with Midazolam
      case 'ev_whiskey_sedative':
        return (
          <svg viewBox="0 0 160 160" width="100%" height="100%">
            <rect width="160" height="160" fill="#0f172a" rx="8" />
            {/* Crystal Glass Silhouette */}
            <path d="M 60 40 C 60 90, 100 90, 100 40 Z" fill="rgba(255,255,255,0.2)" stroke="#e2e8f0" strokeWidth="2" />
            <rect x="76" y="90" width="8" height="30" fill="#94a3b8" />
            <ellipse cx="80" cy="120" rx="25" ry="6" fill="#64748b" />
            {/* Scotch + Midazolam Purple Chemical Reagent */}
            <path d="M 65 65 C 65 85, 95 85, 95 65 Z" fill="#b45309" />
            <circle cx="80" cy="72" r="5" fill="#9333ea" />
            <text x="80" y="145" fill="#c084fc" fontSize="9" fontFamily="monospace" textAnchor="middle">
              REAGENT: 45MG MIDAZOLAM
            </text>
          </svg>
        );

      // 3. ThinkPad Audit Spreadsheet
      case 'ev_audit_spreadsheet':
        return (
          <svg viewBox="0 0 160 160" width="100%" height="100%">
            <rect width="160" height="160" fill="#0369a1" rx="8" />
            <rect x="10" y="10" width="140" height="20" fill="#0c4a6e" />
            <text x="15" y="24" fill="#fff" fontSize="8" fontFamily="monospace" fontWeight="bold">
              AUDIT_OBERLIN_2026.XLSX
            </text>
            {/* Spreadsheet rows */}
            {Array.from({ length: 5 }).map((_, i) => (
              <rect key={i} x="10" y={35 + i * 20} width="140" height="16" fill={i === 2 ? '#ef4444' : '#0284c7'} opacity="0.85" />
            ))}
            <text x="15" y="47" fill="#fff" fontSize="7" fontFamily="monospace">Q3 Discrepancy: $420,000</text>
            <text x="15" y="67" fill="#fff" fontSize="7" fontFamily="monospace">Q4 Transfer: $1,200,000</text>
            <text x="15" y="87" fill="#fef08a" fontSize="8" fontFamily="monospace" fontWeight="bold">
              ! FLAG: DR. STERLING ($2.4M)
            </text>
            <text x="80" y="148" fill="#fef08a" fontSize="9" fontFamily="monospace" textAnchor="middle">
              CONFIDENTIAL EMBEZZLEMENT
            </text>
          </svg>
        );

      // 4. Honeywell Programmed Alarm Timer
      case 'ev_panic_alarm_timer':
        return (
          <svg viewBox="0 0 160 160" width="100%" height="100%">
            <rect width="160" height="160" fill="#18181b" rx="8" stroke="#3f3f46" strokeWidth="2" />
            <rect x="25" y="25" width="110" height="50" fill="#022c22" stroke="#15803d" strokeWidth="2" rx="4" />
            <text x="80" y="55" fill="#4ade80" fontSize="16" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              11:47:00
            </text>
            <text x="80" y="68" fill="#86efac" fontSize="7" fontFamily="monospace" textAnchor="middle">
              [DELAYED DIAGNOSTIC: +6 MIN]
            </text>
            <text x="80" y="115" fill="#ef4444" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              DECOY TIMESTAMP TRIGGER
            </text>
            <text x="80" y="135" fill="#cbd5e1" fontSize="8" fontFamily="sans-serif" textAnchor="middle">
              Programmed at 11:41 PM
            </text>
          </svg>
        );

      // 5. 180-lb Neodymium Magnet
      case 'ev_neodymium_magnet':
        return (
          <svg viewBox="0 0 160 160" width="100%" height="100%">
            <rect width="160" height="160" fill="#0f172a" rx="8" />
            {/* Cylinder Heavy Magnet */}
            <rect x="45" y="45" width="70" height="65" rx="8" fill="#475569" stroke="#94a3b8" strokeWidth="3" />
            <rect x="55" y="55" width="50" height="45" rx="4" fill="#334155" />
            {/* Felt wrap */}
            <rect x="42" y="90" width="76" height="20" fill="#b91c1c" opacity="0.8" rx="2" />
            <text x="80" y="104" fill="#fff" fontSize="8" fontFamily="monospace" textAnchor="middle">FELT PADDING</text>
            {/* Strong Magnetic flux curves */}
            <path d="M 25 75 Q 15 25 80 25 Q 145 25 135 75" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 3" />
            <text x="80" y="145" fill="#f87171" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              180-LB PULL NEODYMIUM
            </text>
          </svg>
        );

      // 6. Midazolam Ampoule Vial
      case 'ev_discarded_ampoule':
        return (
          <svg viewBox="0 0 160 160" width="100%" height="100%">
            <rect width="160" height="160" fill="#090d16" rx="8" />
            {/* Glass Ampoule */}
            <path d="M 75 25 L 85 25 L 83 45 L 90 55 L 90 115 L 70 115 L 70 55 L 77 45 Z" fill="#38bdf8" opacity="0.8" stroke="#fff" strokeWidth="2" />
            <rect x="71" y="65" width="18" height="35" fill="#f8fafc" />
            <text x="80" y="75" fill="#000" fontSize="5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">MIDAZOLAM</text>
            <text x="80" y="85" fill="#b91c1c" fontSize="5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">#MR-8821</text>
            <text x="80" y="94" fill="#000" fontSize="4" fontFamily="monospace" textAnchor="middle">15mg / 3ml</text>
            <text x="80" y="145" fill="#38bdf8" fontSize="9" fontFamily="monospace" textAnchor="middle">
              CLINIC INVENTORY MATCH
            </text>
          </svg>
        );

      // 7. Volvo Parking Ticket
      case 'ev_volvo_ticket':
        return (
          <svg viewBox="0 0 160 160" width="100%" height="100%">
            <rect width="160" height="160" fill="#18181b" rx="8" />
            {/* White/Yellow parking receipt */}
            <rect x="35" y="20" width="90" height="120" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" rx="2" />
            <text x="80" y="40" fill="#000" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              MERIDIAN RESIDENCES
            </text>
            <text x="80" y="52" fill="#713f12" fontSize="7" fontFamily="monospace" textAnchor="middle">
              SUB-GARAGE BAY 06
            </text>
            <line x1="45" y1="60" x2="115" y2="60" stroke="#a16207" strokeWidth="1" />
            <text x="80" y="80" fill="#b91c1c" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              11:15 PM
            </text>
            <text x="80" y="95" fill="#000" fontSize="7" fontFamily="monospace" textAnchor="middle">
              PLATE: NY-882-V9
            </text>
            {/* Barcode */}
            <line x1="45" y1="115" x2="115" y2="115" stroke="#000" strokeWidth="8" strokeDasharray="2 1 4 2 1 3" />
            <text x="80" y="152" fill="#ef4444" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              SHATTERS CORINNE'S ALIBI
            </text>
          </svg>
        );

      // 8. Canvas Laundry Hamper DNA match
      case 'ev_laundry_cart_dna':
        return (
          <svg viewBox="0 0 160 160" width="100%" height="100%">
            <rect width="160" height="160" fill="#0c0a09" rx="8" />
            {/* Industrial Hamper on Wheels */}
            <rect x="35" y="40" width="90" height="60" fill="#78716c" stroke="#a8a29e" strokeWidth="2" rx="3" />
            <circle cx="50" cy="110" r="10" fill="#1c1917" stroke="#78716c" strokeWidth="2" />
            <circle cx="110" cy="110" r="10" fill="#1c1917" stroke="#78716c" strokeWidth="2" />
            {/* DNA double helix overlay in blue Luminol */}
            <path d="M 50 65 Q 65 50 80 65 Q 95 80 110 65" fill="none" stroke="#38bdf8" strokeWidth="2" />
            <path d="M 50 75 Q 65 90 80 75 Q 95 60 110 75" fill="none" stroke="#38bdf8" strokeWidth="2" />
            <text x="80" y="145" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              TIMOTHY VANCE DNA CONFIRMED
            </text>
          </svg>
        );

      // Default generic evidence folder
      default:
        return (
          <svg viewBox="0 0 160 160" width="100%" height="100%">
            <rect width="160" height="160" fill="#1e293b" rx="8" />
            <polygon points="40,30 80,30 90,45 120,45 120,130 40,130" fill="#334155" stroke="#64748b" strokeWidth="2" />
            <circle cx="80" cy="85" r="18" fill="none" stroke="#f59e0b" strokeWidth="2" />
            <text x="80" y="90" fill="#f59e0b" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">017</text>
            <text x="80" y="148" fill="#cbd5e1" fontSize="9" fontFamily="monospace" textAnchor="middle">
              FORENSIC ARTIFACT
            </text>
          </svg>
        );
    }
  };

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.6)',
        background: '#090d16'
      }}
    >
      {renderSVG()}
    </div>
  );
};
