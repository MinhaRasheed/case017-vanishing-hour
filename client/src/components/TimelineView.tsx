import React, { useState } from 'react';
import { useGame } from '../game/state/GameStateContext';
import { TimelineEvent } from '../game/state/types';
import { TimelineEngine } from '../game/engine/TimelineEngine';
import {
  Clock,
  CheckCircle,
  AlertOctagon,
  HelpCircle,
  Search,
  Eye,
  Calendar,
  ShieldCheck
} from 'lucide-react';

export const TimelineView: React.FC = () => {
  const { gameState, caseBundle, setScreen } = useGame();
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  const evaluatedEvents = TimelineEngine.evaluateTimelineState(
    caseBundle.timeline as any,
    gameState.discoveredEvidenceIds,
    gameState.revealedContradictionIds
  );

  const completeness = TimelineEngine.computeCompleteness(
    caseBundle.timeline as any,
    gameState.discoveredEvidenceIds
  );

  return (
    <div className="case-content">
      {/* Title & Reconstruction Progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>
            Chronological Timeline Reconstruction
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Reconstruct the critical hour (10:15 PM - 12:15 AM). Expose the decoy 11:47 PM panic alarm.
          </p>
        </div>
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '10px 18px',
          textAlign: 'right'
        }}>
          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)' }}>
            TIMELINE COMPLETENESS
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>
            {completeness}%
          </div>
        </div>
      </div>

      {/* Timeline Layout */}
      <div style={{
        position: 'relative',
        padding: '20px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Central Spine line */}
        <div style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '120px',
          width: '2px',
          background: 'var(--border-subtle)'
        }} />

        {evaluatedEvents.map((evt, idx) => {
          const isHidden = evt.status === 'hidden';
          const isContradicted = evt.status === 'contradicted';
          const isConfirmed = evt.status === 'confirmed';

          let statusBadge = <span className="stamp stamp-cyan">UNRESOLVED</span>;
          let nodeColor = 'var(--border-strong)';

          if (isConfirmed) {
            statusBadge = <span className="stamp stamp-green">CONFIRMED EVENT</span>;
            nodeColor = 'var(--accent-emerald)';
          } else if (isContradicted) {
            statusBadge = <span className="stamp stamp-red">CONTRADICTED / DECOY</span>;
            nodeColor = 'var(--accent-red)';
          } else if (isHidden) {
            statusBadge = <span className="stamp stamp-amber">MISSING FORENSIC INTERVAL</span>;
            nodeColor = 'var(--accent-amber)';
          }

          return (
            <div
              key={evt.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '24px',
                position: 'relative'
              }}
            >
              {/* Timestamp column */}
              <div style={{
                width: '100px',
                textAlign: 'right',
                fontFamily: 'var(--font-mono)',
                fontWeight: '700',
                color: isContradicted ? 'var(--accent-red)' : '#cbd5e1',
                fontSize: '0.95rem',
                paddingTop: '6px'
              }}>
                {evt.timeStr}
              </div>

              {/* Node Indicator */}
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: nodeColor,
                border: '4px solid var(--bg-primary)',
                boxShadow: `0 0 10px ${nodeColor}`,
                zIndex: 2,
                marginTop: '6px',
                cursor: 'pointer'
              }} />

              {/* Event Card */}
              <div
                className="detective-card"
                style={{
                  flex: 1,
                  borderLeft: `4px solid ${nodeColor}`,
                  cursor: isHidden ? 'default' : 'pointer',
                  opacity: isHidden ? 0.7 : 1
                }}
                onClick={() => !isHidden && setSelectedEvent(evt)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.05rem', color: '#fff', fontWeight: '700' }}>
                    {evt.title}
                  </h3>
                  {statusBadge}
                </div>

                <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '8px' }}>
                  {evt.trueDescription}
                </p>

                {evt.conflictingStatement && (
                  <div style={{
                    marginTop: '8px',
                    padding: '8px 12px',
                    background: 'rgba(230, 57, 70, 0.1)',
                    border: '1px solid var(--accent-red)',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    color: '#fca5a5'
                  }}>
                    <strong>Contradicted Sworn Statement:</strong> {evt.conflictingStatement}
                  </div>
                )}

                {evt.notes && !isHidden && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-faint)', fontStyle: 'italic', marginTop: '6px' }}>
                    Detective Note: {evt.notes}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Event Details Modal */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className="stamp stamp-cyan" style={{ fontSize: '0.75rem', marginBottom: '6px' }}>
                  {selectedEvent.timeStr} // VERIFIED SEQUENCE
                </span>
                <h2 style={{ fontSize: '1.4rem', color: '#fff', fontWeight: '800' }}>
                  {selectedEvent.title}
                </h2>
              </div>
              <button className="icon-btn" onClick={() => setSelectedEvent(null)}>✕</button>
            </div>

            <p style={{ fontSize: '1rem', color: '#e2e8f0', lineHeight: 1.6, marginBottom: '16px' }}>
              {selectedEvent.trueDescription}
            </p>

            {selectedEvent.evidenceId && (
              <div style={{
                background: '#0a0d14',
                border: '1px solid #1e293b',
                padding: '14px',
                borderRadius: '6px',
                marginBottom: '20px'
              }}>
                <div style={{ color: 'var(--accent-amber)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                  CORROBORATING RECOVERED EVIDENCE:
                </div>
                <div style={{ color: '#fff', fontWeight: '600', fontSize: '0.95rem' }}>
                  {caseBundle.evidence.find(e => e.id === selectedEvent.evidenceId)?.name || selectedEvent.evidenceId}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn-secondary" onClick={() => setSelectedEvent(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
