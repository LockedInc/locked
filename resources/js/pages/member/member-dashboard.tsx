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

const upcomingTasks: Task[] = [
    {
        id: 1,
        name: 'Finalize Budget',
        status: 'in_progress',
        due_date: '2024-03-20T14:00:00',
        priority: 'high'
    },
    {
        id: 2,
        name: 'Update Roadmap',
        status: 'pending',
        due_date: '2024-03-22T10:00:00',
        priority: 'medium'
    },
    {
        id: 3,
        name: 'Client Presentation',
        status: 'pending',
        due_date: '2024-03-25T15:30:00',
        priority: 'high'
    }
];

interface DashboardProps {
    taskStats: {
        total: number;
        completed: number;
        in_progress: number;
        pending: number;
    };
    recentActivities: Timeline[];
}

export default function MemberDashboard({ taskStats, recentActivities }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-[calc(100vh-4rem)] flex-1 flex-col gap-2 pt-2 px-4 pb-4 overflow-y-auto">
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1.5fr] gap-4">
                    {/* Left Column */}
                    <div className="flex flex-col gap-4">
                        {/* Recent Activity */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[300px] overflow-y-auto">
                                <MemberRecentActivity activities={recentActivities} />
                            </CardContent>
                        </Card>

                        {/* Watch List */}
                        <MemberWatchList tasks={upcomingTasks} />
                    </div>

                    {/* Right Column */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-min">
                        {/* Performance Metric */}
                        <div className="md:col-span-2">
                            <PerformanceMetrics taskStats={taskStats} />
                        </div>
                        
                        {/* Alerts */}
                        <div className="md:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Alerts</CardTitle>
                                </CardHeader>
                                <CardContent>
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
            </div>
        </AppLayout>
    );
} 