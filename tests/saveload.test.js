const test = require('node:test');
const assert = require('node:assert');
const path = require('path');
const Database = require('../server/node_modules/better-sqlite3');

test('SQLite Database - Save & Load Engine Integration', () => {
  // Use in-memory SQLite database for testing
  const db = new Database(':memory:');
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE saves (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL,
      slot_name TEXT DEFAULT 'AutoSave',
      playtime_seconds INTEGER DEFAULT 0,
      current_location TEXT,
      game_state_json TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE notes (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL,
      category TEXT DEFAULT 'general',
      title TEXT,
      content TEXT NOT NULL,
      tags TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Test 1: Insert Save
  const testState = {
    caseId: 'case017',
    discoveredEvidenceIds: ['ev_whiskey_sedative', 'ev_neodymium_magnet'],
    currentLocationId: 'security_room',
    playtimeSeconds: 420
  };

  const insertSave = db.prepare(`
    INSERT INTO saves (id, case_id, slot_name, playtime_seconds, current_location, game_state_json)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  insertSave.run('save_test_01', 'case017', 'Slot 1', 420, 'security_room', JSON.stringify(testState));

  // Test 2: Retrieve Save
  const getSave = db.prepare('SELECT * FROM saves WHERE id = ?');
  const loaded = getSave.get('save_test_01');
  assert.ok(loaded, 'Save must exist in database');
  assert.strictEqual(loaded.case_id, 'case017');
  assert.strictEqual(loaded.current_location, 'security_room');

  const parsedState = JSON.parse(loaded.game_state_json);
  assert.deepStrictEqual(parsedState.discoveredEvidenceIds, ['ev_whiskey_sedative', 'ev_neodymium_magnet']);

  // Test 3: Insert & Query Notes
  const insertNote = db.prepare(`
    INSERT INTO notes (id, case_id, category, title, content, tags)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  insertNote.run('note_01', 'case017', 'theory', 'Magnetic deadbolt theory', 'Investigate circular scuffs on brass latch', 'magnet, lock');

  const notesStmt = db.prepare('SELECT * FROM notes WHERE case_id = ?');
  const allNotes = notesStmt.all('case017');
  assert.strictEqual(allNotes.length, 1);
  assert.strictEqual(allNotes[0].title, 'Magnetic deadbolt theory');

  db.close();
});
