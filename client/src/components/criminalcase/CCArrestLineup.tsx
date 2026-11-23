import React, { useState } from 'react';
import { CharacterPortrait } from '../graphics/CharacterPortraits';
import { audio } from '../../services/audioService';
import {
  Scale,
  ShieldCheck,
  AlertOctagon,
  Award,
  Star,
  CheckCircle,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface Props {
  discoveredTraits: string[];
  totalScore: number;
  onReplay: () => void;
}

export const CCArrestLineup: React.FC<Props> = ({ discoveredTraits, totalScore, onReplay }) => {
  const [selectedSuspectId, setSelectedSuspectId] = useState<string>('dr_eleanor_sterling');
  const [isArresting, setIsArresting] = useState<boolean>(false);
  const [arrestStage, setArrestStage] = useState<'lineup' | 'cuffed' | 'confession' | 'sentencing' | 'case_closed'>('lineup');

  const suspects = [
    {
      id: 'dr_eleanor_sterling',
      name: 'Dr. Eleanor Sterling',
      role: 'Chief Neurologist',
      isCulprit: true
    },
    {
      id: 'gregory_vance',
      name: 'Gregory Vance',
      role: 'Building Superintendent',
      isCulprit: false
    },
    {
      id: 'corinne_blake',
      name: 'Corinne Blake',
      role: 'Foundation Director',
      isCulprit: false
    },
    {
      id: 'toby_ray',
      name: 'Toby Ray',
      role: 'Paparazzo Photographer',
      isCulprit: false
    }
  ];

  const handleArrestClick = () => {
    setIsArresting(true);
    audio.playStamp();

    // Stage 1: Cuffs slam
    setArrestStage('cuffed');

    setTimeout(() => {
      if (selectedSuspectId === 'dr_eleanor_sterling') {
        audio.playContradiction();
        setArrestStage('confession');
      } else {
        setIsArresting(false);
        setArrestStage('lineup');
        alert("WRONGFUL ARREST! This suspect does not match the killer profile traits! Re-examine the traits in the Profile tab.");
      }
    }, 1200);
  };

  const handleProceedToCourt = () => {
    audio.playStamp();
    setArrestStage('sentencing');
  };

  const handleCaseClosed = () => {
    audio.playEvidenceFound();
    setArrestStage('case_closed');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
      {/* Title */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
        border: '2px solid #ef4444',
        borderRadius: '12px',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div>
          <div style={{ color: '#fca5a5', fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 'bold' }}>
            CRIMINAL DIVISION // POLICE SUSPECT LINEUP
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#fff', fontWeight: '900', margin: '2px 0 0' }}>
            ARREST THE KILLER!
          </h2>
        </div>
      </div>

      {/* LINEUP STAGE */}
      {arrestStage === 'lineup' && (
        <div>
          {/* Partner Advice Bubble */}
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
              <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#38bdf8', fontWeight: 'bold', marginBottom: '2px' }}>
                OFFICER JACK VANCE // FINAL ARREST BRIEFING:
              </div>
              <p style={{ color: '#e2e8f0', fontSize: '0.95rem', margin: 0, fontStyle: 'italic', lineHeight: 1.5 }}>
                "We've extracted the killer profile traits in the lab: Female, Doctor, uses high-power neodymium magnet, and was disinherited of $40 million. Only ONE suspect matches all traits! Select the killer and slam the handcuffs!"
              </p>
            </div>
          </div>

          {/* Suspect Lineup Wall */}
          <div style={{
            background: '#090d16',
            border: '2px solid #1e3a8a',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            position: 'relative'
          }}>
            {/* Height markings in background */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              padding: '24px', opacity: 0.15, pointerEvents: 'none', fontFamily: 'monospace'
            }}>
              {['6\' 4"', '6\' 2"', '6\' 0"', '5\' 10"', '5\' 8"', '5\' 6"', '5\' 4"'].map(h => (
                <div key={h} style={{ borderBottom: '1px solid #fff', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{h}</span>
                  <span>{h}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', position: 'relative', zIndex: 10 }}>
              {suspects.map((suspect, idx) => {
                const isSelected = selectedSuspectId === suspect.id;
                return (
                  <div
                    key={suspect.id}
                    onClick={() => setSelectedSuspectId(suspect.id)}
                    style={{
                      background: isSelected ? 'rgba(239, 68, 68, 0.2)' : '#111827',
                      border: isSelected ? '3px solid #ef4444' : '1px solid #374151',
                      borderRadius: '10px',
                      padding: '16px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: isSelected ? '0 0 24px rgba(239, 68, 68, 0.5)' : 'none'
                    }}
                  >
                    <div style={{
                      background: isSelected ? '#ef4444' : '#1e293b',
                      color: '#fff',
                      width: '32px', height: '32px',
                      borderRadius: '50%',
                      margin: '0 auto 12px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: '900', fontSize: '0.9rem'
                    }}>
                      {idx + 1}
                    </div>

                    <CharacterPortrait id={suspect.id} size={110} showBadge={false} />

                    <h4 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: '800', margin: '10px 0 2px' }}>
                      {suspect.name}
                    </h4>
                    <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: 0 }}>
                      {suspect.role}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Big Red Arrest Button */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handleArrestClick}
              disabled={isArresting}
              style={{
                background: 'linear-gradient(180deg, #ef4444 0%, #b91c1c 100%)',
                color: '#fff',
                border: '3px solid #fecaca',
                borderRadius: '50px',
                padding: '16px 48px',
                fontSize: '1.25rem',
                fontWeight: '900',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 0 30px rgba(239, 68, 68, 0.6)'
              }}
            >
              <Scale size={24} />
              <span>SLAM HANDCUFFS & ARREST KILLER!</span>
            </button>
          </div>
        </div>
      )}

      {/* CUFFS ANIMATION STAGE */}
      {arrestStage === 'cuffed' && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div className="cc-cuff-animation" style={{ fontSize: '5rem', marginBottom: '20px' }}>
            ⛓️ 🔒
          </div>
          <h2 style={{ fontSize: '2.5rem', color: '#ef4444', fontWeight: '900', letterSpacing: '0.1em' }}>
            CUFFS SLAMMED!
          </h2>
          <p style={{ color: '#fff', fontSize: '1.1rem' }}>Executing official police arrest warrant...</p>
        </div>
      )}

      {/* CONFESSION BREAKDOWN STAGE */}
      {arrestStage === 'confession' && (
        <div style={{
          background: '#090d16',
          border: '3px solid #ef4444',
          borderRadius: '12px',
          padding: '28px',
          boxShadow: '0 0 40px rgba(239, 68, 68, 0.4)',
          animation: 'fadeInModal 0.4s ease-out'
        }}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ position: 'relative' }}>
              <CharacterPortrait id="dr_eleanor_sterling" size={130} showBadge={false} />
              <div style={{
                position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)',
                background: '#ef4444', color: '#fff', fontWeight: '900', fontSize: '0.75rem',
                padding: '2px 8px', borderRadius: '4px', whiteSpace: 'nowrap', border: '1px solid #fff'
              }}>
                GUILTY
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <span className="stamp stamp-red" style={{ fontSize: '0.8rem', marginBottom: '8px', display: 'inline-block' }}>
                KILLER'S CONFESSION BREAKDOWN
              </span>
              <h3 style={{ fontSize: '1.6rem', color: '#fff', fontWeight: '900', margin: '4px 0 12px' }}>
                Dr. Eleanor Sterling Confesses:
              </h3>
              <p style={{
                fontSize: '1.05rem',
                color: '#fecaca',
                fontStyle: 'italic',
                lineHeight: 1.6,
                background: '#1c1917',
                padding: '16px 20px',
                borderRadius: '8px',
                borderLeft: '4px solid #ef4444'
              }}>
                "You think you're clever, Detective?! Timothy was going to destroy thirty years of neurological research! He had the audacity to revoke my $40 million foundation endowment at 11:15 PM! Midazolam in his scotch knocked him out in four minutes. Gregory held the service lift while I wheeled him out in the laundry hamper. And that 180-lb neodymium magnet locked his deadbolt from the hallway—no keys, no forced entry! He was going to sign the funds back to me at my clinic!"
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <button
              className="btn-primary"
              style={{
                padding: '12px 28px',
                fontSize: '1rem',
                fontWeight: '900',
                background: 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)',
                color: '#000'
              }}
              onClick={handleProceedToCourt}
            >
              <span>Take Dr. Sterling to Court for Sentencing →</span>
            </button>
          </div>
        </div>
      )}

      {/* COURT SENTENCING STAGE */}
      {arrestStage === 'sentencing' && (
        <div style={{
          background: 'linear-gradient(180deg, #1e293b 0%, #090d16 100%)',
          border: '3px solid #f59e0b',
          borderRadius: '12px',
          padding: '32px',
          textAlign: 'center',
          boxShadow: '0 0 40px rgba(245, 158, 11, 0.3)'
        }}>
          <div className="cc-gavel-anim" style={{ fontSize: '4rem', marginBottom: '14px' }}>
            ⚖️ 🔨
          </div>
          <div style={{ color: '#fef08a', fontFamily: 'monospace', fontWeight: 'bold', fontSize: '0.85rem' }}>
            HIGH COURT OF JUSTICE // CRIMINAL PROCEEDINGS
          </div>
          <h2 style={{ fontSize: '2.2rem', color: '#fff', fontWeight: '900', margin: '4px 0 16px' }}>
            JUDGE HALL DELIVERS THE SENTENCE
          </h2>

          <div style={{
            maxWidth: '700px',
            margin: '0 auto 24px',
            background: '#020617',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #334155'
          }}>
            <p style={{ fontSize: '1.1rem', color: '#cbd5e1', fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>
              "Order in the court! For the premeditated abduction, illegal chemical sedation, and grand financial extortion of Timothy Vance, this court finds Dr. Eleanor Sterling guilty on all counts! The defendant is hereby sentenced to <strong>30 Years to Life Imprisonment</strong> without possibility of parole!"
            </p>
          </div>

          <button
            className="btn-primary"
            style={{
              padding: '14px 36px',
              fontSize: '1.1rem',
              fontWeight: '900',
              background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)'
            }}
            onClick={handleCaseClosed}
          >
            <span>Celebrate Case Closed! ⭐</span>
          </button>
        </div>
      )}

      {/* CASE CLOSED FINAL CELEBRATION STAGE */}
      {arrestStage === 'case_closed' && (
        <div style={{
          background: 'linear-gradient(180deg, #0f172a 0%, #020617 100%)',
          border: '4px solid #10b981',
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 0 50px rgba(16, 185, 129, 0.5)'
        }}>
          <div className="cc-star-earned" style={{ marginBottom: '16px' }}>
            <Award size={80} color="#10b981" style={{ filter: 'drop-shadow(0 0 20px #10b981)' }} />
          </div>

          <div style={{
            color: '#34d399',
            fontFamily: 'monospace',
            fontWeight: '900',
            fontSize: '1.2rem',
            letterSpacing: '0.2em'
          }}>
            POLICE DEPARTMENT // PRECINCT 017
          </div>

          <h1 style={{
            fontSize: '3rem',
            color: '#fff',
            fontWeight: '900',
            margin: '6px 0 12px',
            textShadow: '0 4px 12px rgba(0,0,0,0.8)'
          }}>
            CASE CLOSED: THE VANISHING HOUR!
          </h1>

          <p style={{ color: '#93c5fd', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto 28px' }}>
            Sensational investigative work, Detective! Timothy Vance was successfully located at Dr. Sterling's private Catskills retreat and revived safely. The locked-room vanishing has been solved!
          </p>

          {/* Trophy & Stats Box */}
          <div style={{
            maxWidth: '500px',
            margin: '0 auto 30px',
            background: '#0a0d14',
            border: '2px solid #f59e0b',
            borderRadius: '10px',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#fef08a', fontSize: '0.8rem', fontFamily: 'monospace' }}>FINAL SCORE</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#fff', fontFamily: 'monospace' }}>
                  {(totalScore || 245000).toLocaleString()} PTS
                </div>
              </div>
              <div style={{ width: '1px', height: '40px', background: '#334155' }} />
              <div>
                <div style={{ color: '#fef08a', fontSize: '0.8rem', fontFamily: 'monospace' }}>POLICE RANK</div>
                <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#38bdf8' }}>
                  MASTER DETECTIVE ⭐
                </div>
              </div>
            </div>
          </div>

          <button
            className="btn-primary"
            style={{
              padding: '14px 40px',
              fontSize: '1.1rem',
              fontWeight: '900',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)'
            }}
            onClick={onReplay}
          >
            <RotateCcw size={20} />
            <span>Replay Investigation</span>
          </button>
        </div>
      )}
    </div>
  );
};
