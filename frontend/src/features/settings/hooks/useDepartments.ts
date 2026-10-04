// import { useCallback, useEffect, useState } from 'react';
// import { getDepartments } from '@/api/departments';
// import type { Department } from '@/types/department';

// export function useDepartments() {
//   const [data, setData] = useState<Department[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await getDepartments();
//       setData(res.data);
//     } catch {
//       setError('Can't connect to server. Please try again');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   return { data, loading, error, refetch: fetchData };
// }


import { useQuery } from '@tanstack/react-query';
import { getDepartments } from '@/api/departments';

export const DEPARTMENTS_KEY = ['departments'];

export function useDepartments() {
  return useQuery({
    queryKey: DEPARTMENTS_KEY,
    queryFn: () => getDepartments().then((res) => res.data),
  });
}