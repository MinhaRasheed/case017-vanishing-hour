import caseData from './cases/case017/case.json';
import suspectsData from './cases/case017/suspects.json';
import locationsData from './cases/case017/locations.json';
import evidenceData from './cases/case017/evidence.json';
import dialogueData from './cases/case017/dialogue.json';
import timelineData from './cases/case017/timeline.json';
import solutionData from './cases/case017/solution.json';

export interface CaseBundle {
  case: typeof caseData;
  suspects: typeof suspectsData;
  locations: typeof locationsData;
  evidence: typeof evidenceData;
  dialogue: typeof dialogueData;
  timeline: typeof timelineData;
  solution: typeof solutionData;
}

const embeddedCases: Record<string, CaseBundle> = {
  case017: {
    case: caseData,
    suspects: suspectsData,
    locations: locationsData,
    evidence: evidenceData,
    dialogue: dialogueData,
    timeline: timelineData,
    solution: solutionData
  }
};

export function getCaseBundle(caseId: string = 'case017'): CaseBundle {
  const bundle = embeddedCases[caseId];
  if (!bundle) {
    throw new Error(`Case bundle not found for ID: ${caseId}`);
  }
  return bundle;
}

export function listAvailableCases() {
  return Object.keys(embeddedCases).map(id => {
    const b = embeddedCases[id];
    return {
      id: b.case.id,
      title: b.case.title,
      subtitle: b.case.subtitle,
      difficulty: b.case.difficulty,
      estimatedTime: b.case.estimatedTime,
      summary: b.case.summary
    };
  });
}
