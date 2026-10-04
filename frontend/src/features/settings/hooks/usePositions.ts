import { useQuery } from '@tanstack/react-query';
import { getPositions } from '@/api/positions';

export const POSITIONS_KEY = ['positions'];

export function usePositions() {
  return useQuery({
    queryKey: POSITIONS_KEY,
    queryFn: () => getPositions().then((res) => res.data),
  });
}