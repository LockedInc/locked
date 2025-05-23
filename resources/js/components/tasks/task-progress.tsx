import { Task } from "@/types/task"
import { Progress } from "@/components/ui/progress"

interface TaskProgressProps {
    tasks: Task[]
}

export function TaskProgress({ tasks }: TaskProgressProps) {
    const completedCount = tasks.filter(t => t.status === 'completed').length
    const totalCount = tasks.length
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

    return (
        <div className="flex flex-col gap-2 w-40">
            <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm font-semibold text-green-600">{Math.round(progress)}%</span>
            </div>
            <Progress 
                value={progress} 
                className="h-3 bg-muted [&>div]:bg-gradient-to-r [&>div]:from-green-500 [&>div]:to-green-600 [&>div]:transition-all [&>div]:duration-500"
            />
        </div>
    )
} 