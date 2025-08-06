import React from 'react';
import { Outlet } from 'react-router-dom';
import CenteredActionButtons from '../layouts/CenteredActionButtons';
const AppLayout: React.FC = () => {
  return (
    <>
      <CenteredActionButtons />
      <Outlet />
    </>
  );
};

export default AppLayout;
