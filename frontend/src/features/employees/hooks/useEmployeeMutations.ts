import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEmployee, deleteEmployee, updateEmployee } from '@/api/employees';
import type { EmployeePayload } from '@/types/employee';
import { EMPLOYEES_KEY } from '@/features/employees/hooks/useEmployees';

export function useSaveEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id?: number; data: EmployeePayload }) =>
      id ? updateEmployee(id, data) : createEmployee(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EMPLOYEES_KEY }),
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteEmployee(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EMPLOYEES_KEY }),
  });
}