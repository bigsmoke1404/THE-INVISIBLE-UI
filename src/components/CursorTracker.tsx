import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';

export default function CursorTracker() {
  const recordInteraction = useStore(state => state.recordInteraction);
  const [positions, setPositions] = useState<{x: number, y: number}[]>([]);

  useEffect(() => {
    let lastTime = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime > 100) { // Throttle to every 100ms
        recordInteraction({
          type: 'move',
          timestamp: now,
          x: e.clientX,
          y: e.clientY
        });
        
        setPositions(prev => [...prev.slice(-40), { x: e.clientX, y: e.clientY }]);
        lastTime = now;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [recordInteraction]);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
      {/* Subtle Heatmap Trail */}
      {positions.map((pos, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: pos.x,
            top: pos.y,
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-accent)',
            opacity: 0.02 * (i / positions.length),
            transform: 'translate(-50%, -50%)',
            transition: 'opacity 1s ease-out'
          }}
        />
      ))}
    </div>
  );
}
