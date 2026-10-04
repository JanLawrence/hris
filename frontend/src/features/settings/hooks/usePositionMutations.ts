import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPosition, deletePosition, updatePosition } from '@/api/positions';
import type { PositionPayload } from '@/types/position';
import { POSITIONS_KEY } from './usePositions';

export function useSavePosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id?: number; data: PositionPayload }) =>
      id ? updatePosition(id, data) : createPosition(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: POSITIONS_KEY }),
  });
}

export function useDeletePosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deletePosition(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: POSITIONS_KEY }),
  });
}