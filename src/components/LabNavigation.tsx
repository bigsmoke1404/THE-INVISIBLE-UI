import React from 'react';
import { useStore } from '../store/useStore';

interface LabNavigationProps {
  activeRoom: string | null;
  onSelectRoom: (id: string) => void;
}

export default function LabNavigation({ activeRoom, onSelectRoom }: LabNavigationProps) {
  const experiments = useStore(state => state.experiments);
  const session = useStore(state => state.session);
  const resetData = useStore(state => state.resetData);

  const discoveredCount = Object.values(experiments).filter(e => e.state !== 'NOT_DISCOVERED').length;
  const completedCount = Object.values(experiments).filter(e => e.state === 'COMPLETED').length;

  return (
    <div style={{ padding: '40px 24px', height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
          Lab Dashboard
        </h2>
        <div style={{ display: 'flex', gap: '24px', fontSize: '0.9rem' }}>
          <div>
            <div style={{ color: 'var(--color-text-muted)' }}>Discovered</div>
            <div>{discoveredCount}/10</div>
          </div>
          <div>
            <div style={{ color: 'var(--color-text-muted)' }}>Completed</div>
            <div>{completedCount}/10</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        {Object.values(experiments).map(exp => (
          <button
            key={exp.id}
            onClick={() => onSelectRoom(exp.id)}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: '16px 0',
              borderBottom: '1px solid var(--color-border)',
              opacity: activeRoom === exp.id ? 1 : 0.6,
              transition: 'var(--transition-snappy)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => {
              if (activeRoom !== exp.id) e.currentTarget.style.opacity = '0.6';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--color-text-muted)' }}>
                {exp.id}
              </span>
              <span style={{ fontSize: '0.6rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: exp.state === 'COMPLETED' ? 'var(--color-border)' : 'transparent' }}>
                {exp.state === 'COMPLETED' ? 'COMPLETED' : exp.state === 'DISCOVERED' ? 'DISCOVERED' : ''}
              </span>
            </div>
            <div style={{ fontSize: '1.1rem', fontFamily: 'var(--font-serif)' }}>
              {exp.title}
            </div>
          </button>
        ))}
      </div>

      <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid var(--color-border)', fontSize: '0.8rem' }}>
        <div style={{ color: 'var(--color-text-muted)', marginBottom: '12px' }}>PRIVATE BY DESIGN</div>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px', lineHeight: 1.4 }}>
          Your interaction history stays on this device. No analytics. No tracking.
        </p>
        <button 
          onClick={resetData}
          style={{ 
            color: 'var(--color-text)', 
            textDecoration: 'underline', 
            opacity: 0.6 
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
        >
          Reset Session Data
        </button>
      </div>
    </div>
  );
}
