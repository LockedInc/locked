import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Plus, LoaderCircle } from 'lucide-react';
import { PageProps } from '@/types';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

type DialogProps = {
    auth: {
        user: {
            client_id: number;
        };
    };
    roles: Array<{
        id: number;
        name: string;
    }>;
}

export default function CreateUserDialog() {
    const { auth, roles } = usePage<PageProps<DialogProps>>().props;
    const clientId = auth.user.client_id;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        client_id: clientId,
        role_id: roles.find(r => r.name === 'member')?.id || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.users.store'), {
            onSuccess: () => {
                reset();
                window.location.href = route('admin.users.index');
            },
        });
    };

    const formatRoleName = (name: string) => {
        return name === "Client-Admin" ? "Admin" : name;
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New User
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                    <DialogDescription>
                        Add a new user to the system
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="Full name"
                                        className="w-full"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        placeholder="email@example.com"
                                        className="w-full"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        placeholder="Password"
                                        className="w-full"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation">Confirm Password</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={e => setData('password_confirmation', e.target.value)}
                                        placeholder="Confirm password"
                                        className="w-full"
                                    />
                                    <InputError message={errors.password_confirmation} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="role_id">Role</Label>
                                    <Select
                                        value={data.role_id.toString()}
                                        onValueChange={(value) => setData('role_id', parseInt(value))}
                                    >
                                        <SelectTrigger id="role_id" className="w-full">
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map((role) => (
                                                <SelectItem key={role.id} value={role.id.toString()}>
                                                    {formatRoleName(role.name)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.role_id} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <DialogFooter className="mt-4">
                        <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Create User
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}