import { SuspectProfile, ContradictionDef } from '../state/types';

export interface ContradictionCheckResult {
  isContradiction: boolean;
  contradiction?: ContradictionDef;
  unlockedClueId?: string;
  response: string;
}

export class ContradictionEngine {
  /**
   * Evaluates if presented evidence contradicts any statement by the suspect
   */
  public static evaluateContradiction(
    suspect: SuspectProfile,
    evidenceId: string
  ): ContradictionCheckResult {
    if (!suspect || !evidenceId) {
      return {
        isContradiction: false,
        response: "You must choose a piece of evidence to present."
      };
    }

    // Check if the suspect has a contradiction matching this evidence ID
    const match = suspect.contradictions.find(c => c.evidenceId === evidenceId);

    if (match) {
      return {
        isContradiction: true,
        contradiction: match,
        unlockedClueId: match.unlockedClueId,
        response: match.responseConfession
      };
    }

    // Contextual responses when presented evidence is irrelevant to this suspect
    const genericDeflections = [
      `"${suspect.name} glances at the evidence with complete indifference: 'I fail to see what this has to do with my testimony, detective.'"`,
      `"${suspect.name} shakes their head: 'You are grasping at shadows. That proves absolutely nothing regarding my whereabouts.'"`,
      `"${suspect.name} frowns coldly: 'Is this supposed to rattle me? Present something relevant or let me go.'"`,
      `"${suspect.name} leans back: 'Interesting artifact, but it doesn't contradict a single word I've told you.'"`,
    ];

    const randomIndex = Math.abs(evidenceId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % genericDeflections.length;

    return {
      isContradiction: false,
      response: genericDeflections[randomIndex]
    };
  }

  /**
   * Returns list of contradictions already resolved for a suspect
   */
  public static getResolvedContradictions(
    suspect: SuspectProfile,
    revealedIds: string[]
  ): ContradictionDef[] {
    return suspect.contradictions.filter(c => revealedIds.includes(c.id));
  }
}
