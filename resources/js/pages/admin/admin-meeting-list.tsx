import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowUpDown } from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { format, isAfter } from 'date-fns';
import { Meeting } from '@/types/meeting';
import { Task, User } from '@/types/task';
import { CreateMeetingDialog } from '@/components/meetings/create-meeting-dialog';
import { MeetingSummary } from '@/components/meetings/meeting-summary';
import { useRolePrefix } from '@/hooks/use-role-prefix';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Meetings',
        href: '/meetings',
    },
];

interface PageProps {
    meetings: Meeting[];
    users: User[];
    tasks: Task[];
}

const columns: ColumnDef<Meeting>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Meeting
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const meeting = row.original;
            const now = new Date();
            const meetingDate = new Date(meeting.date);
            const isUpcoming = isAfter(meetingDate, now);
            return (
                <div>
                    <div className="font-medium">{meeting.title}</div>
                    <div>
                        <span
                            className={
                                isUpcoming
                                    ? "px-1.5 py-0.5 rounded text-[10px] font-semibold bg-green-100 text-green-800"
                                    : "px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-200 text-gray-700"
                            }
                        >
                            {isUpcoming ? "Upcoming" : "Past"}
                        </span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "date",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = row.getValue("date")
            if (!date) return '-'
            try {
                return format(new Date(date as string), 'MMM dd, yyyy - hh:mm a')
            } catch (error) {
                return '-'
            }
        },
    },
    {
        accessorKey: "type",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return (
                <span className="text-sm text-muted-foreground">{row.getValue("type")}</span>
            );
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
                    Attendees
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const attendees = row.original.users || []
            return (
                <div className="flex flex-wrap gap-1">
                    {attendees.map((user) => (
                        <Badge key={user.id} variant="secondary">
                            {user.name}
                        </Badge>
                    ))}
                </div>
            )
        },
    },
    {
        accessorKey: "tasks",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Related Tasks
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const tasks = row.original.tasks || []
            return (
                <div className="flex flex-wrap gap-1">
                    {tasks.map((task) => (
                        <Badge key={task.id} variant="outline">
                            {task.name}
                        </Badge>
                    ))}
                </div>
            )
        },
    },
];

export default function Meetings({ meetings, users, tasks }: PageProps) {
    const [isMeetingDialogOpen, setIsMeetingDialogOpen] = useState(false);
    const { getRoute } = useRolePrefix();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Meetings" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold ml-5">Manage Your Meetings</h1>
                    <div className="flex items-center gap-5">
                        <MeetingSummary meetings={meetings} />
                    </div>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <DataTable
                            columns={columns}
                            data={meetings}
                            searchPlaceholder="Search meetings..."
                            searchColumn="title"
                            onRowClick={(meeting) => router.visit(getRoute(`/meetings/${meeting.id}`))} 
                            addButton={
                                <Button onClick={() => setIsMeetingDialogOpen(true)} className="cursor-pointer">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Meeting
                                </Button>
                            }
                        />
                    </CardContent>
                </Card>

                <CreateMeetingDialog
                    users={users}
                    tasks={tasks}
                    open={isMeetingDialogOpen}
                    onOpenChange={setIsMeetingDialogOpen}
                />
            </div>
        </AppLayout>
    );
}

