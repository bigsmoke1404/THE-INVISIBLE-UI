import React, { useState, useEffect } from 'react';
import LabNavigation from './components/LabNavigation';
import CursorTracker from './components/CursorTracker';
import { useStore } from './store/useStore';

// Rooms
import Room01Proximity from './rooms/Room01Proximity';
import Room02Magnetic from './rooms/Room02Magnetic';
import Room03Gesture from './rooms/Room03Gesture';
import Room04Time from './rooms/Room04Time';
import Room05Silence from './rooms/Room05Silence';
import Room06Shadow from './rooms/Room06Shadow';
import Room07Breathing from './rooms/Room07Breathing';
import Room08OneHand from './rooms/Room08OneHand';
import Room09Vanishing from './rooms/Room09Vanishing';
import Room10Adaptive from './rooms/Room10Adaptive';
import ExperimentNotebook from './components/ExperimentNotebook';

function LandingPage({ onEnter }: { onEnter: () => void }) {
  const [distance, setDistance] = useState(100);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dist = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));
    setDistance(Math.min(dist, 300));
  };

  const scale = 1 + Math.max(0, (300 - distance) / 300) * 0.5;
  const blur = Math.max(0, (distance - 50) / 20);

  return (
    <div 
      className="landing-page" 
      style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'default' }}
      onMouseMove={handleMouseMove}
    >
      <div style={{ textAlign: 'center', marginBottom: '4rem', zIndex: 10 }}>
        <h1 style={{ fontSize: '4rem', letterSpacing: '0.1em', marginBottom: '1rem', color: 'var(--color-text)' }}>
          THE<br/>INVISIBLE<br/>UI
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', fontStyle: 'italic', marginBottom: '3rem' }}>
          "Interfaces don't have to announce themselves."
        </p>
        <button 
          onClick={onEnter}
          style={{ 
            padding: '12px 32px', 
            border: '1px solid var(--color-border)', 
            borderRadius: '100px',
            fontSize: '0.9rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            transition: 'var(--transition-smooth)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-text)';
            e.currentTarget.style.color = 'var(--color-surface)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--color-text)';
          }}
        >
          Enter the Lab
        </button>
      </div>

      <div 
        style={{
          position: 'absolute',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-accent)',
          opacity: 0.1,
          transform: `scale(${scale})`,
          filter: `blur(${blur}px)`,
          transition: 'transform 0.1s ease-out, filter 0.1s ease-out',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}

export default function App() {
  const [inLab, setInLab] = useState(false);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);

  const renderRoom = () => {
    switch (activeRoom) {
      case '01': return <Room01Proximity />;
      case '02': return <Room02Magnetic />;
      case '03': return <Room03Gesture />;
      case '04': return <Room04Time />;
      case '05': return <Room05Silence />;
      case '06': return <Room06Shadow />;
      case '07': return <Room07Breathing />;
      case '08': return <Room08OneHand />;
      case '09': return <Room09Vanishing />;
      case '10': return <Room10Adaptive />;
      default: return (
        <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
          <p>Select an experiment to begin.</p>
        </div>
      );
    }
  };

  if (!inLab) {
    return <LandingPage onEnter={() => setInLab(true)} />;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <CursorTracker />
      
      <div style={{ flex: 1, position: 'relative' }}>
        {renderRoom()}
        
        {activeRoom && (
           <div style={{ position: 'absolute', bottom: '40px', right: '40px', zIndex: 50 }}>
              <ExperimentNotebook experimentId={activeRoom} />
           </div>
        )}
      </div>

      <div style={{ width: '320px', borderLeft: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', zIndex: 100 }}>
        <LabNavigation activeRoom={activeRoom} onSelectRoom={setActiveRoom} />
      </div>
    </div>
  );
}
