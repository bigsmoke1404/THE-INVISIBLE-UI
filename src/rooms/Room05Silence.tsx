import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';

export default function Room05Silence() {
  const completeExperiment = useStore(state => state.completeExperiment);
  const discoverExperiment = useStore(state => state.discoverExperiment);
  
  const [silenceDuration, setSilenceDuration] = useState(0);
  const [lastMove, setLastMove] = useState(Date.now());

  useEffect(() => {
    discoverExperiment('05');
    
    const handleMove = () => {
      setLastMove(Date.now());
      setSilenceDuration(0);
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [discoverExperiment]);

  useEffect(() => {
    const interval = setInterval(() => {
      const dur = Date.now() - lastMove;
      setSilenceDuration(dur);
      if (dur > 3000) {
        completeExperiment('05');
      }
    }, 100);
    return () => clearInterval(interval);
  }, [lastMove, completeExperiment]);

  const opacity = Math.min(1, Math.max(0, (silenceDuration - 1000) / 2000));

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', top: '40px', left: '40px', color: 'var(--color-text-muted)', opacity: 1 - opacity * 0.5 }}>
        Stay still.
      </div>
      
      {silenceDuration > 30000 && (
        <div style={{ position: 'absolute', top: '80px', left: '40px', color: 'var(--color-text)', fontSize: '0.8rem', fontStyle: 'italic', animation: 'fadeIn 2s ease-out' }}>
          "All of humanity's problems stem from man's inability to sit quietly in a room alone." - Blaise Pascal
        </div>
      )}

      {/* Central Object */}
      <div style={{
        width: '60px',
        height: '60px',
        border: '1px solid var(--color-border)',
        transform: 'rotate(45deg)',
        transition: 'all 0.5s ease-out'
      }} />
      
      {/* Emerging Controls */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${0.8 + opacity * 0.2})`,
        opacity: opacity,
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
        pointerEvents: opacity > 0.8 ? 'auto' : 'none'
      }}>
        <div style={{ display: 'flex', gap: '80px', transform: 'translateY(-60px)' }}>
          <button style={{ padding: '8px 16px', border: '1px solid var(--color-border)', fontSize: '0.8rem' }}>EDIT</button>
          <button style={{ padding: '8px 16px', border: '1px solid var(--color-border)', fontSize: '0.8rem' }}>SAVE</button>
        </div>
        <div style={{ display: 'flex', gap: '80px', transform: 'translateY(60px)' }}>
          <button style={{ padding: '8px 16px', border: '1px solid var(--color-border)', fontSize: '0.8rem' }}>SHARE</button>
          <button style={{ padding: '8px 16px', border: '1px solid var(--color-border)', fontSize: '0.8rem' }}>DELETE</button>
        </div>
      </div>
    </div>
  );
}
