import { Task } from "@/types/task"
import { TaskSummary } from "@/components/tasks/task-summary"

interface MemberTaskStatsProps {
    tasks: Task[]
}

export function MemberTaskStats({ tasks }: MemberTaskStatsProps) {
    return (
        <TaskSummary tasks={tasks} />
    )
} 