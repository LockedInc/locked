import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    requiredRole?: UserRole;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export type UserRole = 'Client-Admin' | 'Member';

export interface Role {
    name: UserRole;
}

export interface User {
    id: number;
    fname: string;
    mname?: string;
    lname: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    role?: Role;
    [key: string]: unknown;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = {
    auth: Auth;
    errors: Record<string, string>;
    flash: {
        message: string | null;
        success: string | null;
        error: string | null;
    };
    ziggy: Config & { location: string };
} & T;
