import { GameState, CaseNote, DeductionSubmission, DeductionResult } from '../game/state/types';

const API_BASE = 'http://localhost:3001/api';

export class ApiService {
  /**
   * Health check
   */
  public static async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2000) });
      const data = await res.json();
      return data.status === 'ok';
    } catch {
      return false;
    }
  }

  /**
   * Save game state
   */
  public static async saveGame(
    caseId: string,
    gameState: GameState,
    slotName: string = 'AutoSave'
  ): Promise<{ success: boolean; id?: string }> {
    // Always persist to localStorage as instant offline backup
    try {
      localStorage.setItem(`save_${caseId}`, JSON.stringify(gameState));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }

    try {
      const res = await fetch(`${API_BASE}/saves`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `save_${caseId}`,
          case_id: caseId,
          slot_name: slotName,
          playtime_seconds: gameState.playtimeSeconds,
          current_location: gameState.currentLocationId,
          gameState
        })
      });
      return await res.json();
    } catch (err) {
      console.warn('Backend API save failed, saved to local cache:', err);
      return { success: true, id: `local_${caseId}` };
    }
  }

  /**
   * Load game state
   */
  public static async loadGame(caseId: string): Promise<GameState | null> {
    try {
      const res = await fetch(`${API_BASE}/saves/save_${caseId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.save?.gameState) {
          return data.save.gameState;
        }
      }
    } catch (err) {
      console.warn('Backend load failed, trying local cache:', err);
    }

    // Fallback to localStorage
    try {
      const local = localStorage.getItem(`save_${caseId}`);
      if (local) {
        return JSON.parse(local);
      }
    } catch (e) {
      console.error('Local storage load error:', e);
    }

    return null;
  }

  /**
   * Sync detective notes with backend
   */
  public static async syncNotes(caseId: string, notes: CaseNote[]): Promise<boolean> {
    try {
      localStorage.setItem(`notes_${caseId}`, JSON.stringify(notes));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Submit deduction to server
   */
  public static async submitDeduction(
    caseId: string,
    submission: DeductionSubmission
  ): Promise<DeductionResult | null> {
    try {
      const res = await fetch(`${API_BASE}/verify/deduction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          case_id: caseId,
          ...submission
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          return {
            score: data.score,
            maxScore: data.maxScore,
            verdict: data.verdict,
            grade: data.ending.grade || 'A',
            ending: data.ending,
            feedback: data.feedback,
            fullDebrief: data.fullDebrief,
            timestamp: new Date().toISOString()
          };
        }
      }
    } catch (err) {
      console.warn('Backend deduction verification failed, using local deduction engine:', err);
    }
    return null;
  }
}
