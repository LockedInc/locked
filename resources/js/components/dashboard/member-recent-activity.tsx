import { Timeline } from '@/types/timeline';
import { format } from 'date-fns';
import { Clock, CheckCircle2, AlertCircle, Calendar, User } from 'lucide-react';
import { router } from '@inertiajs/react';
import { useRolePrefix } from '@/hooks/use-role-prefix';

interface RecentActivityProps {
    activities: Timeline[];
}

export function MemberRecentActivity({ activities }: RecentActivityProps) {
    const { getRoute } = useRolePrefix();

    const getActivityIcon = (subjectType: string) => {
        switch (subjectType.toLowerCase()) {
            case 'task':
                return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
            case 'meeting':
                return <Calendar className="h-4 w-4 text-blue-600" />;
            default:
                return <Clock className="h-4 w-4 text-muted-foreground" />;
        }
    };

    const handleActivityClick = (activity: Timeline) => {
        const route = getRoute(`/${activity.subject_type.toLowerCase()}s/${activity.subject_id}`);
        router.visit(route);
    };

    if (activities.length === 0) {
        return (
            <div className="text-muted-foreground text-sm">No recent activity</div>
        );
    }

    return (
        <ul className="space-y-3">
            {activities.map((activity) => (
                <li 
                    key={activity.id} 
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleActivityClick(activity)}
                >
                    <div className="mt-0.5">
                        {getActivityIcon(activity.subject_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-card-foreground">{activity.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                                {activity.user?.name}
                            </span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">
                                {format(new Date(activity.created_at), 'MMM d, h:mm a')}
                            </span>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
} 