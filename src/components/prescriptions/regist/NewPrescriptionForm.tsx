import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import 'react-datepicker/dist/react-datepicker.css';

type Props = {
  values: { 
    title: string; 
    type: string; 
    commandType: string;
    startDate: string;
    attachments: null | Array<{
      id: string; 
      fileName: string;
      fileType: string;
      base64Data?: string;
    }>;
    metaData: {
      metadata: {
        instructions?: {
          dosage?: string;
          frequency?: string;
        }
        discontinuation?: {
          reason?: string;
        };
      }
    };
  };
  errors: { 
    title?: string; 
    type?: string; 
    commandType?: string;
    file?: string;
  };
  touched: { 
    title?: boolean; 
    type?: boolean; 
    commandType?: boolean;
  };
  handleChange: {
    (e: React.ChangeEvent<HTMLInputElement>): void;
    (e: React.ChangeEvent<HTMLTextAreaElement>): void;
    (e: React.ChangeEvent<HTMLSelectElement>): void;
  };
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  setFieldValue: (field: string, value: any) => void;
  onAttachmentChange: (attachments: Array<{
    id: string;
    fileName: string;
    fileType: string;
    base64Data: string;
  }> | null) => void;
};

export const NewPrescriptionForm: React.FC<Props> = ({
  values,
  errors,
  touched,
  handleChange,
  handleSubmit,
  setFieldValue,
  onAttachmentChange
}) => {
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.png'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        try {
       
          const base64Data = await readFileAsBase64(file);
          
          if (file.type.startsWith('image/')) {
            setFilePreview(`data:${file.type};base64,${base64Data}`);
          }

          const newAttachment = {
            id: Date.now().toString(),
            fileName: file.name,
            fileType: file.type,
            base64Data: base64Data
          };
          
          onAttachmentChange([newAttachment]);
        } catch (error) {
          console.error('Error reading file:', error);
          onAttachmentChange(null);
          setFilePreview(null);
        }
      } else {
        onAttachmentChange(null);
        setFilePreview(null);
      }
    }
  });

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data:application/...;base64, prefix if present
        const base64Data = result.split(',')[1] || result;
        resolve(base64Data);
      };
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleMetaDataChange = (field: 'dosage' | 'frequency', value: string) => {
    const newMetaData = {
      ...values.metaData,
      metadata: {
        ...values.metaData.metadata,
        instructions: {
          ...values.metaData.metadata?.instructions,
          [field]: value
        }
      }
    };
    setFieldValue('metaData', newMetaData);
  };

  const removeAttachment = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAttachmentChange(null);
    setFilePreview(null);
  };

  return (
    <div className="w-full p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        ثبت نسخه جدید
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            عنوان نسخه
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={values.title}
            onChange={handleChange}
            placeholder="مثلاً نسخه دکتر ..."
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
          />
          {errors.title && touched.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            نوع نسخه
          </label>
          <select
            id="type"
            name="type"
            value={values.type}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
          >
            <option value="">انتخاب کنید</option>
            <option value="دارویی">دارویی</option>
            <option value="آزمایشی">آزمایشی</option>
            <option value="ویزیت">ویزیت</option>
          </select>
          {errors.type && touched.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type}</p>
          )}
        </div>

        <div>
          <label htmlFor="commandType" className="block text-sm font-medium text-gray-700">
            دستور مصرف
          </label>
          <textarea
            id="commandType"
            name="commandType"
            value={values.commandType}
            onChange={handleChange}
            placeholder="مثلاً روزی ۲ بار بعد از غذا ..."
            rows={3}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
          />
          {errors.commandType && touched.commandType && (
            <p className="mt-1 text-sm text-red-600">{errors.commandType}</p>
          )}
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium mb-3 text-gray-800">دستورالعمل مصرف</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="dosage" className="block text-sm font-medium text-gray-700">
                مقدار مصرف
              </label>
              <input
                id="dosage"
                type="text"
                value={values.metaData.metadata?.instructions?.dosage || ''}
                onChange={(e) => handleMetaDataChange('dosage', e.target.value)}
                placeholder="مثلاً 1 قرص"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
              />
            </div>

            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                دفعات مصرف
              </label>
              <input
                id="frequency"
                type="text"
                value={values.metaData.metadata?.instructions?.frequency || ''}
                onChange={(e) => handleMetaDataChange('frequency', e.target.value)}
                placeholder="مثلاً هر 8 ساعت"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            فایل پیوست (اختیاری)
          </label>
          <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-blue-500 transition bg-white">
            <input {...getInputProps()} />
            {values.attachments?.length ? (
              <div className="flex flex-col items-center">
                {values.attachments[0].fileType.startsWith('image/') && (
                  <img 
                    src={filePreview || ''} 
                    alt="پیش‌نمایش" 
                    className="h-32 object-contain mb-2"
                  />
                )}
                <p className="text-sm text-gray-600">
                  {values.attachments[0].fileName}
                </p>
                <button
                  type="button"
                  className="mt-2 text-sm text-red-500"
                  onClick={removeAttachment}
                >
                  حذف فایل
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600">
                  فایل را اینجا رها کنید یا کلیک کنید
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  (PDF, Word, تصاویر تا 5MB)
                </p>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          ثبت نسخه
        </button>
      </form>
    </div>
  );
};