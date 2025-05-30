import { type NavItem } from '@/types';
import { LayoutGrid, SquareCheckBig, Users, Calendar } from 'lucide-react';

export const navigationConfig = {
    admin: [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
            icon: LayoutGrid,
            requiredRole: 'Client-Admin',
        },
        {
            title: 'Tasks',
            href: '/admin/tasks',
            icon: SquareCheckBig,
            requiredRole: 'Client-Admin',
        },
        {
            title: 'Users',
            href: '/admin/users',
            icon: Users,
            requiredRole: 'Client-Admin',
        },
        {
            title: 'Meetings',
            href: '/admin/meetings',
            icon: Calendar,
            requiredRole: 'Client-Admin',
        },
    ],
    member: [
        {
            title: 'Dashboard',
            href: '/member/dashboard',
            icon: LayoutGrid,
            requiredRole: 'Member',
        },
        {
            title: 'My Tasks',
            href: '/member/tasks',
            icon: SquareCheckBig,
            requiredRole: 'Member',
        },
        {
            title: 'My Meetings',
            href: '/member/meetings',
            icon: Calendar,
            requiredRole: 'Member',
        },
    ],
} satisfies Record<string, NavItem[]>;

export function getNavigationItems(role?: string): NavItem[] {
    if (!role) return [];
    
    return role === 'Client-Admin' 
        ? navigationConfig.admin 
        : navigationConfig.member;
} 