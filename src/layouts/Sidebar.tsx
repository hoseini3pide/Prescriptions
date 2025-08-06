import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePrescriptionStore } from '../stores/prescriptionStore';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSelectedId } = usePrescriptionStore();

  const menuItems = [
    { 
      name: 'گزارشات', 
      icon: '📊', 
      onClick: () => {
        setSelectedId(null); 
        if (location.pathname !== '/main/prescriptions') {
          navigate('/main/prescriptions');
        }
      }
    },
    { 
      name: 'ثبت', 
      icon: '➕', 
      onClick: () => {
        setSelectedId(null); 
        navigate('/main/registPrescriptions');
      }
    },
  ];

  return (
    <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg border-l border-gray-100 flex flex-col">
      <div className="p-4 border-b border-gray-100 flex items-center justify-center">
        <h2 className="text-xl font-bold text-gray-700">دسترسی ها</h2>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={item.onClick}
                className="w-full flex items-center p-3 rounded-lg transition-colors hover:bg-gray-50 text-gray-600 hover:text-gray-800 text-right bg-white"
              >
                <span className="ml-2 text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav> 
    </div>
  );
};

export default Sidebar;