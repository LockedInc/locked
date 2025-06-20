import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowUpDown, Filter, Calendar, User, Bell } from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useState, useEffect } from 'react';
import { format, addDays, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';
import { type Task, type User as TaskUser, type TaskStatus } from '@/types/task';
import { CreateTaskDialog } from '@/components/tasks/create-task-dialog';
import { SendAlertDialog } from '@/components/tasks/send-alert-dialog';
import { AdminTaskStats } from '@/components/tasks/admin-task-stats';
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
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/tasks',
    },
];

interface AdminTaskListProps extends PageProps {
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
                            {user.fname} {user.lname}
                        </Badge>
                    ))}
                </div>
            )
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const task = row.original;
            return (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 group relative"
                        onClick={(e) => {
                            e.stopPropagation();
                            // This will be handled by the parent component
                            window.dispatchEvent(new CustomEvent('openAlertDialog', { detail: task }));
                        }}
                        title="Send Alert"
                    >
                        <Bell className="h-4 w-4 text-blue-600 transition-all duration-200 group-hover:text-blue-700 group-hover:scale-110 group-hover:animate-pulse" />
                        {/* Hover tooltip effect */}
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                            Send Alert
                        </div>
                    </Button>
                </div>
            )
        },
    },
];

export default function AdminTaskList({ tasks, users }: AdminTaskListProps) {
    const { auth } = usePage().props as unknown as PageProps;
    const isAdmin = auth.user.role?.name === 'Client-Admin';
    const { getRoute } = useRolePrefix();
    const prefix = isAdmin ? '/admin' : '/member';
    const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [filteredTasks, setFilteredTasks] = useState(tasks);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(null);

    // Listen for alert dialog open events
    useEffect(() => {
        const handleOpenAlertDialog = (event: CustomEvent) => {
            setSelectedTask(event.detail);
            setIsAlertDialogOpen(true);
        };

        window.addEventListener('openAlertDialog', handleOpenAlertDialog as EventListener);
        return () => {
            window.removeEventListener('openAlertDialog', handleOpenAlertDialog as EventListener);
        };
    }, []);

    const clearFilters = () => {
        setSelectedUser(null);
        setSelectedDateFilter(null);
        setFilteredTasks(tasks);
    };

    const applyFilters = (dateFilter?: string, userFilter?: string) => {
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

        // Apply user filter
        if (userFilter) {
            filtered = filtered.filter(task => 
                task.users.some(user => String(user.id) === userFilter)
            );
        }

        setFilteredTasks(filtered);
    };

    const handleDateFilter = (filterType: string) => {
        setSelectedDateFilter(filterType === 'all' ? null : filterType);
        applyFilters(filterType === 'all' ? undefined : filterType, selectedUser || undefined);
    };

    const handleUserFilter = (userId: string) => {
        setSelectedUser(userId === 'all' ? null : userId);
        applyFilters(selectedDateFilter || undefined, userId === 'all' ? undefined : userId);
    };

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

                <Card>
                    <CardContent className="pt-6">
                        <DataTable
                            columns={columns}
                            data={filteredTasks}
                            searchPlaceholder="Search tasks..."
                            searchColumn="name"
                            onRowClick={(task: Task) => router.visit(getRoute(`/tasks/${task.id}`))}
                            addButton={
                                <div className="flex items-center gap-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="sm" className="h-8 gap-1">
                                                <Filter className="h-4 w-4" />
                                                Filter
                                                {(selectedUser || selectedDateFilter) && (
                                                    <Badge variant="secondary" className="ml-1">
                                                        {[selectedUser, selectedDateFilter].filter(Boolean).length}
                                                    </Badge>
                                                )}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-[200px]">
                                            {(selectedUser || selectedDateFilter) && (
                                                <>
                                                    <DropdownMenuItem onClick={clearFilters}>
                                                        Clear All Filters
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                </>
                                            )}
                                            <DropdownMenuGroup>
                                                <DropdownMenuLabel>Filter by Due Date</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem 
                                                    onClick={() => handleDateFilter('all')}
                                                    className={selectedDateFilter === null ? 'bg-muted' : ''}
                                                >
                                                    All Tasks
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    onClick={() => handleDateFilter('due-today')}
                                                    className={selectedDateFilter === 'due-today' ? 'bg-muted' : ''}
                                                >
                                                    Due Today
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    onClick={() => handleDateFilter('due-tomorrow')}
                                                    className={selectedDateFilter === 'due-tomorrow' ? 'bg-muted' : ''}
                                                >
                                                    Due Tomorrow
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    onClick={() => handleDateFilter('due-this-week')}
                                                    className={selectedDateFilter === 'due-this-week' ? 'bg-muted' : ''}
                                                >
                                                    Due This Week
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    onClick={() => handleDateFilter('due-this-month')}
                                                    className={selectedDateFilter === 'due-this-month' ? 'bg-muted' : ''}
                                                >
                                                    Due This Month
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    onClick={() => handleDateFilter('overdue')}
                                                    className={selectedDateFilter === 'overdue' ? 'bg-muted' : ''}
                                                >
                                                    Overdue
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    onClick={() => handleDateFilter('no-due-date')}
                                                    className={selectedDateFilter === 'no-due-date' ? 'bg-muted' : ''}
                                                >
                                                    No Due Date
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                <DropdownMenuLabel>Filter by Assignee</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <div className="px-2 py-1">
                                                    <Select
                                                        value={selectedUser || 'all'}
                                                        onValueChange={handleUserFilter}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select user..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">All Users</SelectItem>
                                                            {users.map((user) => (
                                                                <SelectItem key={user.id} value={String(user.id)}>
                                                                    {user.fname} {user.lname}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <Button onClick={() => setIsTaskDialogOpen(true)} className="cursor-pointer">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Task
                                    </Button>
                                </div>
                            }
                        />
                    </CardContent>
                </Card>

                <CreateTaskDialog
                    users={users}
                    open={isTaskDialogOpen}
                    onOpenChange={setIsTaskDialogOpen}
                />

                <SendAlertDialog
                    open={isAlertDialogOpen}
                    onOpenChange={setIsAlertDialogOpen}
                    task={selectedTask}
                />
            </div>
        </AppLayout>
    );
}