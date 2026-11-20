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

import './styles/theme.css';
import './styles/components.css';

const GameRouter: React.FC = () => {
  const { gameState } = useGame();

  const renderScreen = () => {
    switch (gameState.currentScreen) {
      case 'main_menu':
        return <MainMenu />;
      case 'briefing':
        return <CaseBriefing />;
      case 'dashboard':
        return <Dashboard />;
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
      case 'resolution':
        return <CaseResolution />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="case-container noir-scanline">
      <Header />
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
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
};

export default App;
