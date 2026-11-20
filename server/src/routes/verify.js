const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const db = require('../db');

const casesDir = path.resolve(__dirname, '../../client/src/data/cases');

// Evaluate final deduction submission
router.post('/deduction', (req, res) => {
  try {
    const { case_id, suspectId, methodId, motiveId, evidenceIds, reasoning } = req.body;
    
    if (!case_id || !suspectId) {
      return res.status(400).json({ success: false, error: 'Missing case_id or suspectId' });
    }

    const solutionPath = path.join(casesDir, case_id, 'solution.json');
    if (!fs.existsSync(solutionPath)) {
      return res.status(404).json({ success: false, error: 'Case solution data not found' });
    }

    const solution = JSON.parse(fs.readFileSync(solutionPath, 'utf8'));

    // Scoring engine
    let score = 0;
    const maxScore = 100;
    const feedback = [];

    // 1. Suspect check (40 points)
    const isCulpritCorrect = suspectId === solution.culpritId;
    if (isCulpritCorrect) {
      score += 40;
      feedback.push({ category: 'suspect', correct: true, text: 'Correct perpetrator identified.' });
    } else {
      feedback.push({ category: 'suspect', correct: false, text: 'Incorrect suspect accused. The evidence points elsewhere.' });
    }

    // 2. Method check (20 points)
    const isMethodCorrect = methodId === solution.methodId;
    if (isMethodCorrect) {
      score += 20;
      feedback.push({ category: 'method', correct: true, text: 'Accurate deduction of the locked-room abduction mechanism.' });
    } else {
      feedback.push({ category: 'method', correct: false, text: 'The proposed method contradicts physical forensic marks.' });
    }

    // 3. Motive check (20 points)
    const isMotiveCorrect = motiveId === solution.motiveId;
    if (isMotiveCorrect) {
      score += 20;
      feedback.push({ category: 'motive', correct: true, text: 'Exact criminal motive uncovered.' });
    } else {
      feedback.push({ category: 'motive', correct: false, text: 'Flawed motive theory. Look closer at the financial records.' });
    }

    // 4. Evidence check (20 points)
    const submittedEvidence = Array.isArray(evidenceIds) ? evidenceIds : [];
    const requiredEvidence = solution.essentialEvidenceIds || [];
    const matchedEvidence = requiredEvidence.filter(id => submittedEvidence.includes(id));
    const evidenceRatio = requiredEvidence.length > 0 ? matchedEvidence.length / requiredEvidence.length : 1;
    const evidencePoints = Math.round(evidenceRatio * 20);
    score += evidencePoints;

    feedback.push({
      category: 'evidence',
      correct: evidenceRatio >= 0.75,
      text: `Presented ${matchedEvidence.length} of ${requiredEvidence.length} key pieces of corroborating proof.`
    });

    // Determine verdict & ending
    let verdict = 'INCORRECT';
    let endingKey = 'wrong_accusation';

    if (score >= 90) {
      verdict = 'PERFECT SOLUTION';
      endingKey = 'perfect_resolution';
    } else if (score >= 70 && isCulpritCorrect) {
      verdict = 'MOSTLY CORRECT';
      endingKey = 'correct_suspect_flawed_method';
    } else if (score >= 50 && isCulpritCorrect) {
      verdict = 'PARTIALLY CORRECT';
      endingKey = 'incomplete_case';
    } else if (isCulpritCorrect) {
      verdict = 'PARTIALLY CORRECT';
      endingKey = 'missed_critical_evidence';
    } else {
      verdict = 'INCORRECT';
      endingKey = 'wrong_accusation';
    }

    const endingData = solution.endings[endingKey] || {
      title: verdict,
      summary: 'The investigation was filed.'
    };

    // Record submission into SQLite
    const id = `sub_${crypto.randomUUID()}`;
    const insertStmt = db.prepare(`
      INSERT INTO deduction_submissions (id, case_id, suspect_id, score, verdict, answers_json)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    insertStmt.run(id, case_id, suspectId, score, verdict, JSON.stringify({
      methodId,
      motiveId,
      evidenceIds: submittedEvidence,
      reasoning: reasoning || '',
      feedback
    }));

    return res.json({
      success: true,
      submissionId: id,
      score,
      maxScore,
      verdict,
      ending: endingData,
      feedback,
      fullDebrief: solution.fullDebrief
    });
  } catch (err) {
    console.error('Error verifying deduction:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
