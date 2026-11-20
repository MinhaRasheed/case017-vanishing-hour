const express = require('express');
const router = express.Router();
const db = require('../db');
const crypto = require('crypto');

// List notes for a case
router.get('/', (req, res) => {
  try {
    const { case_id } = req.query;
    if (!case_id) {
      return res.status(400).json({ success: false, error: 'case_id is required' });
    }
    const stmt = db.prepare('SELECT * FROM notes WHERE case_id = ? ORDER BY updated_at DESC');
    const rows = stmt.all(case_id);
    return res.json({ success: true, notes: rows });
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create note
router.post('/', (req, res) => {
  try {
    const { case_id, category, title, content, tags } = req.body;
    if (!case_id || !content) {
      return res.status(400).json({ success: false, error: 'case_id and content are required' });
    }
    const id = `note_${crypto.randomUUID()}`;
    const stmt = db.prepare(`
      INSERT INTO notes (id, case_id, category, title, content, tags)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, case_id, category || 'general', title || '', content, tags || '');
    return res.json({ success: true, id, message: 'Note created' });
  } catch (err) {
    console.error('Error creating note:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update note
router.put('/:id', (req, res) => {
  try {
    const { category, title, content, tags } = req.body;
    const stmt = db.prepare(`
      UPDATE notes SET
        category = COALESCE(?, category),
        title = COALESCE(?, title),
        content = COALESCE(?, content),
        tags = COALESCE(?, tags),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(category, title, content, tags, req.params.id);
    return res.json({ success: true, message: 'Note updated' });
  } catch (err) {
    console.error('Error updating note:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete note
router.delete('/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM notes WHERE id = ?');
    stmt.run(req.params.id);
    return res.json({ success: true, message: 'Note deleted' });
  } catch (err) {
    console.error('Error deleting note:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
