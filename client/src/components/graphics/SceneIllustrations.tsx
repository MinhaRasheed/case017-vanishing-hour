import React from 'react';
import { InspectableObject } from '../../game/state/types';

interface SceneProps {
  locationId: string;
  inspectables: InspectableObject[];
  inspectedIds: string[];
  onInspect: (obj: InspectableObject) => void;
}

export const SceneIllustration: React.FC<SceneProps> = ({
  locationId,
  inspectables,
  inspectedIds,
  onInspect
}) => {
  const getInspectable = (id: string) => inspectables.find(o => o.id === id);

  switch (locationId) {
    // ==========================================
    // 1. PENTHOUSE APARTMENT 4B (PRIMARY CRIME SCENE)
    // ==========================================
    case 'apartment_4b':
      return (
        <svg viewBox="0 0 1000 500" width="100%" height="100%" style={{ display: 'block' }}>
          <defs>
            {/* Ambient Room Lighting */}
            <radialGradient id="lampGlow" cx="65%" cy="35%" r="45%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#d97706" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0b0f19" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#020617" />
              <stop offset="60%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <linearGradient id="floorParquet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1c140e" />
              <stop offset="100%" stopColor="#0a0705" />
            </linearGradient>
            <filter id="neonHover">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#38bdf8" />
            </filter>
          </defs>

          {/* Wall Backdrop */}
          <rect width="1000" height="350" fill="#111622" />
          <line x1="0" y1="350" x2="1000" y2="350" stroke="#1e293b" strokeWidth="3" />
          {/* Wood Flooring */}
          <rect y="350" width="1000" height="150" fill="url(#floorParquet)" />
          {/* Flooring plank perspective lines */}
          <g stroke="#261c14" strokeWidth="1">
            <line x1="0" y1="350" x2="0" y2="500" />
            <line x1="150" y1="350" x2="100" y2="500" />
            <line x1="300" y1="350" x2="280" y2="500" />
            <line x1="500" y1="350" x2="500" y2="500" />
            <line x1="700" y1="350" x2="720" y2="500" />
            <line x1="850" y1="350" x2="900" y2="500" />
            <line x1="1000" y1="350" x2="1000" y2="500" />
          </g>

          {/* Window 4 stories above city alley (Kitchen Window) */}
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => { const o = getInspectable('obj_kitchen_window'); if (o) onInspect(o); }}
          >
            {/* Window Frame */}
            <rect x="300" y="50" width="160" height="230" fill="url(#nightSky)" stroke="#334155" strokeWidth="8" rx="2" />
            {/* City Silhouette in Window */}
            <rect x="320" y="160" width="30" height="110" fill="#020617" />
            <rect x="360" y="130" width="45" height="140" fill="#090d16" />
            <rect x="415" y="180" width="35" height="90" fill="#020617" />
            {/* Distant building window lights */}
            <circle cx="375" cy="150" r="1.5" fill="#fef08a" opacity="0.6" />
            <circle cx="390" cy="170" r="1.5" fill="#38bdf8" opacity="0.6" />
            {/* Rain Streaks on Glass */}
            <line x1="330" y1="70" x2="320" y2="120" stroke="#38bdf8" strokeWidth="1" strokeDasharray="10 20" opacity="0.4" />
            <line x1="390" y1="90" x2="380" y2="150" stroke="#38bdf8" strokeWidth="1" strokeDasharray="15 25" opacity="0.4" />
            <line x1="430" y1="60" x2="420" y2="110" stroke="#38bdf8" strokeWidth="1" strokeDasharray="12 18" opacity="0.4" />
            {/* Window Sash Bars & Brass Latch */}
            <line x1="300" y1="165" x2="460" y2="165" stroke="#475569" strokeWidth="4" />
            <rect x="375" y="160" width="12" height="10" fill="#eab308" />
            {/* Inspection Glow on Hover */}
            <rect x="296" y="46" width="168" height="238" fill="none" stroke={inspectedIds.includes('obj_kitchen_window') ? '#10b981' : '#38bdf8'} strokeWidth="2" strokeDasharray="4 4" opacity="0.7" />
            <text x="380" y="295" fill="#38bdf8" fontSize="11" fontFamily="monospace" textAnchor="middle">KITCHEN WINDOW (SEALED)</text>
          </g>

          {/* Front Entrance Heavy Oak Door & Deadbolt */}
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => { const o = getInspectable('obj_deadbolt'); if (o) onInspect(o); }}
          >
            {/* Door Frame */}
            <rect x="70" y="100" width="120" height="250" fill="#2d1e12" stroke="#523924" strokeWidth="6" />
            {/* Door Panels */}
            <rect x="85" y="120" width="90" height="90" fill="#1f140b" stroke="#3d2816" strokeWidth="2" />
            <rect x="85" y="230" width="90" height="100" fill="#1f140b" stroke="#3d2816" strokeWidth="2" />
            {/* Heavy Brass Deadbolt & Thumbturn */}
            <circle cx="170" cy="225" r="10" fill="#ca8a04" stroke="#eab308" strokeWidth="2" />
            <rect x="166" y="221" width="8" height="8" fill="#fef08a" />
            {/* Microscopic Magnetic Scuff indicator */}
            <circle cx="170" cy="225" r="16" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 2" />
            <text x="130" y="90" fill="#ef4444" fontSize="11" fontFamily="monospace" textAnchor="middle">BRASS DEADBOLT (MAGNET SCUFFS)</text>
          </g>

          {/* Wall Alarm Keypad (Honeywell Panel) */}
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => { const o = getInspectable('obj_panic_panel'); if (o) onInspect(o); }}
          >
            <rect x="215" y="190" width="40" height="55" fill="#1e293b" stroke="#475569" strokeWidth="2" rx="3" />
            {/* Digital LCD screen with green text */}
            <rect x="220" y="196" width="30" height="16" fill="#022c22" />
            <text x="235" y="208" fill="#4ade80" fontSize="7" fontFamily="monospace" textAnchor="middle">11:47</text>
            {/* Keypad Buttons */}
            <circle cx="225" cy="220" r="2" fill="#94a3b8" />
            <circle cx="235" cy="220" r="2" fill="#94a3b8" />
            <circle cx="245" cy="220" r="2" fill="#94a3b8" />
            <circle cx="225" cy="230" r="2" fill="#94a3b8" />
            <circle cx="235" cy="230" r="2" fill="#94a3b8" />
            <circle cx="245" cy="230" r="2" fill="#ef4444" />
            <text x="235" y="260" fill="#f59e0b" fontSize="10" fontFamily="monospace" textAnchor="middle">ALARM CONSOLE</text>
          </g>

          {/* Workstation Desk & Open Laptop */}
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => { const o = getInspectable('obj_laptop'); if (o) onInspect(o); }}
          >
            {/* Mahogany Desk */}
            <rect x="580" y="270" width="200" height="15" fill="#3b2314" stroke="#54331d" strokeWidth="2" rx="2" />
            <line x1="600" y1="285" x2="600" y2="420" stroke="#26170d" strokeWidth="8" />
            <line x1="760" y1="285" x2="760" y2="420" stroke="#26170d" strokeWidth="8" />
            {/* Open ThinkPad Laptop */}
            <polygon points="630,270 710,270 720,282 620,282" fill="#1e293b" />
            <rect x="630" y="210" width="80" height="60" fill="#0f172a" stroke="#334155" strokeWidth="2" rx="2" />
            {/* Glowing Laptop Screen with Excel spreadsheet grid */}
            <rect x="634" y="214" width="72" height="52" fill="#0284c7" opacity="0.85" />
            {/* Spreadsheet lines */}
            <line x1="634" y1="225" x2="706" y2="225" stroke="#fff" strokeWidth="0.8" opacity="0.6" />
            <line x1="634" y1="235" x2="706" y2="235" stroke="#fff" strokeWidth="0.8" opacity="0.6" />
            <line x1="634" y1="245" x2="706" y2="245" stroke="#fff" strokeWidth="0.8" opacity="0.6" />
            {/* Red Flagged Fraud Row */}
            <rect x="634" y="246" width="72" height="8" fill="#ef4444" opacity="0.75" />
            <text x="670" y="198" fill="#38bdf8" fontSize="11" fontFamily="monospace" textAnchor="middle">THINKPAD AUDIT FILE</text>
          </g>

          {/* Reading Desk Lamp Casting Warm Glow */}
          <ellipse cx="670" cy="270" rx="140" ry="80" fill="url(#lampGlow)" pointerEvents="none" />
          <path d="M 740 270 L 730 230 L 720 235" stroke="#d97706" strokeWidth="3" fill="none" />
          <path d="M 710 230 L 735 230 L 740 245 L 705 245 Z" fill="#b45309" />

          {/* Coffee Table with Whiskey Glass (Forensic Clue) */}
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => { const o = getInspectable('obj_whiskey_glass'); if (o) onInspect(o); }}
          >
            {/* Glass Coffee Table */}
            <ellipse cx="480" cy="400" rx="90" ry="32" fill="rgba(30, 41, 59, 0.7)" stroke="#64748b" strokeWidth="3" />
            <line x1="420" y1="415" x2="420" y2="455" stroke="#475569" strokeWidth="4" />
            <line x1="540" y1="415" x2="540" y2="455" stroke="#475569" strokeWidth="4" />
            {/* Crystal Glencairn Whiskey Glass */}
            <path d="M 470 385 C 470 398, 490 398, 490 385 L 487 372 L 473 372 Z" fill="rgba(255, 255, 255, 0.4)" stroke="#e2e8f0" strokeWidth="1.5" />
            {/* Amber Scotch Liquid with chemical indicator */}
            <path d="M 472 388 C 472 396, 488 396, 488 388 Z" fill="#d97706" />
            {/* Yellow Police Evidence Marker [1] */}
            <polygon points="450,410 462,410 456,396" fill="#facc15" stroke="#a16207" strokeWidth="1" />
            <text x="456" y="407" fill="#000" fontSize="8" fontWeight="bold" textAnchor="middle">1</text>
            <text x="480" y="435" fill="#facc15" fontSize="11" fontFamily="monospace" textAnchor="middle">WHISKEY GLASS (MIDAZOLAM)</text>
          </g>

          {/* Coat Closet Access Panel (Red Herring) */}
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => { const o = getInspectable('obj_closet_panel'); if (o) onInspect(o); }}
          >
            <rect x="830" y="120" width="110" height="230" fill="#1e1812" stroke="#382517" strokeWidth="4" />
            {/* Loosened Service Hatch on lower wall */}
            <rect x="850" y="270" width="70" height="70" fill="#0f172a" stroke="#475569" strokeWidth="2" strokeDasharray="4 2" />
            {/* Unscrewed bolts on floor */}
            <circle cx="860" cy="355" r="2.5" fill="#94a3b8" />
            <circle cx="910" cy="355" r="2.5" fill="#94a3b8" />
            <text x="885" y="110" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">CLOSET SERVICE HATCH</text>
          </g>
        </svg>
      );

    // ==========================================
    // 2. 4TH FLOOR CORRIDOR & SERVICE LANDING
    // ==========================================
    case 'hallway_4th':
      return (
        <svg viewBox="0 0 1000 500" width="100%" height="100%" style={{ display: 'block' }}>
          <defs>
            <linearGradient id="hallwayWalls" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e2433" />
              <stop offset="100%" stopColor="#0b0e17" />
            </linearGradient>
            <linearGradient id="carpetRunner" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7f1d1d" />
              <stop offset="100%" stopColor="#450a0a" />
            </linearGradient>
          </defs>

          {/* Deep Perspective Hallway Walls */}
          <polygon points="0,0 1000,0 800,280 200,280" fill="#131926" />
          <polygon points="0,0 200,280 200,500 0,500" fill="#1a2233" />
          <polygon points="1000,0 800,280 800,500 1000,500" fill="#131926" />
          {/* Floor & Crimson Carpet Runner */}
          <polygon points="200,280 800,280 1000,500 0,500" fill="#0f131d" />
          <polygon points="380,280 620,280 750,500 250,500" fill="url(#carpetRunner)" stroke="#991b1b" strokeWidth="2" />

          {/* Damp Wheel Impression Tracks on Carpet */}
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => { const o = getInspectable('obj_carpet_runner'); if (o) onInspect(o); }}
          >
            <line x1="430" y1="285" x2="360" y2="500" stroke="#1f2937" strokeWidth="5" strokeDasharray="8 4" opacity="0.8" />
            <line x1="570" y1="285" x2="640" y2="500" stroke="#1f2937" strokeWidth="5" strokeDasharray="8 4" opacity="0.8" />
            {/* Yellow Police Evidence Cone [2] */}
            <polygon points="490,420 510,420 500,395" fill="#facc15" stroke="#a16207" strokeWidth="1" />
            <text x="500" y="412" fill="#000" fontSize="10" fontWeight="bold" textAnchor="middle">2</text>
            <text x="500" y="445" fill="#ef4444" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              PARALLEL WHEEL TREADS (LAUNDRY CART)
            </text>
          </g>

          {/* Left Door: Penthouse 4A (Toby Ray) with Taped Peephole */}
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => { const o = getInspectable('obj_4a_door'); if (o) onInspect(o); }}
          >
            <polygon points="50,120 180,180 180,440 50,470" fill="#2d1e12" stroke="#3d2816" strokeWidth="4" />
            <text x="130" y="240" fill="#eab308" fontSize="14" fontFamily="monospace" fontWeight="bold">4A</text>
            {/* Smart Video Doorbell with Black Electrical Tape */}
            <rect x="150" y="260" width="16" height="26" fill="#18181b" rx="2" />
            {/* Black PVC tape square */}
            <rect x="153" y="266" width="10" height="10" fill="#09090b" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="110" y="110" fill="#38bdf8" fontSize="11" fontFamily="monospace" textAnchor="middle">APT 4A (TAPED PEEPHOLE)</text>
          </g>

          {/* Center Background Doors: Penthouse 4B with Police Crime Tape */}
          <g>
            <rect x="420" y="160" width="160" height="120" fill="#1a140e" stroke="#334155" strokeWidth="3" />
            <text x="500" y="210" fill="#eab308" fontSize="16" fontFamily="monospace" fontWeight="bold" textAnchor="middle">4B</text>
            {/* Yellow Police Tape Across 4B */}
            <line x1="410" y1="180" x2="590" y2="240" stroke="#facc15" strokeWidth="6" />
            <line x1="410" y1="240" x2="590" y2="180" stroke="#facc15" strokeWidth="6" />
          </g>

          {/* Right Doors: Heavy Industrial Freight Elevator */}
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => { const o = getInspectable('obj_freight_doors'); if (o) onInspect(o); }}
          >
            <polygon points="820,180 950,120 950,470 820,440" fill="#334155" stroke="#475569" strokeWidth="4" />
            {/* Center Bi-Parting seam */}
            <line x1="885" y1="150" x2="885" y2="455" stroke="#0f172a" strokeWidth="3" />
            {/* Master Keycard Override slot with brass scuffs */}
            <circle cx="850" cy="300" r="8" fill="#ca8a04" stroke="#eab308" strokeWidth="2" />
            {/* Red Indicator: DOCKED AT BASEMENT */}
            <rect x="870" y="165" width="30" height="15" fill="#450a0a" stroke="#ef4444" strokeWidth="1" />
            <text x="885" y="177" fill="#f87171" fontSize="9" fontFamily="monospace" textAnchor="middle">B1</text>
            <text x="890" y="105" fill="#eab308" fontSize="11" fontFamily="monospace" textAnchor="middle">FREIGHT ELEVATOR</text>
          </g>

          {/* Fire Stairwell Door with Snipped Alarm Wire */}
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => { const o = getInspectable('obj_stairwell_alarm'); if (o) onInspect(o); }}
          >
            <rect x="230" y="200" width="60" height="140" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            {/* Emergency Fire Exit Sign */}
            <rect x="235" y="185" width="50" height="12" fill="#15803d" />
            <text x="260" y="194" fill="#fff" fontSize="8" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">EXIT</text>
            {/* Snipped Wire */}
            <line x1="285" y1="205" x2="280" y2="215" stroke="#ef4444" strokeWidth="2" />
            <line x1="282" y1="220" x2="285" y2="230" stroke="#ef4444" strokeWidth="2" />
            <text x="260" y="360" fill="#ef4444" fontSize="10" fontFamily="monospace" textAnchor="middle">SHEARED SENSOR</text>
          </g>
        </svg>
      );

    // ==========================================
    // 3. MAIN LOBBY & RECEPTION
    // ==========================================
    case 'lobby':
      return (
        <svg viewBox="0 0 1000 500" width="100%" height="100%" style={{ display: 'block' }}>
          <defs>
            <linearGradient id="marbleWall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="terrazzoFloor" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0a0a0c" />
              <stop offset="50%" stopColor="#18181b" />
              <stop offset="100%" stopColor="#0a0a0c" />
            </linearGradient>
          </defs>

          {/* Opulent Art Deco Marble Foyer */}
          <rect width="1000" height="340" fill="url(#marbleWall)" />
          {/* Polished Checkered Terrazzo Floor */}
          <rect y="340" width="1000" height="160" fill="url(#terrazzoFloor)" />
          {/* Checkerboard Floor Tiles */}
          <g stroke="#27272a" strokeWidth="1" opacity="0.6">
            <line x1="0" y1="380" x2="1000" y2="380" />
            <line x1="0" y1="430" x2="1000" y2="430" />
            <line x1="0" y1="500" x2="1000" y2="500" />
            <line x1="100" y1="340" x2="0" y2="500" />
            <line x1="300" y1="340" x2="200" y2="500" />
            <line x1="500" y1="340" x2="450" y2="500" />
            <line x1="700" y1="340" x2="750" y2="500" />
            <line x1="900" y1="340" x2="1000" y2="500" />
          </g>

          {/* Brass Mailboxes on Left Wall */}
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => { const o = getInspectable('obj_mailboxes'); if (o) onInspect(o); }}
          >
            <rect x="80" y="120" width="180" height="160" fill="#713f12" stroke="#ca8a04" strokeWidth="3" rx="4" />
            {/* Grid of Brass Tenant Pigeonholes */}
            {Array.from({ length: 4 }).map((_, r) =>
              Array.from({ length: 4 }).map((_, c) => (
                <rect
                  key={`${r}-${c}`}
                  x={95 + c * 40}
                  y={135 + r * 35}
                  width="32"
                  height="25"
                  fill="#a16207"
                  stroke="#eab308"
                  strokeWidth="1"
                />
              ))
            )}
            {/* Super's Mailbox with Overdraft Notice & Pawn Ticket */}
            <rect x="175" y="205" width="32" height="25" fill="#ef4444" opacity="0.8" />
            <polygon points="180,210 200,210 190,225" fill="#fff" />
            <text x="170" y="105" fill="#eab308" fontSize="11" fontFamily="monospace" textAnchor="middle">
              SUPER'S MAILBOX (DEBT NOTICES)
            </text>
          </g>

          {/* Concierge Desk & Visitor Logbook */}
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => { const o = getInspectable('obj_logbook'); if (o) onInspect(o); }}
          >
            {/* Marble Counter */}
            <rect x="420" y="260" width="220" height="120" fill="#0f172a" stroke="#475569" strokeWidth="4" rx="4" />
            <rect x="400" y="250" width="260" height="20" fill="#334155" rx="3" />
            {/* Leather Bound Visitor Logbook */}
            <rect x="450" y="235" width="80" height="40" fill="#7c2d12" stroke="#eab308" strokeWidth="1.5" rx="2" />
            <rect x="455" y="240" width="32" height="30" fill="#fef08a" />
            <rect x="492" y="240" width="32" height="30" fill="#fef08a" />
            {/* Yellow Police Cone [3] */}
            <polygon points="560,255 572,255 566,240" fill="#facc15" stroke="#a16207" strokeWidth="1" />
            <text x="566" y="252" fill="#000" fontSize="8" fontWeight="bold" textAnchor="middle">3</text>
            <text x="530" y="225" fill="#facc15" fontSize="11" fontFamily="monospace" textAnchor="middle">
              VISITOR LOG ('DR. V. MARTIN')
            </text>
          </g>

          {/* Reception CCTV Monitor displaying late-night entry */}
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => { const o = getInspectable('obj_cctv_monitor'); if (o) onInspect(o); }}
          >
            <rect x="680" y="150" width="120" height="90" fill="#020617" stroke="#64748b" strokeWidth="4" rx="4" />
            <rect x="690" y="160" width="100" height="70" fill="#0f172a" />
            {/* Screen Footage: Dark Trench Coat Figure entering at 11:24 PM */}
            <circle cx="740" cy="185" r="10" fill="#334155" />
            <path d="M 725 220 L 740 195 L 755 220 Z" fill="#1e293b" />
            {/* Green REC dot & timestamp */}
            <circle cx="700" cy="170" r="3" fill="#22c55e" />
            <text x="750" y="172" fill="#22c55e" fontSize="8" fontFamily="monospace">11:24 PM</text>
            <text x="740" y="135" fill="#38bdf8" fontSize="11" fontFamily="monospace" textAnchor="middle">
              CCTV MONITOR (11:24 PM STILL)
            </text>
          </g>

          {/* Wet Umbrella Stand with Corinne's Monogrammed Umbrella */}
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => { const o = getInspectable('obj_umbrella_stand'); if (o) onInspect(o); }}
          >
            <rect x="880" y="290" width="30" height="70" fill="#ca8a04" stroke="#eab308" strokeWidth="2" rx="3" />
            {/* Dripping Umbrella Handles */}
            <path d="M 890 290 L 890 250 Q 895 240 900 250" stroke="#1e1b4b" strokeWidth="5" fill="none" />
            <circle cx="890" cy="275" r="3" fill="#38bdf8" opacity="0.8" />
            {/* Puddle of Rainwater */}
            <ellipse cx="895" cy="365" rx="25" ry="8" fill="#0284c7" opacity="0.6" />
            <text x="895" y="390" fill="#38bdf8" fontSize="10" fontFamily="monospace" textAnchor="middle">
              WET UMBRELLA ('C.B.')
            </text>
          </g>
        </svg>
      );

    // ==========================================
    // 4. SECURITY & SURVEILLANCE ROOM
    // ==========================================
    case 'security_room':
      return (
        <svg viewBox="0 0 1000 500" width="100%" height="100%" style={{ display: 'block' }}>
          <defs>
            <linearGradient id="serverBlue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0c1322" />
              <stop offset="100%" stopColor="#030712" />
            </linearGradient>
          </defs>

          {/* Dark Technical Server Room Walls & Ceiling Conduit */}
          <rect width="1000" height="500" fill="url(#serverBlue)" />
          {/* Overhead Cable Trays */}
          <rect y="20" width="1000" height="15" fill="#1e293b" stroke="#334155" strokeWidth="1" />
          <line x1="200" y1="35" x2="200" y2="200" stroke="#0284c7" strokeWidth="3" />
          <line x1="500" y1="35" x2="500" y2="200" stroke="#eab308" strokeWidth="3" />

          {/* Blue-lit Server Rack on Left */}
          <rect x="50" y="80" width="140" height="380" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" rx="4" />
          {/* LED blinkers */}
          {Array.from({ length: 12 }).map((_, i) => (
            <g key={i}>
              <rect x="65" y={100 + i * 28} width="110" height="18" fill="#1e293b" />
              <circle cx="75" cy={109 + i * 28} r="2.5" fill={i % 3 === 0 ? '#ef4444' : '#22c55e'} />
              <circle cx="85" cy={109 + i * 28} r="2.5" fill="#38bdf8" />
              <line x1="100" y1={109 + i * 28} x2="165" y2={109 + i * 28} stroke="#334155" strokeWidth="2" strokeDasharray="3 3" />
            </g>
          ))}

          {/* Access Card Computer Terminal */}
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => { const o = getInspectable('obj_access_terminal'); if (o) onInspect(o); }}
          >
            <rect x="260" y="200" width="140" height="110" fill="#090d16" stroke="#0ea5e9" strokeWidth="3" rx="4" />
            <rect x="270" y="210" width="120" height="85" fill="#0369a1" opacity="0.9" />
            {/* Terminal Log lines */}
            <text x="275" y="225" fill="#fff" fontSize="8" fontFamily="monospace">11:12 PM - Super Card #2</text>
            <text x="275" y="240" fill="#fef08a" fontSize="8" fontFamily="monospace">11:40 PM - Lift Override</text>
            <text x="275" y="255" fill="#f87171" fontSize="8" fontFamily="monospace">11:52 PM - Bay Door Open</text>
            <text x="330" y="180" fill="#38bdf8" fontSize="11" fontFamily="monospace" textAnchor="middle">
              KEYCARD AUDIT SERVER
            </text>
          </g>

          {/* Camera 03 DVR Channel Blackout Screen */}
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => { const o = getInspectable('obj_dvr_server'); if (o) onInspect(o); }}
          >
            <rect x="460" y="160" width="170" height="130" fill="#020617" stroke="#475569" strokeWidth="4" rx="4" />
            {/* Blue Screen of Disconnected Video */}
            <rect x="470" y="170" width="150" height="105" fill="#1d4ed8" />
            <text x="545" y="220" fill="#fff" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              CAM 03: NO SIGNAL
            </text>
            <text x="545" y="240" fill="#f87171" fontSize="9" fontFamily="monospace" textAnchor="middle">
              BLACKOUT: 11:41 - 11:53
            </text>
            <text x="545" y="145" fill="#ef4444" fontSize="11" fontFamily="monospace" textAnchor="middle">
              LOADING BAY CAMERA (SABOTAGED)
            </text>
          </g>

          {/* Wire Wastebasket with Crumpled Bribery Note */}
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => { const o = getInspectable('obj_wastebasket'); if (o) onInspect(o); }}
          >
            <polygon points="680,380 730,380 720,440 690,440" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="3 3" />
            {/* Crumpled Lined Memo */}
            <circle cx="705" cy="415" r="10" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
            <text x="705" y="365" fill="#fef08a" fontSize="10" fontFamily="monospace" textAnchor="middle">
              CRUMPLED BRIBERY MEMO
            </text>
          </g>

          {/* Steel Locker #01 (Super's Locker with Neodymium Magnet) */}
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => { const o = getInspectable('obj_super_locker'); if (o) onInspect(o); }}
          >
            <rect x="780" y="100" width="160" height="360" fill="#1e293b" stroke="#64748b" strokeWidth="4" rx="3" />
            {/* Open Door Angle */}
            <rect x="790" y="120" width="140" height="320" fill="#0f172a" stroke="#334155" strokeWidth="2" />
            <text x="860" y="145" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              LOCKER 01: G.VANCE
            </text>
            {/* Heavy Neodymium Cylinder Magnet on Shelf */}
            <rect x="800" y="240" width="120" height="10" fill="#334155" />
            {/* Powerful Magnet */}
            <rect x="835" y="200" width="50" height="38" rx="6" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
            <circle cx="860" cy="219" r="14" fill="#64748b" />
            {/* Magnetic Field Waves */}
            <circle cx="860" cy="219" r="22" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 2" />
            <text x="860" y="275" fill="#ef4444" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              180-LB NEODYMIUM MAGNET
            </text>
          </g>
        </svg>
      );

    // ==========================================
    // 5. ROOFTOP TERRACE & HVAC ACCESS
    // ==========================================
    case 'rooftop':
      return (
        <svg viewBox="0 0 1000 500" width="100%" height="100%" style={{ display: 'block' }}>
          <defs>
            <linearGradient id="stormyNight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#020617" />
              <stop offset="50%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>
          </defs>

          {/* Storm Sky & Distant Manhattan Skyline */}
          <rect width="1000" height="320" fill="url(#stormyNight)" />
          {/* Skyscrapers with Illuminated Office Windows */}
          <polygon points="50,180 120,180 120,320 50,320" fill="#090d16" />
          <polygon points="150,100 230,100 230,320 150,320" fill="#020617" />
          <polygon points="350,60 420,60 420,320 350,320" fill="#090d16" />
          <polygon points="680,120 780,120 780,320 680,320" fill="#020617" />
          <polygon points="850,90 920,90 920,320 850,320" fill="#090d16" />
          {/* Red Warning Radio Beacon Lights on Towers */}
          <circle cx="190" cy="98" r="3" fill="#ef4444" />
          <circle cx="385" cy="58" r="3" fill="#ef4444" />

          {/* Wet Asphalt Rooftop Floor */}
          <rect y="320" width="1000" height="180" fill="#18181b" />
          {/* Rain puddles reflecting lights */}
          <ellipse cx="250" cy="420" rx="90" ry="24" fill="#1e1b4b" stroke="#38bdf8" strokeWidth="1" opacity="0.6" />
          <ellipse cx="720" cy="400" rx="120" ry="30" fill="#1e1b4b" stroke="#38bdf8" strokeWidth="1" opacity="0.6" />

          {/* Brick Parapet Wall with Muddy Bootprint */}
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => { const o = getInspectable('obj_boot_print'); if (o) onInspect(o); }}
          >
            <rect x="0" y="290" width="1000" height="35" fill="#78350f" stroke="#9a3412" strokeWidth="2" />
            {/* Muddy Boot Print (Vibram Lug Sole) */}
            <ellipse cx="650" cy="305" rx="12" ry="6" fill="#1c1917" stroke="#451a03" strokeWidth="1.5" />
            <circle cx="664" cy="305" r="4" fill="#1c1917" />
            <text x="650" y="275" fill="#facc15" fontSize="11" fontFamily="monospace" textAnchor="middle">
              SIZE 9 BOOTPRINT (TOBY RAY)
            </text>
          </g>

          {/* HVAC Air Vent Shaft with Shotgun Microphone */}
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => { const o = getInspectable('obj_hvac_grill'); if (o) onInspect(o); }}
          >
            <rect x="420" y="220" width="150" height="150" fill="#334155" stroke="#475569" strokeWidth="4" />
            {/* Exhaust Louver Slats */}
            {Array.from({ length: 6 }).map((_, i) => (
              <line key={i} x1="430" y1={240 + i * 18} x2="560" y2={240 + i * 18} stroke="#0f172a" strokeWidth="6" />
            ))}
            {/* Concealed Shotgun Mic pointing down shaft */}
            <rect x="475" y="250" width="50" height="10" fill="#000" stroke="#ef4444" strokeWidth="1.5" />
            <circle cx="525" cy="255" r="2" fill="#ef4444" />
            <text x="495" y="205" fill="#ef4444" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              DIRECTIONAL BUGGING MIC (4B VENT)
            </text>
          </g>

          {/* Maintenance Alcove with Sobranie Cigarette Butts */}
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => { const o = getInspectable('obj_roof_door'); if (o) onInspect(o); }}
          >
            <rect x="120" y="180" width="140" height="190" fill="#0f172a" stroke="#334155" strokeWidth="4" />
            <rect x="140" y="220" width="100" height="150" fill="#1e293b" />
            {/* Two Crushed Gold-Foil Cigarettes with Lipstick */}
            <line x1="160" y1="365" x2="175" y2="368" stroke="#fef08a" strokeWidth="3" />
            <circle cx="160" cy="365" r="2" fill="#e11d48" />
            <line x1="180" y1="362" x2="195" y2="360" stroke="#fef08a" strokeWidth="3" />
            <circle cx="180" cy="362" r="2" fill="#e11d48" />
            <text x="190" y="165" fill="#f43f5e" fontSize="10" fontFamily="monospace" textAnchor="middle">
              SOBRANIE CIGARETTES (RED LIPSTICK)
            </text>
          </g>

          {/* Iron Fire Escape Ladder (Red Herring) */}
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => { const o = getInspectable('obj_fire_escape'); if (o) onInspect(o); }}
          >
            <line x1="880" y1="180" x2="880" y2="450" stroke="#71717a" strokeWidth="4" />
            <line x1="910" y1="180" x2="910" y2="450" stroke="#71717a" strokeWidth="4" />
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={i} x1="880" y1={200 + i * 28} x2="910" y2={200 + i * 28} stroke="#71717a" strokeWidth="3" />
            ))}
            {/* Rust / Cobwebs */}
            <circle cx="895" cy="320" r="10" fill="none" stroke="#d97706" strokeWidth="1" strokeDasharray="2 2" />
            <text x="895" y="165" fill="#71717a" fontSize="10" fontFamily="monospace" textAnchor="middle">
              RUSTED FIRE LADDER
            </text>
          </g>
        </svg>
      );

    // ==========================================
    // 6. SUBTERRANEAN PARKING & LOADING BAY
    // ==========================================
    case 'parking_garage':
    default:
      return (
        <svg viewBox="0 0 1000 500" width="100%" height="100%" style={{ display: 'block' }}>
          <defs>
            <linearGradient id="concreteBay" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e2433" />
              <stop offset="100%" stopColor="#090d16" />
            </linearGradient>
          </defs>

          {/* Subterranean Concrete Ceiling & Columns */}
          <rect width="1000" height="500" fill="url(#concreteBay)" />
          {/* Concrete Pillars */}
          <rect x="180" y="50" width="50" height="400" fill="#334155" stroke="#475569" strokeWidth="2" />
          <rect x="740" y="50" width="50" height="400" fill="#334155" stroke="#475569" strokeWidth="2" />
          {/* Overhead Flickering Fluorescent Tubes */}
          <rect x="350" y="20" width="120" height="6" fill="#f8fafc" stroke="#38bdf8" strokeWidth="1" />
          <rect x="600" y="20" width="120" height="6" fill="#f8fafc" stroke="#38bdf8" strokeWidth="1" />
          {/* Yellow Hazard Floor Striping */}
          <line x1="0" y1="420" x2="1000" y2="420" stroke="#ca8a04" strokeWidth="4" strokeDasharray="16 16" />

          {/* Bay 06: Corinne's Silver Volvo Sedan */}
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => { const o = getInspectable('obj_volvo_sedan'); if (o) onInspect(o); }}
          >
            {/* Stenciled Parking Bay Label */}
            <text x="100" y="380" fill="#eab308" fontSize="16" fontFamily="monospace" fontWeight="bold">BAY 06</text>
            {/* Volvo Car Body */}
            <path d="M 40 410 L 60 350 L 140 340 L 220 370 L 250 410 Z" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="3" />
            {/* Windows */}
            <polygon points="75,355 130,348 130,370 70,370" fill="#0f172a" />
            <polygon points="140,348 200,370 140,370" fill="#0f172a" />
            {/* Wheels */}
            <circle cx="80" cy="415" r="16" fill="#18181b" stroke="#475569" strokeWidth="3" />
            <circle cx="210" cy="415" r="16" fill="#18181b" stroke="#475569" strokeWidth="3" />
            {/* Heat haze indicator from warm engine */}
            <path d="M 230 380 Q 240 360 230 340" stroke="#f87171" strokeWidth="2" fill="none" opacity="0.7" />
            {/* Windshield Parking Ticket stamped 11:15 PM */}
            <rect x="180" y="360" width="12" height="8" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
            <text x="145" y="325" fill="#facc15" fontSize="11" fontFamily="monospace" textAnchor="middle">
              CORINNE'S VOLVO (11:15 PM TICKET)
            </text>
          </g>

          {/* Industrial Canvas Laundry Hamper Cart (Crucial Clue) */}
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => { const o = getInspectable('obj_laundry_cart'); if (o) onInspect(o); }}
          >
            {/* Canvas Hamper Body */}
            <rect x="520" y="270" width="140" height="90" fill="#78716c" stroke="#a8a29e" strokeWidth="3" rx="4" />
            {/* Steel Frame Rails */}
            <rect x="515" y="265" width="150" height="10" fill="#44403c" />
            {/* Heavy 5-inch Vulcanized Rubber Wheels */}
            <circle cx="540" cy="375" r="14" fill="#0c0a09" stroke="#57534e" strokeWidth="3" />
            <circle cx="640" cy="375" r="14" fill="#0c0a09" stroke="#57534e" strokeWidth="3" />
            {/* Biological / Saliva Luminol Glow Inside */}
            <ellipse cx="590" cy="310" rx="40" ry="20" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
            {/* Yellow Police Evidence Cone [4] */}
            <polygon points="500,360 512,360 506,345" fill="#facc15" stroke="#a16207" strokeWidth="1" />
            <text x="506" y="357" fill="#000" fontSize="8" fontWeight="bold" textAnchor="middle">4</text>
            <text x="590" y="245" fill="#38bdf8" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              CANVAS LAUNDRY CART (DNA TRACES)
            </text>
          </g>

          {/* Trash Compactor with Discarded Midazolam Ampoule */}
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => { const o = getInspectable('obj_trash_compactor'); if (o) onInspect(o); }}
          >
            <rect x="830" y="200" width="120" height="180" fill="#1e293b" stroke="#64748b" strokeWidth="4" rx="4" />
            {/* Stainless Steel Hopper Chute */}
            <rect x="850" y="220" width="80" height="70" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
            {/* Spent Glass Pharmaceutical Ampoule Vial */}
            <rect x="880" y="240" width="8" height="24" fill="#38bdf8" opacity="0.8" rx="2" stroke="#fff" strokeWidth="1" />
            {/* Yellow Police Evidence Cone [5] */}
            <polygon points="840,310 852,310 846,295" fill="#facc15" stroke="#a16207" strokeWidth="1" />
            <text x="846" y="307" fill="#000" fontSize="8" fontWeight="bold" textAnchor="middle">5</text>
            <text x="890" y="180" fill="#ef4444" fontSize="11" fontFamily="monospace" textAnchor="middle">
              MIDAZOLAM AMPOULE (#MR-8821)
            </text>
          </g>

          {/* Loading Bay Shutter with Dual-Wheel Van Tracks */}
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => { const o = getInspectable('obj_loading_bay'); if (o) onInspect(o); }}
          >
            <rect x="340" y="160" width="130" height="150" fill="#020617" stroke="#475569" strokeWidth="4" />
            {/* Corrugated Shutter Slats */}
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={i} x1="340" y1={170 + i * 14} x2="470" y2={170 + i * 14} stroke="#334155" strokeWidth="3" />
            ))}
            {/* Fresh Dual-Wheel Van Skid Tracks */}
            <line x1="380" y1="310" x2="380" y2="450" stroke="#000" strokeWidth="6" strokeDasharray="10 5" opacity="0.85" />
            <line x1="390" y1="310" x2="390" y2="450" stroke="#000" strokeWidth="6" strokeDasharray="10 5" opacity="0.85" />
            <text x="405" y="140" fill="#38bdf8" fontSize="11" fontFamily="monospace" textAnchor="middle">
              LOADING BAY (AMBULANCE TRACKS)
            </text>
          </g>
        </svg>
      );
  }
};
