import React, { useState } from 'react';
import { CharacterPortrait } from '../graphics/CharacterPortraits';
import { audio } from '../../services/audioService';
import {
  MessageSquare,
  ShieldAlert,
  CheckCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

interface Props {
  onGoToLineup: () => void;
}

export const CCInterrogateTab: React.FC<Props> = ({ onGoToLineup }) => {
  const [activeSuspectId, setActiveSuspectId] = useState<string>('dr_eleanor_sterling');
  const [interrogationStep, setInterrogationStep] = useState<number>(0);

  const suspects = [
    {
      id: 'dr_eleanor_sterling',
      name: 'Dr. Eleanor Sterling',
      role: 'Chief Neurologist & Primary Physician',
      dialogue: [
        {
          q: 'Detective, what is your official account of your visit to Penthouse 4B tonight?',
          a: '"I arrived at approximately 11:10 PM for a private medical consultation regarding Timothy\'s escalating tremors. We had a brief glass of scotch, reviewed his chart, and I left at 11:30 PM sharp. He was alive and well."'
        },
        {
          q: 'Did you know Timothy was executing a legal amendment revoking your $40M grant?',
          a: '"(Clenches jaw) Timothy was eccentric and often threatened impetuous decisions when delirious. But to suggest I would harm him over philanthropy is insulting, Detective."'
        },
        {
          q: 'How do you explain the clinical Midazolam found in his scotch tumbler?',
          a: '"Midazolam is a standard clinical sedative. I prescribe it, but I certainly didn\'t administer it into his liquor! Anyone with hospital access could have stolen an ampoule!"'
        }
      ]
    },
    {
      id: 'gregory_vance',
      name: 'Gregory Vance',
      role: 'Building Super & Maintenance Chief',
      dialogue: [
        {
          q: 'Mr. Vance, where were you when the 11:47 PM panic alarm was triggered?',
          a: '"I was down in the basement workshop sorting circuit breakers! I heard the siren on the master annunciator panel and took the service lift up immediately. The door was locked from inside!"'
        },
        {
          q: 'Why was your master maintenance keycard used at the freight elevator at 11:44 PM?',
          a: '"Look, I... I might have lent it to someone, okay? Dr. Sterling asked to use the service lift to move some heavy medical monitors down to the loading bay. She slipped me five grand in cash!"'
        }
      ]
    },
    {
      id: 'corinne_blake',
      name: 'Corinne Blake',
      role: 'Philanthropist & Foundation Director',
      dialogue: [
        {
          q: 'Ms. Blake, your monogrammed umbrella was found dripping in the main lobby.',
          a: '"Yes, I arrived at 11:20 PM to receive Timothy\'s executed trust deed for the shelter. But Gregory told me Timothy was in a private medical session and turned me away. I waited in the lobby until the alarm went off."'
        }
      ]
    },
    {
      id: 'toby_ray',
      name: 'Toby Ray',
      role: 'Paparazzo Photographer',
      dialogue: [
        {
          q: 'Toby, why were you caught staking out Penthouse 4B from the rooftop fire escape?',
          a: '"I had a tip that Timothy Vance was signing over forty million dollars tonight! Through my telephoto lens at 11:32 PM, I saw Dr. Sterling handing him a tumbler. Three minutes later, he slumped forward completely limp!"'
        }
      ]
    }
  ];

  const currentSuspect = suspects.find(s => s.id === activeSuspectId) || suspects[0];

  const handleSelectQuestion = (index: number) => {
    audio.playTypewriter();
    setInterrogationStep(index);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '16px' }}>
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
            PRECINCT INTERROGATION ROOM B // FORMAL WITNESS INQUIRY
          </div>
          <h2 style={{ fontSize: '1.5rem', color: '#fff', fontWeight: '900', margin: '2px 0 0' }}>
            SUSPECT INTERROGATIONS
          </h2>
        </div>

        <button
          className="btn-danger"
          style={{ padding: '10px 20px', fontSize: '0.9rem', fontWeight: '800' }}
          onClick={onGoToLineup}
        >
          <span>Ready for Lineup Arrest →</span>
        </button>
      </div>

      {/* Suspect Selector Pills */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {suspects.map(s => {
          const isActive = s.id === activeSuspectId;
          return (
            <button
              key={s.id}
              onClick={() => {
                setActiveSuspectId(s.id);
                setInterrogationStep(0);
                audio.playCardFlip();
              }}
              style={{
                flex: 1,
                background: isActive ? '#ef4444' : '#1e293b',
                color: isActive ? '#fff' : '#94a3b8',
                border: isActive ? '2px solid #fff' : '1px solid #334155',
                borderRadius: '8px',
                padding: '10px 14px',
                fontWeight: '800',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {s.name}
            </button>
          );
        })}
      </div>

      {/* Interrogation Cutscene Stage */}
      <div style={{
        background: '#090d16',
        border: '2px solid #1e3a8a',
        borderRadius: '12px',
        padding: '24px',
        display: 'grid',
        gridTemplateColumns: '180px 1fr 180px',
        gap: '24px',
        alignItems: 'center',
        minHeight: '340px',
        marginBottom: '20px'
      }}>
        {/* Officer Jack Vance on Left */}
        <div style={{ textAlign: 'center' }}>
          <CharacterPortrait id="detective_partner" size={120} showBadge={false} />
          <div style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '0.85rem', marginTop: '8px' }}>
            Officer Jack Vance
          </div>
          <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Lead Detective</div>
        </div>

        {/* Center Dialogue Box (Criminal Case Cutscene Style) */}
        <div style={{
          background: '#0f172a',
          border: '2px solid #334155',
          borderRadius: '10px',
          padding: '20px',
          minHeight: '200px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ color: '#f59e0b', fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 'bold', marginBottom: '6px' }}>
              INTERROGATION INQUIRY:
            </div>
            <p style={{ color: '#93c5fd', fontSize: '1rem', fontWeight: '700', margin: '0 0 14px', lineHeight: 1.5 }}>
              "{currentSuspect.dialogue[interrogationStep]?.q}"
            </p>

            <div style={{ color: '#34d399', fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 'bold', marginBottom: '6px' }}>
              SUSPECT'S SWORN TESTIMONY:
            </div>
            <p style={{ color: '#fff', fontSize: '0.95rem', margin: 0, fontStyle: 'italic', lineHeight: 1.6 }}>
              {currentSuspect.dialogue[interrogationStep]?.a}
            </p>
          </div>

          {/* Question Selector Tabs */}
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
            {currentSuspect.dialogue.map((d, i) => (
              <button
                key={i}
                onClick={() => handleSelectQuestion(i)}
                style={{
                  background: interrogationStep === i ? '#3b82f6' : '#1e293b',
                  color: interrogationStep === i ? '#fff' : '#94a3b8',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Question {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Suspect on Right */}
        <div style={{ textAlign: 'center' }}>
          <CharacterPortrait id={currentSuspect.id} size={120} showBadge={false} />
          <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '0.85rem', marginTop: '8px' }}>
            {currentSuspect.name}
          </div>
          <div style={{ color: '#64748b', fontSize: '0.7rem' }}>{currentSuspect.role}</div>
        </div>
      </div>
    </div>
  );
};
