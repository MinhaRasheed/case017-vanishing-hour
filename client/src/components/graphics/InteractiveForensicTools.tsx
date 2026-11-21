import React, { useState, useEffect } from 'react';
import { audio } from '../../services/audioService';
import {
  Play,
  Square,
  Volume2,
  Pipette,
  Magnet,
  Clock,
  CheckCircle,
  AlertTriangle,
  Zap
} from 'lucide-react';

interface ToolProps {
  evidenceId: string;
}

export const InteractiveForensicTool: React.FC<ToolProps> = ({ evidenceId }) => {
  if (evidenceId === 'ev_tape_transcript') {
    return <WiretapTapePlayer />;
  }
  if (evidenceId === 'ev_whiskey_sedative') {
    return <ChemicalSpectrometryTool />;
  }
  if (evidenceId === 'ev_neodymium_magnet' || evidenceId === 'ev_deadbolt_scuff') {
    return <MagneticDeadboltTool />;
  }
  if (evidenceId === 'ev_alarm_timer') {
    return <HoneywellTimerTool />;
  }

  return null;
};

/**
 * 1. Wiretap Reel-to-Reel Tape Player
 */
export const WiretapTapePlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(0);
  const [transcriptSubtitle, setTranscriptSubtitle] = useState<string>('Press PLAY to review analog wiretap recording #4B-REEL.');

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setSeconds(prev => {
          const next = prev + 1;
          if (next >= 6) {
            setIsPlaying(false);
            setTranscriptSubtitle('End of reel. Rewound to beginning.');
            return 0;
          }
          if (next === 1) setTranscriptSubtitle('[11:32 PM - Audio] Crystal whiskey glass clinking on glass table...');
          if (next === 2) setTranscriptSubtitle('[11:32 PM - Muffled voices] "...drink up Timothy, for old time\'s sake."');
          if (next === 3) setTranscriptSubtitle('[11:33 PM - Heavy thud] Dull impact of body collapsing onto rug.');
          if (next === 4) setTranscriptSubtitle('[11:44 PM - Mechanical noise] Rubber hamper wheels squeaking on hardwood floor.');
          if (next === 5) setTranscriptSubtitle('[11:47 PM - Sharp piercing alarm] Honeywell panic siren engages automatically.');
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlayToggle = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setSeconds(0);
      setTranscriptSubtitle('Playback stopped.');
    } else {
      setIsPlaying(true);
      setSeconds(0);
      setTranscriptSubtitle('[00:00] Engaging magnetic tape drive motor...');
      audio.playWiretapAudio(() => {
        setIsPlaying(false);
        setSeconds(0);
      });
    }
  };

  return (
    <div style={{
      background: '#0a0d14',
      border: '1px solid #334155',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '20px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Volume2 size={18} color="var(--accent-cyan)" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: '700' }}>
            NAGRA REEL-TO-REEL ANALOG TAPE DECK [RECOVERED AUDIO]
          </span>
        </div>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          color: isPlaying ? '#ef4444' : 'var(--text-faint)',
          fontWeight: '700'
        }}>
          {isPlaying ? '● RECORDING LIVE PLAYBACK' : 'IDLE'}
        </span>
      </div>

      {/* Reel-to-Reel Visuals */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        background: '#121622',
        borderRadius: '6px',
        padding: '16px',
        border: '1px solid #1e293b',
        position: 'relative'
      }}>
        {/* Left Reel */}
        <div style={{ textAlign: 'center' }}>
          <svg width="80" height="80" viewBox="0 0 80 80" className={isPlaying ? 'spinning-reel' : ''}>
            <circle cx="40" cy="40" r="38" fill="#1e293b" stroke="#475569" strokeWidth="2" />
            <circle cx="40" cy="40" r="28" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
            <circle cx="40" cy="40" r="8" fill="#38bdf8" />
            <line x1="40" y1="12" x2="40" y2="68" stroke="#64748b" strokeWidth="2" />
            <line x1="12" y1="40" x2="68" y2="40" stroke="#64748b" strokeWidth="2" />
            <line x1="20" y1="20" x2="60" y2="60" stroke="#64748b" strokeWidth="2" />
            <line x1="20" y1="60" x2="60" y2="20" stroke="#64748b" strokeWidth="2" />
          </svg>
          <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-faint)', marginTop: '4px' }}>
            FEED SPOOL
          </div>
        </div>

        {/* Center Waveform & Counter */}
        <div style={{ textAlign: 'center', flex: 1, padding: '0 20px' }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '1.4rem',
            fontWeight: '900',
            color: '#38bdf8',
            letterSpacing: '0.15em',
            marginBottom: '8px'
          }}>
            00:0{seconds} / 00:06
          </div>

          {/* Equalizer Waveform Bars */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: '4px',
            height: '36px',
            marginBottom: '10px'
          }}>
            {[18, 28, 12, 34, 22, 10, 30, 26, 14, 32, 20, 8].map((baseHeight, i) => (
              <div
                key={i}
                style={{
                  width: '5px',
                  height: isPlaying ? `${Math.max(6, Math.sin(seconds + i) * 16 + 18)}px` : '6px',
                  background: isPlaying ? 'var(--accent-red)' : '#334155',
                  borderRadius: '2px',
                  transition: 'height 0.15s ease'
                }}
              />
            ))}
          </div>

          <button
            onClick={handlePlayToggle}
            className={isPlaying ? 'btn-danger' : 'btn-primary'}
            style={{ fontSize: '0.85rem', padding: '6px 16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            {isPlaying ? <Square size={16} /> : <Play size={16} />}
            <span>{isPlaying ? 'STOP TAPE' : 'PLAY AUDIO EVIDENCE'}</span>
          </button>
        </div>

        {/* Right Reel */}
        <div style={{ textAlign: 'center' }}>
          <svg width="80" height="80" viewBox="0 0 80 80" className={isPlaying ? 'spinning-reel' : ''}>
            <circle cx="40" cy="40" r="38" fill="#1e293b" stroke="#475569" strokeWidth="2" />
            <circle cx="40" cy="40" r="28" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
            <circle cx="40" cy="40" r="8" fill="#e63946" />
            <line x1="40" y1="12" x2="40" y2="68" stroke="#64748b" strokeWidth="2" />
            <line x1="12" y1="40" x2="68" y2="40" stroke="#64748b" strokeWidth="2" />
            <line x1="20" y1="20" x2="60" y2="60" stroke="#64748b" strokeWidth="2" />
            <line x1="20" y1="60" x2="60" y2="20" stroke="#64748b" strokeWidth="2" />
          </svg>
          <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-faint)', marginTop: '4px' }}>
            TAKEUP SPOOL
          </div>
        </div>
      </div>

      {/* Synchronized Transcript Subtitle readout */}
      <div style={{
        marginTop: '12px',
        padding: '10px 14px',
        background: '#0f172a',
        borderLeft: isPlaying ? '3px solid var(--accent-red)' : '3px solid #475569',
        fontSize: '0.85rem',
        color: '#e2e8f0',
        fontStyle: 'italic',
        lineHeight: 1.5,
        minHeight: '42px',
        display: 'flex',
        alignItems: 'center'
      }}>
        {transcriptSubtitle}
      </div>
    </div>
  );
};

/**
 * 2. Chemical Reagent Spectrometry Dropper Test
 */
export const ChemicalSpectrometryTool: React.FC = () => {
  const [dropsApplied, setDropsApplied] = useState<number>(0);
  const [isReacting, setIsReacting] = useState<boolean>(false);
  const [analyzed, setAnalyzed] = useState<boolean>(false);

  const handleApplyReagent = () => {
    if (analyzed || isReacting) return;
    audio.playDropperSound();
    setIsReacting(true);
    setDropsApplied(prev => prev + 1);

    setTimeout(() => {
      audio.playStamp();
      setIsReacting(false);
      setAnalyzed(true);
    }, 1200);
  };

  const getLiquidColor = () => {
    if (analyzed) return '#7e22ce'; // Violet / Purple (Midazolam positive)
    if (isReacting) return '#a855f7';
    return '#d97706'; // Amber whiskey
  };

  return (
    <div style={{
      background: '#0a0d14',
      border: '1px solid #334155',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '20px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Pipette size={18} color="var(--accent-amber)" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent-amber)', fontWeight: '700' }}>
            BENZODIAZEPINE REAGENT DROPPER ASSAY (MARQUIS METHOD)
          </span>
        </div>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: analyzed ? 'var(--accent-emerald)' : 'var(--text-faint)'
        }}>
          {analyzed ? '✓ REACTION COMPLETE' : 'AWAITING REAGENT'}
        </span>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        background: '#121622',
        padding: '16px',
        borderRadius: '6px',
        border: '1px solid #1e293b'
      }}>
        {/* Test Tube Graphic */}
        <div style={{ position: 'relative', width: '60px', height: '140px', textAlign: 'center' }}>
          <svg width="60" height="140" viewBox="0 0 60 140">
            {/* Tube glass */}
            <path d="M 15 10 L 15 110 A 15 15 0 0 0 45 110 L 45 10 Z" fill="none" stroke="#64748b" strokeWidth="2.5" />
            <ellipse cx="30" cy="10" rx="15" ry="4" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
            {/* Liquid */}
            <path
              d="M 17 50 L 17 110 A 13 13 0 0 0 43 110 L 43 50 Z"
              fill={getLiquidColor()}
              style={{ transition: 'fill 1s ease' }}
            />
            {/* Measurement hashes */}
            <line x1="20" y1="40" x2="26" y2="40" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="20" y1="65" x2="28" y2="65" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="20" y1="90" x2="26" y2="90" stroke="#94a3b8" strokeWidth="1.5" />
            {/* Droplets falling */}
            {isReacting && (
              <circle cx="30" cy="30" r="3" fill="#a855f7">
                <animate attributeName="cy" from="15" to="50" dur="0.4s" repeatCount="indefinite" />
              </circle>
            )}
          </svg>
          <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-faint)' }}>
            VIAL #4B-S
          </div>
        </div>

        {/* Controls and Spectrometer Readout */}
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '12px', lineHeight: 1.5 }}>
            Apply the concentrated reagent directly to the tumbler rim residue to test for schedule IV tranquilizers and clinical hypnotics.
          </p>

          <button
            onClick={handleApplyReagent}
            disabled={analyzed || isReacting}
            className="btn-primary"
            style={{
              fontSize: '0.85rem',
              padding: '8px 16px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              opacity: analyzed ? 0.6 : 1
            }}
          >
            <Pipette size={16} />
            <span>{analyzed ? 'ASSAY CONCLUDED' : isReacting ? 'REACTING...' : 'DISPENSE REAGENT (3 DROPS)'}</span>
          </button>

          {analyzed && (
            <div style={{
              marginTop: '14px',
              padding: '10px 14px',
              background: 'rgba(126, 34, 206, 0.2)',
              border: '1px solid #9333ea',
              borderRadius: '6px',
              animation: 'fadeInModal 0.3s ease-out'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c084fc', fontWeight: '700', fontSize: '0.85rem' }}>
                <CheckCircle size={16} />
                <span>CONFIRMED: POSITIVE FOR MIDAZOLAM HYDROCHLORIDE</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#e9d5ff', marginTop: '4px' }}>
                Concentration: <strong>15mg/mL</strong> (Rapid loss of consciousness within 3–4 minutes). Matches lot #MDZ-9041 issued exclusively to hospital anesthesiology wards.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * 3. Magnetic Deadbolt Cross-Section Tool
 */
export const MagneticDeadboltTool: React.FC = () => {
  const [isMagnetEngaged, setIsMagnetEngaged] = useState<boolean>(false);

  const toggleMagnet = () => {
    if (!isMagnetEngaged) {
      audio.playStamp();
      setIsMagnetEngaged(true);
    } else {
      setIsMagnetEngaged(false);
    }
  };

  return (
    <div style={{
      background: '#0a0d14',
      border: '1px solid #334155',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '20px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Magnet size={18} color="var(--accent-red)" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent-red)', fontWeight: '700' }}>
            MAGNETIC DEADBOLT EXPERIMENT [LOCKED ROOM RECONSTRUCTION]
          </span>
        </div>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: isMagnetEngaged ? 'var(--accent-red)' : 'var(--text-faint)'
        }}>
          {isMagnetEngaged ? 'DEADBOLT THUMBTURN ROTATED 90° (LOCKED)' : 'UNLOCKED / RESTING'}
        </span>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        background: '#121622',
        padding: '16px',
        borderRadius: '6px',
        border: '1px solid #1e293b'
      }}>
        {/* Interactive Door Cross-Section Graphic */}
        <div style={{ position: 'relative', width: '180px', height: '120px' }}>
          <svg width="180" height="120" viewBox="0 0 180 120">
            {/* 2-inch Oak Door Frame Cross Section */}
            <rect x="50" y="10" width="80" height="100" fill="#451a03" stroke="#78350f" strokeWidth="2" rx="4" />
            <text x="90" y="65" textAnchor="middle" fill="#d97706" fontSize="9" fontFamily="monospace">OAK DOOR</text>

            {/* Interior Brass Thumbturn */}
            <circle cx="130" cy="60" r="14" fill="#b45309" stroke="#f59e0b" strokeWidth="1.5" />
            <line
              x1="130"
              y1="60"
              x2={isMagnetEngaged ? "142" : "130"}
              y2={isMagnetEngaged ? "60" : "48"}
              stroke="#fef08a"
              strokeWidth="4"
              strokeLinecap="round"
              style={{ transition: 'all 0.3s ease' }}
            />
            <text x="145" y="30" fill="#cbd5e1" fontSize="8" fontFamily="monospace">INSIDE (4B)</text>

            {/* Exterior Hallway & Magnet */}
            <text x="25" y="30" fill="#cbd5e1" fontSize="8" fontFamily="monospace">HALLWAY</text>
            <rect
              x={isMagnetEngaged ? "32" : "10"}
              y="45"
              width="18"
              height="30"
              fill="#94a3b8"
              stroke="#cbd5e1"
              strokeWidth="1.5"
              rx="2"
              style={{ transition: 'all 0.3s ease' }}
            />
            {/* Magnetic Flux Lines */}
            {isMagnetEngaged && (
              <g stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3">
                <path d="M 50 50 Q 85 40 120 52" fill="none" opacity="0.8" />
                <path d="M 50 60 Q 85 60 120 60" fill="none" opacity="0.8" />
                <path d="M 50 70 Q 85 80 120 68" fill="none" opacity="0.8" />
              </g>
            )}
          </svg>
        </div>

        {/* Explanation & Action */}
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '12px', lineHeight: 1.5 }}>
            Place the 180-lb neodymium recovery cylinder against the exterior brass escutcheon to test whether magnetic flux penetrates 2-inch solid core wood.
          </p>

          <button
            onClick={toggleMagnet}
            className={isMagnetEngaged ? 'btn-danger' : 'btn-primary'}
            style={{ fontSize: '0.85rem', padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Magnet size={16} />
            <span>{isMagnetEngaged ? 'REMOVE MAGNET' : 'APPLY NEODYMIUM MAGNET'}</span>
          </button>

          {isMagnetEngaged && (
            <div style={{
              marginTop: '12px',
              padding: '10px 14px',
              background: 'rgba(230, 57, 70, 0.15)',
              border: '1px solid var(--accent-red)',
              borderRadius: '6px',
              fontSize: '0.8rem',
              color: '#f8fafc',
              lineHeight: 1.4
            }}>
              <strong>DEDUCTION PROVED:</strong> The deadbolt can be locked from the outside hallway without leaving keys inside or tampering with the lock cylinder!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * 4. Honeywell Digital Timer Decoy Tool
 */
export const HoneywellTimerTool: React.FC = () => {
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [displayTime, setDisplayTime] = useState<string>('11:41 PM');
  const [alarmTriggered, setAlarmTriggered] = useState<boolean>(false);

  const handleSimulate = () => {
    if (timerRunning) return;
    setTimerRunning(true);
    setAlarmTriggered(false);
    setDisplayTime('11:41 PM');

    setTimeout(() => setDisplayTime('11:44 PM (Kidnapper exits)'), 1000);
    setTimeout(() => {
      setDisplayTime('11:47 PM [SIREN BLARING]');
      setAlarmTriggered(true);
      setTimerRunning(false);
      audio.playStamp();
    }, 2200);
  };

  return (
    <div style={{
      background: '#0a0d14',
      border: '1px solid #334155',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '20px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={18} color="var(--accent-cyan)" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: '700' }}>
            HONEYWELL DIGITAL DELAY TIMER RECONSTRUCTION
          </span>
        </div>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: alarmTriggered ? 'var(--accent-red)' : 'var(--text-faint)'
        }}>
          {alarmTriggered ? 'ALARM TRIPPED AT 11:47 PM' : 'PROGRAMMED: +6 MIN DELAY'}
        </span>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        background: '#121622',
        padding: '16px',
        borderRadius: '6px',
        border: '1px solid #1e293b'
      }}>
        {/* Keypad LCD */}
        <div style={{
          background: '#020617',
          border: '2px solid #38bdf8',
          borderRadius: '6px',
          padding: '12px 18px',
          fontFamily: 'var(--font-mono)',
          color: alarmTriggered ? '#ef4444' : '#38bdf8',
          minWidth: '180px',
          textAlign: 'center',
          boxShadow: alarmTriggered ? '0 0 16px rgba(239, 68, 68, 0.4)' : '0 0 12px rgba(56, 189, 248, 0.2)'
        }}>
          <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginBottom: '4px' }}>KEYPAD BUFFER:</div>
          <div style={{ fontSize: '1.1rem', fontWeight: '900', letterSpacing: '0.05em' }}>
            {displayTime}
          </div>
        </div>

        {/* Action & Explanation */}
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '12px', lineHeight: 1.5 }}>
            Reconstruct the timer countdown programmed into the keypad to verify whether anyone was physically in the room when the alarm went off at 11:47 PM.
          </p>

          <button
            onClick={handleSimulate}
            disabled={timerRunning}
            className="btn-primary"
            style={{ fontSize: '0.85rem', padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Clock size={16} />
            <span>{timerRunning ? 'CALCULATING DECOY DELAY...' : 'RUN DELAY SIMULATION'}</span>
          </button>

          {alarmTriggered && (
            <div style={{
              marginTop: '12px',
              padding: '10px 14px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid #38bdf8',
              borderRadius: '6px',
              fontSize: '0.8rem',
              color: '#f8fafc',
              lineHeight: 1.4
            }}>
              <strong>ALIBI CORROBORATED:</strong> The apartment was already empty when the siren shrieked at 11:47 PM. The disappearance did not happen at 11:47 PM—it happened between 11:32 PM and 11:44 PM!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
