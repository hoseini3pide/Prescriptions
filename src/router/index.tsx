// src/router/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import CenteredActionButtons from '../layouts/CenteredActionButtons';
import PrescriptionListContainer from '../containers/prescriptions/PrescriptionListContainer';
import PrescriptionDetailContainer from '../containers/prescriptions/PrescriptionDetailViewContainer';
import ErrorBoundary from '../components/ErrorBoundary';
import { NewPrescriptionContainer } from '../containers/prescriptions/NewPrescriptionContainer';
import MainLayout from '../layouts/MainLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <CenteredActionButtons />,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/main',
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: 'prescriptions',
        element: <PrescriptionListContainer />,
      },
      {
        path: 'prescriptions/:id',
        element: <PrescriptionDetailContainer />,
      },
      {
        path: 'registPrescriptions',
        element: <NewPrescriptionContainer />,
      }
    ]
  }
]);

export default router;