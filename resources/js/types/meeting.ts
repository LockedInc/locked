import { type User } from './user';

export type MeetingStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface Meeting {
    id: number;
    name: string;
    description: string;
    status: MeetingStatus;
    start_time: string;
    end_time: string;
    location?: string;
    meeting_link?: string;
    client_id: number;
    created_by: number;
    created_at: string;
    updated_at: string;
    users: User[];
    created_by_user: User;
}