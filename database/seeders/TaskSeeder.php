<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Task;
use App\Models\User;
use App\Models\Client;
use App\Models\Role;

class TaskSeeder extends Seeder
{
    public function run(): void
    {

        // Get some users to assign to tasks
        $users = User::where('client_id', 1)->take(3)->get();

        // Create 5 tasks for client 1
        $tasks = [
            [
                'name' => 'Implement User Authentication',
                'description' => 'Set up secure user authentication system with JWT tokens',
                'status' => 'in_progress',
                'priority' => 'high',
                'due_date' => now()->addDays(7),
                'client_id' => 1,
            ],
            [
                'name' => 'Design Database Schema',
                'description' => 'Create and optimize database schema for the application',
                'status' => 'completed',
                'priority' => 'high',
                'due_date' => now()->subDays(2),
                'client_id' => 1,
            ],
            [
                'name' => 'Create API Documentation',
                'description' => 'Write comprehensive API documentation for all endpoints',
                'status' => 'pending',
                'priority' => 'medium',
                'due_date' => now()->addDays(14),
                'client_id' => 1,
            ],
            [
                'name' => 'Implement Task Management',
                'description' => 'Build task management system with CRUD operations',
                'status' => 'in_progress',
                'priority' => 'high',
                'due_date' => now()->addDays(5),
                'client_id' => 1,
            ],
            [
                'name' => 'Setup CI/CD Pipeline',
                'description' => 'Configure continuous integration and deployment pipeline',
                'status' => 'pending',
                'priority' => 'medium',
                'due_date' => now()->addDays(10),
                'client_id' => 1,
            ],
            [
                'name' => 'Implement the new test',
                'description' => 'Build the new test',
                'status' => 'in_progress',
                'priority' => 'high',
                'due_date' => now()->addDays(5),
                'client_id' => 1,
            ],
            [
                'name' => 'Implement New Object Detection Model',
                'description' => 'Build object detection model with YOLOv5',
                'status' => 'in_progress',
                'priority' => 'high',
                'due_date' => now()->addDays(5),
                'client_id' => 1,
            ], 
            [
                'name' => 'Start New Project',
                'description' => 'Start new project with Laravel and React',
                'status' => 'in_progress',
                'priority' => 'high',
                'due_date' => now()->addDays(5),
                'client_id' => 1,
            ], 
            [
                'name' => 'Diagnose and Fix Issue',
                'description' => 'Diagnose and fix issue with Laravel and React',
                'status' => 'in_progress',
                'priority' => 'high',
                'due_date' => now()->addDays(5),
                'client_id' => 1,
            ],

            [
                'name' => 'Transfer Data to New Database',
                'description' => 'Transfer data to new database',
                'status' => 'in_progress',
                'priority' => 'high',
                'due_date' => now()->addDays(5),
                'client_id' => 1,
            ],
        ];

        foreach ($tasks as $taskData) {
            $task = Task::create($taskData);
            
            // Assign 2 random users to each task
            $task->users()->attach(
                $users->random(2)->pluck('id')->toArray(),
                ['created_at' => now(), 'updated_at' => now()]
            );
        }
    }
} 