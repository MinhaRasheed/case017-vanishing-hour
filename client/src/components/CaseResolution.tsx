import React, { useState } from 'react';
import { useGame } from '../game/state/GameStateContext';
import {
  Award,
  CheckCircle,
  XCircle,
  RotateCcw,
  Search,
  BookOpen,
  FileText,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const CaseResolution: React.FC = () => {
  const { gameState, caseBundle, restartCase, setScreen } = useGame();
  const [showFullDebrief, setShowFullDebrief] = useState<boolean>(true);

  const res = gameState.evaluationResult;
  if (!res) {
    return (
      <div className="case-content" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2>No case resolution recorded yet.</h2>
        <button className="btn-primary" onClick={() => setScreen('deduction')} style={{ marginTop: '20px' }}>
          Go to Final Deduction
        </button>
      </div>
    );
  }

  const isPerfect = res.grade === 'S';
  const isPassing = res.score >= 50;

  const getStampClass = (grade: string) => {
    switch (grade) {
      case 'S': return 'stamp-green';
      case 'B': return 'stamp-cyan';
      case 'C': return 'stamp-amber';
      default: return 'stamp-red';
    }
  };

  return (
    <div className="case-content" style={{ maxWidth: '950px' }}>
      {/* Formal Case Report Folder */}
      <div style={{
        background: '#161924',
        border: `2px solid ${isPerfect ? 'var(--accent-emerald)' : isPassing ? 'var(--accent-amber)' : 'var(--accent-red)'}`,
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
        marginBottom: '32px'
      }}>
        {/* Report Top Banner */}
        <div style={{
          background: '#0e121a',
          borderBottom: '1px solid #1e293b',
          padding: '20px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)', fontSize: '0.85rem' }}>
              DISTRICT ATTORNEY // SPECIAL FORENSIC PROSECUTION
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginTop: '2px' }}>
              INDICTMENT DISPOSITION REPORT: CASE 017
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span className={`stamp ${getStampClass(res.grade)}`} style={{ fontSize: '1.2rem', padding: '6px 16px' }}>
              GRADE: {res.grade}
            </span>
          </div>
        </div>

        {/* Verdict Summary Header */}
        <div style={{ padding: '32px 32px 20px 32px' }}>
          <div style={{ marginBottom: '8px' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              color: isPerfect ? 'var(--accent-emerald)' : isPassing ? 'var(--accent-amber)' : 'var(--accent-red)',
              fontSize: '1rem',
              fontWeight: '800',
              letterSpacing: '0.08em'
            }}>
              OFFICIAL VERDICT: {res.verdict}
            </span>
          </div>

          <h1 style={{
            fontSize: '2.4rem',
            fontWeight: '800',
            color: '#f8fafc',
            lineHeight: 1.2,
            marginBottom: '14px'
          }}>
            {res.ending.title}
          </h1>

          <div style={{
            display: 'inline-block',
            background: '#0a0d14',
            padding: '6px 14px',
            borderRadius: '6px',
            border: '1px solid #1e293b',
            color: 'var(--accent-cyan)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.95rem',
            marginBottom: '20px'
          }}>
            FORENSIC SCORE: <strong>{res.score}</strong> / {res.maxScore} POINTS
          </div>

          <div style={{
            background: '#0d111a',
            borderLeft: `4px solid ${isPerfect ? 'var(--accent-emerald)' : isPassing ? 'var(--accent-amber)' : 'var(--accent-red)'}`,
            padding: '18px 22px',
            borderRadius: '6px',
            lineHeight: 1.6,
            fontSize: '1rem',
            color: '#cbd5e1',
            marginBottom: '20px'
          }}>
            {res.ending.summary}
          </div>

          <div style={{
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px dashed var(--accent-amber)',
            padding: '14px 18px',
            borderRadius: '6px',
            fontSize: '0.9rem',
            color: 'var(--text-parchment)',
            fontStyle: 'italic',
            lineHeight: 1.5,
            marginBottom: '28px'
          }}>
            <strong>Courtroom Epilogue:</strong> {res.ending.epilogue}
          </div>

          {/* Categorical Feedback Breakdown */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{
              fontSize: '1rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent-cyan)',
              marginBottom: '12px'
            }}>
              LEGAL INDICTMENT EVALUATION BREAKDOWN:
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {res.feedback.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#0a0d14',
                    border: '1px solid #1e293b',
                    borderRadius: '6px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  {item.correct ? (
                    <CheckCircle size={20} color="var(--accent-emerald)" />
                  ) : (
                    <XCircle size={20} color="var(--accent-red)" />
                  )}
                  <span style={{ fontSize: '0.9rem', color: item.correct ? '#fff' : '#fca5a5' }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Minute-by-Minute Full Debrief Accordion */}
          <div style={{
            background: '#0b0e17',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            marginBottom: '24px',
            overflow: 'hidden'
          }}>
            <button
              onClick={() => setShowFullDebrief(!showFullDebrief)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: '700'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)' }}>
                <FileText size={18} /> THE TRUE ANATOMY OF THE CRIME // MINUTE-BY-MINUTE DEBRIEF
              </span>
              {showFullDebrief ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {showFullDebrief && (
              <div style={{
                padding: '0 20px 20px 20px',
                borderTop: '1px solid #1e293b',
                color: '#cbd5e1',
                lineHeight: 1.7,
                fontSize: '0.95rem',
                whiteSpace: 'pre-line'
              }}>
                {res.fullDebrief}
              </div>
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div style={{
          background: '#0d111a',
          borderTop: '1px solid #1e293b',
          padding: '20px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            className="btn-secondary"
            onClick={() => setScreen('evidence_viewer')}
          >
            <Search size={16} /> Review Evidence Locker
          </button>

          <button
            className="btn-primary"
            onClick={() => {
              if (window.confirm('Replay this case? Your current investigation state will be reset for a fresh investigation.')) {
                restartCase();
                setScreen('main_menu');
              }
            }}
          >
            <RotateCcw size={16} /> Re-Open Case 017
          </button>
        </div>
      </div>
    </div>
  );
};
