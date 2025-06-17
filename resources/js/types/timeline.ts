export interface Timeline {
    id: number;
    user_id: number;
    subject_type: string;
    subject_id: number;
    origin_client_id: number;
    message: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    user?: {
        id: number;
        fname: string;
        lname: string;
    };
} 