import React from 'react';
import type { IPrescription } from '../../../intefaces/IPrescription';

type Props = {
  prescription: IPrescription;
   onClick: (id: number) => void;
  onToggleStatus?: (id: number, newStatus: number) => void;
};

export const PrescriptionCard: React.FC<Props> = React.memo(({ prescription, onClick, onToggleStatus }) => {
  const { id, title, type, startDate, isSeen,status, attachments } = prescription;
  


  const handleStatusToggle = (e: React.MouseEvent) => {
    debugger;
    e.stopPropagation();
    if (onToggleStatus) {
      onToggleStatus(id, status === 1 ? 0 : 1);
    }
  };

return (
  <div 
    className="cursor-pointer shadow-md rounded-lg hover:bg-gray-50 transition h-full w-full min-w-[300px]" 
    onClick={(e) => {
      e.stopPropagation();
      onClick(id);
    }}
  >
    <div className="p-4">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <div className="flex justify-between mt-2">
        <span className="text-sm text-gray-600">{type}</span>
      </div>
      <div className="flex justify-between mt-2">
        <span className={`text-xs px-2 py-1 rounded-full ${
          status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {status === 1 ? 'فعال' : 'لغو شده'}
        </span>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 text-gray-500 mr-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <span className="text-xs text-gray-500">
            {new Date(startDate).toLocaleDateString('fa-IR')}
          </span>
        </div>
        
        <div className="flex items-center">
          {isSeen ? (
            <>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 text-green-500 mr-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                />
              </svg>
              <span className="text-sm text-green-500">دیده شده</span>
            </>
          ) : (
            <>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 text-gray-400 mr-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" 
                />
              </svg>
              <span className="text-sm text-gray-400">دیده نشده</span>
            </>
          )}
        </div>
      </div>


      {attachments && (
        <div className="mt-2 flex items-center text-gray-500">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 mr-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" 
            />
          </svg>
          <span className="text-sm text-blue-700">دارای پیوست</span>
        </div>
      )}

      <button
        onClick={handleStatusToggle}
        className={`mt-3 w-full py-2 rounded-md text-sm font-medium ${
          status === 1 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-green-500 hover:bg-green-600 text-white'
        }`}
      >
        {status === 1 ? 'لغو نسخه' : 'فعال کردن'}
      </button>
    </div>
  </div>
);
});