import client from './client';
import type { Employee, EmployeePayload } from '@/types/employee';

const BASE = '/api/employees/';

export const getEmployees = () => client.get<Employee[]>(BASE);
export const createEmployee = (data: EmployeePayload) => client.post<Employee>(BASE, data);
export const updateEmployee = (id: number, data: EmployeePayload) => client.patch<Employee>(`${BASE}${id}/`, data);
export const deleteEmployee = (id: number) => client.delete(`${BASE}${id}/`);