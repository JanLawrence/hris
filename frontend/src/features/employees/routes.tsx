import type { RouteObject } from 'react-router-dom';
import EmployeesPage from './pages/EmployeesPage';
import EmployeeFormNavAdd from './components/EmployeeFormNavAdd';
import EmployeeFormNavEdit from './components/EmployeeFormNavEdit';

export const employeesRoutes: RouteObject[] = [
  { path: 'employees', element: <EmployeesPage /> },
  { path: 'employees/form/add', element: <EmployeeFormNavAdd /> },
  { path: 'employees/:id/edit', element: <EmployeeFormNavEdit /> },
];