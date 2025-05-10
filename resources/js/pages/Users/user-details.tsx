import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface UserDetailsProps {
    user: User;
}

export default function UserDetails({ user }: UserDetailsProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Users',
            href: '/users',
        },
        {
            title: 'User Details',
            href: `/users/${user.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`User: ${user.name}`} />
            <div className="container mx-auto py-8">
                <Card className="w-full max-w-2xl mx-auto bg-white dark:bg-neutral-800 shadow-lg">
                    <CardHeader className="border-b border-neutral-200 dark:border-neutral-700 pb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <User className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle className="text-2xl font-semibold">{user.name}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-6">
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Name</span>
                                <p className="text-lg">{user.name}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Email</span>
                                <p className="text-lg">{user.email}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
