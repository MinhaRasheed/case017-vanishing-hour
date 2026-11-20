import React, { useState } from 'react';
import { useGame } from '../game/state/GameStateContext';
import { DeductionSubmission } from '../game/state/types';
import {
  CheckCircle,
  AlertTriangle,
  User,
  ShieldAlert,
  ArrowRight,
  FileCheck,
  Scale
} from 'lucide-react';

export const DeductionResolution: React.FC = () => {
  const { gameState, caseBundle, submitDeduction, setScreen } = useGame();

  const options = (caseBundle.solution as any).questionOptions;

  const [suspectId, setSuspectId] = useState<string>('');
  const [whatHappenedId, setWhatHappenedId] = useState<string>('');
  const [methodId, setMethodId] = useState<string>('');
  const [motiveId, setMotiveId] = useState<string>('');
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<string[]>([]);
  const [reasoning, setReasoning] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const discoveredEvidence = caseBundle.evidence.filter(e =>
    gameState.discoveredEvidenceIds.includes(e.id)
  );

  const toggleEvidenceSelect = (id: string) => {
    if (selectedEvidenceIds.includes(id)) {
      setSelectedEvidenceIds(selectedEvidenceIds.filter(eId => eId !== id));
    } else {
      setSelectedEvidenceIds([...selectedEvidenceIds, id]);
    }
  };

  const isFormComplete =
    suspectId !== '' &&
    whatHappenedId !== '' &&
    methodId !== '' &&
    motiveId !== '' &&
    selectedEvidenceIds.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete || isSubmitting) return;

    setIsSubmitting(true);
    const submission: DeductionSubmission = {
      suspectId,
      whatHappenedId,
      methodId,
      motiveId,
      evidenceIds: selectedEvidenceIds,
      reasoning
    };

    await submitDeduction(submission);
    setIsSubmitting(false);
  };

  return (
    <div className="case-content" style={{ maxWidth: '1000px' }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1f1418 0%, #111420 100%)',
        border: '2px solid var(--accent-red)',
        borderRadius: '10px',
        padding: '24px 32px',
        marginBottom: '28px',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-red)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
              <Scale size={18} /> FORMAL INDICTMENT PROCEEDING
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#fff', marginTop: '6px' }}>
              Case Resolution & Final Accusation
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              Synthesize your physical evidence, exposed contradictions, and timeline deductions.
            </p>
          </div>
          <span className="stamp stamp-red">FINAL VERDICT</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* Question 1: Who is responsible? */}
        <div className="detective-card" style={{ borderLeft: '4px solid var(--accent-red)' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }}>01.</span>
            Who is the Primary Perpetrator Responsible for the Disappearance?
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {caseBundle.suspects.map(suspect => {
              const isSelected = suspectId === suspect.id;
              return (
                <div
                  key={suspect.id}
                  onClick={() => setSuspectId(suspect.id)}
                  style={{
                    background: isSelected ? 'rgba(230, 57, 70, 0.2)' : '#0d111a',
                    border: isSelected ? '2px solid var(--accent-red)' : '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ fontWeight: '700', color: '#fff', fontSize: '1rem', marginBottom: '2px' }}>
                    {suspect.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {suspect.occupation}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', marginTop: '6px' }}>
                    {suspect.relation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Question 2: What happened? */}
        <div className="detective-card" style={{ borderLeft: '4px solid var(--accent-cyan)' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>02.</span>
            What Actually Occurred to Timothy Vance in Penthouse 4B?
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {options.whatHappened.map((opt: any) => {
              const isSelected = whatHappenedId === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setWhatHappenedId(opt.id)}
                  style={{
                    background: isSelected ? 'rgba(56, 189, 248, 0.15)' : '#0d111a',
                    border: isSelected ? '2px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '14px 18px',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.95rem', marginBottom: '4px' }}>
                    {opt.label}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                    {opt.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Question 3: How was it done? (The Locked-Room Execution) */}
        <div className="detective-card" style={{ borderLeft: '4px solid var(--accent-amber)' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>03.</span>
            How Was the Locked-Room Illusion Executed & the Escape Carried Out?
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {options.method.map((opt: any) => {
              const isSelected = methodId === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setMethodId(opt.id)}
                  style={{
                    background: isSelected ? 'rgba(245, 158, 11, 0.15)' : '#0d111a',
                    border: isSelected ? '2px solid var(--accent-amber)' : '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '14px 18px',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.95rem', marginBottom: '4px' }}>
                    {opt.label}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                    {opt.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Question 4: Why? (Motive) */}
        <div className="detective-card" style={{ borderLeft: '4px solid var(--accent-emerald)' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>04.</span>
            What Was the True Criminal Motive Driving the Crime?
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {options.motive.map((opt: any) => {
              const isSelected = motiveId === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setMotiveId(opt.id)}
                  style={{
                    background: isSelected ? 'rgba(16, 185, 129, 0.15)' : '#0d111a',
                    border: isSelected ? '2px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '14px 18px',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.95rem', marginBottom: '4px' }}>
                    {opt.label}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                    {opt.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Question 5: Which key evidence proves this theory? */}
        <div className="detective-card">
          <div className="card-header-styled">
            <h2 style={{ fontSize: '1.2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#f43f5e', fontFamily: 'var(--font-mono)' }}>05.</span>
              Which Forensic Evidence Substantiates Your Indictment?
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Selected: <strong style={{ color: 'var(--accent-cyan)' }}>{selectedEvidenceIds.length}</strong> items
            </span>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Choose the essential physical artifacts, access logs, and chemical proof that legally corroborate your indictment.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '10px',
            maxHeight: '300px',
            overflowY: 'auto'
          }}>
            {discoveredEvidence.map(ev => {
              const isSelected = selectedEvidenceIds.includes(ev.id);
              return (
                <div
                  key={ev.id}
                  onClick={() => toggleEvidenceSelect(ev.id)}
                  style={{
                    background: isSelected ? 'var(--accent-red)' : '#0d111a',
                    border: isSelected ? '1px solid #fff' : '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--accent-cyan)',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {ev.category}
                  </div>
                  <div style={{
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: isSelected ? '#fff' : '#e2e8f0',
                    marginTop: '2px'
                  }}>
                    {ev.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Written Reasoning (Optional but immersive) */}
        <div className="detective-card">
          <h2 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '8px' }}>
            Detective's Executive Synthesis (Case Notes for the Prosecutor)
          </h2>
          <textarea
            rows={3}
            placeholder="Summarize your deduction in your own words (e.g. How the magnetic deadbolt operated, why the 11:47 PM panic alarm was a decoy)..."
            value={reasoning}
            onChange={e => setReasoning(e.target.value)}
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

        {/* Submit Indictment CTA */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <button
            type="submit"
            className="btn-primary"
            disabled={!isFormComplete || isSubmitting}
            style={{
              fontSize: '1.25rem',
              padding: '16px 40px',
              borderRadius: '8px',
              opacity: isFormComplete ? 1 : 0.4
            }}
          >
            <FileCheck size={22} />
            <span>{isSubmitting ? 'Verifying Legal Indictment...' : 'Submit Indictment to District Attorney'}</span>
          </button>

          {!isFormComplete && (
            <p style={{ color: 'var(--accent-amber)', fontSize: '0.85rem', marginTop: '10px' }}>
              * Complete all 5 indictment questions to submit your case resolution.
            </p>
          )}
        </div>
      </form>
    </div>
  );
};
