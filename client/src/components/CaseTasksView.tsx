import React, { useState } from 'react';
import { useGame } from '../game/state/GameStateContext';
import { CharacterPortrait } from './graphics/CharacterPortraits';
import { FingerprintDustingModal } from './minigames/FingerprintDustingModal';
import { TornDocumentModal } from './minigames/TornDocumentModal';
import {
  Star,
  CheckCircle,
  Play,
  ArrowRight,
  Shield,
  Scan,
  Puzzle,
  Pipette,
  Volume2,
  Users,
  Award,
  Zap
} from 'lucide-react';

interface CaseTask {
  id: string;
  title: string;
  category: 'scene' | 'lab' | 'interrogation' | 'arrest';
  description: string;
  starReward: number;
  icon: React.ReactNode;
  actionText: string;
  action: () => void;
}

export const CaseTasksView: React.FC = () => {
  const { gameState, setScreen, setLocation } = useGame();
  const [activeMiniGame, setActiveMiniGame] = useState<'fingerprint' | 'tornDocument' | null>(null);

  const completed = gameState.completedTaskIds || [];

  const tasks: CaseTask[] = [
    {
      id: 'task_inspect_4b',
      title: 'Investigate Penthouse 4B Crime Scene',
      category: 'scene',
      description: 'Search Timothy Vance\'s locked apartment for the whiskey glass, alarm console, laptop, and deadbolt.',
      starReward: 2,
      icon: <Scan size={20} color="#38bdf8" />,
      actionText: 'Investigate Scene →',
      action: () => {
        setLocation('apartment_4b');
        setScreen('location_view');
      }
    },
    {
      id: 'task_dust_fingerprint',
      title: 'Forensics Lab: Dust Deadbolt for Latent Fingerprints',
      category: 'lab',
      description: 'Use the charcoal feather brush on the exterior brass escutcheon to extract ridge minutiae and run AFIS biometric scan.',
      starReward: 1,
      icon: <Scan size={20} color="#eab308" />,
      actionText: completed.includes('task_dust_fingerprint') ? 'Re-examine Print' : 'Play Dusting Kit →',
      action: () => setActiveMiniGame('fingerprint')
    },
    {
      id: 'task_reconstruct_ledger',
      title: 'Document Lab: Reconstruct Shredded Secret Will',
      category: 'lab',
      description: 'Piece together torn codicil fragments retrieved from the hearth to uncover who Timothy disinherited.',
      starReward: 1,
      icon: <Puzzle size={20} color="#f59e0b" />,
      actionText: completed.includes('task_reconstruct_ledger') ? 'Review Codicil' : 'Assemble Fragments →',
      action: () => setActiveMiniGame('tornDocument')
    },
    {
      id: 'task_lab_whiskey',
      title: 'Chemical Lab: Spectrometry Assay of Whiskey Glass',
      category: 'lab',
      description: 'Dispense Marquis reagent onto the crystal tumbler rim to detect schedule IV hypnotics.',
      starReward: 1,
      icon: <Pipette size={20} color="#a855f7" />,
      actionText: 'Examine in Evidence Locker →',
      action: () => setScreen('evidence_viewer')
    },
    {
      id: 'task_wiretap',
      title: 'Audio Forensics: Decrypt NAGRA Reel-to-Reel Tape',
      category: 'lab',
      description: 'Play analog wiretap recording #4B-REEL to verify audio timestamps and decoy alarm intervals.',
      starReward: 1,
      icon: <Volume2 size={20} color="#38bdf8" />,
      actionText: 'Listen in Evidence Locker →',
      action: () => setScreen('evidence_viewer')
    },
    {
      id: 'task_interrogate_all',
      title: 'Suspect Interrogations: Expose Alibi Contradictions',
      category: 'interrogation',
      description: 'Confront Dr. Eleanor Sterling, Gregory Vance, Corinne Blake, and Toby Ray with hard physical evidence.',
      starReward: 2,
      icon: <Users size={20} color="#ef4444" />,
      actionText: 'Interrogate Suspects →',
      action: () => setScreen('interrogation')
    },
    {
      id: 'task_lineup_arrest',
      title: 'Police Headquarters: Suspect Lineup & Final Arrest',
      category: 'arrest',
      description: 'All evidence has been compiled. Identify the mastermind, slap on the cuffs, and deliver the final verdict!',
      starReward: 3,
      icon: <Shield size={20} color="#10b981" />,
      actionText: 'Proceed to Police Lineup →',
      action: () => setScreen('police_lineup')
    }
  ];

  return (
    <div className="case-content">
      {/* Criminal Case Top Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
        border: '2px solid #3b82f6',
        borderRadius: '12px',
        padding: '20px 24px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '24px',
        boxShadow: '0 8px 30px rgba(59, 130, 246, 0.25)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#93c5fd', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
            <Shield size={18} /> PRECINCT 017 SPECIAL INVESTIGATIONS DIVISION
          </div>
          <h1 style={{ fontSize: '1.8rem', color: '#fff', fontWeight: '900', margin: '4px 0 0' }}>
            CASE TASKS & HEADQUARTERS
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: '4px 0 0' }}>
            Investigate scenes, perform forensic lab procedures, earn police stars, and arrest the killer!
          </p>
        </div>

        {/* Stars and Score Counter Pills */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {/* Star Counter */}
          <div style={{
            background: '#090d16',
            border: '2px solid #eab308',
            borderRadius: '8px',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 0 16px rgba(234, 179, 8, 0.3)'
          }}>
            <Star size={24} fill="#eab308" color="#fef08a" />
            <div>
              <div style={{ fontSize: '0.7rem', color: '#fef08a', fontFamily: 'var(--font-mono)' }}>POLICE STARS</div>
              <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#fff' }}>
                {gameState.stars || 1} / 10
              </div>
            </div>
          </div>

          {/* Investigation Score */}
          <div style={{
            background: '#090d16',
            border: '2px solid #38bdf8',
            borderRadius: '8px',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 0 16px rgba(56, 189, 248, 0.3)'
          }}>
            <Award size={24} color="#38bdf8" />
            <div>
              <div style={{ fontSize: '0.7rem', color: '#7dd3fc', fontFamily: 'var(--font-mono)' }}>CASE SCORE</div>
              <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#fff', fontFamily: 'var(--font-mono)' }}>
                {(gameState.policeScore || 15000).toLocaleString()} PTS
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Partner Commentary Speech Bubble (Criminal Case Style) */}
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
            DETECTIVE PARTNER: INSPECTOR JACK VANCE
          </div>
          <p style={{ color: '#e2e8f0', fontSize: '0.95rem', margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>
            "Good work so far, Detective! We've got trace evidence piling up in the lab. Make sure you dust that deadbolt for latent prints, run reagent tests on the whiskey, and piece together that burned codicil before we bring the suspects in for the final lineup!"
          </p>
        </div>
      </div>

      {/* Tasks Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {tasks.map(task => {
          const isDone = completed.includes(task.id);
          return (
            <div
              key={task.id}
              style={{
                background: isDone ? 'rgba(16, 185, 129, 0.08)' : '#0f1420',
                border: isDone ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '8px',
                  background: isDone ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {isDone ? <CheckCircle size={24} color="var(--accent-emerald)" /> : task.icon}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ fontSize: '1.05rem', color: '#fff', fontWeight: '700', margin: 0 }}>
                      {task.title}
                    </h3>
                    {isDone ? (
                      <span className="stamp stamp-green" style={{ fontSize: '0.65rem' }}>COMPLETED</span>
                    ) : (
                      <span className="stamp stamp-amber" style={{ fontSize: '0.65rem' }}>+ {task.starReward} STARS</span>
                    )}
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0', maxWidth: '750px' }}>
                    {task.description}
                  </p>
                </div>
              </div>

              <button
                className={isDone ? 'btn-secondary' : 'btn-primary'}
                style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                onClick={task.action}
              >
                <span>{task.actionText}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Mini-Games Modals */}
      {activeMiniGame === 'fingerprint' && (
        <FingerprintDustingModal onClose={() => setActiveMiniGame(null)} />
      )}
      {activeMiniGame === 'tornDocument' && (
        <TornDocumentModal onClose={() => setActiveMiniGame(null)} />
      )}
    </div>
  );
};
