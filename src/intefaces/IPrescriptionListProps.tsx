import type { IPrescription } from "./IPrescription";


export interface IPrescriptionListProps {
  prescriptions: IPrescription[];
  onCardClick?: (id: number) => void;
  isSeen: boolean;
}
