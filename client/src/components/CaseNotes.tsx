import React, { useState } from 'react';
import { useGame } from '../game/state/GameStateContext';
import { CaseNote } from '../game/state/types';
import {
  BookOpen,
  Plus,
  Trash2,
  Tag,
  Calendar,
  Save,
  CheckCircle,
  FileEdit
} from 'lucide-react';

export const CaseNotes: React.FC = () => {
  const { gameState, saveNote, deleteNote } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isDrafting, setIsDrafting] = useState<boolean>(false);

  // New Note Draft State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CaseNote['category']>('theory');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const categories = [
    { id: 'all', label: 'All Notes' },
    { id: 'theory', label: 'Suspect Theories' },
    { id: 'timeline', label: 'Timeline Deductions' },
    { id: 'evidence', label: 'Forensic Clues' },
    { id: 'general', label: 'General Directives' }
  ];

  const filteredNotes = gameState.notes.filter(note =>
    selectedCategory === 'all' ? true : note.category === selectedCategory
  );

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    saveNote({
      caseId: gameState.caseId,
      title: title.trim() || 'Untitled Field Observation',
      category,
      content: content.trim(),
      tags: tags.trim()
    });

    // Reset draft
    setTitle('');
    setContent('');
    setTags('');
    setIsDrafting(false);
  };

  return (
    <div className="case-content" style={{ maxWidth: '1000px' }}>
      {/* Title & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen size={28} color="var(--accent-amber)" /> Detective's Field Notebook
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Record personal hypotheses, timeline discrepancies, suspect alibi holes, and working theories.
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={() => setIsDrafting(!isDrafting)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} />
          <span>{isDrafting ? 'Cancel Entry' : 'New Note Entry'}</span>
        </button>
      </div>

      {/* New Note Form */}
      {isDrafting && (
        <form
          onSubmit={handleSaveDraft}
          style={{
            background: '#131722',
            border: '2px solid var(--accent-amber)',
            borderRadius: '10px',
            padding: '24px',
            marginBottom: '28px',
            boxShadow: 'var(--shadow-md)',
            animation: 'fadeInModal 0.2s ease-out'
          }}
        >
          <h3 style={{ color: 'var(--accent-amber)', fontSize: '1.1rem', marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>
            NEW DETECTIVE MEMORANDUM
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                MEMO TITLE:
              </label>
              <input
                type="text"
                placeholder="e.g. Hypothesis on the 11:47 PM Alarm..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                style={{
                  width: '100%',
                  background: '#0a0d14',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  color: '#fff',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                CATEGORY:
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                style={{
                  width: '100%',
                  background: '#0a0d14',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  color: '#fff',
                  fontSize: '0.9rem'
                }}
              >
                <option value="theory">Suspect Theory</option>
                <option value="timeline">Timeline Deduction</option>
                <option value="evidence">Forensic Clue</option>
                <option value="general">General Directive</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              OBSERVATIONS & REASONING:
            </label>
            <textarea
              rows={4}
              placeholder="Record your reasoning, contradictions observed, or connections between clues..."
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              style={{
                width: '100%',
                background: '#0a0d14',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '12px 14px',
                color: '#fff',
                fontSize: '0.9rem',
                lineHeight: 1.5,
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ width: '50%' }}>
              <input
                type="text"
                placeholder="Tags (comma-separated, e.g. magnet, sedative, lift)"
                value={tags}
                onChange={e => setTags(e.target.value)}
                style={{
                  width: '100%',
                  background: '#0a0d14',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsDrafting(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                <Save size={16} /> Save to Leather Journal
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Category Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            style={{
              background: selectedCategory === c.id ? 'var(--accent-amber)' : 'var(--bg-card)',
              color: selectedCategory === c.id ? '#000' : 'var(--text-muted)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '8px 14px',
              fontSize: '0.8rem',
              fontWeight: selectedCategory === c.id ? '700' : '500',
              cursor: 'pointer'
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Notes Entries List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredNotes.map(note => (
          <div
            key={note.id}
            className="detective-card"
            style={{
              background: '#161a24',
              borderLeft: '4px solid var(--accent-amber)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div>
                <span className="stamp stamp-amber" style={{ fontSize: '0.65rem', marginBottom: '6px' }}>
                  {note.category.toUpperCase()}
                </span>
                <h3 style={{ fontSize: '1.15rem', color: '#fff', fontWeight: '700', marginTop: '2px' }}>
                  {note.title}
                </h3>
              </div>
              <button
                onClick={() => deleteNote(note.id)}
                style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }}
                title="Delete note"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <p style={{ color: '#e2e8f0', fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-line', marginBottom: '12px' }}>
              {note.content}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-faint)' }}>
              <span>Recorded: {new Date(note.createdAt).toLocaleString()}</span>
              {note.tags && (
                <div style={{ display: 'flex', gap: '4px' }}>
                  {note.tags.split(',').map((t, idx) => (
                    <span key={idx} style={{ background: '#0a0d14', padding: '2px 6px', borderRadius: '4px', border: '1px solid #1e293b' }}>
                      #{t.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
