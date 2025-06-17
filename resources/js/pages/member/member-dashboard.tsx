import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { PerformanceMetrics } from '@/components/dashboard/member-performance-metrics';
import { MemberRecentActivity } from '@/components/dashboard/member-recent-activity';
import { MemberWatchList } from '@/components/dashboard/member-watch-list';
import { Timeline } from '@/types/timeline';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const alerts = [
    { id: 1, type: 'Overdue', message: 'Task "Submit Report" is overdue!', icon: <AlertCircle className="h-4 w-4 text-red-500" /> },
    { id: 2, type: 'New', message: 'You have been assigned a new task.', icon: <CheckCircle2 className="h-4 w-4 text-green-500" /> },
];

interface Task {
    id: number;
    name: string;
    status: 'pending' | 'in_progress' | 'completed';
    due_date: string;
    priority: 'low' | 'medium' | 'high';
}

interface DashboardProps {
    taskStats: {
        total: number;
        completed: number;
        in_progress: number;
        pending: number;
    };
    recentActivities: Timeline[];
    tasks: Task[];
}

export default function MemberDashboard({ taskStats, recentActivities, tasks }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="h-[calc(100vh-4rem)] p-2 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1.5fr] gap-4 h-full min-h-0 overflow-hidden">
                    {/* Left Column */}
                    <div className="flex flex-col gap-4 h-full min-h-0">
                        {/* Recent Activity */}
                        <Card className="flex-1 py-3 min-h-0 ">
                            <CardHeader className="px-3 gap-0">
                                <CardTitle className="text-base mt-0 mb-0">Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent className="overflow-y-auto px-0 h-full min-h-0">
                                <MemberRecentActivity activities={recentActivities} />
                            </CardContent>
                        </Card>

                        {/* Watch List */}
                        <Card className="flex-1 py-3 min-h-0">
                            <CardHeader className="px-3 gap-0">
                                <CardTitle className="text-base mt-0 mb-0">Watch List</CardTitle>
                            </CardHeader>
                            <CardContent className="overflow-y-auto px-1 h-full min-h-0">
                                <MemberWatchList tasks={tasks} />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-4 h-full">
                        {/* Performance Metric */}
                        <Card className="py-3">
                            <CardHeader className="px-3 gap-0">
                                <CardTitle className="text-base mt-0 mb-0">Task Overview</CardTitle>
                            </CardHeader>
                            <CardContent className="px-3">
                                <PerformanceMetrics taskStats={taskStats} />
                            </CardContent>
                        </Card>
                        
                        {/* Alerts */}
                        <Card className="flex-1 py-3 min-h-0">
                            <CardHeader className="px-3 gap-0">
                                <CardTitle className="text-base mt-0 mb-0">Alerts</CardTitle>
                            </CardHeader>
                            <CardContent className="overflow-y-auto px-3 h-full min-h-0">
                                {alerts.length === 0 ? (
                                    <div className="text-muted-foreground text-sm">No alerts</div>
                                ) : (
                                    <ul className="space-y-3">
                                        {alerts.map(alert => (
                                            <li key={alert.id} className="flex items-center gap-3">
                                                {alert.icon}
                                                <span className="text-sm">{alert.message}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 