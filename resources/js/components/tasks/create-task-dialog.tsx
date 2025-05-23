import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "@inertiajs/react"
import { TaskStatus, TaskPriority, User } from "@/types/task"
import { MultiSelect } from "@/components/ui/multi-select"

interface CreateTaskDialogProps {
    users: User[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateTaskDialog({ users, open, onOpenChange }: CreateTaskDialogProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        status: 'pending' as TaskStatus,
        priority: 'medium' as TaskPriority,
        due_date: '',
        users: [] as number[]
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/tasks', {
            onSuccess: () => {
                reset();
                onOpenChange(false);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                    <DialogDescription>
                        Add a new task to your project. Fill in the details below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Task Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    error={errors.name}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    error={errors.description}
                                    className="min-h-[100px]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(value) => setData('status', value as TaskStatus)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="priority">Priority</Label>
                                <Select
                                    value={data.priority}
                                    onValueChange={(value) => setData('priority', value as TaskPriority)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="due_date">Due Date</Label>
                                <Input
                                    type="date"
                                    id="due_date"
                                    value={data.due_date}
                                    onChange={e => setData('due_date', e.target.value)}
                                    error={errors.due_date}
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <MultiSelect
                                items={users}
                                selectedIds={data.users}
                                onSelectionChange={(ids) => setData('users', ids)}
                                placeholder="Select users..."
                                label="Assign Users"
                                error={errors.users}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} className="cursor-pointer">
                            Create Task
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
