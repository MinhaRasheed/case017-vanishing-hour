import React, { useState } from 'react';
import { CharacterPortrait } from '../graphics/CharacterPortraits';
import { audio } from '../../services/audioService';
import {
  Pipette,
  Magnet,
  FileText,
  Scan,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Star
} from 'lucide-react';

export interface KillerProfileTrait {
  id: string;
  category: string;
  trait: string;
  source: string;
  discovered: boolean;
}

interface Props {
  stars: number;
  onSpendStar: (amount: number) => boolean;
  discoveredTraits: string[];
  onTraitDiscovered: (traitId: string) => void;
  onGoToProfile: () => void;
}

export const CCLabTab: React.FC<Props> = ({
  stars,
  onSpendStar,
  discoveredTraits,
  onTraitDiscovered,
  onGoToProfile
}) => {
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  const labItems = [
    {
      id: 'trait_gender_female',
      name: 'Carpet Footprint & Shoe Traction',
      clue: 'Muddy impression recovered from Penthouse 4B Persian rug.',
      traitReveal: 'Gender: Female (Women\'s Size 7.5 Italian Leather Pump)',
      icon: <Scan size={24} color="#38bdf8" />,
      timeSeconds: 3
    },
    {
      id: 'trait_medical_access',
      name: 'Scotch Tumbler Chemical Residue',
      clue: 'Spectrometry analysis of white crystalline rim deposit.',
      traitReveal: 'Profession: Doctor with Hospital Sedative Access (Midazolam)',
      icon: <Pipette size={24} color="#a855f7" />,
      timeSeconds: 4
    },
    {
      id: 'trait_neodymium_magnet',
      name: 'Deadbolt Brass Collar Abrasion',
      clue: 'Magnetic flux analysis of the exterior lock face.',
      traitReveal: 'Method: Possesses 180-lb Neodymium Recovery Magnet',
      icon: <Magnet size={24} color="#ef4444" />,
      timeSeconds: 3
    },
    {
      id: 'trait_revoked_will',
      name: 'Torn Codicil Document Recovery',
      clue: 'Assembling charred paper scraps found in fireplace.',
      traitReveal: 'Motive: Disinherited of $40,000,000 Research Grant',
      icon: <FileText size={24} color="#f59e0b" />,
      timeSeconds: 4
    }
  ];

  const handleStartAnalysis = (item: typeof labItems[0]) => {
    if (discoveredTraits.includes(item.id)) return;
    if (!onSpendStar(1)) {
      alert("You need at least 1 Police Star to perform this forensic analysis! Replay or search crime scenes to earn stars.");
      return;
    }

    setAnalyzingId(item.id);
    audio.playDropperSound();

    setTimeout(() => {
      audio.playStamp();
      audio.playEvidenceFound();
      setAnalyzingId(null);
      onTraitDiscovered(item.id);
    }, item.timeSeconds * 800);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '16px' }}>
      {/* Lab Banner with Dr. Grace */}
      <div style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #0f172a 100%)',
        border: '2px solid #10b981',
        borderRadius: '12px',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '24px',
        boxShadow: '0 8px 30px rgba(16, 185, 129, 0.25)'
      }}>
        <CharacterPortrait id="forensic_tech" size={80} showBadge={false} />
        <div style={{ flex: 1 }}>
          <div style={{ color: '#6ee7b7', fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 'bold' }}>
            CHIEF FORENSIC MEDICAL EXAMINER // DR. GRACE HARPER
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#fff', fontWeight: '900', margin: '2px 0 6px' }}>
            FORENSICS & AUTOPSY LABORATORY
          </h2>
          <p style={{ color: '#d1fae5', fontSize: '0.9rem', margin: 0, fontStyle: 'italic', lineHeight: 1.4 }}>
            "Welcome to the lab, Detective! Bring me the physical evidence recovered from Penthouse 4B. I'll run chemical spectrometry, magnetic flux tests, and orthotic reconstruction to profile the killer!"
          </p>
        </div>

        {/* Available Stars Pill */}
        <div style={{
          background: '#020617',
          border: '2px solid #f59e0b',
          borderRadius: '12px',
          padding: '12px 20px',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#fef08a' }}>
            <Star size={20} fill="#f59e0b" color="#fef08a" />
            <span style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fff' }}>{stars}</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#fef08a', fontFamily: 'monospace', fontWeight: 'bold', marginTop: '2px' }}>
            POLICE STARS
          </div>
        </div>
      </div>

      {/* Lab Workstations Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {labItems.map(item => {
          const isDone = discoveredTraits.includes(item.id);
          const isRunning = analyzingId === item.id;

          return (
            <div
              key={item.id}
              style={{
                background: isDone ? 'rgba(16, 185, 129, 0.1)' : '#0f172a',
                border: isDone ? '2px solid #10b981' : isRunning ? '2px solid #f59e0b' : '1px solid #1e3a8a',
                borderRadius: '10px',
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
                boxShadow: isDone ? '0 0 16px rgba(16, 185, 129, 0.2)' : 'none'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      background: '#1e293b',
                      padding: '10px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', color: '#fff', fontWeight: '800', margin: 0 }}>
                        {item.name}
                      </h3>
                      <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '2px 0 0' }}>
                        {item.clue}
                      </p>
                    </div>
                  </div>

                  {isDone ? (
                    <span style={{ background: '#064e3b', color: '#34d399', fontSize: '0.7rem', fontWeight: 'bold', padding: '3px 8px', borderRadius: '4px' }}>
                      COMPLETED
                    </span>
                  ) : (
                    <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fef08a', fontSize: '0.7rem', fontWeight: 'bold', padding: '3px 8px', borderRadius: '4px' }}>
                      ⭐ 1 STAR
                    </span>
                  )}
                </div>

                {/* Result Reveal */}
                {isDone ? (
                  <div style={{
                    background: '#022c22',
                    border: '1px solid #059669',
                    borderRadius: '6px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <CheckCircle size={18} color="#34d399" />
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#a7f3d0', fontFamily: 'monospace', fontWeight: 'bold' }}>
                        KILLER PROFILE TRAIT UNLOCKED:
                      </div>
                      <div style={{ color: '#fff', fontWeight: '800', fontSize: '0.9rem' }}>
                        {item.traitReveal}
                      </div>
                    </div>
                  </div>
                ) : isRunning ? (
                  <div style={{
                    background: '#1e1b4b',
                    border: '1px solid #3b82f6',
                    borderRadius: '6px',
                    padding: '12px',
                    textAlign: 'center',
                    color: '#93c5fd',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem'
                  }}>
                    <div style={{ width: '28px', height: '28px', border: '3px solid #3b82f6', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 8px', animation: 'spinReel 0.8s linear infinite' }} />
                    ANALYZING SPECTROMETRY SPECTRUM...
                  </div>
                ) : (
                  <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '4px 0 0', fontStyle: 'italic' }}>
                    Send this evidence to Dr. Grace to extract a distinctive physical or psychological trait of the killer.
                  </p>
                )}
              </div>

              {!isDone && !isRunning && (
                <button
                  className="btn-primary"
                  style={{ width: '100%', padding: '10px', fontSize: '0.85rem', fontWeight: '800' }}
                  onClick={() => handleStartAnalysis(item)}
                >
                  <span>Spend 1 Star to Analyze Sample →</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Button to Profile Board */}
      <div style={{
        background: '#0f172a',
        border: '1px solid #334155',
        borderRadius: '10px',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ color: '#38bdf8', fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 'bold' }}>
            INVESTIGATION PROGRESS:
          </div>
          <div style={{ color: '#fff', fontWeight: '800', fontSize: '1.1rem' }}>
            {discoveredTraits.length} of {labItems.length} Killer Traits Identified
          </div>
        </div>

        <button
          className="btn-primary"
          style={{
            padding: '10px 22px',
            fontSize: '0.9rem',
            fontWeight: '800',
            background: 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)'
          }}
          onClick={onGoToProfile}
        >
          <span>Open Suspect Profiling & Elimination Board →</span>
        </button>
      </div>
    </div>
  );
};
