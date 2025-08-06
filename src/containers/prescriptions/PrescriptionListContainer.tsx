import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PrescriptionList } from '../../components/prescriptions/list/PrescriptionList';
import type { IPrescription } from '../../intefaces/IPrescription';
import { parseFieldFromJSON } from '../../services/parseFieldFromJSON';
import { usePrescriptionStore } from '../../stores/prescriptionStore';
import { fetchPrescriptionById } from '../../services/prefetchPrescriptions';
import { useSeenStore } from '../../stores/seenStore';
import Tabs from '../../components/Tabs';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';

const PAGE_SIZE = 6;

interface TabType {
  title: string;
  component: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

const fetchAllPrescriptions = async (): Promise<IPrescription[]> => {
  const response = await fetch(`http://localhost:3001/prescriptions`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const rawData = await response.json();
  return parseFieldFromJSON<IPrescription, 'metaData', IPrescription['metaData']>(rawData, 'metaData');
};

const PrescriptionListContainer: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'active' | 'cancelled'>('active');
  const [currentPage, setCurrentPage] = useState(1);

  const { selectedId, setSelectedId } = usePrescriptionStore();
  const markAsSeen = useSeenStore((state) => state.markAsSeen);

  const {
    data: allPrescriptions,
    isLoading,
    error,
    isFetching,
  } = useQuery<IPrescription[]>({
    queryKey: ['all-prescriptions'],
    queryFn: fetchAllPrescriptions,
  });

  const { activePrescriptions, cancelledPrescriptions } = useMemo(() => {
    if (!allPrescriptions) {
      return { activePrescriptions: [], cancelledPrescriptions: [] };
    }

    return {
      activePrescriptions: allPrescriptions.filter(p => p.status === 1),
      cancelledPrescriptions: allPrescriptions.filter(p => p.status === 0)
    };
  }, [allPrescriptions]);

  const getPaginatedData = useCallback((tab: 'active' | 'cancelled') => {
    const prescriptions = tab === 'active' ? activePrescriptions : cancelledPrescriptions;
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return prescriptions.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, activePrescriptions, cancelledPrescriptions]);

  // Calculate total pages for current tab
  const getTotalPages = useCallback((tab: 'active' | 'cancelled') => {
    const totalItems = tab === 'active' 
      ? activePrescriptions.length 
      : cancelledPrescriptions.length;
    return Math.ceil(totalItems / PAGE_SIZE);
  }, [activePrescriptions.length, cancelledPrescriptions.length]);

  const totalPages = getTotalPages(activeTab);
  const currentActiveData = getPaginatedData('active');
  const currentCancelledData = getPaginatedData('cancelled');

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle tab change
  const handleTabChange = (tab: 'active' | 'cancelled') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Handle status toggle
 const handleToggleStatus = useCallback(
  async (id: number, newStatus: number) => {
    try {
      // Get current data from query cache
      const previousData = queryClient.getQueryData<IPrescription[]>(['all-prescriptions']);
      
      if (!previousData) return;

      // Find the prescription to update
      const prescriptionToUpdate = previousData.find(p => p.id === id);
      if (!prescriptionToUpdate) return;

      const previousStatus = prescriptionToUpdate.status;

      // Optimistic update
      queryClient.setQueryData<IPrescription[]>(['all-prescriptions'], (oldData) => {
        if (!oldData) return [];
        return oldData.map(prescription => 
          prescription.id === id 
            ? { ...prescription, status: newStatus } 
            : prescription
        );
      });

      // API call
      const response = await fetch(`http://localhost:3001/prescriptions/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to update status');

      await queryClient.invalidateQueries({ queryKey: ['all-prescriptions'] });
    } catch (err) {
      queryClient.invalidateQueries({ queryKey: ['all-prescriptions'] });
      toast.error('خطا در تغییر وضعیت');
      console.error('Update error:', err);
    }
  },
  [queryClient]
);

  const handleCardClick = useCallback(
    async (id: number) => {
      markAsSeen(id);
      const { seen } = useSeenStore.getState();
      const isCurrentlySeen = seen[id] || false;
      if (isCurrentlySeen) {
        const response = await fetch(`http://localhost:3001/prescriptions/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            isSeen: true,
          }),
        });

        if (!response.ok) throw new Error('Failed to update seen status');
      }
      setSelectedId(id);
      queryClient.prefetchQuery({
        queryKey: ['prescription', id],
        queryFn: () => fetchPrescriptionById(id),
      });
    },
    [markAsSeen, setSelectedId, queryClient]
  );

  useEffect(() => {
    if (selectedId !== null) {
      navigate(`/main/prescriptions/${selectedId}`);
    }
  }, [selectedId, navigate]);

  const tabs: TabType[] = [
    {
      title: 'در حال اجرا',
      component: (
        <div className="flex flex-col h-full">
          <PrescriptionList
            prescriptions={currentActiveData}
            onCardClick={handleCardClick}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      ),
      isActive: activeTab === 'active',
      onClick: () => handleTabChange('active')
    },
    {
      title: 'لغو شده',
      component: (
        <div className="flex flex-col h-full">
          <PrescriptionList
            prescriptions={currentCancelledData}
            onCardClick={handleCardClick}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      ),
      isActive: activeTab === 'cancelled',
      onClick: () => handleTabChange('cancelled')
    }
  ];

  if (isLoading || isFetching) return <div className="flex justify-center p-8"><p>در حال بارگذاری...</p></div>;
  if (error) return <div className="flex justify-center p-8 text-red-500"><p>خطا در بارگذاری اطلاعات: {(error as Error).message}</p></div>;

  return (
    <div className="p-4 h-full flex flex-col">
      <Tabs tabs={tabs} />
      
      {totalPages > 1 && (
        <div className="mt-4">
          <ReactPaginate
            forcePage={currentPage - 1}
            breakLabel="..."
            nextLabel="بعدی >"
            onPageChange={({ selected }) => handlePageChange(selected + 1)}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            pageCount={totalPages}
            previousLabel="< قبلی"
            containerClassName="flex flex-wrap gap-2 justify-center"
            pageClassName="flex items-center justify-center w-8 h-8 border rounded"
            activeClassName="!bg-blue-600 !text-white"
            previousClassName="px-3 py-1 border rounded"
            nextClassName="px-3 py-1 border rounded"
            disabledClassName="opacity-50 cursor-not-allowed"
            breakClassName="flex items-end px-2"
          />
        </div>
      )}
    </div>
  );
};

export default PrescriptionListContainer;