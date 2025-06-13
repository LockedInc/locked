import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Task {
    id: number;
    name: string;
    status: 'pending' | 'in_progress' | 'completed';
    due_date: string;
    priority: 'low' | 'medium' | 'high';
}

interface MemberWatchListProps {
    tasks: Task[];
}

function getStatusBadge(status: string) {
    const map: Record<string, string> = {
        completed: 'bg-green-100 text-green-800',
        in_progress: 'bg-blue-100 text-blue-800',
        pending: 'bg-yellow-100 text-yellow-800',
    };
    return map[status] || 'bg-gray-100 text-gray-800';
}

function getPriorityBadge(priority: string) {
    const map: Record<string, string> = {
        high: 'bg-red-100 text-red-800',
        medium: 'bg-orange-100 text-orange-800',
        low: 'bg-green-100 text-green-800',
    };
    return map[priority] || 'bg-gray-100 text-gray-800';
}

export function MemberWatchList({ tasks }: MemberWatchListProps) {
    if (tasks.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-muted-foreground text-sm">No upcoming tasks</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Watch List</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                    {tasks.map(task => (
                        <li key={task.id} className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <Eye className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium">{task.name}</span>
                                <span className={`ml-auto px-2 py-0.5 rounded text-xs font-medium ${getStatusBadge(task.status)}`}>
                                    {task.status.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground pl-6">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{format(new Date(task.due_date), 'MMM d, yyyy')}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{format(new Date(task.due_date), 'h:mm a')}</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityBadge(task.priority)}`}>
                                    {task.priority}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
} 