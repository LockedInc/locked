import { type BreadcrumbItem, type PageProps } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

export default function Profile() {
    const { auth } = usePage<PageProps>().props;
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        fname: '',
        mname: '',
        lname: '',
        email: '',
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        setData({
            fname: auth.user.fname,
            mname: auth.user.mname || '',
            lname: auth.user.lname,
            email: auth.user.email,
            current_password: '',
            password: '',
            password_confirmation: '',
        });
    }, [auth.user]);

    const updateProfile = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('profile.update'), {
            onSuccess: () => {
                toast.success('Profile updated successfully');
                // Clear password fields after successful update
                setData(data => ({
                    ...data,
                    current_password: '',
                    password: '',
                    password_confirmation: '',
                }));
            },
            onError: () => {
                toast.error('Failed to update profile');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Profile information" description="Update your name and email address" />

                    <Card className="w-full max-w-2xl mx-auto bg-white dark:bg-neutral-800 shadow-lg">
                        <CardHeader className="border-b border-neutral-200 dark:border-neutral-700 pb-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-full">
                                    <User className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-2xl font-semibold">Profile Settings</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={updateProfile} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="fname">First Name</Label>
                                    <Input
                                        id="fname"
                                        value={data.fname}
                                        onChange={e => setData('fname', e.target.value)}
                                        error={errors.fname}
                                        className="h-10 text-sm bg-muted/30 p-4 rounded-md min-h-[40px] flex items-center text-foreground border w-full"
                                    />
                                    <InputError message={errors.fname} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="mname">Middle Name</Label>
                                    <Input
                                        id="mname"
                                        value={data.mname}
                                        onChange={e => setData('mname', e.target.value)}
                                        error={errors.mname}
                                        className="h-10 text-sm bg-muted/30 p-4 rounded-md min-h-[40px] flex items-center text-foreground border w-full"
                                    />
                                    <InputError message={errors.mname} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lname">Last Name</Label>
                                    <Input
                                        id="lname"
                                        value={data.lname}
                                        onChange={e => setData('lname', e.target.value)}
                                        error={errors.lname}
                                        className="h-10 text-sm bg-muted/30 p-4 rounded-md min-h-[40px] flex items-center text-foreground border w-full"
                                    />
                                    <InputError message={errors.lname} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        error={errors.email}
                                        className="h-10 text-sm bg-muted/30 p-4 rounded-md min-h-[40px] flex items-center text-foreground border w-full"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
                                    <h3 className="text-lg font-medium mb-4">Update Password</h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="current_password">Current Password</Label>
                                            <Input
                                                id="current_password"
                                                type="password"
                                                value={data.current_password}
                                                onChange={e => setData('current_password', e.target.value)}
                                                error={errors.current_password}
                                                className="h-10 text-sm bg-muted/30 p-4 rounded-md min-h-[40px] flex items-center text-foreground border w-full"
                                            />
                                            <InputError message={errors.current_password} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password">New Password</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={data.password}
                                                onChange={e => setData('password', e.target.value)}
                                                error={errors.password}
                                                className="h-10 text-sm bg-muted/30 p-4 rounded-md min-h-[40px] flex items-center text-foreground border w-full"
                                            />
                                            <InputError message={errors.password} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password_confirmation">Confirm New Password</Label>
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                value={data.password_confirmation}
                                                onChange={e => setData('password_confirmation', e.target.value)}
                                                error={errors.password_confirmation}
                                                className="h-10 text-sm bg-muted/30 p-4 rounded-md min-h-[40px] flex items-center text-foreground border w-full"
                                            />
                                            <InputError message={errors.password_confirmation} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button type="submit" disabled={processing}>
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
