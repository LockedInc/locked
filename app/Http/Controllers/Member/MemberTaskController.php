<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MemberTaskController extends Controller
{
    public function index()
    {
        $userId = auth()->id();
        $clientId = auth()->user()->client->id;

        $tasks = Task::where('client_id', $clientId)
            ->whereHas('users', function ($query) use ($userId) {
                $query->where('users.id', $userId);
            })
            ->with(['users' => function ($query) use ($clientId) {
                $query->where('users.client_id', $clientId)
                    ->select('users.id', 'users.name', 'users.email');
            }])
            ->get();

        return Inertia::render('user/user-task-list', [
            'tasks' => $tasks
        ]);
    }

    public function show(Task $task)
    {
        $userId = auth()->id();
        $clientId = auth()->user()->client->id;

        // Ensure the task belongs to the client and is assigned to the user
        if ($task->client_id !== $clientId || !$task->users->contains('id', $userId)) {
            abort(403, 'Unauthorized');
        }

        $task->load(['users' => function ($query) use ($clientId) {
            $query->where('users.client_id', $clientId)
                ->select('users.id', 'users.name', 'users.email');
        }]);

        return Inertia::render('user/user-task-details', [
            'task' => $task
        ]);
    }

    public function update(Request $request, Task $task)
    {
        $userId = auth()->id();
        $clientId = auth()->user()->client->id;

        // Ensure the task belongs to the client and is assigned to the user
        if ($task->client_id !== $clientId || !$task->users->contains('id', $userId)) {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'status' => 'required|in:pending,in_progress,completed',
        ]);

        $task->update([
            'status' => $request->status
        ]);

        session()->flash('success', 'Task updated successfully!');
        return back();
    }
} 