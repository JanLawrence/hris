import client from './client';
import type { AuthUser, AuthPayload, TokenPair} from '@/types/auth';

const BASE = '/api/auth/';

export const login = (data: AuthPayload) =>
    client.post<TokenPair>(`${BASE}token/`, data)

export const getMe = () => client.get<AuthUser>(`${BASE}me/`);