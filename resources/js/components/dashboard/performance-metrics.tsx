import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface TaskStats {
    total: number;
    completed: number;
    in_progress: number;
    pending: number;
}

interface PerformanceMetricsProps {
    taskStats: TaskStats;
}

export function PerformanceMetrics({ taskStats }: PerformanceMetricsProps) {
    const completion = taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0;

    return (
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
    );
} 