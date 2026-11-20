const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const timeline = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../client/src/data/cases/case017/timeline.json'), 'utf8')
);

// Timeline logic
function evaluateTimeline(events, discoveredEvidenceIds) {
  return events.map(evt => {
    if (evt.status === 'hidden' && evt.evidenceId && !discoveredEvidenceIds.includes(evt.evidenceId)) {
      return { ...evt, status: 'hidden' };
    }
    const isContradicted = evt.status === 'contradicted' && evt.evidenceId && discoveredEvidenceIds.includes(evt.evidenceId);
    return {
      ...evt,
      status: isContradicted ? 'contradicted' : (evt.status === 'hidden' ? 'confirmed' : evt.status)
    };
  });
}

function computeCompleteness(events, discoveredEvidenceIds) {
  const known = events.filter(e => {
    if (e.status === 'confirmed') return true;
    if (e.evidenceId && discoveredEvidenceIds.includes(e.evidenceId)) return true;
    return false;
  });
  return Math.round((known.length / events.length) * 100);
}

test('Timeline Engine - Events are strictly ordered chronologically', () => {
  for (let i = 0; i < timeline.length - 1; i++) {
    assert.ok(
      timeline[i].timestampMinutes <= timeline[i + 1].timestampMinutes,
      `Event ${timeline[i].id} must not be after ${timeline[i + 1].id}`
    );
  }
});

test('Timeline Engine - Hidden intervals unlock when corroborating clue discovered', () => {
  const sedationEvent = timeline.find(e => e.id === 'evt_1138');
  assert.strictEqual(sedationEvent.status, 'hidden');

  // Without clue, event remains hidden
  let evaluated = evaluateTimeline(timeline, []);
  assert.strictEqual(evaluated.find(e => e.id === 'evt_1138').status, 'hidden');

  // Discovering Toby's audio tape unlocks this interval
  evaluated = evaluateTimeline(timeline, ['ev_tape_transcript']);
  assert.strictEqual(evaluated.find(e => e.id === 'evt_1138').status, 'confirmed');
});

test('Timeline Engine - Completeness increases with evidence discoveries', () => {
  const initialCompleteness = computeCompleteness(timeline, []);
  assert.ok(initialCompleteness > 0, 'Initial confirmed events exist');

  const withAllEvidence = computeCompleteness(timeline, [
    'ev_volvo_ticket',
    'ev_visitor_logbook',
    'ev_whiskey_sedative',
    'ev_tape_transcript',
    'ev_access_card_terminal',
    'ev_panic_alarm_timer',
    'ev_laundry_cart_dna',
    'ev_neodymium_magnet',
    'ev_ambulance_tire_tracks'
  ]);

  assert.strictEqual(withAllEvidence, 100, 'All timeline events resolved');
});
