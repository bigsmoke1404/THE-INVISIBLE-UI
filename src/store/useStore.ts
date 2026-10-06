import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ExperimentState = 'NOT_DISCOVERED' | 'DISCOVERED' | 'COMPLETED';

export interface Experiment {
  id: string;
  title: string;
  principle: string;
  state: ExperimentState;
}

export interface Interaction {
  type: 'hover' | 'click' | 'gesture' | 'dwell' | 'move';
  timestamp: number;
  x: number;
  y: number;
  duration?: number;
  target?: string;
  outcome?: string;
}

export interface SessionData {
  startTime: number;
  experimentsOpened: number;
  interactionsCount: number;
  gesturesRecognized: number;
  tasksCompleted: number;
  adaptationChanges: number;
}

export interface NotebookEntry {
  experimentId: string;
  note: string;
  timestamp: number;
}

interface AppState {
  experiments: Record<string, Experiment>;
  session: SessionData;
  interactions: Interaction[];
  notebook: NotebookEntry[];
  adaptiveModeEnabled: boolean;
  
  // Actions
  discoverExperiment: (id: string) => void;
  completeExperiment: (id: string) => void;
  recordInteraction: (interaction: Interaction) => void;
  addNotebookEntry: (entry: NotebookEntry) => void;
  resetData: () => void;
  toggleAdaptiveMode: (enabled: boolean) => void;
}

const initialExperiments: Record<string, Experiment> = {
  '01': { id: '01', title: 'PROXIMITY', principle: 'Progressive disclosure', state: 'NOT_DISCOVERED' },
  '02': { id: '02', title: 'MAGNETIC UI', principle: 'Spatial relationships', state: 'NOT_DISCOVERED' },
  '03': { id: '03', title: 'GESTURE', principle: 'Spatial input', state: 'NOT_DISCOVERED' },
  '04': { id: '04', title: 'TIME AS INPUT', principle: 'Temporal intent', state: 'NOT_DISCOVERED' },
  '05': { id: '05', title: 'SILENCE', principle: 'Inactivity as signal', state: 'NOT_DISCOVERED' },
  '06': { id: '06', title: 'SHADOW INTERFACE', principle: 'Contextual actions', state: 'NOT_DISCOVERED' },
  '07': { id: '07', title: 'BREATHING UI', principle: 'Rhythmic adaptation', state: 'NOT_DISCOVERED' },
  '08': { id: '08', title: 'ONE-HAND INTERFACE', principle: 'Ergonomic optimization', state: 'NOT_DISCOVERED' },
  '09': { id: '09', title: 'VANISHING CONTROLS', principle: 'Workspace maximization', state: 'NOT_DISCOVERED' },
  '10': { id: '10', title: 'THE ADAPTIVE INTERFACE', principle: 'Personalized interfaces', state: 'NOT_DISCOVERED' },
};

const initialSession: SessionData = {
  startTime: Date.now(),
  experimentsOpened: 0,
  interactionsCount: 0,
  gesturesRecognized: 0,
  tasksCompleted: 0,
  adaptationChanges: 0,
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      experiments: initialExperiments,
      session: initialSession,
      interactions: [],
      notebook: [],
      adaptiveModeEnabled: true,
      
      discoverExperiment: (id) => set((state) => {
        if (state.experiments[id]?.state === 'NOT_DISCOVERED') {
          return {
            experiments: {
              ...state.experiments,
              [id]: { ...state.experiments[id], state: 'DISCOVERED' }
            }
          };
        }
        return state;
      }),
      
      completeExperiment: (id) => set((state) => ({
        experiments: {
          ...state.experiments,
          [id]: { ...state.experiments[id], state: 'COMPLETED' }
        }
      })),
      
      recordInteraction: (interaction) => set((state) => {
        // Keep last 1000 interactions for memory to avoid bloat
        const newInteractions = [...state.interactions, interaction].slice(-1000);
        return {
          interactions: newInteractions,
          session: {
            ...state.session,
            interactionsCount: state.session.interactionsCount + 1,
            gesturesRecognized: interaction.type === 'gesture' ? state.session.gesturesRecognized + 1 : state.session.gesturesRecognized
          }
        };
      }),
      
      addNotebookEntry: (entry) => set((state) => ({
        notebook: [...state.notebook, entry]
      })),
      
      resetData: () => set(() => ({
        experiments: initialExperiments,
        session: { ...initialSession, startTime: Date.now() },
        interactions: [],
        notebook: []
      })),
      
      toggleAdaptiveMode: (enabled) => set({ adaptiveModeEnabled: enabled })
    }),
    {
      name: 'invisible-ui-storage',
    }
  )
);
