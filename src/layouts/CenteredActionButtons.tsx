import React from 'react';
import { useNavigate } from 'react-router-dom';
import paperLogo from '../assets/Paper.png';

const CenteredActionButtons: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-[999] bg-custom-gradient flex items-center justify-center">

      <div className="relative border border-custom-border bg-white/50 backdrop-blur-sm rounded-xl shadow-lg p-8 min-w-[400px] w-full max-w-md">

        <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] rounded-xl -z-10"></div>

        <div className="flex flex-col items-center">

          <img 
            src={paperLogo} 
            alt="Logo"
            className="w-auto h-auto max-w-full max-h-[150px] mb-6"
          />
          
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">عملیات نسخه‌ها</h2>

          <div className="flex flex-col space-y-4 w-full">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg text-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              onClick={() => navigate('/main')}
            >
              ورود
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default CenteredActionButtons;