export type ScreenType =
  | 'main_menu'
  | 'briefing'
  | 'dashboard'
  | 'location_view'
  | 'evidence_viewer'
  | 'suspect_profiles'
  | 'interrogation'
  | 'timeline'
  | 'evidence_board'
  | 'notes'
  | 'deduction'
  | 'resolution';

export type EvidenceCategory = 'physical' | 'digital' | 'document' | 'forensic' | 'surveillance' | 'testimony';
export type EvidenceImportance = 'critical' | 'high' | 'moderate' | 'low' | 'misleading';

export interface EvidenceItem {
  id: string;
  name: string;
  category: EvidenceCategory;
  locationFound: string;
  timestampFound: string;
  importance: EvidenceImportance;
  description: string;
  detailedAnalysis: string;
  tags: string[];
  connectsTo: string[];
  contradictionForSuspect?: string | null;
}

export interface ContradictionDef {
  id: string;
  statementQuote: string;
  evidenceId: string;
  challengeText: string;
  responseConfession: string;
  unlockedClueId?: string;
}

export interface SuspectProfile {
  id: string;
  name: string;
  age: number;
  occupation: string;
  relation: string;
  personality: string;
  initialStatement: string;
  background: string;
  motive: string;
  secrets: string;
  contradictions: ContradictionDef[];
}

export interface InspectableObject {
  id: string;
  name: string;
  category: string;
  x: number; // Percentage coordinate (0-100)
  y: number; // Percentage coordinate (0-100)
  description: string;
  inspectionText: string;
  revealedEvidenceId?: string;
  isRedHerring?: boolean;
  hint?: string;
}

export interface LocationScene {
  id: string;
  name: string;
  category: string;
  description: string;
  atmosphericNotes: string;
  inspectables: InspectableObject[];
}

export interface TimelineEvent {
  id: string;
  timeStr: string;
  timestampMinutes: number;
  title: string;
  status: 'confirmed' | 'uncertain' | 'contradicted' | 'hidden';
  trueDescription: string;
  evidenceId?: string;
  suspectId?: string | null;
  conflictingStatement?: string;
  notes?: string;
}

export interface DialogueTopic {
  id: string;
  label: string;
  response: string;
  requiresClueId?: string;
}

export interface DialogueTree {
  greeting: string;
  topics: DialogueTopic[];
}

export interface BoardConnection {
  id: string;
  fromId: string;
  toId: string;
  label: string;
  color?: string;
}

export interface CaseNote {
  id: string;
  caseId: string;
  category: 'suspect' | 'timeline' | 'evidence' | 'theory' | 'general';
  title: string;
  content: string;
  tags?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeductionSubmission {
  suspectId: string;
  whatHappenedId: string;
  methodId: string;
  motiveId: string;
  evidenceIds: string[];
  reasoning: string;
}

export interface DeductionFeedback {
  category: 'suspect' | 'whatHappened' | 'method' | 'motive' | 'evidence';
  correct: boolean;
  text: string;
}

export interface EndingData {
  verdict: string;
  grade: string;
  title: string;
  summary: string;
  epilogue: string;
}

export interface DeductionResult {
  score: number;
  maxScore: number;
  verdict: string;
  grade: string;
  ending: EndingData;
  feedback: DeductionFeedback[];
  fullDebrief: string;
  timestamp: string;
}

export interface GameState {
  caseId: string;
  currentScreen: ScreenType;
  currentLocationId: string;
  currentSuspectId: string | null;
  discoveredEvidenceIds: string[];
  inspectedObjectIds: string[];
  visitedLocationIds: string[];
  revealedContradictionIds: string[];
  unlockedDialogueTopicIds: string[];
  unlockedTimelineEventIds: string[];
  evidenceConnections: BoardConnection[];
  boardPositions: Record<string, { x: number; y: number }>;
  notes: CaseNote[];
  playtimeSeconds: number;
  soundMuted: boolean;
  soundVolume: number;
  finalDeduction: DeductionSubmission | null;
  evaluationResult: DeductionResult | null;
  historyLogs: { timestamp: string; message: string; type: 'info' | 'clue' | 'contradiction' }[];
}
