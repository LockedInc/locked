<?php 

namespace App\Http\Controllers\Crud\Member;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\TimelineMessageService;

class MemberTaskController extends Controller
{
    public function index(Request $request)
    {
        $userId = auth()->id();
        $clientId = auth()->user()->client->id;

        // Base query for tasks
        $query = Task::where('client_id', $clientId)
            ->with(['users' => function ($query) use ($clientId) {
                $query->where('users.client_id', $clientId)
                    ->select('users.id', 'users.fname', 'users.mname', 'users.lname', 'users.email');
            }]);

        // If view is 'assigned', only show tasks assigned to the user
        if ($request->query('view') !== 'all') {
            $query->whereHas('users', function ($query) use ($userId) {
                $query->where('users.id', $userId);
            });
        }

        $tasks = $query->get();

        $users = User::where('client_id', $clientId)
            ->select('id', 'fname', 'mname', 'lname', 'email')
            ->get();

        return Inertia::render('member/member-task-list', [
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

        $timelineMessageService = new TimelineMessageService();
        $timelineMessageService->taskCreated(auth()->user(), $task->name, 'Task', $task->id);

        session()->flash('success', 'Task created successfully!');
        return back();
    }

    public function show(Task $task)
    {
        // Ensure the task belongs to the user's client and the user is assigned to it
        if ($task->client_id !== auth()->user()->client->id || 
            !$task->users()->where('users.id', auth()->id())->exists()) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('member/member-task-details', [
            'task' => $task->load(['users' => function ($query) {
                $query->where('users.client_id', auth()->user()->client->id)
                    ->select('users.id', 'users.fname', 'users.mname', 'users.lname', 'users.email');
            }])
        ]);
    }

    public function update(Request $request, Task $task)
    {
        // Ensure the task belongs to the user's client and the user is assigned to it
        if ($task->client_id !== auth()->user()->client->id || 
            !$task->users()->where('users.id', auth()->id())->exists()) {
            abort(403, 'Unauthorized');
        }

        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string|max:255',
            'status' => 'sometimes|required|in:pending,in_progress,completed',
            'priority' => 'sometimes|required|in:low,medium,high',
            'due_date' => 'sometimes|nullable|date',
            'users' => 'sometimes|array',
            'users.*' => 'exists:users,id'
        ]);

        $originalValues = $task->getOriginal();
        $task->update($validatedData);

        $timelineMessageService = new TimelineMessageService();
        $timelineMessageService->taskUpdated(auth()->user(), $task->name, 'Task', $task->id, $originalValues, $validatedData);

        session()->flash('success', 'Task updated successfully!');
        return back();
    }
} 