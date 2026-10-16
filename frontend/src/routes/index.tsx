import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { dashboardRoutes } from '@/features/dashboard/routes';
import { employeesRoutes } from '@/features/employees/routes';
import { settingsRoutes } from '@/features/settings/routes';
import { authRoutes } from '@/features/auth/routes';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';

export const router = createBrowserRouter([
  ...authRoutes,

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          ...dashboardRoutes,
          ...employeesRoutes,
          ...settingsRoutes,
        ],
      }
    ]
  },

  { path: '/', element: <Navigate to="/dashboard" replace /> },
]);