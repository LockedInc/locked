import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useForm } from "@inertiajs/react"
import { User, Task } from "@/types/task"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "@/components/ui/multi-select"

interface CreateMeetingDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    users: User[]
    tasks: Task[]
}

export function CreateMeetingDialog({ open, onOpenChange, users, tasks }: CreateMeetingDialogProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        date: '',
        type: '',
        agenda_text: '',
        users: [] as number[],
        tasks: [] as number[],
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        post('/admin/meetings', {
            onSuccess: () => {
                reset()
                onOpenChange(false)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create New Meeting</DialogTitle>
                        <DialogDescription>
                            Add a new meeting and assign attendees and tasks.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-8 py-4">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    error={errors.title}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date">Date & Time</Label>
                                <Input
                                    id="date"
                                    type="datetime-local"
                                    value={data.date}
                                    onChange={e => setData('date', e.target.value)}
                                    error={errors.date}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Meeting Type</Label>
                                <Input
                                    id="type"
                                    value={data.type}
                                    onChange={e => setData('type', e.target.value)}
                                    error={errors.type}
                                    placeholder="Type (e.g. Internal, Client, etc.)"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="agenda">Agenda</Label>
                                <Input
                                    id="agenda"
                                    value={data.agenda_text}
                                    onChange={e => setData('agenda_text', e.target.value)}
                                    error={errors.agenda_text}
                                    placeholder="Meeting agenda or description"
                                />
                            </div>
                        </div>
                        <div className="space-y-6" >
                            <MultiSelect
                                items={users}
                                selectedIds={data.users}
                                onSelectionChange={(ids) => setData('users', ids)}
                                placeholder="Select users..."
                                label="Attendees"
                                error={errors.users}
                            />
                            <MultiSelect
                                items={tasks}
                                selectedIds={data.tasks}
                                onSelectionChange={(ids) => setData('tasks', ids)}
                                placeholder="Select tasks..."
                                label="Related Tasks"
                                error={errors.tasks}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} className="cursor-pointer">
                            Create Meeting
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
} 