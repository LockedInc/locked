<?php

namespace App\Mail;

use App\Models\Alert;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AlertNotification extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public readonly Alert $alert,
        public readonly User $recipient,
        public readonly User $admin,
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Task Alert: ' . $this->alert->task->name,
            tags: ['task-alert', 'notification'],
            metadata: [
                'task_id' => $this->alert->task->id,
                'recipient_id' => $this->recipient->id,
                'admin_id' => $this->admin->id,
            ],
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.alert-notification',
            with: [
                'alert' => $this->alert,
                'recipient' => $this->recipient,
                'admin' => $this->admin,
                'task' => $this->alert->task,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
} 