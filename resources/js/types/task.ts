export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface Task {
    id: number;
    name: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    due_date: string | null;
    users: User[];
} 