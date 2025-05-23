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
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect, useCallback } from "react"
import { useForm } from "@inertiajs/react"
import { TaskStatus, TaskPriority, User } from "@/types/task"
import { Badge } from "@/components/ui/badge"

interface CreateTaskDialogProps {
    users: User[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateTaskDialog({ users, open, onOpenChange }: CreateTaskDialogProps) {
    const [userPopoverOpen, setUserPopoverOpen] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        status: 'pending' as TaskStatus,
        priority: 'medium' as TaskPriority,
        due_date: '',
        users: [] as number[]
    });

    // Update filtered users when users prop changes
    useEffect(() => {
        setFilteredUsers(users);
    }, [users]);

    const handleUserSearch = useCallback((searchTerm: string) => {
        const filtered = users.filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [users]);

    const handleUserSelect = useCallback((userId: number) => {
        const currentUsers = [...data.users];
        const index = currentUsers.indexOf(userId);
        
        if (index === -1) {
            currentUsers.push(userId);
        } else {
            currentUsers.splice(index, 1);
        }
        
        setData('users', currentUsers);
    }, [data.users, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/tasks', {
            onSuccess: () => {
                reset();
                onOpenChange(false);
            }
        });
    };

    const handleDropdownToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setUserPopoverOpen(prev => !prev);
    };

    const handleDropdownClick = (e: React.MouseEvent) => {
        e.stopPropagation();
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

                            <div className="grid grid-cols-2 gap-4">
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
                            <div className="space-y-2">
                                <Label>Assign Users</Label>
                                <div className="relative">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        role="combobox"
                                        className="w-full justify-between"
                                        onClick={handleDropdownToggle}
                                    >
                                        {data.users.length > 0
                                            ? `${data.users.length} users selected`
                                            : "Select users..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                    {userPopoverOpen && (
                                        <div 
                                            className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg"
                                            onClick={handleDropdownClick}
                                        >
                                            <div className="p-2 border-b">
                                                <Input 
                                                    type="text"
                                                    placeholder="Search users..." 
                                                    className="border-0 focus-visible:ring-0"
                                                    onClick={handleDropdownClick}
                                                    onChange={(e) => handleUserSearch(e.target.value)}
                                                />
                                            </div>
                                            <div className="max-h-[300px] overflow-auto">
                                                {(filteredUsers.length > 0 ? filteredUsers : users).map((user) => (
                                                    <div
                                                        key={user.id}
                                                        className="flex items-center px-4 py-2 hover:bg-accent cursor-pointer"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handleUserSelect(user.id);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                data.users.includes(user.id) ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {user.name}
                                                    </div>
                                                ))}
                                                {filteredUsers.length === 0 && (
                                                    <div className="px-4 py-2 text-sm text-muted-foreground">
                                                        No users found.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {data.users.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {users
                                            .filter(user => data.users.includes(user.id))
                                            .map(user => (
                                                <Badge key={user.id} variant="secondary">
                                                    {user.name}
                                                </Badge>
                                            ))}
                                    </div>
                                )}
                                {errors.users && (
                                    <p className="text-sm text-red-500">{errors.users}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            Create Task
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
