export interface Position {
    id: number;
    title: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type PositionPayload = {
    title: string | null;
    is_active: boolean;
}