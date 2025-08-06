import React from "react";
import type { IPrescription } from "../../../intefaces/IPrescription";

type Props = {
  prescription: IPrescription;
};

export const PrescriptionDetailView: React.FC<Props> = ({ prescription }) => {
  const {
    title,
    type,
    startDate,
    commandType,
    status,
    attachments,
    metaData,
  } = prescription;


  const toPersianDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR');
  };

  const handleDownload = (file: {
    id: string;
    fileName: string;
    fileType: string;
    base64Data: string;
  }) => {
    try {
     
      const byteCharacters = atob(file.base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: file.fileType });

    
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.fileName;
      document.body.appendChild(a);
      a.click();
      
 
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('خطا در دانلود فایل');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto ">

      <h1 className="text-gray-800 mb-16">جزئیات نسخه</h1>
      <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>

      <div className="space-y-3 mb-6">
        <div className="flex items-center">
          <span className="text-gray-600 font-medium w-32">نوع نسخه:</span>
          <span className="text-gray-800">{type}</span>
        </div>
        
        <div className="flex items-center">
          <span className="text-gray-600 font-medium w-32">تاریخ شروع:</span>
          <span className="text-gray-800">{toPersianDate(startDate)}</span>
        </div>
        
        <div className="flex items-center">
          <span className="text-gray-600 font-medium w-32">دسته‌بندی:</span>
          <span className="text-gray-800">{commandType}</span>
        </div>
        
        <div className="flex items-center">
          <span className="text-gray-600 font-medium w-32">وضعیت:</span>
          <span className={`font-medium ${status === 1 ? 'text-green-600' : 'text-red-600'}`}>
            {status === 1 ? "در حال اجرا" : "لغو شده"}
          </span>
        </div>
      </div>

      {metaData?.metadata?.instructions && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">دستور مصرف</h2>
          <div className="space-y-2">
            {metaData.metadata.instructions.dosage && (
              <div className="flex">
                <span className="text-gray-700 font-medium ml-2">مقدار مصرف:</span>
                <span className="text-gray-900">{metaData.metadata.instructions.dosage}</span>
              </div>
            )}
            {metaData.metadata.instructions.frequency && (
              <div className="flex">
                <span className="text-gray-700 font-medium ml-2">دفعات مصرف:</span>
                <span className="text-gray-900">{metaData.metadata.instructions.frequency}</span>
              </div>
            )}
           
          </div>
        </div>
      )}

      {metaData?.metadata?.discontinuation && (
        <div className="mb-6 p-4 bg-red-50 rounded-lg">
          <h2 className="text-lg font-semibold text-red-800 mb-2">اطلاعات قطع مصرف</h2>
          <div className="space-y-2">
            {metaData.metadata.discontinuation.reason && (
              <div className="flex">
                <span className="text-gray-700 font-medium ml-2">دلیل:</span>
                <span>{metaData.metadata.discontinuation.reason}</span>
              </div>
            )}
           
          </div>
        </div>
      )}

      {attachments && attachments.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">فایل‌های پیوست شده</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {attachments.map((file) => (
              <div key={file.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">  
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{file.fileName}</p>
                    <p className="text-sm text-gray-500">{file.fileType}</p>
                  </div>
                
                  <button
                    onClick={() => handleDownload(file)}
                    className="ml-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded text-sm whitespace-nowrap"
                  >
                    دانلود
                  </button>
                </div>
                
                {file.fileType.startsWith('image/') && file.base64Data && (
                  <div className="mt-2 border-t pt-2">
                    <img 
                      src={`data:${file.fileType};base64,${file.base64Data}`}
                      alt={`پیش‌نمایش ${file.fileName}`}
                      className="max-h-40 w-auto mx-auto rounded"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};