export interface Department {
    id: number;
    name: string;
    code: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type DepartmentPayload = {
    name: string;
    code: string | null;
    is_active: boolean;
};