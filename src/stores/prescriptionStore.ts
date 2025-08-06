import { create } from 'zustand';
import type { IPrescription } from '../intefaces/IPrescription';

type PrescriptionState = {
  selectedId: number | null;
  prescriptions: IPrescription[];
  setSelectedId: (id: number | null) => void;
  updateStatus: (id: number, newStatus: number) => void;
  setPrescriptions: (prescriptions: IPrescription[]) => void
};

export const usePrescriptionStore = create<PrescriptionState>((set) => ({
  selectedId: null,
  prescriptions: [],
  setSelectedId: (id) => set({ selectedId: id }),
  setPrescriptions: (prescriptions) => set({ prescriptions }),
  updateStatus: (id, newStatus) => 
    set((state) => ({
      prescriptions: state.prescriptions.map(prescription =>
        prescription.id === id
          ? { ...prescription, status: newStatus }
          : prescription
      ),
    })),
}));