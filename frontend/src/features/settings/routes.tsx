import { Navigate, type RouteObject } from 'react-router-dom';
import SettingsPage from './pages/SettingsPage';
import DepartmentPage from './pages/DepartmentPage';
import PositionPage from './pages/PositionPage';

export const settingsRoutes: RouteObject[] = [
  {
    path: 'settings',
    element: <SettingsPage />,
    children: [
      { index: true, element: <Navigate to="department" replace /> },
      { path: 'department', element: <DepartmentPage /> },
      { path: 'position', element: <PositionPage /> },
    ],
  },
];
