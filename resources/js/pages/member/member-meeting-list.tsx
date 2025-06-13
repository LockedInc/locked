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
import { type Meeting } from '@/types/meeting';
import { type User } from '@/types/user';
import { type Task } from '@/types/task';
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
        title: 'Meetings',
        href: '/member/meetings',
    },
];

interface MemberMeetingListProps extends PageProps {
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

export default function MemberMeetingList({ meetings, users, tasks }: MemberMeetingListProps) {
    const { getRoute } = useRolePrefix();
    const [isMeetingDialogOpen, setIsMeetingDialogOpen] = useState(false);
    const [filteredMeetings, setFilteredMeetings] = useState(meetings);
    const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(null);
    const [meetingView, setMeetingView] = useState<'upcoming' | 'all'>('upcoming');
    const { auth } = usePage().props as unknown as PageProps;

    // Update filtered meetings when meetings prop changes
    useEffect(() => {
        setFilteredMeetings(meetings);
    }, [meetings]);

    const clearFilters = () => {
        setSelectedDateFilter(null);
        setFilteredMeetings(meetings);
    };

    const applyFilters = (dateFilter?: string) => {
        let filtered = [...meetings];

        // Apply date filter
        if (dateFilter) {
            const today = new Date();
            const tomorrow = addDays(today, 1);
            const endOfWeek = addDays(today, 7);
            const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

            switch (dateFilter) {
                case 'today':
                    filtered = filtered.filter(meeting => {
                        const meetingDate = new Date(meeting.date);
                        return meetingDate >= startOfDay(today) && meetingDate <= endOfDay(today);
                    });
                    break;
                case 'tomorrow':
                    filtered = filtered.filter(meeting => {
                        const meetingDate = new Date(meeting.date);
                        return meetingDate >= startOfDay(tomorrow) && meetingDate <= endOfDay(tomorrow);
                    });
                    break;
                case 'this-week':
                    filtered = filtered.filter(meeting => {
                        const meetingDate = new Date(meeting.date);
                        return meetingDate >= startOfDay(today) && meetingDate <= endOfDay(endOfWeek);
                    });
                    break;
                case 'this-month':
                    filtered = filtered.filter(meeting => {
                        const meetingDate = new Date(meeting.date);
                        return meetingDate >= startOfDay(today) && meetingDate <= endOfDay(endOfMonth);
                    });
                    break;
            }
        }

        // Apply view filter
        if (meetingView === 'upcoming') {
            const now = new Date();
            filtered = filtered.filter(meeting => isAfter(new Date(meeting.date), now));
        }

        setFilteredMeetings(filtered);
    };

    const handleDateFilter = (filterType: string) => {
        setSelectedDateFilter(filterType);
        applyFilters(filterType);
    };

    const handleMeetingViewChange = (view: 'upcoming' | 'all') => {
        setMeetingView(view);
        applyFilters(selectedDateFilter || undefined);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Meetings" />
            <div className="flex h-[calc(100vh-4rem)] flex-1 flex-col p-4">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-semibold">Meetings</h1>
                    <div className="flex items-center gap-2">
                        <Select
                            value={meetingView}
                            onValueChange={(value) => handleMeetingViewChange(value as 'upcoming' | 'all')}
                        >
                            <SelectTrigger className="w-[180px] h-8 cursor-pointer">
                                <SelectValue placeholder="View meetings" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem className="cursor-pointer" value="upcoming">Upcoming Meetings</SelectItem>
                                <SelectItem className="cursor-pointer" value="all">All Meetings</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1 cursor-pointer"
                            onClick={() => setIsMeetingDialogOpen(true)}
                        >
                            <Plus className="h-4 w-4" />
                            Add Meeting
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
                                    <DropdownMenuItem onClick={() => handleDateFilter('today')}>
                                        Today
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDateFilter('tomorrow')}>
                                        Tomorrow
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDateFilter('this-week')}>
                                        This Week
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDateFilter('this-month')}>
                                        This Month
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
                </div>

                <Card className="flex-1 overflow-hidden">
                    <CardContent className="h-full p-0">
                        <div className="h-full flex flex-col">
                            <div className="p-6 pb-0">
                                <DataTable
                                    columns={columns}
                                    data={filteredMeetings}
                                    searchPlaceholder="Search meetings..."
                                    searchColumn="title"
                                    onRowClick={(meeting: Meeting) => router.visit(getRoute(`/meetings/${meeting.id}`), {
                                        preserveState: true,
                                        preserveScroll: true,
                                    })}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
} 