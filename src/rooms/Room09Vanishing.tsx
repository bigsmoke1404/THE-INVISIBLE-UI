import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';

export default function Room09Vanishing() {
  const completeExperiment = useStore(state => state.completeExperiment);
  const discoverExperiment = useStore(state => state.discoverExperiment);
  
  const [inactiveTime, setInactiveTime] = useState(0);
  const [edgeApproached, setEdgeApproached] = useState(false);

  useEffect(() => {
    discoverExperiment('09');
    
    let lastMove = Date.now();
    const handleMove = (e: MouseEvent) => {
      lastMove = Date.now();
      setInactiveTime(0);
      
      // Check if cursor is near edge (e.g. top or left edge)
      if (e.clientX < 50 || e.clientY < 50 || e.clientX > window.innerWidth - 370 || e.clientY > window.innerHeight - 50) {
        setEdgeApproached(true);
        completeExperiment('09');
      } else {
        setEdgeApproached(false);
      }
    };

    window.addEventListener('mousemove', handleMove);
    
    const interval = setInterval(() => {
      setInactiveTime(Date.now() - lastMove);
    }, 100);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      clearInterval(interval);
    };
  }, [discoverExperiment, completeExperiment]);

  const controlsVisible = edgeApproached || inactiveTime < 2000;
  
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '40px', left: '40px', color: 'var(--color-text-muted)' }}>
        Maximize workspace.
      </div>

      {/* Main Content Area */}
      <div style={{
        position: 'absolute',
        inset: controlsVisible ? '120px' : '40px',
        border: '1px dashed var(--color-border)',
        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
          CONTENT AREA
        </div>
      </div>

      {/* Toolbar */}
      <div style={{
        position: 'absolute',
        top: '40px',
        left: '50%',
        transform: `translateX(-50%) translateY(${controlsVisible ? '0' : '-100px'})`,
        opacity: controlsVisible ? 1 : 0,
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        gap: '16px',
        padding: '16px 32px',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '32px',
        boxShadow: 'var(--shadow-subtle)'
      }}>
        {['FILE', 'EDIT', 'VIEW', 'HELP'].map(item => (
          <button key={item} style={{ fontSize: '0.8rem' }}>{item}</button>
        ))}
      </div>
    </div>
  );
}
