import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';

export default function Room10Adaptive() {
  const completeExperiment = useStore(state => state.completeExperiment);
  const discoverExperiment = useStore(state => state.discoverExperiment);
  const interactions = useStore(state => state.interactions);
  const adaptiveModeEnabled = useStore(state => state.adaptiveModeEnabled);
  const toggleAdaptiveMode = useStore(state => state.toggleAdaptiveMode);
  
  const [clicks, setClicks] = useState({ search: 0, settings: 0, profile: 0 });
  const [adapted, setAdapted] = useState(false);

  useEffect(() => {
    discoverExperiment('10');
  }, [discoverExperiment]);

  const handleAction = (action: 'search' | 'settings' | 'profile') => {
    setClicks(prev => {
      const next = { ...prev, [action]: prev[action] + 1 };
      if (next.search > 5 || next.settings > 5) {
        setAdapted(true);
        completeExperiment('10');
      }
      return next;
    });
  };

  // UI Adaptation logic based on clicks
  const searchProminence = adaptiveModeEnabled && adapted && clicks.search > clicks.settings ? 1.5 : 1;
  const settingsProminence = adaptiveModeEnabled && adapted && clicks.settings > clicks.search ? 1.5 : 1;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'absolute', top: '40px', left: '40px', color: 'var(--color-text-muted)', zIndex: 10 }}>
        The interface learns from you.
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '40px', gap: '24px' }}>
        <button 
          onClick={() => handleAction('search')}
          style={{
            padding: '12px 24px',
            border: '1px solid var(--color-border)',
            borderRadius: '4px',
            transform: `scale(${searchProminence})`,
            transition: 'all 0.5s ease-out',
            backgroundColor: searchProminence > 1 ? 'var(--color-text)' : 'var(--color-surface)',
            color: searchProminence > 1 ? 'var(--color-surface)' : 'var(--color-text)'
          }}
        >
          SEARCH ({clicks.search})
        </button>
        <button 
          onClick={() => handleAction('settings')}
          style={{
            padding: '12px 24px',
            border: '1px solid var(--color-border)',
            borderRadius: '4px',
            transform: `scale(${settingsProminence})`,
            transition: 'all 0.5s ease-out',
            backgroundColor: settingsProminence > 1 ? 'var(--color-text)' : 'var(--color-surface)',
            color: settingsProminence > 1 ? 'var(--color-surface)' : 'var(--color-text)',
            opacity: searchProminence > 1 && settingsProminence === 1 ? 0.5 : 1
          }}
        >
          SETTINGS ({clicks.settings})
        </button>
      </div>

      {adapted && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'var(--color-surface)',
          padding: '40px',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-hover)',
          maxWidth: '400px',
          animation: 'fadeIn 0.5s ease-out'
        }}>
          <h3 style={{ marginBottom: '16px', fontFamily: 'var(--font-serif)', fontSize: '1.2rem' }}>INTERFACE EVOLUTION</h3>
          <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
            The interface changed because:
          </div>
          <ul style={{ fontSize: '0.9rem', color: 'var(--color-text)', marginBottom: '24px', paddingLeft: '20px' }}>
            <li>Search used: {clicks.search} times</li>
            <li>Settings used: {clicks.settings} times</li>
            <li>Average interaction zone: Top-right</li>
          </ul>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <button 
              onClick={() => toggleAdaptiveMode(true)}
              style={{
                padding: '8px 16px',
                backgroundColor: adaptiveModeEnabled ? 'var(--color-text)' : 'transparent',
                color: adaptiveModeEnabled ? 'var(--color-surface)' : 'var(--color-text)',
                border: '1px solid var(--color-text)',
                fontSize: '0.8rem'
              }}
            >
              APPLY ADAPTATION
            </button>
            <button 
              onClick={() => toggleAdaptiveMode(false)}
              style={{
                padding: '8px 16px',
                border: '1px solid var(--color-border)',
                fontSize: '0.8rem'
              }}
            >
              RESET ADAPTATION
            </button>
          </div>
        </div>
      )}

      {/* Signature Feature: Interaction Memory */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '40px',
        width: '280px',
        borderTop: '1px solid var(--color-border)',
        paddingTop: '16px',
        fontSize: '0.7rem'
      }}>
        <div style={{ color: 'var(--color-text-muted)', marginBottom: '12px', letterSpacing: '0.1em' }}>INTERACTION MEMORY</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: 'var(--color-text-muted)' }}>MOST USED AREA</span>
          <span>TOP-RIGHT</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: 'var(--color-text-muted)' }}>AVERAGE DWELL</span>
          <span>1.8 SEC</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: 'var(--color-text-muted)' }}>GESTURE FREQUENCY</span>
          <span>{Math.min(100, interactions.filter(i => i.type === 'gesture').length * 2)}%</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--color-text-muted)' }}>MOVEMENT EFFICIENCY</span>
          <span>{adapted && adaptiveModeEnabled ? '94%' : '81%'}</span>
        </div>
      </div>
    </div>
  );
}
