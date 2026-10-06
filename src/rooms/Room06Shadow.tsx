import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';

export default function Room06Shadow() {
  const completeExperiment = useStore(state => state.completeExperiment);
  const discoverExperiment = useStore(state => state.discoverExperiment);
  
  const [hovered, setHovered] = useState(false);
  const [shadowHovered, setShadowHovered] = useState(false);

  useEffect(() => {
    discoverExperiment('06');
  }, [discoverExperiment]);

  useEffect(() => {
    if (shadowHovered) {
      completeExperiment('06');
    }
  }, [shadowHovered, completeExperiment]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', top: '40px', left: '40px', color: 'var(--color-text-muted)' }}>
        Explore the shadow.
      </div>
      
      <div style={{ position: 'relative', width: '300px', height: '400px', perspective: '1000px' }}>
        {/* Shadow Interface */}
        <div 
          onMouseEnter={() => setShadowHovered(true)}
          onMouseLeave={() => setShadowHovered(false)}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'var(--color-bg)',
            border: '1px dashed var(--color-border)',
            transform: hovered ? 'translateX(120px) translateY(40px) translateZ(-100px)' : 'translateZ(-50px)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            opacity: hovered ? 1 : 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
            pointerEvents: hovered ? 'auto' : 'none',
            zIndex: 1
          }}
        >
          {['ARCHIVE', 'DUPLICATE', 'SHARE', 'DELETE'].map(action => (
            <button key={action} style={{
              padding: '8px 24px',
              borderBottom: '1px solid var(--color-border)',
              fontSize: '0.8rem',
              letterSpacing: '0.1em'
            }}>
              {action}
            </button>
          ))}
        </div>

        {/* Main Document */}
        <div 
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            boxShadow: hovered ? 'var(--shadow-hover)' : 'var(--shadow-subtle)',
            padding: '32px',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: hovered ? 'translateX(-40px) translateZ(50px)' : 'translateZ(0)',
            zIndex: 2,
            cursor: 'default'
          }}
        >
          <div style={{ width: '40%', height: '4px', backgroundColor: 'var(--color-border)', marginBottom: '32px' }} />
          <div style={{ width: '100%', height: '1px', backgroundColor: 'var(--color-border)', marginBottom: '16px' }} />
          <div style={{ width: '80%', height: '1px', backgroundColor: 'var(--color-border)', marginBottom: '16px' }} />
          <div style={{ width: '90%', height: '1px', backgroundColor: 'var(--color-border)', marginBottom: '16px' }} />
        </div>
      </div>
    </div>
  );
}
