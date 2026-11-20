import { DeductionSubmission, DeductionResult, DeductionFeedback } from '../state/types';
import solutionData from '../../data/cases/case017/solution.json';

export class DeductionEngine {
  /**
   * Evaluates the player's final indictment submission against the case solution
   */
  public static evaluateDeduction(submission: DeductionSubmission): DeductionResult {
    const solution = solutionData;
    let score = 0;
    const maxScore = 100;
    const feedback: DeductionFeedback[] = [];

    // 1. Suspect check (40 points)
    const isCulpritCorrect = submission.suspectId === solution.culpritId;
    if (isCulpritCorrect) {
      score += 40;
      feedback.push({
        category: 'suspect',
        correct: true,
        text: 'Correct Perpetrator Identified: Dr. Eleanor Sterling was the orchestrator of the kidnapping.'
      });
    } else {
      feedback.push({
        category: 'suspect',
        correct: false,
        text: 'Incorrect Suspect Accused: The person you indicted was either a victim of circumstance, a bribed accomplice, or an innocent red herring.'
      });
    }

    // 2. What Happened check (15 points)
    const isWhatHappenedCorrect = submission.whatHappenedId === 'what_abduction_sedated';
    if (isWhatHappenedCorrect) {
      score += 15;
      feedback.push({
        category: 'whatHappened',
        correct: true,
        text: 'Accurate Incident Theory: Timothy Vance was incapacitated via pharmaceutical sedation and extracted while unconscious.'
      });
    } else {
      feedback.push({
        category: 'whatHappened',
        correct: false,
        text: 'Flawed Event Assessment: Physical forensics refute voluntary flight or murder inside the utility shaft.'
      });
    }

    // 3. Method check (15 points)
    const isMethodCorrect = submission.methodId === solution.methodId;
    if (isMethodCorrect) {
      score += 15;
      feedback.push({
        category: 'method',
        correct: true,
        text: 'Locked-Room & Escape Solved: Chemical sedation in scotch, laundry hamper transport, magnetic deadbolt rotation, and decoy 11:47 PM timer.'
      });
    } else {
      feedback.push({
        category: 'method',
        correct: false,
        text: 'Incorrect Execution Method: The physical evidence disproves window rappelling, dumbwaiter ropes, or direct firearm coercion.'
      });
    }

    // 4. Motive check (15 points)
    const isMotiveCorrect = submission.motiveId === solution.motiveId;
    if (isMotiveCorrect) {
      score += 15;
      feedback.push({
        category: 'motive',
        correct: true,
        text: 'Criminal Motive Uncovered: Dr. Sterling sought to suppress the $2.4M forensic audit exposing her clinic\'s money laundering.'
      });
    } else {
      feedback.push({
        category: 'motive',
        correct: false,
        text: 'Flawed Motive Deduction: While gambling debts and espionage existed in the building, they were incidental to the primary crime.'
      });
    }

    // 5. Supporting Evidence check (15 points)
    const submittedEv = Array.isArray(submission.evidenceIds) ? submission.evidenceIds : [];
    const essentialEv = solution.essentialEvidenceIds || [];
    const matchedEv = essentialEv.filter(id => submittedEv.includes(id));
    const evidenceRatio = essentialEv.length > 0 ? matchedEv.length / essentialEv.length : 1;
    const evidencePoints = Math.round(evidenceRatio * 15);
    score += evidencePoints;

    feedback.push({
      category: 'evidence',
      correct: evidenceRatio >= 0.7,
      text: `Corroborating Evidence: Selected ${matchedEv.length} of ${essentialEv.length} indispensable forensic cornerstones (${evidencePoints}/15 pts).`
    });

    // Determine verdict, grade, and ending narrative
    let verdict = 'INCORRECT';
    let grade = 'F';
    let endingKey = 'wrong_accusation';

    if (score >= 90) {
      verdict = 'PERFECT RESOLUTION';
      grade = 'S';
      endingKey = 'perfect_resolution';
    } else if (score >= 70 && isCulpritCorrect) {
      verdict = 'MOSTLY CORRECT';
      grade = 'B';
      endingKey = 'correct_suspect_flawed_method';
    } else if (score >= 50 && isCulpritCorrect) {
      verdict = 'PARTIALLY CORRECT';
      grade = 'C';
      endingKey = 'incomplete_case';
    } else if (isCulpritCorrect) {
      verdict = 'PARTIALLY CORRECT';
      grade = 'D';
      endingKey = 'missed_critical_evidence';
    } else {
      verdict = 'INCORRECT';
      grade = 'F';
      endingKey = 'wrong_accusation';
    }

    const ending = (solution.endings as Record<string, any>)[endingKey] || {
      verdict,
      grade,
      title: verdict,
      summary: 'The investigation was logged in precinct records.',
      epilogue: 'The case remains in department archives.'
    };

    return {
      score,
      maxScore,
      verdict,
      grade,
      ending,
      feedback,
      fullDebrief: solution.fullDebrief,
      timestamp: new Date().toISOString()
    };
  }
}
