import { usePage } from '@inertiajs/react';
import { type PageProps } from '@/types';

export function useRolePrefix() {
    const { auth } = usePage().props as unknown as PageProps;
    const isAdmin = auth.user.role?.name === 'Client-Admin';
    const prefix = isAdmin ? '/admin' : '/member';

    return {
        prefix,
        isAdmin,
        getRoute: (path: string) => `${prefix}${path}`
    };
} 