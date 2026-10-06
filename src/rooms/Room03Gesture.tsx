import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { recognizeGesture, Point } from '../utils/gesture';

export default function Room03Gesture() {
  const completeExperiment = useStore(state => state.completeExperiment);
  const discoverExperiment = useStore(state => state.discoverExperiment);
  
  const [points, setPoints] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [result, setResult] = useState<{ gesture: string, confidence: number } | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    discoverExperiment('03');
  }, [discoverExperiment]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDrawing(true);
    setResult(null);
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPoints([{ x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPoints(prev => [...prev, { x: e.clientX - rect.left, y: e.clientY - rect.top }]);
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
    if (points.length > 5) {
      const recognized = recognizeGesture(points);
      if (recognized) {
        setResult(recognized);
        completeExperiment('03');
      } else {
        setResult({ gesture: 'UNKNOWN', confidence: 0 });
      }
    }
  };

  // Build SVG path
  const pathData = points.length > 0 
    ? `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`
    : '';

  return (
    <div 
      ref={containerRef}
      style={{ width: '100%', height: '100%', position: 'relative', touchAction: 'none' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div style={{ position: 'absolute', top: '40px', left: '40px', color: 'var(--color-text-muted)', zIndex: 10 }}>
        Try drawing: circle, line, triangle, or spiral.
      </div>
      
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <path 
          d={pathData} 
          fill="none" 
          stroke="var(--color-text)" 
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      
      {result && !isDrawing && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div style={{ fontSize: '0.8rem', letterSpacing: '0.1em', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
            GESTURE RECOGNIZED
          </div>
          <div style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', marginBottom: '4px' }}>
            {result.gesture}
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            Confidence: {Math.round(result.confidence * 100)}%
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -40%); }
          to { opacity: 1; transform: translate(-50%, -50%); }
        }
      `}</style>
    </div>
  );
}
