import { Timeline } from '@/types/timeline';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecentActivityProps {
    activities: Timeline[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
    if (activities.length === 0) {
        return (
            <div className="text-muted-foreground text-sm">
                No recent activity
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {activities.map((activity) => (
                <div 
                    key={activity.id} 
                    className="group relative flex items-start gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-muted/50 cursor-pointer"
                >
                    <div className="mt-1">
                        <Clock className="h-4 w-4 text-blue-400 transition-colors group-hover:text-blue-500" />
                    </div>
                    <div className="flex-1 space-y-1 min-w-0">
                        <p className="text-sm text-foreground transition-colors group-hover:text-foreground/90 line-clamp-2">
                            {activity.message}
                        </p>
                        <div className="flex items-center gap-2">
                            <p className="text-xs text-muted-foreground transition-colors group-hover:text-muted-foreground/80">
                                {format(new Date(activity.created_at), 'MMM d, yyyy • h:mm a')}
                            </p>
                            {activity.user && (
                                <span className="text-xs text-muted-foreground/60">
                                    • by {activity.user.name}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
} 