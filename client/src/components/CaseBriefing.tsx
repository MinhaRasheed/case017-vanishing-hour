import React from 'react';
import { useGame } from '../game/state/GameStateContext';
import { CharacterPortrait } from './graphics/CharacterPortraits';
import {
  FileText,
  User,
  Clock,
  MapPin,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Search
} from 'lucide-react';

export const CaseBriefing: React.FC = () => {
  const { caseBundle, setScreen } = useGame();
  const c = caseBundle.case;

  return (
    <div className="case-content" style={{ maxWidth: '1000px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        border: '1px solid #334155',
        borderRadius: '10px',
        padding: '24px 32px',
        marginBottom: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
            <FileText size={16} /> METROPOLITAN INVESTIGATION BUREAU // INCIDENT REPORT
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#f8fafc', marginTop: '6px' }}>
            CASE {c.caseNumber}: {c.title}
          </h1>
          <div style={{ display: 'flex', gap: '20px', marginTop: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={15} /> {c.incidentDate} — {c.incidentTime}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={15} /> {c.location}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span className="stamp stamp-red">PRIORITY ONE</span>
        </div>
      </div>

      {/* Grid: Victim Dossier & Incident Summary */}
      <div className="grid-2" style={{ marginBottom: '28px' }}>
        {/* Victim Profile Card */}
        <div className="detective-card" style={{ borderLeft: '4px solid var(--accent-red)' }}>
          <div className="card-header-styled">
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-red)', fontWeight: '700', fontSize: '0.85rem' }}>
              SUBJECT OF INQUIRY
            </span>
            <span className="stamp stamp-amber">{c.victim.status}</span>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '16px' }}>
            <CharacterPortrait id="timothy_vance" size={110} statusBadge="MISSING" />
            <div>
              <h2 style={{ fontSize: '1.4rem', color: '#f8fafc', fontWeight: '800' }}>{c.victim.name}</h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--accent-amber)', marginTop: '2px' }}>
                Age {c.victim.age} • {c.victim.occupation}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Oberlin-Vane Trust • Forensic Auditing Division
              </div>
            </div>
          </div>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#cbd5e1', marginBottom: '14px' }}>
            {c.victim.description}
          </p>
          <div style={{ background: '#0a0d14', padding: '12px 14px', borderRadius: '6px', fontSize: '0.85rem', border: '1px solid #1e293b' }}>
            <strong style={{ color: 'var(--accent-amber)' }}>Last Known Activity:</strong>
            <p style={{ color: '#94a3b8', marginTop: '4px' }}>{c.victim.lastKnownActivity}</p>
          </div>
        </div>

        {/* The Incident Facts */}
        <div className="detective-card" style={{ borderLeft: '4px solid var(--accent-cyan)' }}>
          <div className="card-header-styled">
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontWeight: '700', fontSize: '0.85rem' }}>
              PHYSICAL INCIDENT SUMMARY
            </span>
            <AlertTriangle size={18} color="var(--accent-cyan)" />
          </div>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#cbd5e1', marginBottom: '16px' }}>
            {c.summary}
          </p>
          <div style={{ fontSize: '0.85rem' }}>
            <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>Verified Crime Scene Facts:</strong>
            <ul style={{ paddingLeft: '18px', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {c.incidentFacts.map((fact, idx) => (
                <li key={idx}>{fact}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Investigation Directives Banner */}
      <div style={{
        background: '#131824',
        border: '1px solid #1e293b',
        borderRadius: '8px',
        padding: '20px 24px',
        marginBottom: '32px'
      }}>
        <h3 style={{
          fontSize: '1rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--accent-amber)',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <ShieldAlert size={18} /> INVESTIGATIVE MISSION DIRECTIVES
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          {c.investigationDirectives.map((dir, i) => (
            <div key={i} style={{
              background: '#0a0d14',
              border: '1px solid #273142',
              borderRadius: '6px',
              padding: '12px',
              fontSize: '0.85rem',
              color: '#cbd5e1',
              display: 'flex',
              gap: '10px'
            }}>
              <span style={{ color: 'var(--accent-red)', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>0{i + 1}</span>
              <span>{dir}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Begin Investigation CTA */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          className="btn-primary"
          style={{ fontSize: '1.2rem', padding: '16px 36px', borderRadius: '8px' }}
          onClick={() => setScreen('dashboard')}
        >
          <span>Acknowledge Dossier & Enter Field Command</span>
          <ArrowRight size={22} />
        </button>
      </div>
    </div>
  );
};
