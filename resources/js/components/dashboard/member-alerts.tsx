import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
    AlertCircle, 
    CheckCircle2, 
    Clock, 
    Info, 
    MessageSquare,
    ExternalLink,
    Eye,
    EyeOff,
    Sparkles
} from 'lucide-react';
import { Alert as AlertType } from '@/types/alert';
import { cn } from '@/lib/utils';

interface MemberAlertsProps {
    alerts: AlertType[];
    onMarkAsRead?: (alertId: number) => void;
    onMarkAsUnread?: (alertId: number) => void;
    onViewTask?: (taskId: number) => void;
}

const getAlertIcon = (priority: string, isRead: boolean) => {
    const iconClass = cn(
        "h-4 w-4",
        isRead ? "text-muted-foreground" : "text-foreground"
    );

    // For unread alerts, show red circle with exclamation mark
    if (!isRead) {
        return <AlertCircle className={cn(iconClass, "text-destructive")} />;
    }

    // For read alerts, show different icons based on priority
    switch (priority) {
        case 'high':
            return <AlertCircle className={cn(iconClass, "text-muted-foreground")} />;
        case 'medium':
            return <AlertCircle className={cn(iconClass, "text-muted-foreground")} />;
        case 'low':
            return <Info className={cn(iconClass, "text-muted-foreground")} />;
        default:
            return <MessageSquare className={iconClass} />;
    }
};

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'high':
            return 'bg-destructive/10 text-destructive border-destructive/20';
        case 'medium':
            return 'bg-warning/10 text-warning border-warning/20';
        case 'low':
            return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
        default:
            return 'bg-muted text-muted-foreground border-border';
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'completed':
            return 'bg-green-500/10 text-green-600 border-green-500/20';
        case 'in_progress':
            return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
        case 'pending':
            return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
        default:
            return 'bg-muted text-muted-foreground border-border';
    }
};

const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    
    // Handle invalid dates
    if (isNaN(diffInMs) || diffInMs < 0) {
        return 'Recently';
    }
    
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}mo ago`;
    return `${Math.floor(diffInDays / 365)}y ago`;
};

const formatExactTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

// Check if alert is very recent (within last 5 minutes)
const isVeryRecent = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    return diffInMs < 5 * 60 * 1000; // 5 minutes
};

export function MemberAlerts({ alerts, onMarkAsRead, onMarkAsUnread, onViewTask }: MemberAlertsProps) {
    const unreadCount = alerts.filter(alert => !alert.is_read).length;

    // Sort alerts: unread first (newest to oldest), then read (most recently read first)
    const sortedAlerts = [...alerts].sort((a, b) => {
        // First, sort by read status (unread first)
        if (!a.is_read && b.is_read) return -1;
        if (a.is_read && !b.is_read) return 1;
        
        // If both are unread, sort by creation date (newest first)
        if (!a.is_read && !b.is_read) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        
        // If both are read, sort by read date (most recently read first)
        if (a.is_read && b.is_read) {
            const aReadTime = a.read_at ? new Date(a.read_at).getTime() : 0;
            const bReadTime = b.read_at ? new Date(b.read_at).getTime() : 0;
            return bReadTime - aReadTime;
        }
        
        return 0;
    });

    if (alerts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No Alerts</h3>
                <p className="text-sm text-muted-foreground">
                    You're all caught up! No new alerts from your admin.
                </p>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto max-h-[calc(100vh-200px)]">
            {unreadCount > 0 && (
                <div className="flex items-center justify-between mb-2 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 py-1">
                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-600">
                        {unreadCount} {unreadCount === 1 ? 'new alert' : 'new alerts'}
                    </Badge>
                </div>
            )}
            
            <div className="space-y-2">
                {sortedAlerts.map((alert, index) => {
                    const isNew = !alert.is_read;
                    const isRecent = isNew && isVeryRecent(alert.created_at);
                    
                    // Check if we need to add a separator (transition from unread to read)
                    const previousAlert = index > 0 ? sortedAlerts[index - 1] : null;
                    const showSeparator = previousAlert && !previousAlert.is_read && alert.is_read;
                    
                    return (
                        <React.Fragment key={alert.id}>
                            {showSeparator && (
                                <div className="flex items-center gap-2 py-2">
                                    <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
                                    <span className="text-xs text-muted-foreground px-2">Read Alerts</span>
                                    <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
                                </div>
                            )}
                            
                            <div 
                                className={cn(
                                    "flex flex-col gap-1 p-3 rounded-lg border transition-all duration-200 cursor-pointer relative",
                                    // Unread alert styling - much more prominent
                                    isNew && [
                                        "border-l-4 border-l-blue-500",
                                        "bg-gradient-to-r from-blue-50/80 to-white dark:from-blue-950/30 dark:to-background",
                                        "shadow-sm hover:shadow-md",
                                        "ring-1 ring-blue-200/50 dark:ring-blue-800/50"
                                    ],
                                    // Read alert styling - muted
                                    alert.is_read && [
                                        "opacity-75",
                                        "bg-muted/30",
                                        "border-gray-200 dark:border-gray-700"
                                    ]
                                )}
                                onClick={() => {
                                    // Mark as read if unread
                                    if (!alert.is_read) {
                                        onMarkAsRead?.(alert.id);
                                    }
                                    // Navigate to task if available
                                    if (alert.task_id) {
                                        onViewTask?.(alert.task_id);
                                    }
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    {getAlertIcon(alert.task?.priority || 'medium', alert.is_read)}
                                    
                                    {/* Enhanced time display for unread alerts */}
                                    <span className={cn(
                                        "text-xs ml-auto",
                                        isNew ? "text-blue-600 font-medium" : "text-muted-foreground"
                                    )}>
                                        {formatTimeAgo(alert.created_at)}
                                    </span>
                                </div>
                                
                                {/* Enhanced message styling for unread alerts */}
                                <div className={cn(
                                    "text-sm",
                                    isNew ? "text-gray-900 dark:text-gray-100 font-medium" : "text-muted-foreground"
                                )}>
                                    {alert.message}
                                </div>
                                
                                {alert.task && (
                                    <div className="flex flex-wrap items-center gap-1 text-xs">
                                        <span className="text-muted-foreground">Task:</span>
                                        <span className={cn(
                                            "font-medium",
                                            isNew ? "text-blue-700 dark:text-blue-300" : "text-muted-foreground"
                                        )}>
                                            {alert.task.name}
                                        </span>
                                        {alert.task.due_date && (
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                <span>Due {new Date(alert.task.due_date).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                <div className="flex items-center gap-1 justify-end">
                                    {alert.task_id && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-5 w-5 p-0"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onViewTask?.(alert.task_id!);
                                            }}
                                        >
                                            <ExternalLink className="h-3 w-3" />
                                        </Button>
                                    )}
                                    
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-5 w-5 p-0"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (alert.is_read) {
                                                onMarkAsUnread?.(alert.id);
                                            } else {
                                                onMarkAsRead?.(alert.id);
                                            }
                                        }}
                                    >
                                        {alert.is_read ? (
                                            <EyeOff className="h-3 w-3" />
                                        ) : (
                                            <Eye className="h-3 w-3" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
} 