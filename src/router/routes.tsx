import AppLayout from './AppLayout';
import PrescriptionListContainer from '../containers/prescriptions/PrescriptionListContainer';
import PrescriptionDetailContainer from '../containers/prescriptions/PrescriptionDetailViewContainer';
import ErrorBoundary from '../components/ErrorBoundary';

// import NotFound from '../pages/NotFound';

const routes = [
  {
    path: '/',
    element: <AppLayout />,  
    children: [
      { path: '', element: <PrescriptionListContainer />,errorElement: <ErrorBoundary />},
      { path: '/main/prescriptions', element: <PrescriptionListContainer />,errorElement: <ErrorBoundary />},
    //   { path: 'prescriptions/new', element: <PrescriptionFormContainer /> },
      { path: '/main/prescriptions/:id', element: <PrescriptionDetailContainer />,errorElement: <ErrorBoundary />},
    ],
  },
//   {
//     path: '*',
//     element: <NotFound />,
//   },
];

export default routes;
