import React, { useState } from 'react';
import { useGame } from '../game/state/GameStateContext';
import { ScreenType } from '../game/state/types';
import {
  ShieldAlert,
  LayoutDashboard,
  MapPin,
  Users,
  Search,
  Clock,
  Share2,
  BookOpen,
  CheckCircle,
  Volume2,
  VolumeX,
  Music,
  Save,
  RotateCcw,
  Star,
  Award,
  ListTodo
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    gameState,
    caseBundle,
    setScreen,
    toggleAudioMute,
    toggleAmbientMusic,
    saveProgress,
    restartCase
  } = useGame();

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [ambientActive, setAmbientActive] = useState(false);

  const handleSave = async () => {
    await saveProgress();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleToggleAmbient = () => {
    toggleAmbientMusic();
    setAmbientActive(!ambientActive);
  };

  const navItems: { screen: ScreenType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { screen: 'dashboard', label: 'Command', icon: <LayoutDashboard size={16} /> },
    { screen: 'tasks', label: 'Tasks', icon: <ListTodo size={16} />, badge: Math.max(0, 7 - (gameState.completedTaskIds?.length || 1)) },
    { screen: 'location_view', label: 'Scenes', icon: <MapPin size={16} />, badge: gameState.visitedLocationIds.length },
    { screen: 'suspect_profiles', label: 'Suspects', icon: <Users size={16} />, badge: caseBundle.suspects.length },
    { screen: 'evidence_viewer', label: 'Evidence', icon: <Search size={16} />, badge: gameState.discoveredEvidenceIds.length },
    { screen: 'timeline', label: 'Timeline', icon: <Clock size={16} /> },
    { screen: 'evidence_board', label: 'Board', icon: <Share2 size={16} /> },
    { screen: 'police_lineup', label: 'Lineup', icon: <Users size={16} /> },
    { screen: 'deduction', label: 'Indictment', icon: <CheckCircle size={16} /> },
  ];

  if (gameState.currentScreen === 'main_menu') {
    return null;
  }

  return (
    <header className="case-header">
      <div className="header-brand">
        <button
          onClick={() => setScreen('main_menu')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
          title="Return to Main Menu"
        >
          <div style={{ background: 'var(--accent-red)', padding: '6px', borderRadius: '4px', display: 'flex' }}>
            <ShieldAlert size={20} color="#fff" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>
              CASE: {caseBundle.case.caseNumber}
            </div>
            <div style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', letterSpacing: '0.02em' }}>
              {caseBundle.case.title}
            </div>
          </div>
        </button>

        {/* Criminal Case Style: Police Stars & Score Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '12px' }}>
          <div
            onClick={() => setScreen('tasks')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#090d16',
              border: '1px solid #eab308',
              padding: '4px 10px',
              borderRadius: '6px',
              color: '#fef08a',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
            title="Earn Police Stars by completing scene investigations and lab tasks"
          >
            <Star size={14} fill="#eab308" color="#fef08a" />
            <span>{gameState.stars || 1} / 10</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: '#090d16',
            border: '1px solid #38bdf8',
            padding: '4px 10px',
            borderRadius: '6px',
            color: '#38bdf8',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            fontWeight: '700'
          }}>
            <Award size={14} />
            <span>{(gameState.policeScore || 15000).toLocaleString()} PTS</span>
          </div>
        </div>
      </div>

      <nav className="header-nav">
        {navItems.map(item => {
          const isActive = gameState.currentScreen === item.screen;
          return (
            <button
              key={item.screen}
              className={`nav-tab ${isActive ? 'active' : ''}`}
              onClick={() => setScreen(item.screen)}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span style={{
                  background: isActive ? 'rgba(255,255,255,0.25)' : 'var(--border-subtle)',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  fontSize: '0.7rem'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="header-actions">
        <button
          className={`icon-btn ${ambientActive ? 'active' : ''}`}
          onClick={handleToggleAmbient}
          title={ambientActive ? 'Atmospheric Drone: ON' : 'Turn On Noir Soundscape'}
        >
          <Music size={16} />
        </button>

        <button
          className="icon-btn"
          onClick={toggleAudioMute}
          title={gameState.soundMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {gameState.soundMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        <button
          className="icon-btn"
          onClick={handleSave}
          title="Save Case Progress (SQLite & Cache)"
          style={{ position: 'relative' }}
        >
          <Save size={16} />
          {saveSuccess && (
            <span style={{
              position: 'absolute',
              bottom: '-28px',
              right: '0',
              background: 'var(--accent-emerald)',
              color: '#000',
              fontSize: '0.65rem',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '4px',
              whiteSpace: 'nowrap'
            }}>
              SAVED
            </span>
          )}
        </button>

        <button
          className="icon-btn"
          onClick={() => {
            if (window.confirm('Restart this investigation from the beginning? Unsaved progress will be reset.')) {
              restartCase();
            }
          }}
          title="Restart Case"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </header>
  );
};
