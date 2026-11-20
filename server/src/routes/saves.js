const express = require('express');
const router = express.Router();
const db = require('../db');
const crypto = require('crypto');

// List saves for a case
router.get('/', (req, res) => {
  try {
    const { case_id } = req.query;
    let stmt;
    if (case_id) {
      stmt = db.prepare('SELECT id, case_id, slot_name, playtime_seconds, current_location, created_at, updated_at FROM saves WHERE case_id = ? ORDER BY updated_at DESC');
      const rows = stmt.all(case_id);
      return res.json({ success: true, saves: rows });
    } else {
      stmt = db.prepare('SELECT id, case_id, slot_name, playtime_seconds, current_location, created_at, updated_at FROM saves ORDER BY updated_at DESC');
      const rows = stmt.all();
      return res.json({ success: true, saves: rows });
    }
  } catch (err) {
    console.error('Error fetching saves:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get single save
router.get('/:id', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM saves WHERE id = ?');
    const row = stmt.get(req.params.id);
    if (!row) {
      return res.status(404).json({ success: false, error: 'Save not found' });
    }
    return res.json({
      success: true,
      save: {
        ...row,
        gameState: JSON.parse(row.game_state_json)
      }
    });
  } catch (err) {
    console.error('Error fetching save:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Save or update game state
router.post('/', (req, res) => {
  try {
    const { id, case_id, slot_name, playtime_seconds, current_location, gameState } = req.body;
    
    if (!case_id || !gameState) {
      return res.status(400).json({ success: false, error: 'Missing case_id or gameState' });
    }

    const saveId = id || `save_${crypto.randomUUID()}`;
    const slot = slot_name || 'AutoSave';
    const playtime = playtime_seconds || 0;
    const location = current_location || 'apartment_4b';
    const stateJson = JSON.stringify(gameState);

    const upsertStmt = db.prepare(`
      INSERT INTO saves (id, case_id, slot_name, playtime_seconds, current_location, game_state_json, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        slot_name = excluded.slot_name,
        playtime_seconds = excluded.playtime_seconds,
        current_location = excluded.current_location,
        game_state_json = excluded.game_state_json,
        updated_at = CURRENT_TIMESTAMP
    `);

    upsertStmt.run(saveId, case_id, slot, playtime, location, stateJson);

    return res.json({ success: true, id: saveId, message: 'Game saved successfully' });
  } catch (err) {
    console.error('Error saving game:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete save
router.delete('/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM saves WHERE id = ?');
    stmt.run(req.params.id);
    return res.json({ success: true, message: 'Save deleted' });
  } catch (err) {
    console.error('Error deleting save:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
