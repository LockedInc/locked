import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MemberAlerts } from './member-alerts';
import { AlertsSummary } from './alerts-summary';
import { Alert } from '@/types/alert';

// Sample data for demonstration
const sampleAlerts: Alert[] = [
    {
        id: 1,
        admin_id: 1,
        user_id: 2,
        task_id: 1,
        message: "Please review the updated requirements for the client presentation. The deadline has been moved up to this Friday.",
        is_read: false,
        read_at: null,
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z",
        admin: {
            id: 1,
            fname: "Sarah",
            lname: "Johnson",
            email: "sarah.johnson@company.com"
        },
        task: {
            id: 1,
            name: "Client Presentation Preparation",
            status: "in_progress",
            priority: "high",
            due_date: "2024-01-19T17:00:00Z"
        }
    },
    {
        id: 2,
        admin_id: 1,
        user_id: 2,
        task_id: 2,
        message: "Great work on the quarterly report! Please make sure to include the new metrics we discussed in the meeting.",
        is_read: false,
        read_at: null,
        created_at: "2024-01-15T09:15:00Z",
        updated_at: "2024-01-15T09:15:00Z",
        admin: {
            id: 1,
            fname: "Sarah",
            lname: "Johnson",
            email: "sarah.johnson@company.com"
        },
        task: {
            id: 2,
            name: "Quarterly Report Update",
            status: "pending",
            priority: "medium",
            due_date: "2024-01-22T17:00:00Z"
        }
    },
    {
        id: 3,
        admin_id: 1,
        user_id: 2,
        task_id: 3,
        message: "The budget review meeting has been rescheduled to tomorrow at 2 PM. Please update your calendar.",
        is_read: true,
        read_at: "2024-01-15T11:00:00Z",
        created_at: "2024-01-15T08:45:00Z",
        updated_at: "2024-01-15T11:00:00Z",
        admin: {
            id: 1,
            fname: "Sarah",
            lname: "Johnson",
            email: "sarah.johnson@company.com"
        },
        task: {
            id: 3,
            name: "Budget Review Meeting",
            status: "completed",
            priority: "low",
            due_date: "2024-01-16T14:00:00Z"
        }
    },
    {
        id: 4,
        admin_id: 1,
        user_id: 2,
        task_id: null,
        message: "Welcome to the team! I've assigned you to the new project. Let me know if you need any clarification.",
        is_read: false,
        read_at: null,
        created_at: "2024-01-14T16:20:00Z",
        updated_at: "2024-01-14T16:20:00Z",
        admin: {
            id: 1,
            fname: "Sarah",
            lname: "Johnson",
            email: "sarah.johnson@company.com"
        }
    }
];

export function AlertsDemo() {
    const handleMarkAsRead = (alertId: number) => {
        console.log('Mark as read:', alertId);
        // In a real app, this would make an API call
    };

    const handleMarkAsUnread = (alertId: number) => {
        console.log('Mark as unread:', alertId);
        // In a real app, this would make an API call
    };

    const handleViewTask = (taskId: number) => {
        console.log('View task:', taskId);
        // In a real app, this would navigate to the task details
    };

    const handleViewAll = () => {
        console.log('View all alerts');
        // In a real app, this would navigate to a full alerts page
    };

    return (
        <div className="space-y-6">
            {/* Alerts Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Alerts Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <AlertsSummary 
                        alerts={sampleAlerts} 
                        onViewAll={handleViewAll}
                    />
                </CardContent>
            </Card>

            {/* Full Alerts Component */}
            <Card>
                <CardHeader>
                    <CardTitle>Task Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                    <MemberAlerts 
                        alerts={sampleAlerts}
                        onMarkAsRead={handleMarkAsRead}
                        onMarkAsUnread={handleMarkAsUnread}
                        onViewTask={handleViewTask}
                    />
                </CardContent>
            </Card>
        </div>
    );
} 