import React, { useState } from 'react';
import { useGame } from '../../game/state/GameStateContext';
import { audio } from '../../services/audioService';
import {
  FileText,
  CheckCircle,
  X,
  Sparkles,
  ArrowRight,
  Puzzle
} from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const TornDocumentModal: React.FC<Props> = ({ onClose }) => {
  const { gameState, completeMiniGame, completeTask } = useGame();
  const [placedPieces, setPlacedPieces] = useState<number[]>(
    gameState.miniGamesCompleted?.shreddedDocument ? [1, 2, 3, 4] : []
  );
  const [isCompleted, setIsCompleted] = useState<boolean>(
    !!gameState.miniGamesCompleted?.shreddedDocument
  );

  const togglePiece = (pieceId: number) => {
    if (isCompleted) return;
    audio.playCardFlip();
    setPlacedPieces(prev => {
      const next = prev.includes(pieceId) ? prev.filter(p => p !== pieceId) : [...prev, pieceId];
      if (next.length === 4) {
        audio.playStamp();
        audio.playEvidenceFound();
        setIsCompleted(true);
        completeMiniGame('shreddedDocument');
        completeTask('task_reconstruct_ledger');
      }
      return next;
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '780px', background: '#0a0d14', border: '2px solid #eab308' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Puzzle size={24} color="#eab308" />
            <div>
              <h2 style={{ fontSize: '1.4rem', color: '#fff', fontWeight: '800', margin: 0 }}>
                CRIME LAB: SHREDDED DOCUMENT RECONSTRUCTION
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '2px 0 0' }}>
                Item #03C: Torn Codicil Fragments (Recovered from Penthouse Hearth)
              </p>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Instructions banner */}
        <div style={{
          background: 'rgba(234, 179, 8, 0.1)',
          border: '1px solid #ca8a04',
          padding: '10px 16px',
          borderRadius: '6px',
          fontSize: '0.85rem',
          color: '#fef08a',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <span>
            {isCompleted
              ? '✓ All fragments assembled! Legal codicil fully deciphered.'
              : 'CLICK the torn scraps below to assemble them onto the illuminated forensic lightboard!'}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
            PIECES PLACED: {placedPieces.length} / 4
          </span>
        </div>

        {/* Light Table Board */}
        <div style={{
          background: isCompleted ? 'rgba(254, 240, 138, 0.08)' : '#020617',
          border: isCompleted ? '2px solid #facc15' : '2px dashed #475569',
          borderRadius: '8px',
          padding: '24px',
          minHeight: '260px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          position: 'relative',
          marginBottom: '20px',
          boxShadow: isCompleted ? '0 0 30px rgba(250, 204, 21, 0.3)' : 'none',
          transition: 'all 0.3s ease'
        }}>
          {/* Piece 1: Top Left */}
          <div
            onClick={() => togglePiece(1)}
            style={{
              background: placedPieces.includes(1) ? '#fef3c7' : 'rgba(30, 41, 59, 0.4)',
              border: placedPieces.includes(1) ? '1px solid #d97706' : '1px dashed #64748b',
              color: placedPieces.includes(1) ? '#78350f' : '#64748b',
              padding: '16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: 'serif',
              fontSize: '0.9rem',
              lineHeight: 1.5,
              transition: 'all 0.2s'
            }}
          >
            {placedPieces.includes(1) ? (
              <div>
                <strong>LAST WILL & CODICIL AMENDMENT</strong>
                <p style={{ margin: '6px 0 0', fontSize: '0.8rem' }}>
                  "I, Timothy Vance, being of sound mind, hereby permanently revoke..."
                </p>
              </div>
            ) : (
              <div style={{ textAlign: 'center', paddingTop: '20px' }}>[CLICK TO PLACE FRAGMENT 1]</div>
            )}
          </div>

          {/* Piece 2: Top Right */}
          <div
            onClick={() => togglePiece(2)}
            style={{
              background: placedPieces.includes(2) ? '#fef3c7' : 'rgba(30, 41, 59, 0.4)',
              border: placedPieces.includes(2) ? '1px solid #d97706' : '1px dashed #64748b',
              color: placedPieces.includes(2) ? '#78350f' : '#64748b',
              padding: '16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: 'serif',
              fontSize: '0.9rem',
              lineHeight: 1.5,
              transition: 'all 0.2s'
            }}
          >
            {placedPieces.includes(2) ? (
              <div>
                <strong style={{ color: '#b91c1c' }}>$40,000,000 RESEARCH GRANT CANCELLED</strong>
                <p style={{ margin: '6px 0 0', fontSize: '0.8rem' }}>
                  "...all previous funding to Dr. Eleanor Sterling & St. Jude Neurological Clinic is terminated immediately..."
                </p>
              </div>
            ) : (
              <div style={{ textAlign: 'center', paddingTop: '20px' }}>[CLICK TO PLACE FRAGMENT 2]</div>
            )}
          </div>

          {/* Piece 3: Bottom Left */}
          <div
            onClick={() => togglePiece(3)}
            style={{
              background: placedPieces.includes(3) ? '#fef3c7' : 'rgba(30, 41, 59, 0.4)',
              border: placedPieces.includes(3) ? '1px solid #d97706' : '1px dashed #64748b',
              color: placedPieces.includes(3) ? '#78350f' : '#64748b',
              padding: '16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: 'serif',
              fontSize: '0.9rem',
              lineHeight: 1.5,
              transition: 'all 0.2s'
            }}
          >
            {placedPieces.includes(3) ? (
              <div>
                <strong>BENEFICIARY REALLOCATION</strong>
                <p style={{ margin: '6px 0 0', fontSize: '0.8rem' }}>
                  "...assets to be held in trust for Corinne Blake upon my legal demise or departure..."
                </p>
              </div>
            ) : (
              <div style={{ textAlign: 'center', paddingTop: '20px' }}>[CLICK TO PLACE FRAGMENT 3]</div>
            )}
          </div>

          {/* Piece 4: Bottom Right */}
          <div
            onClick={() => togglePiece(4)}
            style={{
              background: placedPieces.includes(4) ? '#fef3c7' : 'rgba(30, 41, 59, 0.4)',
              border: placedPieces.includes(4) ? '1px solid #d97706' : '1px dashed #64748b',
              color: placedPieces.includes(4) ? '#78350f' : '#64748b',
              padding: '16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: 'serif',
              fontSize: '0.9rem',
              lineHeight: 1.5,
              transition: 'all 0.2s'
            }}
          >
            {placedPieces.includes(4) ? (
              <div>
                <strong>EXECUTED SIGNATURE</strong>
                <p style={{ margin: '6px 0 0', fontStyle: 'italic', fontSize: '0.85rem' }}>
                  Signed: Timothy Vance, Nov 20, 11:15 PM
                </p>
              </div>
            ) : (
              <div style={{ textAlign: 'center', paddingTop: '20px' }}>[CLICK TO PLACE FRAGMENT 4]</div>
            )}
          </div>
        </div>

        {/* Codicil Meaning & Confirmed Motive */}
        {isCompleted && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid var(--accent-emerald)',
            borderRadius: '6px',
            padding: '12px 16px',
            marginBottom: '16px',
            animation: 'fadeInModal 0.3s ease-out'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)', fontWeight: '700' }}>
              <CheckCircle size={18} />
              <span>MOTIVE SECURED: FINANCIAL RUIN & MEDICAL FRAUD</span>
            </div>
            <p style={{ color: '#d1fae5', fontSize: '0.85rem', margin: '4px 0 0' }}>
              Dr. Eleanor Sterling learned she was being disinherited of $40 million at 11:15 PM. She had 30 minutes to drug Timothy Vance before the legal amendment was registered!
            </p>
          </div>
        )}

        {/* Modal Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {!isCompleted && (
            <button
              className="btn-secondary"
              style={{ fontSize: '0.8rem' }}
              onClick={() => {
                setPlacedPieces([1, 2, 3, 4]);
                setIsCompleted(true);
                completeMiniGame('shreddedDocument');
                completeTask('task_reconstruct_ledger');
                audio.playStamp();
              }}
            >
              Assemble All Automatically →
            </button>
          )}

          <div style={{ marginLeft: 'auto' }}>
            <button className="btn-primary" onClick={onClose}>
              {isCompleted ? 'Catalog Secret Codicil into Evidence' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
