import React from 'react';
import { CharacterPortrait } from '../graphics/CharacterPortraits';
import {
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Scale,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

interface Props {
  discoveredTraits: string[];
  onGoToLineup: () => void;
}

export const CCProfileTab: React.FC<Props> = ({ discoveredTraits, onGoToLineup }) => {
  const killerTraits = [
    { id: 'trait_gender_female', label: 'Gender', value: 'Female', source: 'Shoe Impression on Carpet' },
    { id: 'trait_medical_access', label: 'Profession', value: 'Doctor / Clinical Hypnotic Access', source: 'Midazolam in Tumbler' },
    { id: 'trait_neodymium_magnet', label: 'Method', value: 'Uses 180-lb Neodymium Cylinder Magnet', source: 'Deadbolt Brass Collar' },
    { id: 'trait_revoked_will', label: 'Motive', value: 'Disinherited of $40,000,000 Research Trust', source: 'Recovered Hearth Codicil' },
  ];

  const suspects = [
    {
      id: 'dr_eleanor_sterling',
      name: 'Dr. Eleanor Sterling',
      relation: 'Victim\'s Physician & Neurological Director',
      gender: 'Female',
      profession: 'Doctor (Chief of Neurology)',
      method: 'Supervised Timothy\'s medications; access to surgical recovery magnets',
      motive: 'Timothy revoked her $40M research foundation grant at 11:15 PM',
      isCulprit: true
    },
    {
      id: 'gregory_vance',
      name: 'Gregory Vance',
      relation: 'Building Super & Estranged Nephew',
      gender: 'Male',
      profession: 'Building Superintendent',
      method: 'Held freight elevator, but has no medical license or hypnotic access',
      motive: 'Owed gambling loans, but receives modest stipend',
      isCulprit: false,
      eliminatedBy: ['trait_gender_female', 'trait_medical_access']
    },
    {
      id: 'corinne_blake',
      name: 'Corinne Blake',
      relation: 'Philanthropist & Beneficiary',
      gender: 'Female',
      profession: 'Non-Profit Executive',
      method: 'No access to schedule IV hospital sedatives',
      motive: 'Was granted the $40M estate by Timothy, giving zero motive to stop him',
      isCulprit: false,
      eliminatedBy: ['trait_medical_access', 'trait_revoked_will']
    },
    {
      id: 'toby_ray',
      name: 'Toby Ray',
      relation: 'Investigative Paparazzo',
      gender: 'Male',
      profession: 'Freelance Photographer',
      method: 'Was trapped on rooftop fire escape taking photos with telephoto lens',
      motive: 'Selling tabloid photos for $5,000',
      isCulprit: false,
      eliminatedBy: ['trait_gender_female', 'trait_medical_access', 'trait_revoked_will']
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
      {/* Profiling Title */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        border: '2px solid #3b82f6',
        borderRadius: '12px',
        padding: '20px 24px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ color: '#93c5fd', fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 'bold' }}>
            SPECIAL CRIMINOLOGY UNIT // KILLER PROFILE & TRAIT MATRIX
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#fff', fontWeight: '900', margin: '2px 0 0' }}>
            SUSPECT ELIMINATION & PROFILE BOOK
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '0.85rem', margin: '4px 0 0' }}>
            Every forensic clue eliminates innocent suspects. The killer matches 100% of all discovered traits!
          </p>
        </div>

        <button
          className="btn-danger"
          style={{ padding: '12px 24px', fontSize: '0.95rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}
          onClick={onGoToLineup}
        >
          <Scale size={20} />
          <span>Arrest in Police Lineup →</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
        {/* Left Side: The Assembled Killer Profile */}
        <div style={{
          background: '#090d16',
          border: '2px solid #f59e0b',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 0 24px rgba(245, 158, 11, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fef08a', marginBottom: '14px' }}>
            <ShieldCheck size={20} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '900', margin: 0 }}>
              THE KILLER PROFILE:
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {killerTraits.map(kt => {
              const isFound = discoveredTraits.includes(kt.id);
              return (
                <div
                  key={kt.id}
                  style={{
                    background: isFound ? '#1e293b' : '#0f172a',
                    border: isFound ? '1px solid #10b981' : '1px dashed #334155',
                    borderRadius: '8px',
                    padding: '12px 14px'
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: isFound ? '#34d399' : '#64748b', fontWeight: 'bold' }}>
                    {kt.label.toUpperCase()}:
                  </div>
                  <div style={{ fontSize: '0.95rem', color: isFound ? '#fff' : '#64748b', fontWeight: '800', marginTop: '2px' }}>
                    {isFound ? kt.value : '??? [LAB ANALYSIS REQUIRED]'}
                  </div>
                  {isFound && (
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px', fontStyle: 'italic' }}>
                      Source: {kt.source}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: The 4 Suspect Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {suspects.map(suspect => {
            // Check if this suspect is eliminated by any currently discovered trait
            const eliminatedTraits = (suspect.eliminatedBy || []).filter(t => discoveredTraits.includes(t));
            const isEliminated = eliminatedTraits.length > 0;
            const matchesAllDiscovered = !isEliminated && discoveredTraits.length > 0;

            return (
              <div
                key={suspect.id}
                style={{
                  background: isEliminated ? '#0c0f17' : '#111827',
                  border: matchesAllDiscovered ? '2px solid #ef4444' : isEliminated ? '1px solid #1f2937' : '1px solid #374151',
                  borderRadius: '12px',
                  padding: '16px',
                  position: 'relative',
                  overflow: 'hidden',
                  opacity: isEliminated ? 0.6 : 1,
                  boxShadow: matchesAllDiscovered ? '0 0 24px rgba(239, 68, 68, 0.4)' : 'none'
                }}
              >
                {/* Visual Portrait and Name */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '12px' }}>
                  <CharacterPortrait id={suspect.id} size={70} showBadge={false} />
                  <div>
                    <h4 style={{ fontSize: '1.1rem', color: '#fff', fontWeight: '800', margin: 0 }}>
                      {suspect.name}
                    </h4>
                    <p style={{ color: 'var(--accent-amber)', fontSize: '0.75rem', fontFamily: 'monospace', margin: '2px 0 0' }}>
                      {suspect.relation}
                    </p>
                  </div>
                </div>

                {/* Trait breakdown */}
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div><strong>Gender:</strong> {suspect.gender}</div>
                  <div><strong>Profession:</strong> {suspect.profession}</div>
                  <div><strong>Method:</strong> {suspect.method}</div>
                  <div><strong>Motive:</strong> {suspect.motive}</div>
                </div>

                {/* Status Stamp */}
                {isEliminated ? (
                  <div style={{
                    marginTop: '12px',
                    padding: '8px 12px',
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid #ef4444',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#fca5a5',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    <XCircle size={16} color="#ef4444" />
                    <span>ELIMINATED FROM SUSPICION (INNOCENT)</span>
                  </div>
                ) : matchesAllDiscovered && discoveredTraits.length >= 3 ? (
                  <div style={{
                    marginTop: '12px',
                    padding: '8px 12px',
                    background: 'rgba(239, 68, 68, 0.25)',
                    border: '2px solid #ef4444',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#fecaca',
                    fontSize: '0.8rem',
                    fontWeight: '900',
                    animation: 'pulsePin 1.5s infinite'
                  }}>
                    <AlertTriangle size={18} color="#ef4444" />
                    <span>100% PROFILE MATCH: PRIME SUSPECT!</span>
                  </div>
                ) : (
                  <div style={{
                    marginTop: '12px',
                    padding: '6px 10px',
                    background: '#1e293b',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    color: '#94a3b8'
                  }}>
                    Awaiting further lab evidence to confirm or clear.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
