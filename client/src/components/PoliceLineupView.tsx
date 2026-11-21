import React, { useState } from 'react';
import { useGame } from '../game/state/GameStateContext';
import { CharacterPortrait } from './graphics/CharacterPortraits';
import { audio } from '../services/audioService';
import {
  ShieldAlert,
  CheckCircle,
  AlertOctagon,
  ArrowRight,
  Flame,
  ShieldCheck,
  Scale
} from 'lucide-react';

export const PoliceLineupView: React.FC = () => {
  const { gameState, caseBundle, submitDeduction, setScreen } = useGame();
  const [selectedSuspectId, setSelectedSuspectId] = useState<string>('dr_eleanor_sterling');
  const [isArresting, setIsArresting] = useState<boolean>(false);
  const [arrestOutcome, setArrestOutcome] = useState<{
    success: boolean;
    suspectName: string;
    confession: string;
  } | null>(null);

  const handleArrest = async () => {
    setIsArresting(true);
    audio.playStamp();
    audio.playContradiction();

    setTimeout(async () => {
      setIsArresting(false);
      const isCorrect = selectedSuspectId === 'dr_eleanor_sterling';

      if (isCorrect) {
        setArrestOutcome({
          success: true,
          suspectName: 'Dr. Eleanor Sterling',
          confession:
            '"Timothy was going to ruin thirty years of neurological research! He had the audacity to revoke my $40 million foundation endowment at 11:15 PM! Midazolam in his single-malt scotch put him under in four minutes. Gregory Vance held the freight elevator while I wheeled him out in the laundry cart. That 180-lb neodymium magnet locked his deadbolt from the hallway—no keys, no forced entry, no trace!"'
        });
        // Auto-submit perfect indictment
        await submitDeduction({
          suspectId: 'dr_eleanor_sterling',
          whatHappenedId: 'what_abducted_alive',
          methodId: 'method_sedative_hamper',
          motiveId: 'motive_sterling_embezzle',
          evidenceIds: ['ev_whiskey_sedative', 'ev_deadbolt_scuff', 'ev_neodymium_magnet', 'ev_alarm_timer'],
          reasoning: 'Dr. Sterling drugged Timothy with Midazolam in scotch, wheeled him in a hamper via freight elevator, set the delayed alarm, and locked the door with a neodymium magnet.'
        });
      } else {
        const suspect = caseBundle.suspects.find(s => s.id === selectedSuspectId);
        setArrestOutcome({
          success: false,
          suspectName: suspect?.name || 'Suspect',
          confession:
            '"You have the wrong person, Detective! You haven\'t accounted for the medical sedative or the external magnetic deadbolt lock!"'
        });
      }
    }, 1500);
  };

  return (
    <div className="case-content">
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
        border: '2px solid #ef4444',
        borderRadius: '12px',
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        boxShadow: '0 8px 30px rgba(239, 68, 68, 0.25)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fca5a5', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
            <AlertOctagon size={18} /> FORMAL INDICTMENT & POLICE SUSPECT LINEUP
          </div>
          <h1 style={{ fontSize: '1.8rem', color: '#fff', fontWeight: '900', margin: '4px 0 0' }}>
            THE POLICE LINEUP: ARREST THE PERPETRATOR
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: '4px 0 0' }}>
            Identify Timothy Vance's abductor, execute the arrest warrant, and send the case to the District Attorney!
          </p>
        </div>

        <button
          className="btn-secondary"
          onClick={() => setScreen('tasks')}
        >
          ← Return to Case Tasks
        </button>
      </div>

      {/* Partner Commentary Box */}
      <div style={{
        background: '#121622',
        border: '1px solid #1e293b',
        borderRadius: '10px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '18px',
        marginBottom: '24px'
      }}>
        <CharacterPortrait id="detective_partner" size={75} showBadge={false} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', marginBottom: '4px' }}>
            INSPECTOR JACK VANCE // SPECIAL ARREST ADVISORY:
          </div>
          <p style={{ color: '#e2e8f0', fontSize: '0.95rem', margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>
            "We've got all four persons of interest in the lineup room. The lab proven Midazolam sedative, the 180-lb neodymium cylinder, the 11:41 PM timer reconstruction, and the revoked will point to one mastermind. Choose carefully, Detective—handcuffs don't go on twice!"
          </p>
        </div>
      </div>

      {/* Confession / Arrest Outcome Alert */}
      {arrestOutcome && (
        <div style={{
          background: arrestOutcome.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: arrestOutcome.success ? '2px solid var(--accent-emerald)' : '2px solid var(--accent-red)',
          borderRadius: '10px',
          padding: '20px 24px',
          marginBottom: '24px',
          animation: 'fadeInModal 0.4s ease-out'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {arrestOutcome.success ? (
                <ShieldCheck size={28} color="var(--accent-emerald)" />
              ) : (
                <AlertOctagon size={28} color="var(--accent-red)" />
              )}
              <h2 style={{ fontSize: '1.4rem', color: '#fff', fontWeight: '800', margin: 0 }}>
                {arrestOutcome.success
                  ? `ARREST WARRANT EXECUTED: ${arrestOutcome.suspectName.toUpperCase()}`
                  : `WRONGFUL ACCUSATION: ${arrestOutcome.suspectName.toUpperCase()}`}
              </h2>
            </div>
            <span className={`stamp ${arrestOutcome.success ? 'stamp-green' : 'stamp-red'}`}>
              {arrestOutcome.success ? 'CONFESSION SECURED' : 'ALIBI HOLDS'}
            </span>
          </div>

          <p style={{
            fontSize: '1rem',
            lineHeight: 1.6,
            color: '#f8fafc',
            fontStyle: 'italic',
            background: 'rgba(0, 0, 0, 0.4)',
            padding: '16px',
            borderRadius: '6px',
            borderLeft: arrestOutcome.success ? '4px solid var(--accent-emerald)' : '4px solid var(--accent-red)'
          }}>
            {arrestOutcome.confession}
          </p>

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            {arrestOutcome.success ? (
              <button
                className="btn-primary"
                onClick={() => setScreen('resolution')}
                style={{ fontSize: '1rem', padding: '10px 20px' }}
              >
                <span>Proceed to Final Case Verdict & Court Debriefing</span>
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                className="btn-secondary"
                onClick={() => setArrestOutcome(null)}
              >
                Re-evaluate Evidence & Try Again
              </button>
            )}
          </div>
        </div>
      )}

      {/* Police Lineup Wall (Height Marks) */}
      <div style={{
        background: '#0b0f19',
        border: '2px solid #1e293b',
        borderRadius: '10px',
        padding: '24px',
        position: 'relative',
        marginBottom: '24px',
        overflow: 'hidden'
      }}>
        {/* Height measurement lines on the back wall */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '20px',
          opacity: 0.15,
          pointerEvents: 'none',
          fontFamily: 'var(--font-mono)'
        }}>
          {['6\' 4"', '6\' 2"', '6\' 0"', '5\' 10"', '5\' 8"', '5\' 6"', '5\' 4"', '5\' 2"'].map(ht => (
            <div key={ht} style={{ borderBottom: '1px solid #fff', display: 'flex', justifyContent: 'space-between' }}>
              <span>{ht}</span>
              <span>{ht}</span>
            </div>
          ))}
        </div>

        {/* Suspect Cards Grid in Lineup */}
        <div className="grid-4" style={{ position: 'relative', zIndex: 10 }}>
          {caseBundle.suspects.map((suspect, idx) => {
            const isSelected = selectedSuspectId === suspect.id;
            return (
              <div
                key={suspect.id}
                onClick={() => {
                  setSelectedSuspectId(suspect.id);
                  setArrestOutcome(null);
                }}
                style={{
                  background: isSelected ? 'rgba(230, 57, 70, 0.15)' : '#121622',
                  border: isSelected ? '2px solid var(--accent-red)' : '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isSelected ? '0 0 24px rgba(230, 57, 70, 0.4)' : 'none'
                }}
              >
                {/* Number Placard */}
                <div style={{
                  background: isSelected ? 'var(--accent-red)' : '#1e293b',
                  color: '#fff',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-mono)',
                  marginBottom: '12px'
                }}>
                  {idx + 1}
                </div>

                <CharacterPortrait id={suspect.id} size={110} showBadge={false} />

                <h3 style={{ fontSize: '1.05rem', color: '#fff', fontWeight: '800', marginTop: '12px', marginBottom: '2px' }}>
                  {suspect.name}
                </h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
                  {suspect.relation}
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: '0 0 12px' }}>
                  {suspect.occupation} • Age {suspect.age}
                </p>

                <div style={{
                  width: '100%',
                  background: '#090d16',
                  borderRadius: '6px',
                  padding: '8px',
                  fontSize: '0.75rem',
                  color: '#cbd5e1',
                  fontStyle: 'italic',
                  border: '1px solid #1e293b'
                }}>
                  "{suspect.initialStatement.substring(0, 75)}..."
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Arrest Action Bar */}
      <div style={{
        background: '#121622',
        border: '1px solid var(--border-subtle)',
        borderRadius: '10px',
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-red)', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
            READY TO DELIVER INDICTMENT:
          </div>
          <div style={{ fontSize: '1.1rem', color: '#fff', fontWeight: '800', marginTop: '2px' }}>
            Suspect Selected: {caseBundle.suspects.find(s => s.id === selectedSuspectId)?.name}
          </div>
        </div>

        <button
          className="btn-danger"
          disabled={isArresting}
          onClick={handleArrest}
          style={{
            fontSize: '1.05rem',
            padding: '12px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 0 20px rgba(230, 57, 70, 0.4)'
          }}
        >
          <Scale size={20} />
          <span>{isArresting ? 'EXECUTING ARREST WARRANT...' : 'SLAM HANDCUFFS & ARREST SUSPECT'}</span>
        </button>
      </div>
    </div>
  );
};
