import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowUpDown, Mail, Shield } from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { PageProps } from '@/types';
import CreateUserDialog from '@/components/users/create-user-dialog';
import { UserSummary } from '@/components/users/user-summary';
import { useState } from 'react';
import { useRolePrefix } from '@/hooks/use-role-prefix';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    role: {
        id: number;
        name: string;
    };
}

const columns: ColumnDef<User>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div>
                    <div className="font-medium">{user.fname} {user.lname}</div>
                </div>
            )
        },
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const email = row.getValue("email") as string;
            return (
                <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{email}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "role.name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Role
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const roleName = row.original.role.name;
            const displayName = roleName === "Client-Admin" ? "Admin" : roleName;
            const roleColors = {
                'Admin': 'bg-purple-100 text-purple-800',
                'User': 'bg-blue-100 text-blue-800',
                'default': 'bg-gray-100 text-gray-800'
            };
            return (
                <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <Badge className={roleColors[displayName as keyof typeof roleColors] || roleColors.default}>
                        {displayName}
                    </Badge>
                </div>
            )
        }
    },
];

export default function Users({ users }: PageProps<{ users: User[] }>) {
    const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
    const { getRoute } = useRolePrefix();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between mt-2 mb-2">
                    <h1 className="text-2xl font-semibold">Manage Your Users</h1>
                    <div className="flex items-center">
                        <UserSummary users={users} />
                    </div>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <DataTable
                            columns={columns}
                            data={users}
                            searchPlaceholder="Search users..."
                            searchColumn="name"
                            onRowClick={(user) => router.visit(getRoute(`/users/${user.id}`))}
                            addButton={
                                <Button onClick={() => setIsUserDialogOpen(true)} className="cursor-pointer">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add User
                                </Button>
                            }
                        />
                    </CardContent>
                </Card>

                <CreateUserDialog
                    open={isUserDialogOpen}
                    onOpenChange={setIsUserDialogOpen}
                />
            </div>
        </AppLayout>
    );
} 