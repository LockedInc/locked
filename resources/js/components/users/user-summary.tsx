import { Card, CardContent } from '@/components/ui/card';
import { Users, UserCheck, UserX } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    role: {
        id: number;
        name: string;
    };
}

interface UserSummaryProps {
    users: User[];
}

export function UserSummary({ users }: UserSummaryProps) {
    const totalUsers = users.length;
    const adminCount = users.filter(user => user.role.name === 'Client-Admin').length;
    const regularUserCount = totalUsers - adminCount;

    return (
        <Card className="px-6 py-3">
            <CardContent className="p-0">
                <div className="flex items-center justify-center gap-8">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium text-foreground text-base">{totalUsers}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">Users</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-2">
                                <UserCheck className="h-4 w-4 text-purple-500" />
                                <span className="font-medium text-purple-600 text-base">{adminCount}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">Admins</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-2">
                                <UserX className="h-4 w-4 text-blue-500" />
                                <span className="font-medium text-blue-600 text-base">{regularUserCount}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">Regular</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 