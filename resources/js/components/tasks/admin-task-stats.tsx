import { Task } from "@/types/task"
import { TaskSummary } from "@/components/tasks/task-summary"

interface AdminTaskStatsProps {
    tasks: Task[]
}

export function AdminTaskStats({ tasks }: AdminTaskStatsProps) {
    return (
        <TaskSummary tasks={tasks} />
    )
} 