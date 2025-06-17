<?php

namespace App\Listeners;

use App\Events\TimelineMessage;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Models\Timeline;
use Illuminate\Support\Facades\Log;

class UpdateTimelineTable
{

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(TimelineMessage $event): void
    {
        Log::info('UpdateTimelineTable listener handling event');
        Timeline::create([
            'user_id' => $event->user->id,
            'subject_type' => $event->subject_type,
            'subject_id' => $event->subject_id,
            'origin_client_id' => $event->origin_client_id,
            'message' => $event->message,
        ]);
    }
} 