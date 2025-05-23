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
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { format } from 'date-fns';
import { useForm } from '@inertiajs/react';
import { Check, ChevronsUpDown, Trash2 } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"




const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/tasks',
    },
    {
        title: 'Task Details',
        href: '/tasks/details',
    },
];

interface PageProps {
    task: Task;
    all_users: User[];
}

const statusColors = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'in_progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800'
};

const priorityColors = {
    'low': 'bg-gray-100 text-gray-800',
    'medium': 'bg-orange-100 text-orange-800',
    'high': 'bg-red-100 text-red-800'
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

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this task?")) {
            router.delete(`/tasks/${task.id}`);
        }
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
                                <Button variant="outline" onClick={handleCancel}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSubmit} disabled={processing}>
                                    Save Changes
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button onClick={() => setIsEditing(true)}>
                                    Edit Task
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Task
                                </Button>
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
                                    />
                                ) : (
                                    <div className="text-lg font-medium">{task.name}</div>
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
                                    />
                                ) : (
                                    <div className="text-muted-foreground">{task.description}</div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    {isEditing ? (
                                        <Select
                                            value={data.status}
                                            onValueChange={(value) => {
                                                setData('status', value as TaskStatus);
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="in_progress">In Progress</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Badge className={statusColors[task.status]}>
                                            {task.status.replace('_', ' ')}
                                        </Badge>
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
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">Low</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="high">High</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Badge className={priorityColors[task.priority]}>
                                            {task.priority}
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Due Date</Label>
                                {isEditing ? (
                                    <Input
                                        type="date"
                                        value={data.due_date ? new Date(data.due_date).toISOString().split('T')[0] : ''}
                                        onChange={e => setData('due_date', e.target.value)}
                                        error={errors.due_date}
                                    />
                                ) : (
                                    <div>
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
                                                className="w-full justify-between"
                                            >
                                                {data.users.length > 0
                                                    ? `${data.users.length} users selected`
                                                    : "Select users..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput placeholder="Search users..." />
                                                <CommandEmpty>No users found.</CommandEmpty>
                                                <CommandGroup>
                                                    {all_users.map((user) => (
                                                        <CommandItem
                                                            key={user.id}
                                                            onSelect={() => {
                                                                const currentUsers = [...data.users];
                                                                const index = currentUsers.indexOf(user.id);
                                                                if (index === -1) {
                                                                    currentUsers.push(user.id);
                                                                } else {
                                                                    currentUsers.splice(index, 1);
                                                                }
                                                                setData('users', currentUsers);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    data.users.includes(user.id) ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {user.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                ) : (
                                    <div className="flex flex-wrap gap-1">
                                        {task.users.map((user) => (
                                            <Badge key={user.id} variant="secondary">
                                                {user.name}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}