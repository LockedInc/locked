<?php

namespace App\Http\Controllers\Crud\ClientAdmin;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index()
    {
        $clientId = auth()->user()->client->id;

        $tasks = Task::where('client_id', $clientId)
            ->with(['users' => function ($query) use ($clientId) {
                $query->where('users.client_id', $clientId)
                    ->select('users.id', 'users.name', 'users.email');
            }])
            ->get();

        $users = User::where('client_id', $clientId)
            ->select('id', 'name', 'email')
            ->get();

        return Inertia::render('admin/admin-task-list', [
            'tasks' => $tasks,
            'users' => $users
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'status' => 'required|in:pending,in_progress,completed',
            'priority' => 'required|in:low,medium,high',
            'due_date' => 'nullable|date',
            'users' => 'array',
            'users.*' => 'exists:users,id',
            'meeting_id' => 'nullable|exists:meetings,id'
        ]);

        $task = Task::create([
            'name' => $request->name,
            'description' => $request->description,
            'status' => $request->status,
            'priority' => $request->priority,
            'due_date' => $request->due_date,
            'client_id' => auth()->user()->client->id
        ]);
        
        if ($request->has('users')) {
            $task->users()->sync($request->users);
        }

        if ($request->has('meeting_id')) {
            $task->meetings()->sync([$request->meeting_id]);
        }

        session()->flash('success', 'Task created successfully!');
        return back();
    }   

    public function show(Task $task)
    {
        // Ensure the task belongs to the user's client
        if ($task->client_id !== auth()->user()->client->id) {
            abort(403, 'Unauthorized');
        }

        $clientId = auth()->user()->client->id;

        // Get all users for the client, for the task details page (to assign users to the task)
        $all_users = User::where('client_id', $clientId)
            ->select('id', 'name', 'email')
            ->get();

        return Inertia::render('admin/admin-task-details', [
            'task' => $task->load(['users' => function ($query) use ($clientId) {
                $query->where('users.client_id', $clientId)
                    ->select('users.id', 'users.name', 'users.email');
            }]),
            'all_users' => $all_users
        ]);
    }

    public function update(Request $request, Task $task)
    {
        // Ensure the task belongs to the user's client
        if ($task->client_id !== auth()->user()->client->id) {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'status' => 'required|in:pending,in_progress,completed',
            'priority' => 'required|in:low,medium,high',
            'due_date' => 'nullable|date',
            'users' => 'array',
            'users.*' => 'exists:users,id'
        ]);

        $task->update($request->only(['name', 'description', 'status', 'priority', 'due_date']));

        if ($request->has('users')) {
            $task->users()->sync($request->users);
        }

        session()->flash('success', 'Task updated successfully!');
        return back();
    }

    public function destroy(Task $task)
    {
        // Ensure the task belongs to the user's client
        if ($task->client_id !== auth()->user()->client->id) {
            abort(403, 'Unauthorized');
        }

        $task->delete();
        session()->flash('success', 'Task deleted successfully!');
        return redirect()->route('admin.tasks.index');
    }
    
    
       
}