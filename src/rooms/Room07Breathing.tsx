import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';

export default function Room07Breathing() {
  const completeExperiment = useStore(state => state.completeExperiment);
  const discoverExperiment = useStore(state => state.discoverExperiment);
  
  const [speed, setSpeed] = useState(0); // 0 to 1
  const lastTimeRef = useRef(Date.now());
  const moveCountRef = useRef(0);

  useEffect(() => {
    discoverExperiment('07');
    
    const handleMove = () => {
      moveCountRef.current += 1;
    };

    window.addEventListener('mousemove', handleMove);
    
    const interval = setInterval(() => {
      const now = Date.now();
      const dt = (now - lastTimeRef.current) / 1000;
      
      const currentSpeed = moveCountRef.current / dt;
      
      // Smoothly map speed to 0-1 range
      setSpeed(prev => {
        const target = Math.min(1, currentSpeed / 20);
        return prev + (target - prev) * 0.1;
      });
      
      if (currentSpeed > 30) {
        completeExperiment('07');
      }
      
      lastTimeRef.current = now;
      moveCountRef.current = 0;
    }, 100);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      clearInterval(interval);
    };
  }, [discoverExperiment, completeExperiment]);

  const spacing = 16 + (1 - speed) * 40; // High speed = compact (16px), Low speed = expansive (56px)
  const borderRadius = speed * 20; // High speed = rounded, Low speed = sharp

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', top: '40px', left: '40px', color: 'var(--color-text-muted)' }}>
        Move fast. Move slow.
      </div>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: `${spacing}px`,
        transition: 'gap 0.3s ease-out'
      }}>
        {[1, 2, 3, 4].map(i => (
          <div 
            key={i}
            style={{
              width: '400px',
              height: '60px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              borderRadius: `${borderRadius}px`,
              transition: 'border-radius 0.3s ease-out',
              display: 'flex',
              alignItems: 'center',
              padding: '0 24px',
              fontSize: '0.8rem',
              color: 'var(--color-text-muted)'
            }}
          >
            Information Block 0{i}
          </div>
        ))}
      </div>
      
      <div style={{ position: 'absolute', bottom: '40px', fontSize: '0.7rem', color: 'var(--color-text-muted)', opacity: 0.5 }}>
        Interaction Intensity: {Math.round(speed * 100)}%
      </div>
    </div>
  );
}
