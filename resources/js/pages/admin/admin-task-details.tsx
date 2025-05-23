import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task, TaskStatus, TaskPriority, User } from '@/types/task';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { format } from 'date-fns';
import { useForm } from '@inertiajs/react';
import { Check, ChevronsUpDown, Trash2, Calendar, Users, AlertCircle } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { DeleteConfirmation } from '@/components/ui/delete-confirmation';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/tasks',
    },
    {
        title: 'Task Details',
        href: '#',
    },
];

interface PageProps {
    task: Task;
    all_users: User[];
}

const statusColors = {
    'pending': 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    'in_progress': 'bg-blue-50 text-blue-700 border border-blue-200',
    'completed': 'bg-green-50 text-green-700 border border-green-200'
};

const priorityColors = {
    'low': 'bg-gray-50 text-gray-700 border border-gray-200',
    'medium': 'bg-orange-50 text-orange-700 border border-orange-200',
    'high': 'bg-red-50 text-red-700 border border-red-200'
};

export default function TaskDetails({ task, all_users }: PageProps) {
    const [isEditing, setIsEditing] = useState(false);
    const { data, setData, put, processing, errors } = useForm({
        name: task.name,
        description: task.description,
        status: task.status,
        priority: task.priority,
        due_date: task.due_date,
        users: task.users.map(user => user.id)
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/tasks/${task.id}`, {
            onSuccess: () => {
                setIsEditing(false);
            }
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
    };



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Task: ${task.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Task Details</h1>
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
                                    Edit Task
                                </Button>
                                <DeleteConfirmation
                                    onConfirm={() => router.delete(`/tasks/${task.id}`)}
                                    itemType="task"
                                    itemName={task.name}
                                >
                                    <Button variant="destructive" className="cursor-pointer">
                                        Delete Task
                                    </Button>
                                </DeleteConfirmation>
                            </>
                        )}
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Task Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Task Name</Label>
                                {isEditing ? (
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        error={errors.name}
                                        className="h-10"
                                    />
                                ) : (
                                    <div className="text-lg font-medium mt-2 h-10 flex items-center">{task.name}</div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                {isEditing ? (
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        error={errors.description}
                                        className="min-h-[100px]"
                                    />
                                ) : (
                                    <div className="text-muted-foreground bg-muted/50 p-3 rounded-md mt-2 min-h-[100px]">
                                        {task.description}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    {isEditing ? (
                                        <Select
                                            value={data.status}
                                            onValueChange={(value) => {
                                                setData('status', value as TaskStatus);
                                            }}
                                        >
                                            <SelectTrigger className="h-10">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="in_progress">In Progress</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <div className="mt-2 h-10 flex items-center">
                                            <Badge className={cn(statusColors[task.status], "text-sm font-medium px-3 py-1")}>
                                                {task.status.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="priority">Priority</Label>
                                    {isEditing ? (
                                        <Select
                                            value={data.priority}
                                            onValueChange={(value) => {
                                                setData('priority', value as TaskPriority);
                                            }}
                                        >
                                            <SelectTrigger className="h-10">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">Low</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="high">High</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <div className="mt-2 h-10 flex items-center">
                                            <Badge className={cn(priorityColors[task.priority], "text-sm font-medium px-3 py-1")}>
                                                {task.priority}
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Due Date</Label>
                                    {isEditing ? (
                                        <Input
                                            type="date"
                                            value={data.due_date ? new Date(data.due_date).toISOString().split('T')[0] : ''}
                                            onChange={e => setData('due_date', e.target.value)}
                                            error={errors.due_date}
                                            className="h-10"
                                        />
                                    ) : (
                                        <div className="flex items-center text-muted-foreground mt-2 h-10">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            {task.due_date ? format(new Date(task.due_date), 'MMM dd, yyyy') : 'No due date'}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Assigned Users</Label>
                                    {isEditing ? (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className="w-full justify-between h-10"
                                                >
                                                    {data.users.length > 0
                                                        ? `${data.users.length} users selected`
                                                        : "Select users..."}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0" align="start">
                                                <Command className="max-h-[200px]">
                                                    <CommandInput placeholder="Search users..." />
                                                    <CommandEmpty>No users found.</CommandEmpty>
                                                    <CommandGroup className="overflow-y-auto">
                                                        {all_users.map((user) => (
                                                            <CommandItem
                                                                key={user.id}
                                                                onSelect={() => {
                                                                    const newUsers = data.users.includes(user.id)
                                                                        ? data.users.filter(id => id !== user.id)
                                                                        : [...data.users, user.id];
                                                                    setData('users', newUsers);
                                                                }}
                                                                className="flex items-center gap-2 px-2 py-1.5"
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "h-4 w-4",
                                                                        data.users.includes(user.id) ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                <span>{user.name}</span>
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    ) : (
                                        <div className="space-y-2 mt-2 min-h-[40px]">
                                            <div className="flex items-center text-muted-foreground">
                                                <Users className="h-4 w-4 mr-2" />
                                                {task.users.length > 0 
                                                    ? `${task.users.length} ${task.users.length === 1 ? 'User' : 'Users'} Assigned`
                                                    : 'No Users Assigned'}
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {task.users.length > 0 ? (
                                                    task.users.map((user) => (
                                                        <Badge key={user.id} variant="secondary" className="text-sm">
                                                            {user.name}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-muted-foreground text-sm">None</span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
                <div className="mt-6">
                    <Button variant="outline" onClick={() => router.visit('/tasks')} className="cursor-pointer">
                        ← Back to Tasks List
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}