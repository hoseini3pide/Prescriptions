import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  // Don't show pagination if only one page exists
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-between items-center px-4 py-2 bg-gray-50 rounded-lg">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded ${currentPage === 1 ? 'text-gray-400 cursor-default' : 'text-blue-600 hover:bg-blue-50'}`}
      >
        &larr; قبلی
      </button>
      
      <div className="flex items-center gap-1">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }
          
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentPage === pageNum 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-gray-100'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
        {totalPages > 5 && currentPage < totalPages - 2 && (
          <span className="px-1">...</span>
        )}
        {totalPages > 5 && currentPage < totalPages - 2 && (
          <button
            onClick={() => onPageChange(totalPages)}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentPage === totalPages 
                ? 'bg-blue-600 text-white' 
                : 'hover:bg-gray-100'
            }`}
          >
            {totalPages}
          </button>
        )}
      </div>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded ${currentPage === totalPages ? 'text-gray-400 cursor-default' : 'text-blue-600 hover:bg-blue-50'}`}
      >
        بعدی &rarr;
      </button>
    </div>
  );
};

export default Pagination;