import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PrescriptionDetailView } from "../../components/prescriptions/detailView/PrescriptionDetailView";
import type { IPrescription } from "../../intefaces/IPrescription";
import { fetchPrescriptionById } from "../../services/prefetchPrescriptions";

const PrescriptionDetailContainer: React.FC = () => {
  const { id } = useParams();

  const {
    data,
    isLoading,
    error,
  } = useQuery<IPrescription>({
    queryKey: ["prescription", id],
    queryFn: () => fetchPrescriptionById(Number(id)),
    enabled: !!id, 
  });

  if (isLoading) return <p>در حال بارگذاری...</p>;
  if (error) return <p>خطا در دریافت اطلاعات نسخه</p>;
  if (!data) return <p>نسخه‌ای یافت نشد</p>;

  return <PrescriptionDetailView prescription={data} />;
};

export default PrescriptionDetailContainer;
