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
            <div className="flex h-[calc(100vh)] flex-1 flex-col gap-2 pt-2 px-4 pb-4">
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <div
                    className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-4 h-[calc(100%)]"
                >
                    {/* Recent Activity (left, spans 2 rows) */}
                    <Card className="row-span-2 md:col-span-1">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RecentActivity activities={recentActivities} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Task Completion</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TaskStatusPieChart taskStats={taskStats} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Team Workload</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <UserWorkloadChart tasks={tasks} users={users} />
                        </CardContent>
                    </Card>

                    {/* Watch List (bottom right) */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Watch List</CardTitle>
                        </CardHeader>
                        <CardContent className="h-64 overflow-y-auto">
                            {/* Example: Upcoming Tasks */}
                            <div className="space-y-4">
                                {upcomingTasks.map((task) => (
                                    <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div>
                                            <h3 className="font-medium">{task.name}</h3>
                                            <p className="text-sm text-muted-foreground">
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
            </div>
        </AppLayout>
    );
}

const statusColors = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'in_progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800'
};