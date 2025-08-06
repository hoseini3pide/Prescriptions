import React, { useState, useMemo, useCallback } from 'react';
import  debounce from 'lodash.debounce';
import type { IPrescription } from '../../../intefaces/IPrescription';
import { PrescriptionCard } from '../card/PrescriptionCard';

type Props = {
  prescriptions: IPrescription[];
  onCardClick: (id: number) => void;
  onToggleStatus?: (id: number, newStatus: number) => void;
};

export const PrescriptionList: React.FC<Props> = ({ 
  prescriptions, 
  onCardClick,
  onToggleStatus, 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const handleSearchDebounced = useCallback(
    debounce((query: string) => {
      setDebouncedQuery(query);
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query); 
    handleSearchDebounced(query);
  };

  const filteredPrescriptions = useMemo(() => {
    if (!debouncedQuery) return prescriptions;
    return prescriptions.filter((prescription) =>
      prescription.title?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      prescription.type?.toString().includes(debouncedQuery)
    );
  }, [prescriptions, debouncedQuery]);

  return (
    <div className="w-full px-4">
      <div className="max-w-screen-2xl mx-auto">
        <input
          type="text"
          placeholder="جستجو بر اساس نوع یا عنوان..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-3 mb-6 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 placeholder-gray-400"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-6 w-full">
          {filteredPrescriptions.map((prescription) => (
            <div key={prescription.id} className="min-w-[300px] w-full">
              <PrescriptionCard
                prescription={prescription}
                onClick={onCardClick}
                onToggleStatus={onToggleStatus}
              />
            </div>
          ))}
        </div>

        {filteredPrescriptions.length === 0 && (
          <p className="text-center text-gray-500 py-8 text-lg">
            موردی یافت نشد
          </p>
        )}
      </div>
    </div>
  );
};