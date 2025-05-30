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
import { useForm, usePage } from '@inertiajs/react';
import { Check, ChevronsUpDown, Trash2, Calendar, Users, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { DeleteConfirmation } from '@/components/ui/delete-confirmation';
import { MultiSelect } from "@/components/ui/multi-select"
import { useRolePrefix } from '@/hooks/use-role-prefix';

interface PageProps {
    task: Task;
    all_users: User[];
    from_meeting?: number;
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
    const { getRoute } = useRolePrefix();
    const [isEditing, setIsEditing] = useState(false);
    const { data, setData, put, processing, errors } = useForm({
        name: task.name,
        description: task.description,
        status: task.status,
        priority: task.priority,
        due_date: task.due_date,
        users: task.users.map(user => user.id)
    });
    const { props } = usePage();
    const fromMeetingId = props.from_meeting;
    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Meetings',
            href: '/meetings',
        },
        ...(fromMeetingId ? [
            {
                title: 'Meeting Details',
                href: `/meetings/${fromMeetingId}`,
            }
        ] : [
            {
                title: 'Tasks',
                href: '/tasks',
            }
        ]),
        {
            title: task.name,
            href: '#',
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(getRoute(`/tasks/${task.id}`), {
            onSuccess: () => {
                setIsEditing(false);
            },
            preserveScroll: true
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setData({
            name: task.name,
            description: task.description,
            status: task.status,
            priority: task.priority,
            due_date: task.due_date,
            users: task.users.map(user => user.id)
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Task: ${task.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight">{task.name}</h1>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {task.due_date ? format(new Date(task.due_date), 'MMMM d, yyyy') : 'No due date'}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {isEditing ? (
                            <>
                                <Button variant="outline" onClick={handleCancel} className="cursor-pointer">
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={handleSubmit} 
                                    disabled={processing} 
                                    className="cursor-pointer"
                                >
                                    {processing ? 'Saving...' : 'Save Changes'}
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

                <div className="grid grid-cols-3 gap-6">
                    <Card className="col-span-3 shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-medium">Task Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-8">
                                        <div className="space-y-2 w-full">
                                            <Label htmlFor="name" className="text-sm font-medium">Task Name</Label>
                                            {isEditing ? (
                                                <Input
                                                    id="name"
                                                    value={data.name}
                                                    onChange={e => setData('name', e.target.value)}
                                                    error={errors.name}
                                                    className="h-10 text-sm bg-muted/30 p-4 rounded-md min-h-[40px] flex items-center text-foreground border w-full"
                                                />
                                            ) : (
                                                <div className="h-10 text-sm bg-muted/30 p-4 rounded-md min-h-[40px] flex items-center text-foreground border w-full">
                                                    {task.name}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2 w-full">
                                            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                                            {isEditing ? (
                                                <Textarea
                                                    id="description"
                                                    value={data.description}
                                                    onChange={e => setData('description', e.target.value)}
                                                    error={errors.description}
                                                    className="min-h-[120px] text-sm bg-muted/30 p-4 rounded-md border w-full"
                                                />
                                            ) : (
                                                <div className="min-h-[120px] text-sm bg-muted/30 p-4 rounded-md border w-full whitespace-pre-wrap">
                                                    {task.description || 'No description provided'}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2 w-full">
                                            {isEditing ? (
                                                <MultiSelect
                                                    items={all_users}
                                                    selectedIds={data.users}
                                                    onSelectionChange={(ids) => setData('users', ids)}
                                                    placeholder="Select users..."
                                                    label="Assigned Users"
                                                    error={errors.users}
                                                />
                                            ) : (
                                                <div className="space-y-4">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {task.users.length > 0 ? (
                                                            task.users.map((user) => (
                                                                <Badge 
                                                                    key={user.id} 
                                                                    variant="secondary" 
                                                                    className="text-sm bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors"
                                                                    onClick={() => router.visit(`/users/${user.id}?from_task=${task.id}`)}
                                                                >
                                                                    {user.name}
                                                                </Badge>
                                                            ))
                                                        ) : (
                                                            <span className="text-muted-foreground text-sm">No users assigned</span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-2 w-full">
                                            <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                                            {isEditing ? (
                                                <Select
                                                    value={data.status}
                                                    onValueChange={(value) => {
                                                        setData('status', value as TaskStatus);
                                                    }}
                                                >
                                                    <SelectTrigger className="h-10 text-sm bg-muted/30">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                                        <SelectItem value="completed">Completed</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <div className="h-10 text-sm bg-muted/30 p-4 rounded-md min-h-[40px] flex items-center border w-full">
                                                    {task.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2 w-full">
                                            <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
                                            {isEditing ? (
                                                <Select
                                                    value={data.priority}
                                                    onValueChange={(value) => {
                                                        setData('priority', value as TaskPriority);
                                                    }}
                                                >
                                                    <SelectTrigger className="h-10 text-sm bg-muted/30">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="low">Low</SelectItem>
                                                        <SelectItem value="medium">Medium</SelectItem>
                                                        <SelectItem value="high">High</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <div className="h-10 text-sm bg-muted/30 p-4 rounded-md min-h-[40px] flex items-center border w-full">
                                                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2 w-full">
                                            <Label htmlFor="due_date" className="text-sm font-medium">Due Date</Label>
                                            {isEditing ? (
                                                <div className="relative">
                                                    <Input
                                                        type="date"
                                                        id="due_date"
                                                        value={data.due_date ? new Date(data.due_date).toISOString().split('T')[0] : ''}
                                                        onChange={e => setData('due_date', e.target.value)}
                                                        error={errors.due_date}
                                                        className="h-10 text-sm bg-muted/30 p-4 rounded-md min-h-[40px] flex items-center text-muted-foreground border w-full pl-10"
                                                    />
                                                    <Calendar className="h-4 w-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                                                </div>
                                            ) : (
                                                <div className="h-10 text-sm bg-muted/30 p-4 rounded-md min-h-[40px] flex items-center text-muted-foreground border w-full">
                                                    <Calendar className="h-4 w-4 mr-2" />
                                                    {task.due_date ? format(new Date(task.due_date), 'MMMM d, yyyy') : 'No due date'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-6">
                    {fromMeetingId ? (
                        <Button variant="outline" onClick={() => router.visit(getRoute(`/meetings/${fromMeetingId}`))} className="cursor-pointer">
                            ← Back to Meeting
                        </Button>
                    ) : (
                        <Button variant="outline" onClick={() => router.visit(getRoute('/tasks'))} className="cursor-pointer">
                            ← Back to Tasks List
                        </Button>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
