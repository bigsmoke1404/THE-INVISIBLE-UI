import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';

export default function Room04Time() {
  const completeExperiment = useStore(state => state.completeExperiment);
  const discoverExperiment = useStore(state => state.discoverExperiment);
  
  const [hoverTime, setHoverTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    discoverExperiment('04');
  }, [discoverExperiment]);

  useEffect(() => {
    let interval: number;
    if (isHovering) {
      interval = window.setInterval(() => {
        setHoverTime(prev => {
          const next = prev + 100;
          if (next >= 5000) completeExperiment('04');
          return next;
        });
      }, 100);
    } else {
      setHoverTime(0);
    }
    return () => clearInterval(interval);
  }, [isHovering, completeExperiment]);

  let state = 'DEFAULT';
  if (hoverTime > 100) state = 'PREVIEW';
  if (hoverTime > 1000) state = 'INSPECT';
  if (hoverTime > 2000) state = 'ACTIVATE';
  if (hoverTime > 5000) state = 'ADVANCED';

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', top: '40px', left: '40px', color: 'var(--color-text-muted)' }}>
        Wait.
      </div>
      
      <div
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{
          width: '200px',
          height: '200px',
          border: '1px solid var(--color-border)',
          borderRadius: state === 'ACTIVATE' || state === 'ADVANCED' ? '16px' : '50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          backgroundColor: state === 'ADVANCED' ? 'var(--color-hover)' : 'transparent',
          boxShadow: state === 'ACTIVATE' || state === 'ADVANCED' ? 'var(--shadow-hover)' : 'var(--shadow-subtle)',
          transform: state === 'INSPECT' ? 'scale(1.1)' : state === 'ACTIVATE' ? 'scale(1.2)' : state === 'ADVANCED' ? 'scale(1.5)' : 'scale(1)'
        }}
      >
        <div style={{ 
          fontSize: '0.8rem', 
          letterSpacing: '0.1em', 
          color: 'var(--color-text-muted)',
          opacity: state === 'DEFAULT' ? 0.5 : 1,
          transition: 'opacity 0.3s'
        }}>
          {state}
        </div>
        
        {state === 'ADVANCED' && (
          <div style={{
            marginTop: '24px',
            display: 'flex',
            gap: '12px',
            animation: 'fadeIn 0.5s ease-out'
          }}>
            <button style={{ padding: '4px 12px', border: '1px solid var(--color-border)', borderRadius: '4px', fontSize: '0.7rem' }}>CONFIG</button>
            <button style={{ padding: '4px 12px', border: '1px solid var(--color-border)', borderRadius: '4px', fontSize: '0.7rem' }}>EXPORT</button>
          </div>
        )}
      </div>
      
      {/* Subtle indicator of time */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '200px',
        height: '1px',
        backgroundColor: 'var(--color-border)',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          backgroundColor: 'var(--color-text)',
          width: `${Math.min(100, (hoverTime / 5000) * 100)}%`,
          transition: 'width 0.1s linear'
        }} />
      </div>
    </div>
  );
}
