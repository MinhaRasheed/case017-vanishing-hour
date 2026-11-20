import React, { useState, useRef } from 'react';
import { useGame } from '../game/state/GameStateContext';
import { BoardConnection } from '../game/state/types';
import {
  Share2,
  Plus,
  Trash2,
  Users,
  Search,
  Link2,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const EvidenceBoard: React.FC = () => {
  const { gameState, caseBundle, addConnection, removeConnection, updateBoardPosition } = useGame();
  const [sourceNodeId, setSourceNodeId] = useState<string>('');
  const [targetNodeId, setTargetNodeId] = useState<string>('');
  const [connectionLabel, setConnectionLabel] = useState<string>('Alibi Contradiction');
  const [showConnector, setShowConnector] = useState<boolean>(false);

  const boardRef = useRef<HTMLDivElement>(null);

  // Available nodes: 4 Suspects + Discovered Evidence
  const suspectNodes = caseBundle.suspects.map(s => ({
    id: s.id,
    type: 'suspect',
    title: s.name,
    subtitle: s.occupation,
    color: 'var(--accent-red)'
  }));

  const evidenceNodes = caseBundle.evidence
    .filter(e => gameState.discoveredEvidenceIds.includes(e.id))
    .map(e => ({
      id: e.id,
      type: 'evidence',
      title: e.name,
      subtitle: e.category,
      color: 'var(--accent-cyan)'
    }));

  const allNodes = [...suspectNodes, ...evidenceNodes];

  // Default coordinate calculations for nodes if not stored
  const getNodePosition = (nodeId: string, index: number, isSuspect: boolean) => {
    if (gameState.boardPositions[nodeId]) {
      return gameState.boardPositions[nodeId];
    }
    // Arrange suspects on top, evidence in rows below
    if (isSuspect) {
      return { x: 80 + index * 260, y: 60 };
    } else {
      const col = index % 4;
      const row = Math.floor(index / 4);
      return { x: 80 + col * 260, y: 220 + row * 160 };
    }
  };

  const handleCreateConnection = () => {
    if (!sourceNodeId || !targetNodeId || sourceNodeId === targetNodeId) return;
    addConnection(sourceNodeId, targetNodeId, connectionLabel);
    setSourceNodeId('');
    setTargetNodeId('');
    setShowConnector(false);
  };

  // Dragging support
  const handleDragEnd = (nodeId: string, e: React.DragEvent) => {
    if (!boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const x = Math.max(20, Math.min(rect.width - 220, e.clientX - rect.left - 100));
    const y = Math.max(20, Math.min(rect.height - 120, e.clientY - rect.top - 50));
    updateBoardPosition(nodeId, x, y);
  };

  return (
    <div className="case-content" style={{ maxWidth: '1600px' }}>
      {/* Title & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>
            Visual Investigation Board // Conspiracy Corkboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Map suspects to physical clues, motives, and access logs. Draw red yarn connections to deduce the truth.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className="btn-primary"
            onClick={() => setShowConnector(!showConnector)}
            style={{ fontSize: '0.85rem' }}
          >
            <Link2 size={16} />
            <span>{showConnector ? 'Close Linker' : 'Draw String Connection'}</span>
          </button>
        </div>
      </div>

      {/* String Linker Drawer */}
      {showConnector && (
        <div style={{
          background: '#121622',
          border: '1px solid var(--accent-red)',
          borderRadius: '8px',
          padding: '16px 20px',
          marginBottom: '16px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          animation: 'fadeInModal 0.2s ease-out'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              ORIGIN CARD:
            </label>
            <select
              value={sourceNodeId}
              onChange={e => setSourceNodeId(e.target.value)}
              style={{
                background: '#0a0d14',
                color: '#fff',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '8px 12px',
                fontSize: '0.85rem'
              }}
            >
              <option value="">-- Choose Origin Card --</option>
              {allNodes.map(n => (
                <option key={n.id} value={n.id}>
                  [{n.type.toUpperCase()}] {n.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              TARGET CARD:
            </label>
            <select
              value={targetNodeId}
              onChange={e => setTargetNodeId(e.target.value)}
              style={{
                background: '#0a0d14',
                color: '#fff',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '8px 12px',
                fontSize: '0.85rem'
              }}
            >
              <option value="">-- Choose Target Card --</option>
              {allNodes.map(n => (
                <option key={n.id} value={n.id}>
                  [{n.type.toUpperCase()}] {n.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              REASONING / CONNECTION LABEL:
            </label>
            <select
              value={connectionLabel}
              onChange={e => setConnectionLabel(e.target.value)}
              style={{
                background: '#0a0d14',
                color: '#fff',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '8px 12px',
                fontSize: '0.85rem'
              }}
            >
              <option value="Alibi Contradiction">Alibi Contradiction</option>
              <option value="Direct Physical Link">Direct Physical Link</option>
              <option value="Embezzlement Motive">Embezzlement Motive</option>
              <option value="Sedative Instrument">Sedative Instrument</option>
              <option value="Keycard Override">Keycard Override</option>
              <option value="Decoy Timer">Decoy Timer</option>
              <option value="Extraction Transport">Extraction Transport</option>
            </select>
          </div>

          <button
            className="btn-primary"
            style={{ marginTop: '18px' }}
            disabled={!sourceNodeId || !targetNodeId || sourceNodeId === targetNodeId}
            onClick={handleCreateConnection}
          >
            Pin String Connection
          </button>
        </div>
      )}

      {/* The Pinboard / Corkboard Viewport */}
      <div
        ref={boardRef}
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '750px',
          background: '#14110e',
          backgroundImage: 'radial-gradient(#2d2116 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
          border: '4px solid #3d2b1f',
          borderRadius: '12px',
          boxShadow: 'inset 0 0 50px rgba(0, 0, 0, 0.9)',
          overflow: 'hidden'
        }}
      >
        {/* SVG Canvas for Yarn / String Connections */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 5
          }}
        >
          {gameState.evidenceConnections.map(conn => {
            const sourceIndex = allNodes.findIndex(n => n.id === conn.fromId);
            const targetIndex = allNodes.findIndex(n => n.id === conn.toId);
            if (sourceIndex === -1 || targetIndex === -1) return null;

            const fromPos = getNodePosition(conn.fromId, sourceIndex, sourceIndex < 4);
            const toPos = getNodePosition(conn.toId, targetIndex, targetIndex < 4);

            // Card center calculations: approx card width 220, height 90
            const x1 = fromPos.x + 110;
            const y1 = fromPos.y + 45;
            const x2 = toPos.x + 110;
            const y2 = toPos.y + 45;

            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;

            return (
              <g key={conn.id}>
                {/* Red yarn string */}
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                  filter="drop-shadow(0 0 3px rgba(239, 68, 68, 0.6))"
                />
                {/* Connection Label Tag */}
                <text
                  x={midX}
                  y={midY - 8}
                  fill="#fef08a"
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="bold"
                  textAnchor="middle"
                  style={{ textShadow: '0 1px 4px #000' }}
                >
                  {conn.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Pinned Suspect Cards */}
        {allNodes.map((node, idx) => {
          const isSuspect = node.type === 'suspect';
          const pos = getNodePosition(node.id, idx, isSuspect);

          return (
            <div
              key={node.id}
              draggable
              onDragEnd={e => handleDragEnd(node.id, e)}
              style={{
                position: 'absolute',
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                width: '220px',
                background: isSuspect ? '#1e2433' : '#111520',
                border: isSuspect ? '2px solid var(--accent-red)' : '1px solid var(--border-strong)',
                borderRadius: '6px',
                padding: '10px 14px',
                boxShadow: '0 6px 15px rgba(0, 0, 0, 0.7)',
                cursor: 'grab',
                zIndex: 10,
                userSelect: 'none'
              }}
            >
              {/* Pushpin at top center */}
              <div style={{
                position: 'absolute',
                top: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: isSuspect ? '#ef4444' : '#38bdf8',
                boxShadow: '0 2px 5px rgba(0,0,0,0.8), inset 0 0 3px #fff',
                border: '1px solid rgba(0,0,0,0.5)'
              }} />

              <div style={{
                fontSize: '0.65rem',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                color: isSuspect ? 'var(--accent-red)' : 'var(--accent-cyan)',
                marginBottom: '2px',
                marginTop: '4px'
              }}>
                {node.type}
              </div>

              <div style={{
                fontSize: '0.9rem',
                fontWeight: '700',
                color: '#fff',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {node.title}
              </div>

              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginTop: '2px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {node.subtitle}
              </div>
            </div>
          );
        })}
      </div>

      {/* Connection Manager List */}
      {gameState.evidenceConnections.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
            Active Yarn Connections ({gameState.evidenceConnections.length})
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {gameState.evidenceConnections.map(conn => {
              const from = allNodes.find(n => n.id === conn.fromId)?.title || conn.fromId;
              const to = allNodes.find(n => n.id === conn.toId)?.title || conn.toId;

              return (
                <div
                  key={conn.id}
                  style={{
                    background: '#121622',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span style={{ color: '#fff', fontWeight: '600' }}>{from}</span>
                  <span style={{ color: 'var(--accent-red)' }}>→ [{conn.label}] →</span>
                  <span style={{ color: '#fff', fontWeight: '600' }}>{to}</span>
                  <button
                    onClick={() => removeConnection(conn.id)}
                    style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', display: 'flex' }}
                    title="Remove connection"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
