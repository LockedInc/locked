import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, ArrowUpDown } from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { ColumnDef } from '@tanstack/react-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/tasks',
    },
];

type TaskStatus = 'pending' | 'in-progress' | 'completed';
type TaskPriority = 'low' | 'medium' | 'high';

interface Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
    assignedTo: string;
}

// Mock data for tasks
const tasks: Task[] = [
    {
        id: 1,
        title: 'Complete project proposal',
        description: 'Write and submit the project proposal for the new client',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2024-05-15',
        assignedTo: 'John Doe',
    },
    {
        id: 2,
        title: 'Review team performance',
        description: 'Analyze and document team performance metrics for Q2',
        status: 'pending',
        priority: 'medium',
        dueDate: '2024-05-20',
        assignedTo: 'Jane Smith',
    },
    {
        id: 3,
        title: 'Schedule team meeting',
        description: 'Set up a meeting to discuss project milestones',
        status: 'completed',
        priority: 'low',
        dueDate: '2024-05-10',
        assignedTo: 'Mike Johnson',
    },
];

const statusColors: Record<TaskStatus, string> = {
    'pending': 'bg-yellow-500',
    'in-progress': 'bg-blue-500',
    'completed': 'bg-green-500',
};

const priorityColors: Record<TaskPriority, string> = {
    'low': 'bg-gray-500',
    'medium': 'bg-orange-500',
    'high': 'bg-red-500',
};

const columns: ColumnDef<Task>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const task = row.original
            return (
                <div>
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm text-muted-foreground">{task.description}</div>
                </div>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as TaskStatus
            return (
                <Badge variant="outline" className={statusColors[status]}>
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => {
            const priority = row.getValue("priority") as TaskPriority
            return (
                <Badge variant="outline" className={priorityColors[priority]}>
                    {priority}
                </Badge>
            )
        },
    },
    {
        accessorKey: "dueDate",
        header: "Due Date",
    },
    {
        accessorKey: "assignedTo",
        header: "Assigned To",
    },
];

export default function Tasks() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-end">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Task
                    </Button>
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Task List</CardTitle>
                                <CardDescription>Manage your tasks and track progress</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <DataTable
                                    columns={columns}
                                    data={tasks}
                                    searchPlaceholder="Search tasks..."
                                    searchColumn="title"
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}