import React, { useState } from 'react';
import { useGame } from '../game/state/GameStateContext';
import { EvidenceItem, EvidenceCategory } from '../game/state/types';
import { EvidenceGraphic } from './graphics/EvidenceIllustrations';
import { InteractiveForensicTool } from './graphics/InteractiveForensicTools';
import {
  Search,
  Filter,
  CheckCircle,
  Tag,
  MapPin,
  Clock,
  Share2,
  AlertCircle,
  X,
  FileText
} from 'lucide-react';

export const EvidenceViewer: React.FC = () => {
  const { gameState, caseBundle, setScreen, addConnection } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);

  const discoveredEvidence = (caseBundle.evidence as unknown as EvidenceItem[]).filter(e =>
    gameState.discoveredEvidenceIds.includes(e.id)
  );

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Evidence' },
    { id: 'physical', label: 'Physical' },
    { id: 'forensic', label: 'Forensic Lab' },
    { id: 'digital', label: 'Digital / Logs' },
    { id: 'document', label: 'Documents' },
    { id: 'surveillance', label: 'Surveillance' },
    { id: 'testimony', label: 'Sworn Testimony' }
  ];

  const filtered = discoveredEvidence.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesQuery =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  const getImportanceStamp = (imp: string) => {
    switch (imp) {
      case 'critical':
        return <span className="stamp stamp-red">CRITICAL PROOF</span>;
      case 'high':
        return <span className="stamp stamp-amber">HIGH VALUE</span>;
      case 'misleading':
        return <span className="stamp stamp-cyan">RED HERRING</span>;
      default:
        return <span className="stamp stamp-green">{imp}</span>;
    }
  };

  return (
    <div className="case-content">
      {/* Title & Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>
            Evidence Locker & Chain of Custody
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Cataloged artifacts, lab spectrometry, surveillance recordings, and forensic documents.
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Recovered: <strong style={{ color: 'var(--accent-cyan)' }}>{discoveredEvidence.length}</strong> of {caseBundle.evidence.length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        background: '#121622',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: '12px 18px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '14px',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                background: selectedCategory === cat.id ? 'var(--accent-red)' : 'var(--bg-card)',
                color: selectedCategory === cat.id ? '#fff' : 'var(--text-muted)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '0.8rem',
                fontWeight: '500',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '240px' }}>
          <Search size={16} color="var(--text-faint)" style={{ position: 'absolute', left: 10, top: 10 }} />
          <input
            type="text"
            placeholder="Search clues, tags, locations..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: '#0a0d14',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '8px 12px 8px 34px',
              color: '#fff',
              fontSize: '0.85rem'
            }}
          />
        </div>
      </div>

      {/* Evidence Cards Grid */}
      {filtered.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'var(--bg-card)',
          borderRadius: '8px',
          border: '1px dashed var(--border-subtle)'
        }}>
          <Search size={40} color="var(--text-faint)" style={{ marginBottom: '12px' }} />
          <h3 style={{ color: '#fff', marginBottom: '6px' }}>No Evidence Found in this Filter</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto' }}>
            Search crime scenes (Apartment 4B, 4th Floor Corridor, Security Room, Basement) or interrogate suspects to unlock further proof.
          </p>
        </div>
      ) : (
        <div className="grid-3">
          {filtered.map(item => (
            <div
              key={item.id}
              className="detective-card"
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              onClick={() => setSelectedEvidence(item)}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--accent-cyan)'
                  }}>
                    {item.category}
                  </span>
                  {getImportanceStamp(item.importance)}
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <EvidenceGraphic id={item.id} size={70} />
                  <div>
                    <h3 style={{ fontSize: '1.05rem', color: '#fff', fontWeight: '700', marginBottom: '4px' }}>
                      {item.name}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--text-faint)', marginBottom: '10px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} /> {item.locationFound}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {item.timestampFound}
                  </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {item.tags.map(tag => (
                    <span
                      key={tag}
                      style={{
                        background: '#0a0d14',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        color: 'var(--text-faint)',
                        border: '1px solid #1e293b'
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Forensic Inspection Modal */}
      {selectedEvidence && (
        <div className="modal-overlay" onClick={() => setSelectedEvidence(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
                <EvidenceGraphic id={selectedEvidence.id} size={110} />
                <div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '6px' }}>
                    <span className="stamp stamp-cyan" style={{ fontSize: '0.7rem' }}>{selectedEvidence.category}</span>
                    {getImportanceStamp(selectedEvidence.importance)}
                  </div>
                  <h2 style={{ fontSize: '1.4rem', color: '#fff', fontWeight: '700' }}>
                    {selectedEvidence.name}
                  </h2>
                </div>
              </div>
              <button className="icon-btn" onClick={() => setSelectedEvidence(null)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '18px', borderBottom: '1px solid #1e293b', paddingBottom: '12px' }}>
              <span><strong>Recovered At:</strong> {selectedEvidence.locationFound}</span>
              <span><strong>Timestamp:</strong> {selectedEvidence.timestampFound}</span>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <h4 style={{ color: 'var(--accent-amber)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>
                PHYSICAL SUMMARY:
              </h4>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#e2e8f0' }}>
                {selectedEvidence.description}
              </p>
            </div>

            {/* Interactive Forensic Mini-Workbench / Tool */}
            <InteractiveForensicTool evidenceId={selectedEvidence.id} />

            <div style={{
              background: '#0a0d14',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <h4 style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
                FORENSIC LAB ANALYSIS & RELEVANCE:
              </h4>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#cbd5e1' }}>
                {selectedEvidence.detailedAnalysis}
              </p>
            </div>

            {/* Suspect Contradiction link */}
            {selectedEvidence.contradictionForSuspect && (
              <div style={{
                background: 'rgba(230, 57, 70, 0.1)',
                border: '1px solid var(--accent-red)',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ color: 'var(--accent-red)', fontWeight: '700', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                    POTENTIAL ALIBI CONTRADICTION DETECTED:
                  </div>
                  <div style={{ color: '#fff', fontSize: '0.85rem', marginTop: '2px' }}>
                    This clue directly disputes sworn statements made by <strong>{selectedEvidence.contradictionForSuspect}</strong>.
                  </div>
                </div>
                <button
                  className="btn-primary"
                  style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                  onClick={() => {
                    setSelectedEvidence(null);
                    setScreen('interrogation');
                  }}
                >
                  Confront Suspect →
                </button>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                className="btn-secondary"
                style={{ fontSize: '0.85rem' }}
                onClick={() => {
                  setScreen('evidence_board');
                  setSelectedEvidence(null);
                }}
              >
                <Share2 size={16} /> Open on Evidence Board
              </button>

              <button className="btn-secondary" onClick={() => setSelectedEvidence(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
