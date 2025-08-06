import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
const MainLayout = () => {
  return (
    <div className="flex w-full h-screen ">

      <div className="w-64 h-full flex-shrink-0 sticky top-0 overflow-y-auto">
        <Sidebar />
      </div>


      <div className="w-full ml-24 mr-24 pt-16 bg-white mt-16">
        <div className="w-full"> 
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;