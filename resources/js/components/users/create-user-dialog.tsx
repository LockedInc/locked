import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { LoaderCircle } from 'lucide-react';
import { PageProps } from '@/types';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { SingleSelect } from '@/components/ui/single-select';

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

interface CreateUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreateUserDialog({ open, onOpenChange }: CreateUserDialogProps) {
    const { auth, roles } = usePage<PageProps<DialogProps>>().props;
    const clientId = auth.user.client_id;

    const { data, setData, post, processing, errors, reset } = useForm({
        fname: '',
        mname: '',
        lname: '',
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
                onOpenChange(false);
            },
        });
    };

    const formatRoleName = (name: string) => {
        return name === "Client-Admin" ? "Admin" : name;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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
                                    <Label htmlFor="fname">First Name</Label>
                                    <Input
                                        id="fname"
                                        value={data.fname}
                                        onChange={e => setData('fname', e.target.value)}
                                        placeholder="First name"
                                        className="w-full"
                                    />
                                    <InputError message={errors.fname} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="mname">Middle Name</Label>
                                    <Input
                                        id="mname"
                                        value={data.mname}
                                        onChange={e => setData('mname', e.target.value)}
                                        placeholder="Middle name (optional)"
                                        className="w-full"
                                    />
                                    <InputError message={errors.mname} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="lname">Last Name</Label>
                                    <Input
                                        id="lname"
                                        value={data.lname}
                                        onChange={e => setData('lname', e.target.value)}
                                        placeholder="Last name"
                                        className="w-full"
                                    />
                                    <InputError message={errors.lname} />
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
                                    <SingleSelect
                                        items={roles.map(r => ({ id: r.id, name: formatRoleName(r.name) }))}
                                        selectedId={data.role_id ? Number(data.role_id) : null}
                                        onChange={id => setData('role_id', id)}
                                        placeholder="Select a role"
                                        label="Role"
                                        error={errors.role_id}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} className="w-full sm:w-auto cursor-pointer">
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Create User
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}