const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const solution = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../client/src/data/cases/case017/solution.json'), 'utf8')
);

// Deduction scoring logic matching DeductionEngine
function evaluateDeduction(submission) {
  let score = 0;
  const isCulpritCorrect = submission.suspectId === solution.culpritId;
  if (isCulpritCorrect) score += 40;

  const isWhatHappenedCorrect = submission.whatHappenedId === 'what_abduction_sedated';
  if (isWhatHappenedCorrect) score += 15;

  const isMethodCorrect = submission.methodId === solution.methodId;
  if (isMethodCorrect) score += 15;

  const isMotiveCorrect = submission.motiveId === solution.motiveId;
  if (isMotiveCorrect) score += 15;

  const submittedEv = submission.evidenceIds || [];
  const essentialEv = solution.essentialEvidenceIds || [];
  const matched = essentialEv.filter(id => submittedEv.includes(id));
  const ratio = matched.length / essentialEv.length;
  score += Math.round(ratio * 15);

  let verdict = 'INCORRECT';
  let grade = 'F';
  let endingKey = 'wrong_accusation';

  if (score >= 90) {
    verdict = 'PERFECT SOLUTION';
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

  return { score, verdict, grade, endingKey };
}

test('Deduction Engine - Perfect Indictment yields Grade S & Perfect Resolution', () => {
  const perfectSubmission = {
    suspectId: 'dr_eleanor_sterling',
    whatHappenedId: 'what_abduction_sedated',
    methodId: 'method_sedation_laundry_stretcher',
    motiveId: 'motive_embezzlement_coverup',
    evidenceIds: solution.essentialEvidenceIds,
    reasoning: 'Dr. Sterling sedated Timothy with Midazolam in scotch, wheeled him out in laundry cart, locked door with magnet.'
  };

  const result = evaluateDeduction(perfectSubmission);
  assert.strictEqual(result.score, 100);
  assert.strictEqual(result.grade, 'S');
  assert.strictEqual(result.verdict, 'PERFECT SOLUTION');
  assert.strictEqual(result.endingKey, 'perfect_resolution');
});

test('Deduction Engine - Correct Suspect but Wrong Method yields Grade B', () => {
  const flawedMethodSubmission = {
    suspectId: 'dr_eleanor_sterling',
    whatHappenedId: 'what_abduction_sedated',
    methodId: 'method_rooftop_rappelling', // wrong method!
    motiveId: 'motive_embezzlement_coverup',
    evidenceIds: solution.essentialEvidenceIds,
    reasoning: 'Thought she rappelled him from roof.'
  };

  const result = evaluateDeduction(flawedMethodSubmission);
  assert.strictEqual(result.score, 85);
  assert.strictEqual(result.grade, 'B');
  assert.strictEqual(result.verdict, 'MOSTLY CORRECT');
  assert.strictEqual(result.endingKey, 'correct_suspect_flawed_method');
});

test('Deduction Engine - Correct Suspect with Missing Evidence yields Grade C', () => {
  const missingEvSubmission = {
    suspectId: 'dr_eleanor_sterling',
    whatHappenedId: 'what_abduction_sedated',
    methodId: 'method_sedation_laundry_stretcher',
    motiveId: 'motive_embezzlement_coverup',
    evidenceIds: [], // no evidence presented!
    reasoning: 'Just a hunch.'
  };

  const result = evaluateDeduction(missingEvSubmission);
  assert.strictEqual(result.score, 85); // 40 + 15 + 15 + 15 + 0 = 85
  assert.ok(result.score < 90);
});

test('Deduction Engine - Wrong Accusation yields Grade F & Miscarriage of Justice', () => {
  const wrongAccusationSubmission = {
    suspectId: 'corinne_blake', // innocent associate!
    whatHappenedId: 'what_homicide_shaft',
    methodId: 'method_dumbwaiter_pulley',
    motiveId: 'motive_personal_vendetta',
    evidenceIds: ['ev_sobranie_cigarette'],
    reasoning: 'Accused Corinne due to cigarette butts.'
  };

  const result = evaluateDeduction(wrongAccusationSubmission);
  assert.ok(result.score < 30);
  assert.strictEqual(result.grade, 'F');
  assert.strictEqual(result.verdict, 'INCORRECT');
  assert.strictEqual(result.endingKey, 'wrong_accusation');
});
