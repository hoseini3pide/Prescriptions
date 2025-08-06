import type { IPrescription } from "../intefaces/IPrescription";
import { parseFieldFromJSON } from "./parseFieldFromJSON";

export const fetchPrescriptionById = async (id: number): Promise<IPrescription> => {
  try {
    const response = await fetch(`http://localhost:3001/prescriptions/${id}`);
    
    if (!response.ok) {
      throw new Error(`خطا در دریافت داده: ${response.status}`);
    }

    const rawData = await response.json();
    

    const [parsedItem] = parseFieldFromJSON([rawData], 'attachments');
    const [finalItem] = parseFieldFromJSON([parsedItem], 'metaData');
    
    return {
      ...finalItem,
      isSeen: finalItem.isSeen || false,
      startDate: finalItem.startDate || new Date().toISOString()
    } as IPrescription;
  } catch (error) {
    console.error('خطا:', error);
    throw new Error('عدم توانایی در دریافت اطلاعات نسخه');
  }
};