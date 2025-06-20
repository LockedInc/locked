import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { PerformanceMetrics } from '@/components/dashboard/member-performance-metrics';
import { MemberRecentActivity } from '@/components/dashboard/member-recent-activity';
import { MemberWatchList } from '@/components/dashboard/member-watch-list';
import { MemberAlerts } from '@/components/dashboard/member-alerts';
import { Timeline } from '@/types/timeline';
import { Alert } from '@/types/alert';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
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
    alerts: Alert[];
}

export default function MemberDashboard({ taskStats, recentActivities, tasks, alerts }: DashboardProps) {
    const handleMarkAsRead = (alertId: number) => {
        // TODO: Implement mark as read functionality
        console.log('Mark as read:', alertId);
    };

    const handleMarkAsUnread = (alertId: number) => {
        // TODO: Implement mark as unread functionality
        console.log('Mark as unread:', alertId);
    };

    const handleViewTask = (taskId: number) => {
        // TODO: Navigate to task details
        console.log('View task:', taskId);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="h-[calc(100vh-4rem)] p-2 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-4 h-full min-h-0 overflow-hidden">
                    {/* Left Column */}
                    <div className="flex flex-col gap-4 h-full min-h-0">
                        {/* Alerts - Top Left (Bigger than Task Overview) */}
                        <Card className="flex-1 py-3 min-h-0 min-h-[300px]">
                            <CardHeader className="px-3 gap-0">
                                <div className="flex items-center gap-2">
                                    <CardTitle className="text-base mt-0 mb-0">Alerts</CardTitle>
                                    {alerts.filter(alert => !alert.is_read).length > 0 && (
                                        <Badge className="bg-red-500 text-white text-xs px-2 py-0.5 animate-pulse">
                                            {alerts.filter(alert => !alert.is_read).length} NEW
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="overflow-y-auto px-3 h-full min-h-0">
                                <MemberAlerts 
                                    alerts={alerts}
                                    onMarkAsRead={handleMarkAsRead}
                                    onMarkAsUnread={handleMarkAsUnread}
                                    onViewTask={handleViewTask}
                                />
                            </CardContent>
                        </Card>

                        {/* Watch List - Smaller now */}
                        <Card className="flex-1 py-3 min-h-0 min-h-[300px]">
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
                        {/* Performance Metric - Smaller */}
                        <Card className="py-3 min-h-0 min-h-[150px]">
                            <CardHeader className="px-3 gap-0">
                                <CardTitle className="text-base mt-0 mb-0">Task Overview</CardTitle>
                            </CardHeader>
                            <CardContent className="px-3">
                                <PerformanceMetrics taskStats={taskStats} />
                            </CardContent>
                        </Card>
                        
                        {/* Recent Activity - Bottom Right (Larger) */}
                        <Card className="flex-1 py-3 min-h-0 min-h-[200px]">
                            <CardHeader className="px-3 gap-0">
                                <CardTitle className="text-base mt-0 mb-0">Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent className="overflow-y-auto px-0 h-full min-h-0">
                                <MemberRecentActivity activities={recentActivities} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 