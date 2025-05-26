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
import { Meeting } from '@/types/meeting';
import { User, Task } from '@/types/task';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { format, parse } from 'date-fns';
import { useForm } from '@inertiajs/react';
import { Check, ChevronsUpDown, Trash2, Calendar, Users, ListTodo, Plus } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { DeleteConfirmation } from '@/components/ui/delete-confirmation';
import { CreateTaskDialog } from '@/components/tasks/create-task-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Meetings',
        href: '/meetings',
    },
    {
        title: 'Meeting Details',
        href: '#',
    },
];

interface PageProps {
    meeting: Meeting;
    users: User[];
    tasks: Task[];
}

type MeetingType = 'internal' | 'client' | 'external';

const typeColors: Record<MeetingType, string> = {
    'internal': 'bg-blue-50/50 text-blue-600 border border-blue-100',
    'client': 'bg-purple-50/50 text-purple-600 border border-purple-100',
    'external': 'bg-green-50/50 text-green-600 border border-green-100'
};

export default function MeetingDetails({ meeting, users, tasks }: PageProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
    const { data, setData, put, processing, errors } = useForm({
        title: meeting.title,
        date: meeting.date ? format(new Date(meeting.date), "yyyy-MM-dd'T'HH:mm") : '',
        type: meeting.type,
        agenda_text: meeting.agenda_text,
        users: meeting.users.map(user => user.id),
        tasks: meeting.tasks.map(task => task.id)
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Meetings',
            href: '/meetings',
        },
        {
            title: meeting.title,
            href: `/meetings/${meeting.id}`,
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/meetings/${meeting.id}`, {
            onSuccess: () => {
                setIsEditing(false);
            }
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this meeting?")) {
            router.delete(`/meetings/${meeting.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Meeting: ${meeting.title}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight">{meeting.title}</h1>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {meeting.date ? format(new Date(meeting.date), 'EEEE, MMMM d, yyyy • h:mm a') : 'No date set'}
                        </div>
                    </div>
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
                                    Edit Meeting
                                </Button>
                                
                                <DeleteConfirmation
                                    onConfirm={() => router.delete(`/meetings/${meeting.id}`)}
                                    itemType="meeting"
                                    itemName={meeting.title}
                                >
                                    <Button variant="destructive" className="cursor-pointer">
                                        Delete Meeting
                                    </Button>
                                </DeleteConfirmation>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <Card className="col-span-3 shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-medium">Meeting Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-3 gap-8">
                                    <div className="col-span-2 space-y-2 w-full">
                                        <Label htmlFor="agenda_text" className="text-sm font-medium">Agenda</Label>
                                        {isEditing ? (
                                            <Textarea
                                                id="agenda_text"
                                                value={data.agenda_text}
                                                onChange={e => setData('agenda_text', e.target.value)}
                                                error={errors.agenda_text}
                                                className="min-h-[calc(100vh-400px)] text-sm bg-muted/30 p-4 rounded-md border w-full"
                                            />
                                        ) : (
                                            <div className="min-h-[calc(100vh-400px)] text-sm bg-muted/30 p-4 rounded-md border w-full whitespace-pre-wrap">
                                                {meeting.agenda_text || 'No agenda set'}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-2 w-full">
                                            <Label htmlFor="title" className="text-sm font-medium">Meeting Title</Label>
                                            {isEditing ? (
                                                <Input
                                                    id="title"
                                                    value={data.title}
                                                    onChange={e => setData('title', e.target.value)}
                                                    error={errors.title}
                                                    className="h-10 text-sm bg-muted/30 p-4 rounded-md min-h-[40px] flex items-center text-foreground border w-full"
                                                />
                                            ) : (
                                                <div className="h-10 text-sm bg-muted/30 p-4 rounded-md min-h-[40px] flex items-center text-foreground border w-full">{meeting.title}</div>
                                            )}
                                        </div>

                                        <div className="space-y-2 w-full">
                                            <Label htmlFor="type" className="text-sm font-medium">Meeting Type</Label>
                                            {isEditing ? (
                                                <Input
                                                    id="type"
                                                    value={data.type}
                                                    onChange={e => setData('type', e.target.value)}
                                                    error={errors.type}
                                                    className="h-10 text-sm bg-muted/30 p-4 rounded-md min-h-[40px] flex items-center border w-full"
                                                    placeholder="Type (e.g. Internal, Client, etc.)"
                                                />
                                            ) : (
                                                <div className="h-10 text-sm bg-muted/30 p-4 rounded-md min-h-[40px] flex items-center border w-full">
                                                    <Badge className={cn(typeColors[meeting.type as MeetingType], "text-xs font-medium px-2 py-0.5 mr-2")}>{meeting.type}</Badge>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2 w-full">
                                            <Label htmlFor="date" className="text-sm font-medium">Date & Time</Label>
                                            {isEditing ? (
                                                <div className="relative">
                                                    <Input
                                                        type="datetime-local"
                                                        id="date"
                                                        value={data.date}
                                                        onChange={e => {
                                                            const date = new Date(e.target.value);
                                                            // Set seconds to 0
                                                            date.setSeconds(0);
                                                            setData('date', format(date, "yyyy-MM-dd'T'HH:mm"));
                                                        }}
                                                        error={errors.date}
                                                        className="h-10 text-sm bg-muted/30 p-4 rounded-md min-h-[40px] flex items-center text-muted-foreground border w-full pl-10"
                                                        step="60"
                                                        onFocus={(e) => {
                                                            // Remove seconds from the input when focused
                                                            const date = new Date(e.target.value);
                                                            date.setSeconds(0);
                                                            e.target.value = format(date, "yyyy-MM-dd'T'HH:mm");
                                                        }}
                                                    />
                                                    <Calendar className="h-4 w-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                                                </div>
                                            ) : (
                                                <div className="h-10 text-sm bg-muted/30 p-4 rounded-md min-h-[40px] flex items-center text-muted-foreground border w-full">
                                                    <Calendar className="h-4 w-4 mr-2" />
                                                    {meeting.date ? format(new Date(meeting.date), 'EEEE, MMMM d, yyyy • h:mm a') : 'No date set'}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2 w-full">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Label className="text-sm font-medium">Attendees</Label>
                                                    <span className="text-sm text-muted-foreground">
                                                        ({meeting.users.length})
                                                    </span>
                                                </div>
                                            </div>
                                            {isEditing ? (
                                                <>
                                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                                        {users
                                                            .filter(user => data.users.includes(user.id))
                                                            .map((user) => (
                                                                <Badge 
                                                                    key={user.id} 
                                                                    variant="secondary" 
                                                                    className="text-sm bg-muted/50"
                                                                >
                                                                    {user.name}
                                                                </Badge>
                                                            ))
                                                        }
                                                    </div>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className="w-full justify-between h-10"
                                                            >
                                                                Select users...
                                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-full p-0" align="start">
                                                            <Command className="max-h-[200px]">
                                                                <CommandInput placeholder="Search users..." />
                                                                <CommandEmpty>No users found.</CommandEmpty>
                                                                <CommandGroup className="overflow-y-auto">
                                                                    {users.map((user) => (
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
                                                </>
                                            ) : (
                                                <div className="space-y-4">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {meeting.users.length > 0 ? (
                                                            meeting.users.map((user) => (
                                                                <Badge 
                                                                    key={user.id} 
                                                                    variant="secondary" 
                                                                    className="text-sm bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors"
                                                                    onClick={() => router.visit(`/users/${user.id}?from_meeting=${meeting.id}`)}
                                                                >
                                                                    {user.name}
                                                                </Badge>
                                                            ))
                                                        ) : (
                                                            <span className="text-muted-foreground text-sm">No attendees</span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2 w-full">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2">
                                                    <Label className="text-sm font-medium">Tasks</Label>
                                                    <span className="text-sm text-muted-foreground">
                                                        ({meeting.tasks.length})
                                                    </span>
                                                </div>
                                                {!isEditing && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setIsCreateTaskOpen(true)}
                                                        className="cursor-pointer"
                                                    >
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Add Task
                                                    </Button>
                                                )}
                                            </div>
                                            {isEditing ? (
                                                <>
                                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                                        {tasks
                                                            .filter(task => data.tasks.includes(task.id))
                                                            .map((task) => (
                                                                <Badge 
                                                                    key={task.id} 
                                                                    variant="secondary" 
                                                                    className="text-sm bg-muted/50"
                                                                >
                                                                    {task.name}
                                                                </Badge>
                                                            ))
                                                        }
                                                    </div>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className="w-full justify-between h-10"
                                                            >
                                                                Select tasks...
                                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-full p-0" align="start">
                                                            <Command className="max-h-[200px]">
                                                                <CommandInput placeholder="Search tasks..." />
                                                                <CommandEmpty>No tasks found.</CommandEmpty>
                                                                <CommandGroup className="overflow-y-auto">
                                                                    {tasks.map((task) => (
                                                                        <CommandItem
                                                                            key={task.id}
                                                                            onSelect={() => {
                                                                                const newTasks = data.tasks.includes(task.id)
                                                                                    ? data.tasks.filter(id => id !== task.id)
                                                                                    : [...data.tasks, task.id];
                                                                                setData('tasks', newTasks);
                                                                            }}
                                                                            className="flex items-center gap-2 px-2 py-1.5"
                                                                        >
                                                                            <Check
                                                                                className={cn(
                                                                                    "h-4 w-4",
                                                                                    data.tasks.includes(task.id) ? "opacity-100" : "opacity-0"
                                                                                )}
                                                                            />
                                                                            <span>{task.name}</span>
                                                                        </CommandItem>
                                                                    ))}
                                                                </CommandGroup>
                                                            </Command>
                                                        </PopoverContent>
                                                    </Popover>
                                                </>
                                            ) : (
                                                <div className="space-y-4">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {meeting.tasks.length > 0 ? (
                                                            meeting.tasks.map((task) => (
                                                                <Badge key={task.id} 
                                                                    variant="secondary" 
                                                                    className="text-sm bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors" 
                                                                    onClick={() => router.visit(`/tasks/${task.id}?from_meeting=${meeting.id}`)}
                                                                >
                                                                    {task.name}
                                                                </Badge>
                                                            ))
                                                        ) : (
                                                            <span className="text-muted-foreground text-sm">No tasks</span>
                                                        )}
                                                    </div>
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
                    <Button variant="outline" onClick={() => router.visit('/meetings')} className="cursor-pointer">
                        ← Back to Meetings List
                    </Button>
                </div>
            </div>
            <CreateTaskDialog 
                open={isCreateTaskOpen}
                onOpenChange={setIsCreateTaskOpen}
                users={users}
                meetingId={meeting.id}
            />
        </AppLayout>
    );
}

