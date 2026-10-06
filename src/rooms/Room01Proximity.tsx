import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';

export default function Room01Proximity() {
  const completeExperiment = useStore(state => state.completeExperiment);
  const discoverExperiment = useStore(state => state.discoverExperiment);
  
  const [cursor, setCursor] = useState({ x: -1000, y: -1000 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    discoverExperiment('01');
    
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [discoverExperiment]);

  const target = { x: window.innerWidth / 2 - 160, y: window.innerHeight / 2 };
  
  const dx = cursor.x - target.x;
  const dy = cursor.y - target.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  const maxDist = 400;
  const proximity = Math.max(0, 1 - distance / maxDist);
  
  // Triggers completion
  useEffect(() => {
    if (proximity > 0.9) {
      completeExperiment('01');
    }
  }, [proximity, completeExperiment]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '40px', left: '40px', color: 'var(--color-text-muted)' }}>
        Explore.
      </div>
      
      <div 
        style={{
          position: 'absolute',
          left: target.x,
          top: target.y,
          transform: 'translate(-50%, -50%)',
          width: '4px',
          height: '4px',
          backgroundColor: 'var(--color-text)',
          borderRadius: '50%',
          transition: 'all 0.1s ease-out'
        }}
      >
        {/* Proximity Rings */}
        <div style={{
          position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
          width: '120px', height: '120px', borderRadius: '50%',
          border: '1px solid var(--color-border)',
          opacity: proximity * 0.5,
          scale: 0.5 + proximity * 0.5,
        }} />
        
        <div style={{
          position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
          width: '240px', height: '240px', borderRadius: '50%',
          border: '1px dashed var(--color-border)',
          opacity: Math.max(0, proximity - 0.5) * 2,
          scale: 0.8 + proximity * 0.2,
        }} />
        
        {/* Controls that appear */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) scale(${0.8 + proximity * 0.2})`,
          opacity: Math.max(0, proximity - 0.7) * 3, // only show very close
          display: 'flex',
          gap: '16px',
          pointerEvents: proximity > 0.8 ? 'auto' : 'none'
        }}>
          {['INSPECT', 'MODIFY', 'SHARE'].map((action, i) => (
            <button 
              key={action}
              style={{
                padding: '8px 16px',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '20px',
                fontSize: '0.7rem',
                letterSpacing: '0.05em',
                transform: `translateY(${(-40 - i * 10) * proximity}px)`,
                boxShadow: 'var(--shadow-subtle)',
                color: 'var(--color-text)',
              }}
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
