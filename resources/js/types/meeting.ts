import { Task, User } from "./task";

export interface Meeting {
    id: number;
    title: string;
    date: string;
    type: string;
    agenda_id: number;
    agenda_text: string;
    client_id: number;
    users: User[];
    tasks: Task[];
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
}