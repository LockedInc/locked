import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowUpDown } from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { format } from 'date-fns';
import { Task, TaskStatus, User } from '@/types/task';
import { CreateTaskDialog } from '@/components/tasks/create-task-dialog';
import { AdminTaskStats } from '@/components/tasks/admin-task-stats';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/tasks',
    },
];

interface PageProps {
    tasks: Task[];
    users: User[];
}

const columns: ColumnDef<Task>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Task
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const task = row.original
            return (
                <div>
                    <div className="font-medium">{task.name}</div>
                    <div className="text-sm text-muted-foreground">{task.description}</div>
                </div>
            )
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const status = row.getValue("status") as TaskStatus
            const statusColors = {
                'pending': 'bg-yellow-100 text-yellow-800',
                'in_progress': 'bg-blue-100 text-blue-800',
                'completed': 'bg-green-100 text-green-800'
            }
            return (
                <Badge className={statusColors[status]}>
                    {status.replace('_', ' ')}
                </Badge>
            )
        },
    },
    {
        accessorKey: "due_date",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Due Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = row.original.due_date
            if (!date) return '-'
            try {
                return format(new Date(date), 'MMM dd, yyyy')
            } catch (error) {
                return '-'
            }
        },
    },
    {
        accessorKey: "users",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Assigned To
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const assignedUsers = row.original.users || []
            return (
                <div className="flex flex-wrap gap-1">
                    {assignedUsers.map((user) => (
                        <Badge key={user.id} variant="secondary">
                            {user.name}
                        </Badge>
                    ))}
                </div>
            )
        },
    },
];

export default function Tasks({ tasks, users }: PageProps) {
    const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
    const { url } = usePage();
    const params = new URLSearchParams(url.split('?')[1]);
    const statusFilter = params.get('status');

    const filteredTasks = statusFilter
        ? tasks.filter((task) => task.status === statusFilter)
        : tasks;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold ml-5">Manage Your Tasks</h1>
                    <div className="flex items-center gap-5">
                        <AdminTaskStats tasks={tasks} />
                    </div>
                </div>

                {statusFilter && (
                    <div className="mb-4 flex items-center gap-2 px-6">
                        <span className="text-sm text-muted-foreground">Showing tasks with status:</span>
                        <Badge variant="outline" className="font-medium">{statusFilter.replace('_', ' ')}</Badge>
                        <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => router.visit('/tasks')} 
                            className="h-7 px-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                            Clear filter
                        </Button>
                    </div>
                )}

                <Card>
                    <CardContent className="pt-6 ">
                        <DataTable
                            columns={columns}
                            data={filteredTasks}
                            searchPlaceholder="Search tasks..."
                            searchColumn="name"
                            onRowClick={(task) => router.visit(`/tasks/${task.id}`)}
                            addButton={
                                <Button onClick={() => setIsTaskDialogOpen(true)} className="cursor-pointer">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Task
                                </Button>
                            }
                        />
                    </CardContent>
                </Card>

                <CreateTaskDialog
                    users={users}
                    open={isTaskDialogOpen}
                    onOpenChange={setIsTaskDialogOpen}
                />
            </div>
        </AppLayout>
    );
}