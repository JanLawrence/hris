import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDepartment, deleteDepartment, updateDepartment } from '@/api/departments';
import type { DepartmentPayload } from '@/types/department';
import { DEPARTMENTS_KEY } from './useDepartments';

export function useSaveDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id?: number; data: DepartmentPayload }) =>
      id ? updateDepartment(id, data) : createDepartment(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DEPARTMENTS_KEY }),
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteDepartment(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DEPARTMENTS_KEY }),
  });
}