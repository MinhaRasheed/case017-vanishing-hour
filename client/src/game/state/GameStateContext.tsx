import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  GameState,
  ScreenType,
  EvidenceItem,
  CaseNote,
  BoardConnection,
  DeductionSubmission,
  DeductionResult
} from './types';
import { getCaseBundle, CaseBundle } from '../../data/caseLoader';
import { ContradictionEngine } from '../engine/ContradictionEngine';
import { DeductionEngine } from '../engine/DeductionEngine';
import { ApiService } from '../../services/apiService';
import { audio } from '../../services/audioService';

interface GameContextType {
  gameState: GameState;
  caseBundle: CaseBundle;
  setScreen: (screen: ScreenType) => void;
  setLocation: (locationId: string) => void;
  setSuspect: (suspectId: string | null) => void;
  inspectObject: (objectId: string) => { evidenceDiscovered: EvidenceItem | null; inspectionText: string };
  presentEvidence: (suspectId: string, evidenceId: string) => {
    isContradiction: boolean;
    response: string;
    unlockedClueId?: string;
  };
  unlockDialogueTopic: (topicId: string) => void;
  addConnection: (fromId: string, toId: string, label: string) => void;
  removeConnection: (connectionId: string) => void;
  updateBoardPosition: (nodeId: string, x: number, y: number) => void;
  saveNote: (note: Omit<CaseNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  deleteNote: (noteId: string) => void;
  submitDeduction: (submission: DeductionSubmission) => Promise<DeductionResult>;
  restartCase: () => void;
  toggleAudioMute: () => void;
  setAudioVolume: (vol: number) => void;
  toggleAmbientMusic: () => void;
  saveProgress: () => Promise<void>;
  completeTask: (taskId: string) => void;
  completeMiniGame: (game: 'fingerprint' | 'shreddedDocument' | 'uvScan') => void;
  addPoliceScore: (points: number) => void;
}

const defaultInitialState: GameState = {
  caseId: 'case017',
  currentScreen: 'main_menu',
  currentLocationId: 'apartment_4b',
  currentSuspectId: null,
  discoveredEvidenceIds: [],
  inspectedObjectIds: [],
  visitedLocationIds: ['apartment_4b'],
  revealedContradictionIds: [],
  unlockedDialogueTopicIds: [],
  unlockedTimelineEventIds: ['evt_1015', 'evt_1045', 'evt_1147'],
  evidenceConnections: [],
  boardPositions: {},
  notes: [
    {
      id: 'note_initial_brief',
      caseId: 'case017',
      category: 'general',
      title: 'Initial Case Directive',
      content: 'Penthouse 4B found locked from inside at 11:47 PM. Windows undisturbed. Timothy Vance is missing. Keycard overrides and basement cameras must be investigated.',
      tags: 'directive, urgent',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  playtimeSeconds: 0,
  soundMuted: false,
  soundVolume: 0.5,
  stars: 1,
  policeScore: 15000,
  completedTaskIds: ['task_briefing'],
  miniGamesCompleted: {},
  finalDeduction: null,
  evaluationResult: null,
  historyLogs: [
    { timestamp: '11:48 PM', message: 'Arrived at The Meridian Court Residences. Investigation began.', type: 'info' }
  ]
};

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [caseBundle] = useState<CaseBundle>(() => getCaseBundle('case017'));
  const [gameState, setGameState] = useState<GameState>(() => {
    // Check local storage for quick initial load
    try {
      const cached = localStorage.getItem('save_case017');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.warn('Cache restore error:', e);
    }
    return defaultInitialState;
  });

  // Track playtime timer
  useEffect(() => {
    const timer = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        playtimeSeconds: prev.playtimeSeconds + 1
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Periodic autosave every 45 seconds
  useEffect(() => {
    const autoSaveTimer = setInterval(() => {
      if (gameState.currentScreen !== 'main_menu' && gameState.currentScreen !== 'resolution') {
        ApiService.saveGame(gameState.caseId, gameState, 'AutoSave');
      }
    }, 45000);
    return () => clearInterval(autoSaveTimer);
  }, [gameState]);

  const setScreen = useCallback((screen: ScreenType) => {
    audio.playTypewriter();
    setGameState(prev => ({ ...prev, currentScreen: screen }));
  }, []);

  const setLocation = useCallback((locationId: string) => {
    audio.playTypewriter();
    setGameState(prev => {
      const visited = prev.visitedLocationIds.includes(locationId)
        ? prev.visitedLocationIds
        : [...prev.visitedLocationIds, locationId];
      return {
        ...prev,
        currentLocationId: locationId,
        visitedLocationIds: visited
      };
    });
  }, []);

  const setSuspect = useCallback((suspectId: string | null) => {
    audio.playCardFlip();
    setGameState(prev => ({ ...prev, currentSuspectId: suspectId }));
  }, []);

  const inspectObject = useCallback((objectId: string) => {
    audio.playTypewriter();
    let discoveredItem: EvidenceItem | null = null;
    let text = 'You inspect the object closely.';

    setGameState(prev => {
      const currentLoc = caseBundle.locations.find(l => l.id === prev.currentLocationId);
      
      // 1. Try to find inspectable in current location or across all locations
      let targetObj = currentLoc?.inspectables.find(o => o.id === objectId || o.revealedEvidenceId === objectId);
      if (!targetObj) {
        for (const loc of caseBundle.locations) {
          targetObj = loc.inspectables.find(o => o.id === objectId || o.revealedEvidenceId === objectId);
          if (targetObj) break;
        }
      }

      if (targetObj) {
        text = targetObj.inspectionText;
      }

      // Check if objectId is an evidence item ID directly
      const directEv = caseBundle.evidence.find(e => e.id === objectId);
      const evidenceToRevealId = targetObj?.revealedEvidenceId || directEv?.id;

      const inspected = prev.inspectedObjectIds.includes(objectId)
        ? prev.inspectedObjectIds
        : [...prev.inspectedObjectIds, objectId];

      let newDiscovered = [...prev.discoveredEvidenceIds];
      const newLogs = [...prev.historyLogs];
      let scoreIncrease = 12000;

      if (evidenceToRevealId && !prev.discoveredEvidenceIds.includes(evidenceToRevealId)) {
        newDiscovered.push(evidenceToRevealId);
        scoreIncrease += 28000;
        const ev = caseBundle.evidence.find(e => e.id === evidenceToRevealId);
        if (ev) {
          discoveredItem = ev as unknown as EvidenceItem;
          audio.playEvidenceFound();
          newLogs.unshift({
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            message: `Discovered Clue: ${ev.name}`,
            type: 'clue'
          });
        }
      }

      const updatedScore = (prev.policeScore || 15000) + scoreIncrease;
      const updatedStars = Math.max(prev.stars || 1, Math.min(10, Math.floor(newDiscovered.length / 2) + 1));
      const updatedTasks = [...(prev.completedTaskIds || [])];

      // Auto-complete scene search task if 3 or more clues found in Apartment 4B
      if (!updatedTasks.includes('task_inspect_4b') && newDiscovered.length >= 3) {
        updatedTasks.push('task_inspect_4b');
      }

      return {
        ...prev,
        inspectedObjectIds: inspected,
        discoveredEvidenceIds: newDiscovered,
        historyLogs: newLogs,
        policeScore: updatedScore,
        stars: updatedStars,
        completedTaskIds: updatedTasks
      };
    });

    return { evidenceDiscovered: discoveredItem, inspectionText: text };
  }, [caseBundle]);

  const presentEvidence = useCallback((suspectId: string, evidenceId: string) => {
    const suspect = caseBundle.suspects.find(s => s.id === suspectId);
    if (!suspect) {
      return { isContradiction: false, response: "Suspect not found." };
    }

    const result = ContradictionEngine.evaluateContradiction(suspect, evidenceId);

    if (result.isContradiction && result.contradiction) {
      audio.playContradiction();
      setGameState(prev => {
        const contraId = result.contradiction!.id;
        const revealed = prev.revealedContradictionIds.includes(contraId)
          ? prev.revealedContradictionIds
          : [...prev.revealedContradictionIds, contraId];

        let newDiscovered = [...prev.discoveredEvidenceIds];
        if (result.unlockedClueId && !newDiscovered.includes(result.unlockedClueId)) {
          newDiscovered.push(result.unlockedClueId);
        }

        const newLogs = [
          {
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            message: `CONTRADICTION EXPOSED: ${suspect.name}'s alibi shattered!`,
            type: 'contradiction' as const
          },
          ...prev.historyLogs
        ];

        return {
          ...prev,
          revealedContradictionIds: revealed,
          discoveredEvidenceIds: newDiscovered,
          historyLogs: newLogs
        };
      });
    } else {
      audio.playCardFlip();
    }

    return result;
  }, [caseBundle]);

  const unlockDialogueTopic = useCallback((topicId: string) => {
    setGameState(prev => {
      if (prev.unlockedDialogueTopicIds.includes(topicId)) return prev;
      return {
        ...prev,
        unlockedDialogueTopicIds: [...prev.unlockedDialogueTopicIds, topicId]
      };
    });
  }, []);

  const addConnection = useCallback((fromId: string, toId: string, label: string) => {
    audio.playTypewriter();
    setGameState(prev => {
      const exists = prev.evidenceConnections.some(
        c => (c.fromId === fromId && c.toId === toId) || (c.fromId === toId && c.toId === fromId)
      );
      if (exists) return prev;
      const conn: BoardConnection = {
        id: `conn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        fromId,
        toId,
        label
      };
      return {
        ...prev,
        evidenceConnections: [...prev.evidenceConnections, conn]
      };
    });
  }, []);

  const removeConnection = useCallback((connectionId: string) => {
    audio.playTypewriter();
    setGameState(prev => ({
      ...prev,
      evidenceConnections: prev.evidenceConnections.filter(c => c.id !== connectionId)
    }));
  }, []);

  const updateBoardPosition = useCallback((nodeId: string, x: number, y: number) => {
    setGameState(prev => ({
      ...prev,
      boardPositions: {
        ...prev.boardPositions,
        [nodeId]: { x, y }
      }
    }));
  }, []);

  const saveNote = useCallback((noteData: Omit<CaseNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    audio.playTypewriter();
    setGameState(prev => {
      const now = new Date().toISOString();
      const newNote: CaseNote = {
        ...noteData,
        id: `note_${Date.now()}`,
        createdAt: now,
        updatedAt: now
      };
      const updatedNotes = [newNote, ...prev.notes];
      ApiService.syncNotes(prev.caseId, updatedNotes);
      return {
        ...prev,
        notes: updatedNotes
      };
    });
  }, []);

  const deleteNote = useCallback((noteId: string) => {
    audio.playTypewriter();
    setGameState(prev => {
      const updatedNotes = prev.notes.filter(n => n.id !== noteId);
      ApiService.syncNotes(prev.caseId, updatedNotes);
      return {
        ...prev,
        notes: updatedNotes
      };
    });
  }, []);

  const submitDeduction = useCallback(async (submission: DeductionSubmission): Promise<DeductionResult> => {
    audio.playStamp();
    // Try server verification first, fallback to local engine
    let result = await ApiService.submitDeduction(gameState.caseId, submission);
    if (!result) {
      result = DeductionEngine.evaluateDeduction(submission);
    }

    setGameState(prev => ({
      ...prev,
      finalDeduction: submission,
      evaluationResult: result,
      currentScreen: 'resolution'
    }));

    // Save final resolution
    ApiService.saveGame(gameState.caseId, {
      ...gameState,
      finalDeduction: submission,
      evaluationResult: result,
      currentScreen: 'resolution'
    }, 'FinalResolution');

    return result;
  }, [gameState]);

  const restartCase = useCallback(() => {
    audio.playTypewriter();
    localStorage.removeItem('save_case017');
    setGameState(defaultInitialState);
  }, []);

  const toggleAudioMute = useCallback(() => {
    setGameState(prev => {
      const nextMuted = !prev.soundMuted;
      audio.setMuted(nextMuted);
      return { ...prev, soundMuted: nextMuted };
    });
  }, []);

  const setAudioVolume = useCallback((vol: number) => {
    audio.setVolume(vol);
    setGameState(prev => ({ ...prev, soundVolume: vol }));
  }, []);

  const toggleAmbientMusic = useCallback(() => {
    audio.toggleAmbient();
  }, []);

  const completeTask = useCallback((taskId: string) => {
    audio.playEvidenceFound();
    setGameState(prev => {
      if (prev.completedTaskIds?.includes(taskId)) return prev;
      return {
        ...prev,
        policeScore: (prev.policeScore || 0) + 20000,
        stars: Math.min(10, (prev.stars || 1) + 1),
        completedTaskIds: [...(prev.completedTaskIds || []), taskId]
      };
    });
  }, []);

  const completeMiniGame = useCallback((game: 'fingerprint' | 'shreddedDocument' | 'uvScan') => {
    audio.playStamp();
    setGameState(prev => ({
      ...prev,
      policeScore: (prev.policeScore || 0) + 35000,
      stars: Math.min(10, (prev.stars || 1) + 1),
      miniGamesCompleted: { ...(prev.miniGamesCompleted || {}), [game]: true }
    }));
  }, []);

  const addPoliceScore = useCallback((points: number) => {
    setGameState(prev => ({
      ...prev,
      policeScore: (prev.policeScore || 0) + points
    }));
  }, []);

  const saveProgress = useCallback(async () => {
    audio.playTypewriter();
    await ApiService.saveGame(gameState.caseId, gameState, 'ManualSave');
  }, [gameState]);

  return (
    <GameContext.Provider
      value={{
        gameState,
        caseBundle,
        setScreen,
        setLocation,
        setSuspect,
        inspectObject,
        presentEvidence,
        unlockDialogueTopic,
        addConnection,
        removeConnection,
        updateBoardPosition,
        saveNote,
        deleteNote,
        submitDeduction,
        restartCase,
        toggleAudioMute,
        setAudioVolume,
        toggleAmbientMusic,
        saveProgress,
        completeTask,
        completeMiniGame,
        addPoliceScore
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
