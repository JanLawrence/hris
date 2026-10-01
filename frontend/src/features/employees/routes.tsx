import type { RouteObject } from 'react-router-dom';
import EmployeesPage from './pages/EmployeesPage';

export const employeesRoutes: RouteObject[] = [
  { path: 'employees', element: <EmployeesPage /> },
];