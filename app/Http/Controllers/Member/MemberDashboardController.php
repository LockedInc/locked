<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Task;
use App\Models\Meeting;
use Carbon\Carbon;
use Inertia\Inertia;

class MemberDashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $clientId = $user->client->id;

        // Get tasks assigned to this member
        $tasks = Task::where('client_id', $clientId)
            ->whereHas('users', function ($query) use ($user) {
                $query->where('users.id', $user->id);
            })
            ->with(['users' => function ($query) use ($clientId) {
                $query->where('users.client_id', $clientId)
                    ->select('users.id', 'users.name', 'users.email');
            }])
            ->get();

        // Get task statistics for this member
        $taskStats = [
            'total' => $tasks->count(),
            'completed' => $tasks->where('status', 'completed')->count(),
            'in_progress' => $tasks->where('status', 'in_progress')->count(),
            'pending' => $tasks->where('status', 'pending')->count(),
        ];

        // Get upcoming tasks for this member
        $upcomingTasks = $tasks->filter(function ($task) {
            return $task->due_date && 
                   Carbon::parse($task->due_date)->isBetween(
                       now(), 
                       now()->addDays(7)
                   );
        })->values();

        // Get meetings this member is invited to
        $meetings = Meeting::where('client_id', $clientId)
            ->whereHas('users', function ($query) use ($user) {
                $query->where('users.id', $user->id);
            })
            ->with(['users' => function ($query) use ($clientId) {
                $query->where('users.client_id', $clientId)
                    ->select('users.id', 'users.name', 'users.email');
            }])
            ->get();

        return Inertia::render('member/member-dashboard', [
            'taskStats' => $taskStats,
            'upcomingTasks' => $upcomingTasks,
            'meetings' => $meetings,
            'tasks' => $tasks
        ]);
    }
} 