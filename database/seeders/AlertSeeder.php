<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Alert;
use App\Models\Task;
use App\Models\User;

class AlertSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some tasks and admins to create alerts
        $tasks = Task::with('users')->get();
        $admins = User::whereHas('role', function($query) {
            $query->where('name', 'Client-Admin');
        })->get();

        if ($tasks->isEmpty() || $admins->isEmpty()) {
            return;
        }

        $alertMessages = [
            'Task deadline approaching - please review and update status',
            'New requirements added to this task',
            'Task has been reassigned - please check your responsibilities',
            'Important update: Task priority has been changed',
            'Please provide status update for this task',
            'Task review required - please submit for approval',
            'New comments added to task discussion',
            'Task dependencies have been updated',
            'Please attend the task review meeting',
            'Task scope has been modified - review changes'
        ];

        foreach ($tasks as $task) {
            // Create 1-3 alerts for each task
            $numAlerts = rand(1, 3);
            
            for ($i = 0; $i < $numAlerts; $i++) {
                $admin = $admins->random();
                $isRead = rand(0, 1) === 1; // 50% chance of being read
                
                Alert::create([
                    'admin_id' => $admin->id,
                    'task_id' => $task->id,
                    'message' => $alertMessages[array_rand($alertMessages)],
                    'is_read' => $isRead,
                    'read_at' => $isRead ? now()->subDays(rand(1, 7)) : null,
                    'created_at' => now()->subDays(rand(1, 30)),
                    'updated_at' => now()->subDays(rand(1, 30)),
                ]);
            }
        }
    }
} 