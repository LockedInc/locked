import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface User {
    id: number;
    name: string;
    email: string;
}

interface UserDetailsProps {
    user: User;
}

export default function UserDetails({ user: initialUser }: UserDetailsProps) {
    const [isEditing, setIsEditing] = useState(false);
    const { data, setData, put, processing, errors, reset } = useForm({
        name: initialUser.name,
        email: initialUser.email,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Users',
            href: '/users',
        },
        {
            title: 'User Details',
            href: `/users/${initialUser.id}`,
        },
    ];

    const handleSave = () => {
        put(`/users/${initialUser.id}`, {
            onSuccess: () => {
                setIsEditing(false);
            },
        });
    };

    const handleCancel = () => {
        reset();
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(`/users/${initialUser.id}`, {
            });
        }
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`User: ${data.name}`} />
            <div className="container mx-auto py-8">
                <Card className="w-full max-w-2xl mx-auto bg-white dark:bg-neutral-800 shadow-lg">
                    <CardHeader className="border-b border-neutral-200 dark:border-neutral-700 pb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-full">
                                    <User className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-2xl font-semibold">{data.name}</CardTitle>
                            </div>

                            <div className="flex items-center gap-2">
                                {isEditing ? (
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={handleCancel}
                                            disabled={processing}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleSave}
                                            disabled={processing}
                                        >
                                            {processing ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            Edit Profile
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={handleDelete}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete User
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>

                                {/* Edit Profile */}
                                {isEditing ? (
                                    <div className="space-y-1">
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="w-full"
                                            disabled={processing}
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-500">{errors.name}</p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-lg">{data.name}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                {isEditing ? (
                                    <div className="space-y-1">
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            className="w-full"
                                            disabled={processing}
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-red-500">{errors.email}</p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-lg">{data.email}</p>
                                )}
                            </div>
                            {!isEditing && (
                                <div className="pt-4">
                                    <Button asChild variant="outline" className="w-full sm:w-auto">
                                        <Link href="/users">Back to User List</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
