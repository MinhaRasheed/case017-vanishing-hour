import React from 'react';
import { GameProvider, useGame } from './game/state/GameStateContext';
import { Header } from './components/Header';
import { MainMenu } from './components/MainMenu';
import { CaseBriefing } from './components/CaseBriefing';
import { Dashboard } from './components/Dashboard';
import { LocationViewer } from './components/LocationViewer';
import { EvidenceViewer } from './components/EvidenceViewer';
import { SuspectInterrogation } from './components/SuspectInterrogation';
import { TimelineView } from './components/TimelineView';
import { EvidenceBoard } from './components/EvidenceBoard';
import { CaseNotes } from './components/CaseNotes';
import { DeductionResolution } from './components/DeductionResolution';
import { CaseResolution } from './components/CaseResolution';
import { CaseTasksView } from './components/CaseTasksView';
import { PoliceLineupView } from './components/PoliceLineupView';
import { CriminalCaseApp } from './components/criminalcase/CriminalCaseApp';

import './styles/theme.css';
import './styles/components.css';

const GameRouter: React.FC<{ onSwitchToCC: () => void }> = ({ onSwitchToCC }) => {
  const { gameState } = useGame();

  const renderScreen = () => {
    switch (gameState.currentScreen) {
      case 'main_menu':
        return <MainMenu />;
      case 'briefing':
        return <CaseBriefing />;
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <CaseTasksView />;
      case 'location_view':
        return <LocationViewer />;
      case 'evidence_viewer':
        return <EvidenceViewer />;
      case 'suspect_profiles':
      case 'interrogation':
        return <SuspectInterrogation />;
      case 'timeline':
        return <TimelineView />;
      case 'evidence_board':
        return <EvidenceBoard />;
      case 'notes':
        return <CaseNotes />;
      case 'deduction':
        return <DeductionResolution />;
      case 'police_lineup':
        return <PoliceLineupView />;
      case 'resolution':
        return <CaseResolution />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="case-container noir-scanline">
      <Header />
      <div style={{ background: '#1e3a8a', padding: '6px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8rem', color: '#bfdbfe', fontWeight: 'bold' }}>
          ⭐ CRIMINAL CASE EDITION IS READY!
        </span>
        <button
          onClick={onSwitchToCC}
          style={{
            background: '#f59e0b',
            color: '#000',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 12px',
            fontSize: '0.75rem',
            fontWeight: '900',
            cursor: 'pointer'
          }}
        >
          Switch to Criminal Case Mode →
        </button>
      </div>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {renderScreen()}
      </main>
      {gameState.currentScreen !== 'main_menu' && (
        <footer style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '14px 24px',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-faint)',
          background: 'rgba(10, 12, 16, 0.95)'
        }}>
          CASE 017: THE VANISHING HOUR // FORENSIC INVESTIGATION SYSTEM • ALL RIGHTS RESERVED
        </footer>
      )}
    </div>
  );
};

export const App: React.FC = () => {
  const [gameMode, setGameMode] = React.useState<'criminal_case' | 'noir'>('criminal_case');

  return (
    <GameProvider>
      {gameMode === 'criminal_case' ? (
        <CriminalCaseApp onSwitchMode={() => setGameMode('noir')} />
      ) : (
        <GameRouter onSwitchToCC={() => setGameMode('criminal_case')} />
      )}
    </GameProvider>
  );
};

export default App;
