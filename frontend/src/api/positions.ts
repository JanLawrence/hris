import client from './client'
import type { Position, PositionPayload } from '@/types/position'

const BASE = '/api/positions/';

export const getPositions = () => client.get<Position []>(BASE);
export const createPosition = (data: PositionPayload) => client.post<Position>(BASE, data);
export const updatePosition = (id: number, data: PositionPayload) => client.patch<Position>(`${BASE}${id}/`, data);
export const deletePosition = (id: number) => client.delete(`${BASE}${id}/`);