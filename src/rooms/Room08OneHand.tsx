import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { distance, lerp } from '../utils/math';

export default function Room08OneHand() {
  const completeExperiment = useStore(state => state.completeExperiment);
  const discoverExperiment = useStore(state => state.discoverExperiment);
  
  const [cursor, setCursor] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    discoverExperiment('08');
    
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [discoverExperiment]);

  const cx = cursor.x;
  const cy = cursor.y;

  const [efficiency, setEfficiency] = useState(0);

  useEffect(() => {
    // If the user discovers that controls come to them
    if (efficiency > 80) {
      completeExperiment('08');
    }
  }, [efficiency, completeExperiment]);

  const controls = [
    { id: '1', bx: 100, by: 100, label: 'MENU' },
    { id: '2', bx: window.innerWidth - 400, by: 100, label: 'SEARCH' },
    { id: '3', bx: 100, by: window.innerHeight - 200, label: 'SETTINGS' },
  ];

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '40px', left: '40px', color: 'var(--color-text-muted)', zIndex: 10 }}>
        The interface comes to you.
      </div>
      
      {/* Phone outline simulation */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '375px',
        height: '812px',
        border: '1px solid var(--color-border)',
        borderRadius: '40px',
        pointerEvents: 'none',
        opacity: 0.1
      }} />

      {controls.map((ctrl) => {
        const dist = distance(cx, cy, ctrl.bx, ctrl.by);
        // Controls move towards cursor if it's somewhat close
        const pull = Math.max(0, 1 - dist / 800);
        
        // Calculate new position
        const tx = lerp(ctrl.bx, cx + (ctrl.bx > cx ? 40 : -40), pull * 0.7);
        const ty = lerp(ctrl.by, cy + (ctrl.by > cy ? 40 : -40), pull * 0.7);

        // Update efficiency if controls are pulled
        useEffect(() => {
          if (pull > 0.6) setEfficiency(prev => Math.min(100, prev + 1));
        }, [pull]);

        return (
          <div key={ctrl.id} style={{
            position: 'absolute',
            left: tx,
            top: ty,
            transform: 'translate(-50%, -50%)',
            padding: '12px 24px',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '24px',
            fontSize: '0.8rem',
            transition: 'all 0.1s linear',
            boxShadow: 'var(--shadow-subtle)'
          }}>
            {ctrl.label}
          </div>
        )
      })}
      
      <div style={{ position: 'absolute', bottom: '40px', left: '40px', fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
        Efficiency: {efficiency}%
      </div>
    </div>
  );
}
