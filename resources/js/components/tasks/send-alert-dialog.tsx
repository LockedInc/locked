import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';
import { type Task, type User as TaskUser } from '@/types/task';

interface SendAlertDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    task: Task | null;
}

const predefinedMessages = [
    {
        id: 'reminder',
        title: 'Task Reminder',
        message: 'This is a friendly reminder about your assigned task. Please review and update the status if needed.'
    },
    {
        id: 'urgent',
        title: 'Urgent Update Required',
        message: 'This task requires immediate attention. Please prioritize and provide an update on the current status.'
    },
    {
        id: 'deadline',
        title: 'Deadline Approaching',
        message: 'The deadline for this task is approaching. Please ensure completion or request an extension if needed.'
    },
    {
        id: 'status',
        title: 'Status Update Requested',
        message: 'Please provide a current status update for this task so we can track progress effectively.'
    }
];

export function SendAlertDialog({ open, onOpenChange, task }: SendAlertDialogProps) {
    const [selectedMessageType, setSelectedMessageType] = useState<string>('reminder');
    const [customMessage, setCustomMessage] = useState<string>('');

    const { data, setData, post, processing, errors, reset } = useForm({
        task_id: task?.id || 0,
        message: predefinedMessages[0]?.message || '',
        user_ids: [] as number[]
    });

    // Update form data when task changes
    useEffect(() => {
        if (task) {
            setData({
                task_id: Number(task.id),
                message: data.message,
                user_ids: task.users?.map(user => Number(user.id)) || []
            });
        }
    }, [task]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Update the form data with the current values
        setData({
            task_id: Number(task?.id) || 0, // Ensure it's a number
            message: data.message,
            user_ids: task?.users?.map(user => Number(user.id)) || [] // Ensure IDs are numbers
        });

        console.log('Sending alert with data:', {
            task_id: Number(task?.id) || 0,
            message: data.message,
            user_ids: task?.users?.map(user => Number(user.id)) || []
        });

        post('/admin/alerts/send', {
            onSuccess: () => {
                console.log('Alert sent successfully');
                reset();
                setCustomMessage('');
                setSelectedMessageType('reminder');
                onOpenChange(false);
            },
            onError: (errors) => {
                console.error('Error sending alert:', errors);
            },
        });
    };

    const handleMessageTypeChange = (value: string) => {
        setSelectedMessageType(value);
        if (value !== 'custom') {
            const predefined = predefinedMessages.find(msg => msg.id === value);
            const message = predefined?.message || '';
            setCustomMessage(message);
            setData('message', message);
        } else {
            setCustomMessage('');
            setData('message', '');
        }
    };

    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setCustomMessage(value);
        setData('message', value);
    };

    const getCurrentMessage = () => {
        return data.message;
    };

    if (!task) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Send Alert</DialogTitle>
                    <DialogDescription>
                        Send an alert to all users assigned to "{task.name}"
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Recipients</Label>
                        <div className="flex flex-wrap gap-2">
                            {task.users?.map((user: TaskUser) => (
                                <Badge key={user.id} variant="secondary" className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {user.fname} {user.lname}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Message Type</Label>
                        <RadioGroup value={selectedMessageType} onValueChange={handleMessageTypeChange}>
                            {predefinedMessages.map((message) => (
                                <div key={message.id} className="flex items-center space-x-2">
                                    <RadioGroupItem value={message.id} id={message.id} />
                                    <Label htmlFor={message.id} className="text-sm font-medium">
                                        {message.title}
                                    </Label>
                                </div>
                            ))}
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="custom" id="custom" />
                                <Label htmlFor="custom" className="text-sm font-medium">
                                    Custom Message
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            value={getCurrentMessage()}
                            onChange={handleMessageChange}
                            placeholder="Enter your alert message..."
                            className="min-h-[100px]"
                        />
                        {errors.message && (
                            <p className="text-sm text-red-600">{errors.message}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Sending...' : 'Send Alert'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
} 