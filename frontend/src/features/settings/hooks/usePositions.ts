import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query';
import { getPositions } from '@/api/positions';
import type { Option } from '@/components/form/MultiSelect';

export const POSITIONS_KEY = ['positions'];

export function usePositions() {
  return useQuery({
    queryKey: POSITIONS_KEY,
    queryFn: () => getPositions().then((res) => res.data),
  });
}

export function usePositionOptions() {
  const { data: positions = [], isLoading } = usePositions();

  const options: Option[] = useMemo(
    () =>
      positions
        .filter((pos) => pos.is_active)
        .map((pos) => ({ value: String(pos.id), label: pos.title })),
    [positions]
  );

  return { options, isLoading };
}