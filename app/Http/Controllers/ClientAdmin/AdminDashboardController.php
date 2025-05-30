<?php

namespace App\Http\Controllers\ClientAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use App\Models\Timeline;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use App\Models\Task;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $clientId = auth()->user()->client->id;

        // Get all tasks with their users
        $tasks = Task::where('client_id', $clientId)
            ->with(['users' => function ($query) use ($clientId) {
                $query->where('users.client_id', $clientId)
                    ->select('users.id', 'users.name', 'users.email');
            }])
            ->get();

        // Get task completion statistics
        $taskStats = [
            'total' => $tasks->count(),
            'completed' => $tasks->where('status', 'completed')->count(),
            'in_progress' => $tasks->where('status', 'in_progress')->count(),
            'pending' => $tasks->where('status', 'pending')->count(),
        ];

        // Get upcoming tasks (due in the next 7 days)
        $upcomingTasks = $tasks->filter(function ($task) {
            return $task->due_date && 
                   Carbon::parse($task->due_date)->isBetween(
                       now(), 
                       now()->addDays(7)
                   );
        })->values()->toArray();

        // Get all users for the timeline
        $users = User::where('client_id', $clientId)
            ->select('id', 'name', 'email')
            ->get();

        // Get recent timeline activities
        $recentActivities = Timeline::where('origin_client_id', $clientId)
            ->with(['user:id,name'])
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('admin/admin-dashboard', [
            'taskStats' => $taskStats,
            'upcomingTasks' => $upcomingTasks,
            'users' => $users,
            'tasks' => $tasks,
            'recentActivities' => $recentActivities
        ]);
    }
}
