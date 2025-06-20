import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, BellOff } from 'lucide-react';
import { Alert } from '@/types/alert';

interface AlertsSummaryProps {
    alerts: Alert[];
    onViewAll?: () => void;
    className?: string;
}

export function AlertsSummary({ alerts, onViewAll, className }: AlertsSummaryProps) {
    const unreadCount = alerts.filter(alert => !alert.is_read).length;
    const urgentCount = alerts.filter(alert => 
        !alert.is_read && alert.task?.priority === 'high'
    ).length;

    if (alerts.length === 0) {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                <BellOff className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">No alerts</span>
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className="relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                    <Badge 
                        variant="destructive" 
                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                    >
                        {unreadCount}
                    </Badge>
                )}
            </div>
            
            <div className="flex items-center gap-1">
                <span className="text-sm font-medium">
                    {unreadCount} alert{unreadCount !== 1 ? 's' : ''}
                </span>
                
                {urgentCount > 0 && (
                    <Badge variant="destructive" className="text-xs">
                        {urgentCount} urgent
                    </Badge>
                )}
            </div>
            
            {onViewAll && (
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onViewAll}
                    className="h-6 px-2 text-xs"
                >
                    View all
                </Button>
            )}
        </div>
    );
} 