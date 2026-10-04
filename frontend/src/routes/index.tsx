import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { dashboardRoutes } from '@/features/dashboard/routes';
import { employeesRoutes } from '@/features/employees/routes';
import { settingsRoutes } from '@/features/settings/routes';

export const router = createBrowserRouter([
  // Walang layout
  // ...authRoutes,

  // May layout (Header, Sidebar, Footer)
  {
    element: <MainLayout />,
    children: [
      ...dashboardRoutes,
      ...employeesRoutes,
      ...settingsRoutes,
    ],
  },

  { path: '/', element: <Navigate to="/dashboard" replace /> },
]);