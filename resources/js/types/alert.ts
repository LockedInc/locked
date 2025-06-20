export interface Alert {
    id: number;
    admin_id: number;
    user_id: number;
    task_id: number | null;
    message: string;
    is_read: boolean;
    read_at: string | null;
    created_at: string;
    updated_at: string;
    admin?: {
        id: number;
        fname: string;
        lname: string;
        email: string;
    };
    task?: {
        id: number;
        name: string;
        status: 'pending' | 'in_progress' | 'completed';
        priority: 'low' | 'medium' | 'high';
        due_date: string | null;
    };
}

export type AlertType = 'info' | 'warning' | 'urgent' | 'success'; 