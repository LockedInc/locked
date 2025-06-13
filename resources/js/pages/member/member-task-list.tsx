import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowUpDown, Filter, Calendar } from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useState, useEffect } from 'react';
import { format, addDays, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';
import { type Task, type TaskStatus, type User as TaskUser } from '@/types/task';
import { MemberTaskStats } from '@/components/tasks/member-task-stats';
import { CreateTaskDialog } from '@/components/tasks/create-task-dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRolePrefix } from '@/hooks/use-role-prefix';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/member/tasks',
    },
];

interface MemberTaskListProps extends PageProps {
    tasks: Task[];
    users: TaskUser[];
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
                <div className="flex flex-col">
                    <span className="font-medium">{task.name}</span>
                    {task.description && (
                        <span className="text-sm text-muted-foreground line-clamp-1">
                            {task.description}
                        </span>
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: "priority",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Priority
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const priority = row.getValue("priority") as string
            const priorityColors = {
                'low': 'bg-gray-50 text-gray-700 border border-gray-200',
                'medium': 'bg-orange-50 text-orange-700 border border-orange-200',
                'high': 'bg-red-50 text-red-700 border border-red-200'
            }
            return (
                <Badge className={priorityColors[priority as keyof typeof priorityColors]}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Badge>
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
            const task = row.original;
            const statusColors = {
                pending: 'bg-yellow-100 text-yellow-800',
                in_progress: 'bg-blue-100 text-blue-800',
                completed: 'bg-green-100 text-green-800',
            };

            const handleStatusChange = (newStatus: 'pending' | 'in_progress' | 'completed') => {
                router.put(`/member/tasks/${task.id}`, {
                    status: newStatus
                }, {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        // Refresh the page data after status update
                        router.reload({ only: ['tasks'] });
                    }
                });
            };

            return (
                <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="ghost" 
                                className={`h-6 px-2 py-1 ${statusColors[task.status]} hover:opacity-80`}
                            >
                                {task.status.split('_').map(word => 
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                ).join(' ')}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem 
                                    onClick={() => handleStatusChange('pending')}
                                    className="cursor-pointer"
                                >
                                    Pending
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    onClick={() => handleStatusChange('in_progress')}
                                    className="cursor-pointer"
                                >
                                    In Progress
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    onClick={() => handleStatusChange('completed')}
                                    className="cursor-pointer"
                                >
                                    Completed
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
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

export default function MemberTaskList({ tasks, users }: MemberTaskListProps) {
    const { getRoute } = useRolePrefix();
    const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
    const [filteredTasks, setFilteredTasks] = useState(tasks);
    const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(null);
    const [taskView, setTaskView] = useState<'assigned' | 'all'>('assigned');
    const { auth } = usePage().props as unknown as PageProps;

    // Update filtered tasks when tasks prop changes
    useEffect(() => {
        setFilteredTasks(tasks);
    }, [tasks]);

    const clearFilters = () => {
        setSelectedDateFilter(null);
        setFilteredTasks(tasks);
    };

    const applyFilters = (dateFilter?: string) => {
        let filtered = tasks;

        // Apply date filter
        if (dateFilter) {
            const now = new Date();
            const today = startOfDay(now);
            const tomorrow = endOfDay(addDays(today, 1));
            const nextWeek = endOfDay(addDays(today, 7));
            const nextMonth = endOfDay(addDays(today, 30));

            switch (dateFilter) {
                case 'due-today':
                    filtered = filtered.filter(task => {
                        if (!task.due_date) return false;
                        const dueDate = new Date(task.due_date);
                        return isAfter(dueDate, today) && isBefore(dueDate, tomorrow);
                    });
                    break;
                case 'due-tomorrow':
                    filtered = filtered.filter(task => {
                        if (!task.due_date) return false;
                        const dueDate = new Date(task.due_date);
                        return isAfter(dueDate, tomorrow) && isBefore(dueDate, addDays(tomorrow, 1));
                    });
                    break;
                case 'due-this-week':
                    filtered = filtered.filter(task => {
                        if (!task.due_date) return false;
                        const dueDate = new Date(task.due_date);
                        return isAfter(dueDate, today) && isBefore(dueDate, nextWeek);
                    });
                    break;
                case 'due-this-month':
                    filtered = filtered.filter(task => {
                        if (!task.due_date) return false;
                        const dueDate = new Date(task.due_date);
                        return isAfter(dueDate, today) && isBefore(dueDate, nextMonth);
                    });
                    break;
                case 'overdue':
                    filtered = filtered.filter(task => {
                        if (!task.due_date) return false;
                        const dueDate = new Date(task.due_date);
                        return isBefore(dueDate, today);
                    });
                    break;
                case 'no-due-date':
                    filtered = filtered.filter(task => !task.due_date);
                    break;
            }
        }

        setFilteredTasks(filtered);
    };

    const handleDateFilter = (filterType: string) => {
        setSelectedDateFilter(filterType === 'all' ? null : filterType);
        applyFilters(filterType === 'all' ? undefined : filterType);
    };

    const handleTaskViewChange = (view: 'assigned' | 'all') => {
        setTaskView(view);
        router.get(getRoute('/tasks'), { view }, {
            preserveState: true,
            preserveScroll: true,
            only: ['tasks']
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Tasks" />
            <div className="flex h-[calc(100vh-4rem)] flex-1 flex-col p-4">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-semibold">My Tasks</h1>
                    <div className="flex items-center gap-5">
                        <MemberTaskStats tasks={tasks} />
                    </div>
                </div>

                <Card className="flex-1 overflow-hidden">
                    <CardContent className="h-full p-0">
                        <div className="h-full flex flex-col">
                            <div className="p-6 pb-0">
                                <DataTable
                                    columns={columns}
                                    data={filteredTasks}
                                    searchPlaceholder="Search tasks..."
                                    searchColumn="name"
                                    onRowClick={(task: Task) => router.visit(getRoute(`/tasks/${task.id}`), {
                                        preserveState: true,
                                        preserveScroll: true,
                                        onSuccess: () => {
                                            // Refresh the page data after task update
                                            router.reload({ only: ['tasks'] });
                                        }
                                    })}
                                    addButton={
                                        <div className="flex items-center gap-2">
                                            <Select
                                                value={taskView}
                                                onValueChange={(value) => handleTaskViewChange(value as 'assigned' | 'all')}
                                            >
                                                <SelectTrigger className="w-[180px] h-8 cursor-pointer">
                                                    <SelectValue placeholder="View tasks" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem className="cursor-pointer" value="assigned">My Assigned Tasks</SelectItem>
                                                    <SelectItem className="cursor-pointer" value="all">All Client Tasks</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 gap-1 cursor-pointer"
                                                onClick={() => setIsTaskDialogOpen(true)}
                                            >
                                                <Plus className="h-4 w-4" />
                                                Add Task
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" size="sm" className="h-8 gap-1 cursor-pointer">
                                                        <Filter className="h-4 w-4" />
                                                        Filter
                                                        {selectedDateFilter && (
                                                            <Badge variant="secondary" className="ml-1">
                                                                1
                                                            </Badge>
                                                        )}
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-[200px]">
                                                    <DropdownMenuLabel>Filter by Date</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuGroup>
                                                        <DropdownMenuItem onClick={() => handleDateFilter('all')}>
                                                            All Dates
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDateFilter('due-today')}>
                                                            Due Today
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDateFilter('due-tomorrow')}>
                                                            Due Tomorrow
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDateFilter('due-this-week')}>
                                                            Due This Week
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDateFilter('due-this-month')}>
                                                            Due This Month
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDateFilter('overdue')}>
                                                            Overdue
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDateFilter('no-due-date')}>
                                                            No Due Date
                                                        </DropdownMenuItem>
                                                    </DropdownMenuGroup>
                                                    {selectedDateFilter && (
                                                        <>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={clearFilters}>
                                                                Clear Filters
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    }
                                />
                            </div>
                        </div>
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
