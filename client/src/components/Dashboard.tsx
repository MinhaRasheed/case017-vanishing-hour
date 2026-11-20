import React from 'react';
import { useGame } from '../game/state/GameStateContext';
import {
  MapPin,
  Users,
  Search,
  AlertOctagon,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { TimelineEngine } from '../game/engine/TimelineEngine';

export const Dashboard: React.FC = () => {
  const { gameState, caseBundle, setScreen, setLocation, setSuspect } = useGame();

  const totalEvidence = caseBundle.evidence.length;
  const foundEvidence = gameState.discoveredEvidenceIds.length;
  const evidencePercent = Math.round((foundEvidence / totalEvidence) * 100);

  const totalContradictions = caseBundle.suspects.reduce((acc, s) => acc + s.contradictions.length, 0);
  const exposedContradictions = gameState.revealedContradictionIds.length;

  const timelinePercent = TimelineEngine.computeCompleteness(
    caseBundle.timeline as any,
    gameState.discoveredEvidenceIds
  );

  const handleGoToLocation = (locId: string) => {
    setLocation(locId);
    setScreen('location_view');
  };

  const handleGoToSuspect = (suspectId: string) => {
    setSuspect(suspectId);
    setScreen('interrogation');
  };

  return (
    <div className="case-content">
      {/* Top Banner & Stat Cards */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f8fafc' }}>
              Investigation Command Dashboard
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Real-time forensic telemetry, lead tracking, and suspect contradiction status.
            </p>
          </div>
          <button
            className="btn-primary"
            onClick={() => setScreen('deduction')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <span>Draft Final Indictment</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid-4">
          {/* Card 1: Evidence */}
          <div className="detective-card" style={{ borderTop: '3px solid var(--accent-cyan)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>EVIDENCE RECOVERED</span>
              <Search size={18} color="var(--accent-cyan)" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>
              {foundEvidence} <span style={{ fontSize: '1rem', color: 'var(--text-faint)' }}>/ {totalEvidence}</span>
            </div>
            <div style={{ background: '#0a0d14', height: '6px', borderRadius: '3px', marginTop: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${evidencePercent}%`, height: '100%', background: 'var(--accent-cyan)' }} />
            </div>
          </div>

          {/* Card 2: Contradictions */}
          <div className="detective-card" style={{ borderTop: '3px solid var(--accent-red)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-red)' }}>LIES EXPOSED</span>
              <AlertOctagon size={18} color="var(--accent-red)" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>
              {exposedContradictions} <span style={{ fontSize: '1rem', color: 'var(--text-faint)' }}>/ {totalContradictions}</span>
            </div>
            <div style={{ background: '#0a0d14', height: '6px', borderRadius: '3px', marginTop: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${(exposedContradictions / totalContradictions) * 100}%`, height: '100%', background: 'var(--accent-red)' }} />
            </div>
          </div>

          {/* Card 3: Timeline */}
          <div className="detective-card" style={{ borderTop: '3px solid var(--accent-amber)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)' }}>TIMELINE SOLVED</span>
              <Clock size={18} color="var(--accent-amber)" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>
              {timelinePercent}%
            </div>
            <div style={{ background: '#0a0d14', height: '6px', borderRadius: '3px', marginTop: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${timelinePercent}%`, height: '100%', background: 'var(--accent-amber)' }} />
            </div>
          </div>

          {/* Card 4: Scenes */}
          <div className="detective-card" style={{ borderTop: '3px solid var(--accent-emerald)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)' }}>SCENES VISITED</span>
              <MapPin size={18} color="var(--accent-emerald)" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>
              {gameState.visitedLocationIds.length} <span style={{ fontSize: '1rem', color: 'var(--text-faint)' }}>/ {caseBundle.locations.length}</span>
            </div>
            <div style={{ background: '#0a0d14', height: '6px', borderRadius: '3px', marginTop: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${(gameState.visitedLocationIds.length / caseBundle.locations.length) * 100}%`, height: '100%', background: 'var(--accent-emerald)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Suspects & Locations */}
      <div className="grid-2" style={{ marginBottom: '28px' }}>
        {/* Suspect Roster */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '1.2rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} color="var(--accent-red)" /> Persons of Interest
            </h2>
            <button
              style={{ background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', fontSize: '0.85rem' }}
              onClick={() => setScreen('suspect_profiles')}
            >
              View Profiles →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {caseBundle.suspects.map(suspect => {
              const solvedContras = suspect.contradictions.filter(c =>
                gameState.revealedContradictionIds.includes(c.id)
              ).length;
              const hasBrokenAlibi = solvedContras > 0;

              return (
                <div
                  key={suspect.id}
                  className="detective-card"
                  style={{
                    padding: '14px 18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleGoToSuspect(suspect.id)}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontWeight: '700', color: '#fff', fontSize: '1rem' }}>{suspect.name}</span>
                      {hasBrokenAlibi ? (
                        <span className="stamp stamp-red" style={{ fontSize: '0.65rem' }}>ALIBI SHATTERED</span>
                      ) : (
                        <span className="stamp stamp-amber" style={{ fontSize: '0.65rem' }}>STATEMENT UNVERIFIED</span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {suspect.occupation} • {suspect.relation}
                    </div>
                  </div>

                  <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                    Interrogate
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Crime Scenes */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '1.2rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="var(--accent-cyan)" /> Explorable Crime Scenes
            </h2>
            <button
              style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', fontSize: '0.85rem' }}
              onClick={() => setScreen('location_view')}
            >
              Enter Scenes →
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {caseBundle.locations.map(loc => {
              const isVisited = gameState.visitedLocationIds.includes(loc.id);
              const inspectedCount = loc.inspectables.filter(o => gameState.inspectedObjectIds.includes(o.id)).length;

              return (
                <div
                  key={loc.id}
                  className="detective-card"
                  style={{
                    padding: '14px',
                    cursor: 'pointer',
                    background: isVisited ? 'var(--bg-card)' : '#0d111a',
                    borderLeft: isVisited ? '3px solid var(--accent-emerald)' : '1px solid var(--border-subtle)'
                  }}
                  onClick={() => handleGoToLocation(loc.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: '600', color: '#fff', fontSize: '0.9rem', marginBottom: '4px' }}>
                      {loc.name}
                    </div>
                    {isVisited && <CheckCircle2 size={14} color="var(--accent-emerald)" />}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>
                    {inspectedCount} of {loc.inspectables.length} inspectables examined
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Case Feed Log */}
      <div className="detective-card">
        <div className="card-header-styled">
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)', fontSize: '0.85rem' }}>
            OFFICIAL INVESTIGATION LOG // RECENT ACTION STREAM
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-faint)' }}>Chronological Record</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
          {gameState.historyLogs.slice(0, 8).map((log, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '12px',
                fontSize: '0.85rem',
                borderBottom: '1px solid #1e293b',
                paddingBottom: '6px'
              }}
            >
              <span style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', minWidth: '70px' }}>
                {log.timestamp}
              </span>
              <span style={{
                color: log.type === 'contradiction'
                  ? 'var(--accent-red)'
                  : log.type === 'clue'
                  ? 'var(--accent-cyan)'
                  : '#cbd5e1'
              }}>
                {log.message}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
