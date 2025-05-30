import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle2, Clock, Eye } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// Mock data for demonstration
const taskStats = {
    total: 12,
    completed: 7,
    in_progress: 3,
    pending: 2,
};
const alerts = [
    { id: 1, type: 'Overdue', message: 'Task "Submit Report" is overdue!', icon: <AlertCircle className="h-4 w-4 text-red-500" /> },
    { id: 2, type: 'New', message: 'You have been assigned a new task.', icon: <CheckCircle2 className="h-4 w-4 text-green-500" /> },
];
const recentActivity = [
    { id: 1, action: 'Completed task "Design Review"', time: '2 hours ago' },
    { id: 2, action: 'Commented on "Client Feedback"', time: '5 hours ago' },
    { id: 3, action: 'Joined meeting "Sprint Planning"', time: '1 day ago' },
];
const watchList = [
    { id: 1, name: 'Finalize Budget', status: 'in_progress' },
    { id: 2, name: 'Update Roadmap', status: 'pending' },
];

function getStatusBadge(status: string) {
    const map: Record<string, string> = {
        completed: 'bg-green-100 text-green-800',
        in_progress: 'bg-blue-100 text-blue-800',
        pending: 'bg-yellow-100 text-yellow-800',
    };
    return map[status] || 'bg-gray-100 text-gray-800';
}

export default function MemberDashboard() {
    const completion = taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="p-6">
                <h1 className="text-2xl font-semibold mb-6 text-gray-100">Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-6 h-[70vh]">
                    {/* Performance Metric */}
                    <Card className="bg-neutral-800 col-span-1 row-span-1 min-h-[180px] flex flex-col justify-center">
                        <CardHeader>
                            <CardTitle className="text-gray-200">Performance Metric</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-6 mb-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-gray-100">{taskStats.completed}</div>
                                    <div className="text-xs text-gray-400">Completed</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-gray-100">{taskStats.in_progress}</div>
                                    <div className="text-xs text-gray-400">In Progress</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-gray-100">{taskStats.pending}</div>
                                    <div className="text-xs text-gray-400">Pending</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-gray-100">{taskStats.total}</div>
                                    <div className="text-xs text-gray-400">Total</div>
                                </div>
                            </div>
                            <div className="mb-2 flex items-center gap-2">
                                <Progress value={completion} className="h-2 bg-gray-700" />
                                <span className="text-xs text-gray-300">{completion}%</span>
                            </div>
                            <div className="text-xs text-gray-400">Task completion rate</div>
                        </CardContent>
                    </Card>
                    {/* Alerts */}
                    <Card className="bg-neutral-800 col-span-1 row-span-1 min-h-[180px] flex flex-col justify-center">
                        <CardHeader>
                            <CardTitle className="text-gray-200">Alerts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {alerts.length === 0 ? (
                                <div className="text-gray-400 text-sm">No alerts</div>
                            ) : (
                                <ul className="space-y-3">
                                    {alerts.map(alert => (
                                        <li key={alert.id} className="flex items-center gap-3">
                                            {alert.icon}
                                            <span className="text-gray-200 text-sm">{alert.message}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                    {/* Recent Activity */}
                    <Card className="bg-neutral-800 col-span-1 row-span-1 min-h-[180px] flex flex-col justify-center">
                        <CardHeader>
                            <CardTitle className="text-gray-200">Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentActivity.length === 0 ? (
                                <div className="text-gray-400 text-sm">No recent activity</div>
                            ) : (
                                <ul className="space-y-2">
                                    {recentActivity.map(act => (
                                        <li key={act.id} className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-blue-400" />
                                            <span className="text-gray-200 text-sm">{act.action}</span>
                                            <span className="text-xs text-gray-400 ml-auto">{act.time}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                    {/* Watch List */}
                    <Card className="bg-neutral-800 col-span-1 row-span-1 min-h-[180px] flex flex-col justify-center">
                        <CardHeader>
                            <CardTitle className="text-gray-200">Watch List</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {watchList.length === 0 ? (
                                <div className="text-gray-400 text-sm">No items in watch list</div>
                            ) : (
                                <ul className="space-y-2">
                                    {watchList.map(item => (
                                        <li key={item.id} className="flex items-center gap-2">
                                            <Eye className="h-4 w-4 text-yellow-400" />
                                            <span className="text-gray-200 text-sm">{item.name}</span>
                                            <span className={`ml-auto px-2 py-0.5 rounded text-xs font-medium ${getStatusBadge(item.status)}`}>{item.status.replace('_', ' ')}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
} 