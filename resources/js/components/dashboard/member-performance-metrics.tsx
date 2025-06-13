import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock, AlertCircle, BarChart3 } from 'lucide-react';

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
    return (
        <Card className="h-fit">
            <CardHeader className="py-2 px-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Task Overview</CardTitle>
                    <BarChart3 className="h-3.5 w-3.5 text-primary" />
                </div>
            </CardHeader>
            <CardContent className="pt-0 px-3 pb-2">
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <div>
                            <div className="text-xs font-medium text-emerald-600">Completed</div>
                            <div className="text-lg font-bold">{taskStats.completed}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-blue-600" />
                        <div>
                            <div className="text-xs font-medium text-blue-600">In Progress</div>
                            <div className="text-lg font-bold">{taskStats.in_progress}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                        <div>
                            <div className="text-xs font-medium text-amber-600">Pending</div>
                            <div className="text-lg font-bold">{taskStats.pending}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <BarChart3 className="h-3.5 w-3.5 text-primary" />
                        <div>
                            <div className="text-xs font-medium text-primary">Total</div>
                            <div className="text-lg font-bold">{taskStats.total}</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 