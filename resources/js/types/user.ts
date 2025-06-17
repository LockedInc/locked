export interface User {
    id: number;
    fname: string;
    mname?: string;
    lname: string;
    email: string;
    role?: {
        id: number;
        name: string;
    };
    client_id?: number;
    full_name?: string;
} 