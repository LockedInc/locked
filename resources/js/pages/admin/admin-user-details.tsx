import React, { useState } from 'react';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { DeleteConfirmation } from '@/components/ui/delete-confirmation';
import { useRolePrefix } from '@/hooks/use-role-prefix';

interface UserData {
    id: number;
    name: string;
    email: string;
}

interface PageProps {
    user: UserData;
    from_meeting?: number;
}

export default function UserDetails({ user }: PageProps) {
    const [isEditing, setIsEditing] = useState(false);
    const { getRoute } = useRolePrefix();
    const { data, setData, put, processing, errors, reset } = useForm({
        name: user.name,
        email: user.email,
    });
    const { props } = usePage();
    const fromMeetingId = props.from_meeting;
    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Meetings',
            href: '/meetings',
        },
        ...(fromMeetingId ? [
            {
                title: 'Meeting Details',
                href: `/meetings/${fromMeetingId}`,
            }
        ] : [
            {
                title: 'Users',
                href: '/users',
            }
        ]),
        {
            title: user.name,
            href: `/users/${user.id}`,
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(getRoute(`/users/${user.id}`), {
            onSuccess: () => {
                setIsEditing(false);
            }
        });
    };

    const handleCancel = () => {
        reset();
        setIsEditing(false);
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
                            <div className="flex gap-2">
                                {isEditing ? (
                                    <>
                                        <Button variant="outline" onClick={handleCancel} className="cursor-pointer">
                                            Cancel
                                        </Button>
                                        <Button onClick={handleSubmit} disabled={processing} className="cursor-pointer">
                                            Save Changes
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button onClick={() => setIsEditing(true)} className="cursor-pointer">
                                            Edit User
                                        </Button>
                                        <DeleteConfirmation
                                            onConfirm={() => router.delete(`/users/${user.id}`)}
                                            itemType="user"
                                            itemName={user.name}
                                        >
                                            <Button variant="destructive" className="cursor-pointer">
                                                Delete User
                                            </Button>
                                        </DeleteConfirmation>
                                    </>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                {isEditing ? (
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        error={errors.name}
                                        className="h-10 text-sm bg-muted/30 p-4 rounded-md min-h-[40px] flex items-center text-foreground border w-full"
                                    />
                                ) : (
                                    <p className="text-lg">{data.name}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                {isEditing ? (
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        error={errors.email}
                                        className="h-10 text-sm bg-muted/30 p-4 rounded-md min-h-[40px] flex items-center text-foreground border w-full"
                                    />
                                ) : (
                                    <p className="text-lg">{data.email}</p>
                                )}
                            </div>
                            <div className="mt-6">
                                {fromMeetingId ? (
                                    <Button variant="outline" onClick={() => router.visit(getRoute(`/meetings/${fromMeetingId}`))} className="cursor-pointer">
                                        ← Back to Meeting
                                    </Button>
                                ) : (
                                    <Button variant="outline" onClick={() => router.visit(getRoute('/users'))} className="cursor-pointer">
                                        ← Back to Users List
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
