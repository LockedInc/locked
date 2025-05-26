<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Task;
use App\Models\User;
use Inertia\Inertia;
use Carbon\Carbon;

class MemberDashboardController extends Controller
{
    public function index()
    {
        $userId = auth()->id();
        $clientId = auth()->user()->client->id;

        // Get tasks assigned to the current user
        $tasks = Task::where('client_id', $clientId)
            ->whereHas('users', function ($query) use ($userId) {
                $query->where('users.id', $userId);
            })
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
        })->values();

        return Inertia::render('user/user-dashboard', [
            'taskStats' => $taskStats,
            'upcomingTasks' => $upcomingTasks,
            'tasks' => $tasks
        ]);
    }
} 