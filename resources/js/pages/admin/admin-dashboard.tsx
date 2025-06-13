import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskProgress } from '@/components/tasks/task-progress';
import { Task, User } from '@/types/task';
import { Timeline } from '@/types/timeline';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { TaskStatusPieChart } from '@/components/dashboard/task-stats-pie';
import { UserWorkloadChart } from '@/components/dashboard/user-workload-chart';
import { RecentActivity } from '@/components/dashboard/admin-recent-activity';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardProps {
    taskStats: {
        total: number;
        completed: number;
        in_progress: number;
        pending: number;
    };
    upcomingTasks: Task[];
    users: User[];
    tasks: Task[];
    recentActivities: Timeline[];
}

export default function Dashboard({ taskStats, upcomingTasks, users, tasks, recentActivities }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-[calc(100vh-5rem)] flex-1 flex-col gap-2 pt-2 px-4 pb-4">
                <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
                <div
                    className="grid grid-cols-1 md:grid-cols-6 gap-4 h-[calc(100%-3rem)]"
                >
                    {/* Left Column - Recent Activity and Watch List stacked */}
                    <div className="md:col-span-4 flex flex-col gap-4">
                        <Card className="flex-[2] overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle>Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[calc(100%-3rem)] overflow-y-auto">
                                <RecentActivity activities={recentActivities} />
                            </CardContent>
                        </Card>

                        <Card className="flex-1 overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle>Watch List</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[calc(100%-3rem)] overflow-y-auto px-2">
                                <div className="space-y-2">
                                    {upcomingTasks.map((task) => (
                                        <div key={task.id} className="flex items-center justify-between p-2 border rounded-lg">
                                            <div>
                                                <h3 className="font-medium text-sm">{task.name}</h3>
                                                <p className="text-xs text-muted-foreground">
                                                    Due: {task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : 'No due date'}
                                                </p>
                                            </div>
                                            <Badge className={statusColors[task.status]}>
                                                {task.status.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Charts stacked vertically */}
                    <div className="md:col-span-2 flex flex-col gap-4">
                        <Card className="flex-1 overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle>Task Completion</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[calc(100%-3rem)]">
                                <TaskStatusPieChart taskStats={taskStats} />
                            </CardContent>
                        </Card>

                        <Card className="flex-1 overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle>Team Workload</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[calc(100%-3rem)]">
                                <UserWorkloadChart tasks={tasks} users={users} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

const statusColors = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'in_progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800'
};