import { Task, User } from '@/types/task';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useState } from 'react';

interface UserWorkloadChartProps {
    tasks: Task[];
    users: User[];
}

export function UserWorkloadChart({ tasks, users }: UserWorkloadChartProps) {
    // Calculate workload for each user
    const workloadData = users.map(user => {
        const userTasks = tasks.filter(task => 
            task.users?.some(u => u.id === user.id)
        );
        
        return {
            name: user.name,
            total: userTasks.length,
        };
    });

    // Sort by total workload descending
    const sortedData = [...workloadData].sort((a, b) => b.total - a.total);
    const [startIndex, setStartIndex] = useState(0);
    const usersPerPage = 6;
    const maxIndex = Math.max(0, sortedData.length - usersPerPage);
    const visibleData = sortedData.slice(startIndex, startIndex + usersPerPage);

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="95%">
                <BarChart
                    data={visibleData}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5, // Increased bottom margin for labels
                    }}
                >
                    <XAxis 
                        dataKey="name" 
                        angle={-45}
                        textAnchor="end"
                        height={100} // Increased height for labels
                        tick={{ 
                            fontSize: 12,
                            dy: 8 // Move labels down slightly
                        }}
                        interval={0} // Show all labels
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar 
                        dataKey="total" 
                        fill="#3b82f6" 
                        name="Total Tasks"
                    />
                </BarChart>
            </ResponsiveContainer>
            {sortedData.length > usersPerPage && (
                <div className="flex items-center justify-center mt-2">
                    <input
                        type="range"
                        min={0}
                        max={maxIndex}
                        value={startIndex}
                        onChange={e => setStartIndex(Number(e.target.value))}
                        step={1}
                        style={{ width: '60%' }}
                    />
                    <span className="ml-2 text-xs text-muted-foreground">
                        Showing {startIndex + 1}-{Math.min(startIndex + usersPerPage, sortedData.length)} of {sortedData.length}
                    </span>
                </div>
            )}
        </div>
    );
} 