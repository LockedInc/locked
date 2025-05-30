<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class TimelineMessage
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct($user, $message, $subject_type, $subject_id)
    {
        Log::info('reached event');
        $this->user = $user;
        $this->message = $message;
        $this->origin_client_id = $user->client_id;
        $this->subject_type = $subject_type;
        $this->subject_id = $subject_id;
    }
} 