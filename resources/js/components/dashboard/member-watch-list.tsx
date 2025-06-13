import { Eye, Calendar, Clock, AlertCircle } from 'lucide-react';
import { format, isPast, addHours, isBefore } from 'date-fns';

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

function isDueSoon(dueDate: string): boolean {
    const date = new Date(dueDate);
    const now = new Date();
    const twentyFourHoursFromNow = addHours(now, 24);
    return !isPast(date) && isBefore(date, twentyFourHoursFromNow);
}

export function MemberWatchList({ tasks }: MemberWatchListProps) {
    // Sort tasks by due date and filter out completed tasks
    const sortedTasks = [...tasks]
        .filter(task => task.status !== 'completed')
        .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
        .slice(0, 3); // Only show the first 3 tasks

    if (sortedTasks.length === 0) {
        return (
            <div className="text-muted-foreground text-sm">No upcoming tasks</div>
        );
    }

    return (
        <ul className="space-y-3">
            {sortedTasks.map(task => {
                const isAlmostDue = isDueSoon(task.due_date);
                return (
                    <li key={task.id} className="flex flex-col gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">{task.name}</span>
                            {isAlmostDue && (
                                <AlertCircle className="h-4 w-4 text-red-500 ml-auto" />
                            )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className={`px-2 py-0.5 rounded font-medium ${getStatusBadge(task.status)}`}>
                                {task.status.replace('_', ' ')}
                            </span>
                            <span className={`px-2 py-0.5 rounded font-medium ${getPriorityBadge(task.priority)}`}>
                                {task.priority}
                            </span>
                            <div className="flex items-center gap-1 text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>{format(new Date(task.due_date), 'MMM d, yyyy')}</span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{format(new Date(task.due_date), 'h:mm a')}</span>
                            </div>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
} 