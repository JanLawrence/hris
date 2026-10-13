import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query';
import { getEmployees } from '@/api/employees';
import type { Option } from '@/components/form/MultiSelect';
import type { EmployeeFilters } from '@/types/employee';

export const EMPLOYEES_KEY = ['employees'];

export function useEmployees(params?: EmployeeFilters) {
  return useQuery({
    queryKey: [...EMPLOYEES_KEY, params],
    queryFn: () => getEmployees(params).then((res) => res.data),
  });
}

export function useEmployeesOptions() {
  const { data: employees = [], isLoading } = useEmployees();

  const options: Option[] = useMemo(
    () =>
      employees
        .filter((emp) => emp.is_active)
        .map((emp) => ({ value: String(emp.id), label: [emp.first_name, emp.middle_name, emp.last_name].filter(Boolean).join(" ") })),
    [employees]
  );

  return { options, isLoading };
}