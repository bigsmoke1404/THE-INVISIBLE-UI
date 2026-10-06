import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { distance } from '../utils/math';

export default function Room02Magnetic() {
  const completeExperiment = useStore(state => state.completeExperiment);
  const discoverExperiment = useStore(state => state.discoverExperiment);
  
  const [cursor, setCursor] = useState({ x: -1000, y: -1000 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    discoverExperiment('02');
    
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [discoverExperiment]);

  const centerX = window.innerWidth / 2 - 160;
  const centerY = window.innerHeight / 2;

  // Items and their base positions
  const items = [
    { id: 'DESIGN', bx: centerX, by: centerY - 100 },
    { id: 'TYPOGRAPHY', bx: centerX - 120, by: centerY + 80 },
    { id: 'COLOR', bx: centerX + 120, by: centerY + 80 },
    { id: 'LAYOUT', bx: centerX, by: centerY + 180 },
  ];

  // Attraction logic
  const cursorDist = distance(cursor.x, cursor.y, centerX, centerY);
  const attractionForce = Math.max(0, 1 - cursorDist / 500);

  useEffect(() => {
    if (attractionForce > 0.8) {
      completeExperiment('02');
    }
  }, [attractionForce, completeExperiment]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '40px', left: '40px', color: 'var(--color-text-muted)' }}>
        Move closer.
      </div>

      {items.map(item => {
        // Calculate attracted position
        // They attract towards the 'DESIGN' node or center
        const targetX = lerp(item.bx, centerX, attractionForce * 0.8);
        const targetY = lerp(item.by, centerY, attractionForce * 0.8);
        
        return (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              left: targetX,
              top: targetY,
              transform: 'translate(-50%, -50%)',
              padding: '12px 24px',
              border: '1px solid var(--color-border)',
              borderRadius: '4px',
              backgroundColor: 'var(--color-surface)',
              fontSize: '0.8rem',
              letterSpacing: '0.1em',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: attractionForce > 0.5 ? 'var(--shadow-hover)' : 'var(--shadow-subtle)'
            }}
          >
            {item.id}
          </div>
        );
      })}
      
      {/* Connecting lines that appear */}
      <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: -1, width: '100%', height: '100%' }}>
        {items.map((item, i) => {
          if (i === 0) return null; // Skip DESIGN
          const startX = lerp(item.bx, centerX, attractionForce * 0.8);
          const startY = lerp(item.by, centerY, attractionForce * 0.8);
          const endX = lerp(items[0].bx, centerX, attractionForce * 0.8);
          const endY = lerp(items[0].by, centerY, attractionForce * 0.8);
          
          return (
            <line 
              key={`line-${i}`}
              x1={startX} y1={startY} x2={endX} y2={endY}
              stroke="var(--color-border)"
              strokeWidth="1"
              opacity={attractionForce}
            />
          );
        })}
      </svg>
    </div>
  );
}

function lerp(start: number, end: number, amt: number) {
  return (1 - amt) * start + amt * end;
}
