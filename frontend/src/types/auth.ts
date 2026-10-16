import type { Role } from '@/config/navigation';

export interface AuthUser {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: Role;
}

export type AuthPayload = {
    username: string;
    password: string;
};

export type TokenPair = {
    access: string; 
    refresh: string
};