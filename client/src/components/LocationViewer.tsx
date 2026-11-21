import React, { useState } from 'react';
import { useGame } from '../game/state/GameStateContext';
import { InspectableObject, LocationScene, EvidenceItem } from '../game/state/types';
import { SceneIllustration } from './graphics/SceneIllustrations';
import { EvidenceGraphic } from './graphics/EvidenceIllustrations';
import { CharacterPortrait } from './graphics/CharacterPortraits';
import { audio } from '../services/audioService';
import {
  MapPin,
  Search,
  CheckCircle,
  Eye,
  AlertTriangle,
  ArrowRight,
  Shield,
  X,
  Sparkles,
  Star,
  Award,
  Zap,
  HelpCircle
} from 'lucide-react';

export const LocationViewer: React.FC = () => {
  const { gameState, caseBundle, setLocation, inspectObject, setScreen } = useGame();
  const [selectedInspectable, setSelectedInspectable] = useState<InspectableObject | null>(null);
  const [isUVMode, setIsUVMode] = useState<boolean>(false);
  const [hintHighlightId, setHintHighlightId] = useState<string | null>(null);
  const [combo, setCombo] = useState<number>(1);
  const [inspectionResult, setInspectionResult] = useState<{
    evidenceDiscovered: EvidenceItem | null;
    inspectionText: string;
  } | null>(null);

  const currentLocation: LocationScene =
    caseBundle.locations.find(l => l.id === gameState.currentLocationId) || caseBundle.locations[0];

  const handleInspect = (obj: InspectableObject) => {
    setCombo(prev => Math.min(5, prev + 1));
    const res = inspectObject(obj.id);
    setSelectedInspectable(obj);
    setInspectionResult(res);
  };

  const handleHint = () => {
    const uninspected = currentLocation.inspectables.find(
      o => !gameState.inspectedObjectIds.includes(o.id)
    );
    if (uninspected) {
      audio.playStamp();
      setHintHighlightId(uninspected.id);
      setTimeout(() => setHintHighlightId(null), 4000);
    }
  };

  const getPartnerTip = (locId: string) => {
    switch (locId) {
      case 'apartment_4b':
        return "Look closely at that scotch glass on the coffee table and the digital alarm keypad. The alarm screamed at 11:47 PM, but was anyone actually alive in the room?";
      case 'hallway_4th':
        return "Check the carpet runner. Those damp wheel treads lead straight to the freight elevator landing—not the front lobby.";
      case 'security_room':
        return "Look for tampering around the master power toggle and Gregory Vance's maintenance locker.";
      case 'rooftop':
        return "Notice those crushed Sobranie cigarettes with red lipstick on the ventilation parapet—someone was running surveillance.";
      case 'parking_garage':
        return "Check the loading bay for ambulance tyre treads and search the trash compactor for pharmaceutical glass!";
      default:
        return "Search every corner of this scene, Detective. Every object tells a story.";
    }
  };

  const handleCloseModal = () => {
    setSelectedInspectable(null);
    setInspectionResult(null);
  };

  return (
    <div className="case-content">
      {/* Location Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '12px',
        marginBottom: '20px',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        {caseBundle.locations.map(loc => {
          const isCurrent = loc.id === currentLocation.id;
          const inspectedCount = loc.inspectables.filter(o => gameState.inspectedObjectIds.includes(o.id)).length;
          const allInspected = inspectedCount === loc.inspectables.length;

          return (
            <button
              key={loc.id}
              onClick={() => {
                setLocation(loc.id);
                handleCloseModal();
              }}
              style={{
                background: isCurrent ? 'var(--accent-red)' : 'var(--bg-card)',
                color: isCurrent ? '#fff' : 'var(--text-muted)',
                border: isCurrent ? '1px solid var(--accent-red)' : '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '10px 16px',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              <MapPin size={16} />
              <span>{loc.name}</span>
              <span style={{
                fontSize: '0.7rem',
                background: isCurrent ? 'rgba(0,0,0,0.3)' : 'var(--bg-primary)',
                padding: '2px 6px',
                borderRadius: '10px',
                color: allInspected ? 'var(--accent-emerald)' : 'inherit'
              }}>
                {inspectedCount}/{loc.inspectables.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Location Info Banner */}
      <div style={{
        background: '#121620',
        border: '1px solid #1e293b',
        borderRadius: '8px',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#fff', fontWeight: '700' }}>{currentLocation.name}</h2>
            <span className="stamp stamp-cyan" style={{ fontSize: '0.7rem' }}>{currentLocation.category}</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '850px' }}>
            {currentLocation.description}
          </p>
        </div>
        <div style={{
          textAlign: 'right',
          fontStyle: 'italic',
          color: 'var(--text-faint)',
          fontSize: '0.8rem',
          maxWidth: '300px'
        }}>
          "{currentLocation.atmosphericNotes}"
        </div>
      </div>

      {/* Interactive 2D Crime Scene Graphic Canvas */}
      <div style={{
        position: 'relative',
        width: '100%',
        minHeight: '440px',
        background: '#090d16',
        border: '2px solid var(--border-subtle)',
        borderRadius: '10px',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.8)',
        marginBottom: '24px',
        overflow: 'hidden'
      }}>
        {/* Render Vector Graphic Illustration of the Crime Scene */}
        <SceneIllustration
          locationId={currentLocation.id}
          inspectables={currentLocation.inspectables}
          inspectedIds={gameState.inspectedObjectIds}
          onInspect={handleInspect}
          isUVMode={isUVMode}
        />

        {/* Scene HUD watermark */}
        <div style={{
          position: 'absolute',
          top: 14,
          left: 18,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: isUVMode ? '#c084fc' : 'var(--accent-amber)',
          letterSpacing: '0.1em',
          background: 'rgba(10, 12, 16, 0.85)',
          padding: '4px 10px',
          borderRadius: '4px',
          border: isUVMode ? '1px solid #9333ea' : '1px solid var(--border-subtle)',
          pointerEvents: 'none'
        }}>
          {isUVMode
            ? `UV FORENSIC SPECTRUM: ${currentLocation.name.toUpperCase()} // HIDDEN FLUORESCENCE ACTIVE`
            : `CRIME SCENE: ${currentLocation.name.toUpperCase()} // CLICK OBJECTS TO EXAMINE FORENSICS`}
        </div>

        {/* UV Blacklight Toggle Control */}
        <button
          onClick={() => {
            audio.playStamp();
            setIsUVMode(!isUVMode);
          }}
          style={{
            position: 'absolute',
            top: 12,
            right: 18,
            background: isUVMode ? 'linear-gradient(135deg, #7e22ce, #9333ea)' : 'rgba(15, 23, 42, 0.85)',
            color: isUVMode ? '#fff' : '#c084fc',
            border: isUVMode ? '1px solid #e9d5ff' : '1px solid #9333ea',
            borderRadius: '6px',
            padding: '6px 14px',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: isUVMode ? '0 0 16px rgba(147, 51, 234, 0.6)' : undefined,
            zIndex: 25,
            transition: 'all 0.2s'
          }}
        >
          <Sparkles size={14} />
          <span>{isUVMode ? 'UV BLACKLIGHT ACTIVE [ON]' : 'ENABLE UV FORENSIC LENS'}</span>
        </button>

        {/* Pulsing Hint Beacon if triggered */}
        {hintHighlightId && (
          <div style={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#eab308',
            color: '#000',
            fontWeight: '800',
            padding: '8px 18px',
            borderRadius: '20px',
            boxShadow: '0 0 24px #eab308',
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            animation: 'objectionZoom 0.3s ease-out'
          }}>
            <Search size={16} />
            <span>HINT: EXAMINE "{currentLocation.inspectables.find(o => o.id === hintHighlightId)?.name.toUpperCase()}"</span>
          </div>
        )}
      </div>

      {/* Criminal Case Style: Target Item Search Ribbon Dock */}
      <div style={{
        background: '#0a0d14',
        border: '2px solid #334155',
        borderRadius: '10px',
        padding: '14px 18px',
        marginBottom: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px',
        boxShadow: '0 6px 20px rgba(0,0,0,0.6)'
      }}>
        {/* Left: Target Clues Ribbon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
          <span style={{
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: '700',
            color: '#38bdf8',
            marginRight: '6px'
          }}>
            ITEMS TO FIND ({currentLocation.inspectables.filter(o => gameState.inspectedObjectIds.includes(o.id)).length}/{currentLocation.inspectables.length}):
          </span>

          {currentLocation.inspectables.map(obj => {
            const isInspected = gameState.inspectedObjectIds.includes(obj.id);
            const isHinted = hintHighlightId === obj.id;
            return (
              <div
                key={obj.id}
                onClick={() => handleInspect(obj)}
                style={{
                  background: isHinted
                    ? '#eab308'
                    : isInspected
                    ? 'rgba(16, 185, 129, 0.15)'
                    : '#1e293b',
                  color: isHinted ? '#000' : isInspected ? '#10b981' : '#cbd5e1',
                  border: isHinted
                    ? '2px solid #fff'
                    : isInspected
                    ? '1px solid #10b981'
                    : '1px solid #475569',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s'
                }}
              >
                {isInspected ? <CheckCircle size={14} /> : <Eye size={14} />}
                <span>{obj.name}</span>
                {isInspected && <span style={{ fontSize: '0.65rem', color: '#6ee7b7' }}>+10K</span>}
              </div>
            );
          })}
        </div>

        {/* Right: Hint Button and Combo Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Combo Multiplier */}
          <div style={{
            background: 'linear-gradient(135deg, #ea580c, #c2410c)',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: '6px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 0 12px rgba(234, 88, 12, 0.4)'
          }}>
            <Zap size={14} />
            <span>COMBO x{combo}</span>
          </div>

          {/* Criminal Case Magnifying Glass Hint Button */}
          <button
            onClick={handleHint}
            className="btn-primary"
            style={{
              padding: '6px 14px',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#eab308',
              color: '#000',
              fontWeight: '800',
              border: 'none'
            }}
          >
            <Search size={15} />
            <span>MAGNIFYING HINT</span>
          </button>
        </div>
      </div>

      {/* Partner Commentary Speech Bubble (Criminal Case Style) */}
      <div style={{
        background: '#121622',
        border: '1px solid #1e293b',
        borderRadius: '8px',
        padding: '14px 18px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <CharacterPortrait id="detective_partner" size={65} showBadge={false} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', marginBottom: '2px' }}>
            PARTNER // INSPECTOR JACK VANCE:
          </div>
          <p style={{ color: '#e2e8f0', fontSize: '0.9rem', margin: 0, fontStyle: 'italic', lineHeight: 1.4 }}>
            "{getPartnerTip(currentLocation.id)}"
          </p>
        </div>
      </div>

      {/* Accessible Inspectables Grid List */}
      <div>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
          Inspectable Evidence & Forensic Focal Points in this Scene
        </h3>
        <div className="grid-3">
          {currentLocation.inspectables.map(obj => {
            const isInspected = gameState.inspectedObjectIds.includes(obj.id);
            return (
              <div
                key={obj.id}
                className="detective-card"
                style={{
                  padding: '14px',
                  cursor: 'pointer',
                  borderLeft: isInspected ? '3px solid var(--accent-emerald)' : '3px solid var(--accent-cyan)'
                }}
                onClick={() => handleInspect(obj)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontWeight: '600', color: '#fff', fontSize: '0.95rem' }}>{obj.name}</span>
                  {isInspected ? (
                    <span style={{ color: 'var(--accent-emerald)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle size={14} /> Inspected
                    </span>
                  ) : (
                    <span style={{ color: 'var(--accent-cyan)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Eye size={14} /> Search
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {obj.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inspection Modal */}
      {selectedInspectable && inspectionResult && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <EvidenceGraphic id={selectedInspectable.revealedEvidenceId || ''} size={90} />
                <div>
                  <span className="stamp stamp-cyan" style={{ fontSize: '0.7rem', marginBottom: '6px' }}>
                    {selectedInspectable.category}
                  </span>
                  <h2 style={{ fontSize: '1.4rem', color: '#fff', fontWeight: '700', marginTop: '2px' }}>
                    {selectedInspectable.name}
                  </h2>
                </div>
              </div>
              <button className="icon-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>

            <div style={{
              background: '#0a0d14',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <h4 style={{ color: 'var(--accent-amber)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
                DETECTIVE'S FORENSIC EXAMINATION:
              </h4>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#e2e8f0', whiteSpace: 'pre-line' }}>
                {inspectionResult.inspectionText}
              </p>
            </div>

            {/* Revealed Evidence Notification */}
            {inspectionResult.evidenceDiscovered && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid var(--accent-emerald)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ color: 'var(--accent-emerald)', fontWeight: '700', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
                    NEW EVIDENCE ADDED TO LOCKER:
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginTop: '2px' }}>
                    {inspectionResult.evidenceDiscovered.name}
                  </div>
                </div>
                <button
                  className="btn-primary"
                  style={{ background: 'var(--accent-emerald)', padding: '8px 14px', fontSize: '0.85rem' }}
                  onClick={() => setScreen('evidence_viewer')}
                >
                  View in Locker →
                </button>
              </div>
            )}

            {/* Red Herring alert */}
            {selectedInspectable.isRedHerring && (
              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid var(--accent-amber)',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '20px',
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                color: 'var(--accent-amber)',
                fontSize: '0.85rem'
              }}>
                <AlertTriangle size={20} />
                <span>
                  <strong>Investigator's Caution:</strong> Physical constraints confirm this item or passageway could not have been used in the disappearance. Avoid building theories upon it!
                </span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn-secondary" onClick={handleCloseModal}>
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
