import client from './client';
import type { Department, DepartmentPayload } from '@/types/department';

const BASE = '/api/departments/';

export const getDepartments = () => client.get<Department[]>(BASE);
export const createDepartment = (data: DepartmentPayload) => client.post<Department>(BASE, data);
export const updateDepartment = (id: number, data: DepartmentPayload) => client.patch<Department>(`${BASE}${id}/`, data);
export const deleteDepartment = (id: number) => client.delete(`${BASE}${id}/`);