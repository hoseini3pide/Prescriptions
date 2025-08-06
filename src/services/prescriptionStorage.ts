import type { IPrescription } from "../intefaces/IPrescription";

export const addPrescriptionToStorage = async (prescription: IPrescription) => {
  try {

    const formattedPrescription = {
      ...prescription,
      metaData: JSON.stringify(prescription.metaData),
      id: prescription.id.toString() 
    };

    const response = await fetch('http://localhost:3001/prescriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedPrescription),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'خطا در ذخیره نسخه');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in addPrescriptionToStorage:', error);
    throw error;
  }
};