import React, { useState } from 'react';
import { useStore } from '../store/useStore';

export default function ExperimentNotebook({ experimentId }: { experimentId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState('');
  
  const addNotebookEntry = useStore(state => state.addNotebookEntry);
  const notebook = useStore(state => state.notebook);
  const experiment = useStore(state => state.experiments[experimentId]);
  
  const entries = notebook.filter(n => n.experimentId === experimentId);

  const handleSave = () => {
    if (!note.trim()) return;
    addNotebookEntry({
      experimentId,
      note,
      timestamp: Date.now()
    });
    setNote('');
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          padding: '12px 24px',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '4px',
          boxShadow: 'var(--shadow-subtle)',
          fontSize: '0.8rem',
          color: 'var(--color-text-muted)'
        }}
      >
        Lab Notebook
      </button>
    );
  }

  return (
    <div style={{
      width: '320px',
      backgroundColor: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: '8px',
      boxShadow: 'var(--shadow-hover)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '400px'
    }}>
      <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '0.9rem', margin: 0 }}>Notebook: {experiment?.title}</h3>
        <button onClick={() => setIsOpen(false)} style={{ color: 'var(--color-text-muted)' }}>✕</button>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', backgroundColor: 'var(--color-bg)' }}>
        {entries.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>What did you notice?</p>
        ) : (
          entries.map((entry, i) => (
            <div key={i} style={{ marginBottom: '16px', fontSize: '0.9rem' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                {new Date(entry.timestamp).toLocaleTimeString()}
              </div>
              <div>{entry.note}</div>
            </div>
          ))
        )}
      </div>

      <div style={{ padding: '16px', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note..."
          style={{
            width: '100%',
            border: 'none',
            outline: 'none',
            resize: 'none',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.9rem',
            minHeight: '60px',
            backgroundColor: 'transparent'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
          <button 
            onClick={handleSave}
            style={{
              padding: '6px 16px',
              backgroundColor: 'var(--color-text)',
              color: 'var(--color-surface)',
              borderRadius: '4px',
              fontSize: '0.8rem'
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
