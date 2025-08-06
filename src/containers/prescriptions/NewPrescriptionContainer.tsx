import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { addPrescriptionToStorage } from '../../services/prescriptionStorage';
import { NewPrescriptionForm } from '../../components/prescriptions/regist/NewPrescriptionForm';
import type { IPrescription } from '../../intefaces/IPrescription';

export const NewPrescriptionContainer: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const formik = useFormik({
    initialValues: {
      title: '',
      type: '',
      commandType: '',
      startDate: '',
      isSeen: false,
      status: 1,
      attachments: null as {
        id: string;
        fileName: string;
        fileType: string;
        base64Data: string;
      }[] | null,
      metaData: {
        metadata: {
          instructions: {
            dosage: '',
            frequency: ''
          }
        }
      }
    },
    validationSchema: Yup.object({
      title: Yup.string().required('عنوان الزامی است'),
      type: Yup.string().required('نوع الزامی است'),
      commandType: Yup.string().required('دستور الزامی است'),
    }),
    onSubmit: async (values) => {
      try {
        const newPrescription: IPrescription = {
          id: Date.now(),
          title: values.title,
          type: values.type,
          commandType: values.commandType,
          startDate: formatDate(new Date()),
          status: 1,
          isSeen: false,
          metaData: values.metaData,
          attachments: values.attachments
        };

        await addPrescriptionToStorage(newPrescription);
        setMessage({ type: 'success', text: 'نسخه با موفقیت ثبت شد.' });
        setTimeout(() => navigate('/main/prescriptions'), 1500);
      } catch (error) {
        console.error('Error saving prescription:', error);
        setMessage({ type: 'error', text: 'خطا در ثبت نسخه. لطفا دوباره تلاش کنید.' });
      }
    }
  });

  const handleAttachmentChange = (attachments: {
    id: string;
    fileName: string;
    fileType: string;
    base64Data: string;
  }[] | null) => {
    formik.setFieldValue('attachments', attachments);
  };

  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {message && (
        <div className={`p-4 mb-6 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}
      
      <NewPrescriptionForm
        values={{
          title: formik.values.title,
          type: formik.values.type,
          commandType: formik.values.commandType,
          startDate: formik.values.startDate,
          attachments: formik.values.attachments,
          metaData: formik.values.metaData
        }}
        errors={formik.errors}
        touched={formik.touched}
        handleChange={formik.handleChange}
        handleSubmit={formik.handleSubmit}
        setFieldValue={formik.setFieldValue}
        onAttachmentChange={handleAttachmentChange}
      />
    </div>
  );
};