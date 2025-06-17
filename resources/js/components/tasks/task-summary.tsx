import { Task } from "@/types/task"
import { Card } from "@/components/ui/card"
import { TaskProgress } from "./task-progress"

interface TaskSummaryProps {
    tasks: Task[]
}

export function TaskSummary({ tasks }: TaskSummaryProps) {
    const pendingCount = tasks.filter(t => t.status === 'pending').length
    const inProgressCount = tasks.filter(t => t.status === 'in_progress').length
    const completedCount = tasks.filter(t => t.status === 'completed').length
    const totalCount = tasks.length

    return (
        <Card className="px-6 py-3">
            <div className="flex items-center justify-center gap-8">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 group">
                            <div className="h-3 w-3 rounded-full bg-yellow-500 group-hover:scale-125 transition-transform" />
                            <span className="font-medium text-yellow-600 group-hover:text-yellow-700 transition-colors">
                                {pendingCount}
                            </span>
                        </div>
                        <span className="text-xs text-muted-foreground">Pending</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 group">
                            <div className="h-3 w-3 rounded-full bg-blue-500 group-hover:scale-125 transition-transform" />
                            <span className="font-medium text-blue-600 group-hover:text-blue-700 transition-colors">
                                {inProgressCount}
                            </span>
                        </div>
                        <span className="text-xs text-muted-foreground">In Progress</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 group">
                            <div className="h-3 w-3 rounded-full bg-green-500 group-hover:scale-125 transition-transform" />
                            <span className="font-medium text-green-600 group-hover:text-green-700 transition-colors">
                                {completedCount}
                            </span>
                        </div>
                        <span className="text-xs text-muted-foreground">Completed</span>
                    </div>
                </div>

                <div className="h-12 w-px bg-border" />

                <div className="flex items-center gap-6">
                    <TaskProgress tasks={tasks} />
                    <div className="flex flex-col items-center">
                        <span className="text-lg font-semibold text-foreground">
                            {totalCount}
                        </span>
                        <span className="text-xs text-muted-foreground">Total Tasks</span>
                    </div>
                </div>
            </div>
        </Card>
    )
} 