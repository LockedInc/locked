import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { type Meeting } from '@/types/meeting';
import { type User } from '@/types/user';
import { type Task } from '@/types/task';
import { useRolePrefix } from '@/hooks/use-role-prefix';
import { ArrowLeft, Calendar, Users, ListTodo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";

interface MemberMeetingDetailsProps extends PageProps {
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

export default function MemberMeetingDetails({ meeting, users, tasks }: MemberMeetingDetailsProps) {
    const { getRoute } = useRolePrefix();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Meetings',
            href: getRoute('/meetings'),
        },
        {
            title: meeting.title,
            href: getRoute(`/meetings/${meeting.id}`),
        },
    ];

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
                    <Button
                        variant="outline"
                        onClick={() => router.visit(getRoute('/meetings'))}
                        className="cursor-pointer"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Meetings
                    </Button>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <Card className="col-span-3 shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-medium">Meeting Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                <div className="grid grid-cols-3 gap-8">
                                    <div className="col-span-2 space-y-2 w-full">
                                        <div className="text-sm font-medium">Agenda</div>
                                        <div className="min-h-[calc(100vh-400px)] text-sm bg-muted/30 p-4 rounded-md border w-full whitespace-pre-wrap">
                                            {meeting.agenda_text || 'No agenda set'}
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-2 w-full">
                                            <div className="text-sm font-medium">Meeting Title</div>
                                            <div className="h-10 text-sm bg-muted/30 p-4 rounded-md min-h-[40px] flex items-center text-foreground border w-full">
                                                {meeting.title}
                                            </div>
                                        </div>

                                        <div className="space-y-2 w-full">
                                            <div className="text-sm font-medium">Meeting Type</div>
                                            <div className="h-10 text-sm bg-muted/30 p-4 rounded-md min-h-[40px] flex items-center border w-full">
                                                <Badge className={cn(typeColors[meeting.type as MeetingType], "text-xs font-medium px-2 py-0.5 mr-2")}>
                                                    {meeting.type}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="space-y-2 w-full">
                                            <div className="text-sm font-medium">Date & Time</div>
                                            <div className="h-10 text-sm bg-muted/30 p-4 rounded-md min-h-[40px] flex items-center text-muted-foreground border w-full">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                {meeting.date ? format(new Date(meeting.date), 'EEEE, MMMM d, yyyy • h:mm a') : 'No date set'}
                                            </div>
                                        </div>

                                        <div className="space-y-2 w-full">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="text-sm font-medium">Attendees</div>
                                                    <span className="text-sm text-muted-foreground">
                                                        ({meeting.users.length})
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {meeting.users.map((user) => (
                                                    <Badge 
                                                        key={user.id} 
                                                        variant="secondary" 
                                                        className="text-sm bg-muted/50"
                                                    >
                                                        {user.fname} {user.lname}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        {meeting.tasks && meeting.tasks.length > 0 && (
                                            <div className="space-y-2 w-full">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="text-sm font-medium">Related Tasks</div>
                                                        <span className="text-sm text-muted-foreground">
                                                            ({meeting.tasks.length})
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    {meeting.tasks.map((task) => (
                                                        <div
                                                            key={task.id}
                                                            className="flex items-center justify-between p-2 rounded-lg border bg-muted/30"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <ListTodo className="h-4 w-4 text-muted-foreground" />
                                                                <span className="text-sm">{task.name}</span>
                                                            </div>
                                                            <Badge variant="outline" className="text-xs">
                                                                {task.status.split('_').map(word => 
                                                                    word.charAt(0).toUpperCase() + word.slice(1)
                                                                ).join(' ')}
                                                            </Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
} 