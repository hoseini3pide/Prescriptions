export interface IPrescription {
  id: number;
  title: string;
  type: string;
  commandType: string;
  startDate: string; 
  status: number;
  isSeen?: boolean;
  
  attachments?: {
    id: string;
    fileName: string;
    fileType: string;
    base64Data: string; 
  }[] | null;


  metaData?: {
    metadata?: { 
      instructions?: {
        dosage?: string;
        frequency?: string;
      };
      discontinuation?: {
        reason?: string;
      };
    };
  };
}