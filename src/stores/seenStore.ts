import { create } from 'zustand';
import type { IPrescription } from '../intefaces/IPrescription';

type SeenState = {
  prescriptions: IPrescription[];
  seen: Record<number, boolean>;
  markAsSeen: (id: number) => void;
};

export const useSeenStore = create<SeenState>()(
  (set) => ({
     prescriptions: [],
  
    setPrescriptions: (prescriptions: any) => set({ prescriptions }),
    seen: {},
    markAsSeen: (id: number) =>
      set((state) => ({
        seen: {
          ...state.seen,
          [id]: true,
        },
      })),
  })
);