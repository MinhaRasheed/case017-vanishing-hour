import React, { useState } from 'react';
import { useGame } from '../../game/state/GameStateContext';
import { CCCrimeScene } from './CCCrimeScene';
import { CCLabTab } from './CCLabTab';
import { CCProfileTab } from './CCProfileTab';
import { CCInterrogateTab } from './CCInterrogateTab';
import { CCArrestLineup } from './CCArrestLineup';
import { CC3DOffice } from './CC3DOffice';
import { CC3DLab } from './CC3DLab';
import { CC3DProfile } from './CC3DProfile';
import { CC3DInterrogation } from './CC3DInterrogation';
import { CC3DLineup } from './CC3DLineup';
import { CharacterPortrait } from '../graphics/CharacterPortraits';
import { audio } from '../../services/audioService';
import '../../styles/criminalcase.css';
import {
  Shield,
  Star,
  Zap,
  DollarSign,
  Search,
  Pipette,
  Users,
  Scale,
  MessageSquare,
  Volume2,
  VolumeX,
  Music,
  CheckCircle,
  ArrowRight,
  Box,
  Layers
} from 'lucide-react';

interface CCAppProps {
  onSwitchMode?: () => void;
}

export const CriminalCaseApp: React.FC<CCAppProps> = ({ onSwitchMode }) => {
  const { gameState, restartCase, toggleAudioMute, toggleAmbientMusic } = useGame();
  const [activeTab, setActiveTab] = useState<'tablet' | 'scene' | 'lab' | 'profile' | 'interrogate' | 'lineup'>('tablet');
  const [use3D, setUse3D] = useState<boolean>(true); // DEFAULT 100% 3D MODE
  const [stars, setStars] = useState<number>(3); // initial stars
  const [energy, setEnergy] = useState<number>(110);
  const [cash, setCash] = useState<number>(4500);
  const [totalScore, setTotalScore] = useState<number>(125000);
  const [discoveredTraits, setDiscoveredTraits] = useState<string[]>(['trait_gender_female']);
  const [ambientActive, setAmbientActive] = useState<boolean>(false);

  const handleSpendStar = (amount: number): boolean => {
    if (stars >= amount) {
      setStars(s => s - amount);
      return true;
    }
    return false;
  };

  const handleSceneComplete = (earnedStars: number, scoreAwarded: number) => {
    setStars(s => s + earnedStars);
    setTotalScore(sc => sc + scoreAwarded);
    setCash(c => c + 1500);
    setActiveTab('lab');
  };

  const handleTraitDiscovered = (traitId: string) => {
    if (!discoveredTraits.includes(traitId)) {
      setDiscoveredTraits(prev => [...prev, traitId]);
    }
  };

  const handleToggleAmbient = () => {
    toggleAmbientMusic();
    setAmbientActive(!ambientActive);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0d14', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* =========================================================================
          AUTHENTIC CRIMINAL CASE POLICE TABLET HEADER
          ========================================================================= */}
      <header className="cc-header">
        <div className="cc-badge-box">
          <div style={{
            background: 'linear-gradient(180deg, #f59e0b 0%, #b45309 100%)',
            padding: '6px',
            borderRadius: '6px',
            display: 'flex',
            boxShadow: '0 0 10px rgba(245, 158, 11, 0.4)'
          }}>
            <Shield size={24} color="#000" />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#f59e0b', fontFamily: 'monospace', fontWeight: 'bold' }}>
              CRIMINAL CASE // CASE #017
            </div>
            <div style={{ fontSize: '1rem', fontWeight: '900', color: '#fff' }}>
              THE VANISHING HOUR
            </div>
          </div>
        </div>

        {/* Resources: Energy, Cash, Stars */}
        <div className="cc-resources">
          {/* 3D vs 2D Engine Switcher Badge */}
          <button
            onClick={() => {
              setUse3D(!use3D);
              audio.playCardFlip();
            }}
            style={{
              background: use3D ? 'linear-gradient(135deg, #0284c7, #2563eb)' : '#1e293b',
              color: '#fff',
              border: use3D ? '1px solid #38bdf8' : '1px solid #475569',
              borderRadius: '20px',
              padding: '5px 14px',
              fontSize: '0.75rem',
              fontWeight: '900',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: use3D ? '0 0 14px rgba(56, 189, 248, 0.4)' : 'none'
            }}
            title="Toggle between full 3D interactive WebGL world and 2D mode"
          >
            <Box size={14} />
            <span>{use3D ? '3D REALITY ENGINE [ON]' : '2D BLUEPRINT MODE'}</span>
          </button>

          {/* Energy Bar */}
          <div className="cc-stat-pill" style={{ borderColor: '#10b981', color: '#34d399' }} title="Investigation Energy">
            <Zap size={16} fill="#10b981" color="#10b981" />
            <span>{energy} / 110</span>
          </div>

          {/* Cash */}
          <div className="cc-stat-pill" style={{ borderColor: '#38bdf8', color: '#38bdf8' }} title="Police Bounty Cash">
            <DollarSign size={16} />
            <span>${cash.toLocaleString()}</span>
          </div>

          {/* Police Stars */}
          <div
            className="cc-stat-pill"
            style={{ borderColor: '#f59e0b', color: '#fef08a', cursor: 'pointer' }}
            onClick={() => setActiveTab('lab')}
            title="Police Stars (Earned in Crime Scenes, Spent in Lab)"
          >
            <Star size={16} fill="#f59e0b" color="#fef08a" />
            <span style={{ fontSize: '0.95rem' }}>{stars} STARS</span>
          </div>
        </div>

        {/* Sound Controls & Mode Toggle */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {onSwitchMode && (
            <button
              onClick={onSwitchMode}
              style={{
                background: '#1e293b',
                color: '#94a3b8',
                border: '1px solid #334155',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
              title="Switch to Classic Detective Mode"
            >
              Classic Mode
            </button>
          )}
          <button
            className={`icon-btn ${ambientActive ? 'active' : ''}`}
            onClick={handleToggleAmbient}
            title={ambientActive ? 'Noir Drone: ON' : 'Turn On Noir Soundscape'}
          >
            <Music size={16} />
          </button>
          <button
            className="icon-btn"
            onClick={toggleAudioMute}
            title={gameState.soundMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {gameState.soundMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </header>

      {/* Navigation Sub-Tabs Bar */}
      <div style={{
        background: '#090d16',
        borderBottom: '2px solid #1e3a8a',
        padding: '8px 20px',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div className="cc-nav-tabs">
          <button
            className={`cc-tab-btn ${activeTab === 'tablet' ? 'active' : ''}`}
            onClick={() => { setActiveTab('tablet'); audio.playCardFlip(); }}
          >
            <Shield size={16} />
            <span>3D Police HQ</span>
          </button>

          <button
            className={`cc-tab-btn ${activeTab === 'scene' ? 'active' : ''}`}
            onClick={() => { setActiveTab('scene'); audio.playCardFlip(); }}
          >
            <Search size={16} />
            <span>3D Crime Scene</span>
          </button>

          <button
            className={`cc-tab-btn ${activeTab === 'lab' ? 'active' : ''}`}
            onClick={() => { setActiveTab('lab'); audio.playCardFlip(); }}
          >
            <Pipette size={16} />
            <span>3D Forensics Lab</span>
          </button>

          <button
            className={`cc-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => { setActiveTab('profile'); audio.playCardFlip(); }}
          >
            <Users size={16} />
            <span>3D Killer Profile</span>
          </button>

          <button
            className={`cc-tab-btn ${activeTab === 'interrogate' ? 'active' : ''}`}
            onClick={() => { setActiveTab('interrogate'); audio.playCardFlip(); }}
          >
            <MessageSquare size={16} />
            <span>3D Interrogate</span>
          </button>

          <button
            className={`cc-tab-btn ${activeTab === 'lineup' ? 'active' : ''}`}
            style={{
              background: activeTab === 'lineup' ? 'linear-gradient(180deg, #ef4444 0%, #b91c1c 100%)' : undefined,
              color: '#fff'
            }}
            onClick={() => { setActiveTab('lineup'); audio.playCardFlip(); }}
          >
            <Scale size={16} />
            <span>3D Arrest Lineup</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          ACTIVE VIEW CONTENT (100% 3D ENGINE INTEGRATION)
          ========================================================================= */}
      <main style={{ flex: 1, padding: '16px', maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
        {/* TAB 1: MAIN CASE HUB (3D DETECTIVE OFFICE) */}
        {activeTab === 'tablet' && (
          use3D ? (
            <CC3DOffice
              onNavigate={(tab) => setActiveTab(tab)}
              stars={stars}
              score={totalScore}
              discoveredTraitsCount={discoveredTraits.length}
            />
          ) : (
            <div style={{ maxWidth: '1100px', margin: '16px auto' }}>
              <div style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                border: '2px solid #3b82f6',
                borderRadius: '12px',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                marginBottom: '24px'
              }}>
                <CharacterPortrait id="detective_partner" size={85} showBadge={false} />
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#93c5fd', fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    OFFICER JACK VANCE // PARTNER BRIEFING
                  </div>
                  <h2 style={{ fontSize: '1.6rem', color: '#fff', fontWeight: '900', margin: '2px 0 6px' }}>
                    CASE 017: THE VANISHING HOUR
                  </h2>
                  <p style={{ color: '#cbd5e1', fontSize: '0.95rem', margin: 0, fontStyle: 'italic', lineHeight: 1.5 }}>
                    "At 11:47 PM, tech billionaire Timothy Vance vanished from his locked penthouse with no forced entry. Let's hit the crime scene, find hidden evidence, earn police stars, and run lab tests with Dr. Grace to profile the killer!"
                  </p>
                </div>
                <button
                  className="btn-primary"
                  style={{ padding: '12px 24px', fontSize: '0.95rem', fontWeight: '800' }}
                  onClick={() => setActiveTab('scene')}
                >
                  Enter Crime Scene →
                </button>
              </div>
            </div>
          )
        )}

        {/* TAB 2: 3D HIDDEN OBJECT CRIME SCENE */}
        {activeTab === 'scene' && (
          <CCCrimeScene onComplete={handleSceneComplete} />
        )}

        {/* TAB 3: 3D FORENSIC LAB */}
        {activeTab === 'lab' && (
          use3D ? (
            <CC3DLab
              stars={stars}
              onSpendStar={handleSpendStar}
              discoveredTraits={discoveredTraits}
              onTraitDiscovered={handleTraitDiscovered}
              onGoToProfile={() => setActiveTab('profile')}
            />
          ) : (
            <CCLabTab
              stars={stars}
              onSpendStar={handleSpendStar}
              discoveredTraits={discoveredTraits}
              onTraitDiscovered={handleTraitDiscovered}
              onGoToProfile={() => setActiveTab('profile')}
            />
          )
        )}

        {/* TAB 4: 3D KILLER PROFILE BOOK */}
        {activeTab === 'profile' && (
          use3D ? (
            <CC3DProfile
              discoveredTraits={discoveredTraits}
              onGoToLineup={() => setActiveTab('lineup')}
            />
          ) : (
            <CCProfileTab
              discoveredTraits={discoveredTraits}
              onGoToLineup={() => setActiveTab('lineup')}
            />
          )
        )}

        {/* TAB 5: 3D SUSPECT INTERROGATIONS */}
        {activeTab === 'interrogate' && (
          use3D ? (
            <CC3DInterrogation onGoToLineup={() => setActiveTab('lineup')} />
          ) : (
            <CCInterrogateTab onGoToLineup={() => setActiveTab('lineup')} />
          )
        )}

        {/* TAB 6: 3D POLICE LINEUP & ARREST */}
        {activeTab === 'lineup' && (
          use3D ? (
            <CC3DLineup
              discoveredTraits={discoveredTraits}
              totalScore={totalScore}
              onReplay={() => {
                restartCase();
                setActiveTab('tablet');
              }}
            />
          ) : (
            <CCArrestLineup
              discoveredTraits={discoveredTraits}
              totalScore={totalScore}
              onReplay={() => {
                restartCase();
                setActiveTab('tablet');
              }}
            />
          )
        )}
      </main>
    </div>
  );
};

