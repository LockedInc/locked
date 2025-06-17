<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\Meeting;
use App\Models\User;
use App\Models\Task;

class MeetingSeeder extends Seeder
{
    public function run()
    {
        // Get some users to assign to tasks
        $users = User::where('client_id', 1)->take(5)->get();

        // Get some tasks to assign to meetings
        $tasks = Task::where('client_id', 1)->take(5)->get();

        $meetings = [
            [
                'title' => 'Meeting 1',
                'date' => Carbon::now(),
                'type' => 'Online Meeting ',
                'agenda_id' => 1,
                'client_id' => 1,
            ],
            [
                'title' => 'Meeting 2',
                'date' => Carbon::now(),
                'type' => 'In-Person Meeting',
                'agenda_id' => 2,
                'client_id' => 1,
            ],
            [
                'title' => 'Meeting 3',
                'date' => Carbon::now(),
                'type' => 'In-Person Meeting',
                'agenda_id' => 3,
                'client_id' => 1,
            ],
        ];

        foreach ($meetings as $meeting) {
            $meeting = Meeting::create($meeting);

            $meeting->users()->attach(
                $users->random(2)->pluck('id')->toArray(),
                ['created_at' => now(), 'updated_at' => now()]
            );

            $meeting->tasks()->attach(
                $tasks->random(2)->pluck('id')->toArray(),
                ['created_at' => now(), 'updated_at' => now()]
            );
        }
    }
}
