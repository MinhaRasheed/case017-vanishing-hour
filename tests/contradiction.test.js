const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

// Load case data
const suspects = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../client/src/data/cases/case017/suspects.json'), 'utf8')
);

// Contradiction evaluator logic (matching client engine)
function evaluateContradiction(suspect, evidenceId) {
  if (!suspect || !evidenceId) return { isContradiction: false };
  const match = suspect.contradictions.find(c => c.evidenceId === evidenceId);
  if (match) {
    return {
      isContradiction: true,
      contradiction: match,
      unlockedClueId: match.unlockedClueId,
      response: match.responseConfession
    };
  }
  return {
    isContradiction: false,
    response: 'Irrelevant evidence deflection'
  };
}

test('Contradiction Engine - Gregory Vance Access Card contradiction', () => {
  const gregory = suspects.find(s => s.id === 'gregory_vance');
  assert.ok(gregory, 'Gregory Vance profile must exist');

  // Presenting access card log should shatter his boiler room alibi
  const res = evaluateContradiction(gregory, 'ev_access_card_terminal');
  assert.strictEqual(res.isContradiction, true);
  assert.strictEqual(res.unlockedClueId, 'ev_super_confession');
  assert.match(res.response, /five grand/i);
});

test('Contradiction Engine - Corinne Blake Volvo parking ticket contradiction', () => {
  const corinne = suspects.find(s => s.id === 'corinne_blake');
  assert.ok(corinne, 'Corinne Blake profile must exist');

  // Presenting parking ticket should shatter Greenwich bed alibi
  const res = evaluateContradiction(corinne, 'ev_volvo_ticket');
  assert.strictEqual(res.isContradiction, true);
  assert.strictEqual(res.unlockedClueId, 'ev_corinne_admission');
  assert.match(res.response, /I lied about Greenwich/i);
});

test('Contradiction Engine - Dr. Eleanor Sterling Midazolam ampoule contradiction', () => {
  const eleanor = suspects.find(s => s.id === 'dr_eleanor_sterling');
  assert.ok(eleanor, 'Dr. Eleanor Sterling profile must exist');

  // Presenting Midazolam batch ampoule should force criminal confession
  const res = evaluateContradiction(eleanor, 'ev_discarded_ampoule');
  assert.strictEqual(res.isContradiction, true);
  assert.strictEqual(res.unlockedClueId, 'ev_full_criminal_confession');
  assert.match(res.response, /Catskills/i);
});

test('Contradiction Engine - Irrelevant evidence returns non-contradiction', () => {
  const toby = suspects.find(s => s.id === 'toby_ray');
  assert.ok(toby, 'Toby Ray profile must exist');

  // Presenting unrelated clue like laundry cart to Toby should be deflected
  const res = evaluateContradiction(toby, 'ev_laundry_cart_dna');
  assert.strictEqual(res.isContradiction, false);
});
