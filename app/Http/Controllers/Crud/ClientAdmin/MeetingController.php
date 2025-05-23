<?php

namespace App\Http\Controllers\Crud\ClientAdmin;

use App\Http\Controllers\Controller;
use App\Models\Meeting;
use App\Models\User;
use App\Models\Task;
use App\Models\Agenda;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MeetingController extends Controller
{
    public function index()
    {
        $clientId = auth()->user()->client->id;

        $meetings = Meeting::where('client_id', $clientId)
            ->with(['users' => function ($query) use ($clientId) {
                $query->where('users.client_id', $clientId)
                    ->select('users.id', 'users.name', 'users.email');
            }])
            ->with(['tasks' => function ($query) use ($clientId) {
                $query->where('tasks.client_id', $clientId)
                    ->select('tasks.id', 'tasks.name', 'tasks.status')
                    ->withPivot('meeting_id');
            }])
            ->get();

        $availableUsers = User::where('client_id', $clientId)
            ->select('id', 'name', 'email')
            ->get();

        $availableTasks = Task::where('client_id', $clientId)
            ->select('id', 'name', 'status')
            ->get();

        return Inertia::render('admin/admin-meeting-list', [
            'meetings' => $meetings,
            'users' => $availableUsers,
            'tasks' => $availableTasks
        ]);
    }

    public function store(Request $request)
    {   
        $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'required|date',
            'type' => 'required|string|max:255',
            'agenda_text' => 'required|string',
            'users' => 'nullable|array',
            'users.*' => 'exists:users,id',
            'tasks' => 'nullable|array',
            'tasks.*' => 'exists:tasks,id'
        ]);
        
        $clientId = auth()->user()->client->id;

        // Create agenda first
        $agenda = Agenda::create([
            'text' => $request->agenda_text,
            'client_id' => $clientId,
        ]);

        $meeting = Meeting::create([
            'title' => $request->title,
            'date' => $request->date,
            'type' => $request->type,
            'agenda_id' => $agenda->id,
            'client_id' => $clientId,
        ]);

        if ($request->has('users')) {
            $meeting->users()->attach($request->users);
        }

        if ($request->has('tasks')) {
            $meeting->tasks()->attach($request->tasks);
        }

        session()->flash('success', 'Meeting created successfully!');
        return back();
    }

    public function show(Meeting $meeting)
    {
        $clientId = auth()->user()->client->id;

        // Ensure the meeting belongs to the client
        if ($meeting->client_id !== $clientId) {
            abort(403);
        }

        // Load the meeting with its relationships and agenda
        $meeting->load(['users' => function ($query) use ($clientId) {
            $query->where('users.client_id', $clientId)
                ->select('users.id', 'users.name', 'users.email');
        }])
        ->load(['tasks' => function ($query) use ($clientId) {
            $query->where('tasks.client_id', $clientId)
                ->select('tasks.id', 'tasks.name', 'tasks.status');
        }])
        ->load('agenda');

        // Add agenda_text to the meeting data
        $meeting->agenda_text = $meeting->agenda->text;

        // Get all available users and tasks for the form
        $availableUsers = User::where('client_id', $clientId)
            ->select('id', 'name', 'email')
            ->get();

        $availableTasks = Task::where('client_id', $clientId)
            ->select('id', 'name', 'status')
            ->get();

        return Inertia::render('admin/admin-meeting-details', [
            'meeting' => $meeting,
            'users' => $availableUsers,
            'tasks' => $availableTasks
        ]);
    }

    public function update(Request $request, Meeting $meeting)
    {
        // Ensure the meeting belongs to the client
        if ($meeting->client_id !== auth()->user()->client->id) {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'required|date',
            'type' => 'required|string|max:255',
            'agenda_text' => 'required|string',
            'users' => 'nullable|array',
            'users.*' => 'exists:users,id',
            'tasks' => 'nullable|array',
            'tasks.*' => 'exists:tasks,id'
        ]);

        // Update the meeting
        $meeting->update([
            'title' => $request->title,
            'date' => $request->date,
            'type' => $request->type,
        ]);

        // Update the agenda
        $meeting->agenda()->update([
            'text' => $request->agenda_text
        ]);

        // Sync users and tasks if they are provided
        if ($request->has('users')) {
            $meeting->users()->sync($request->users);
        }

        if ($request->has('tasks')) {
            $meeting->tasks()->sync($request->tasks);
        }

        session()->flash('success', 'Meeting updated successfully!');
        return back();
    }

    public function destroy(Meeting $meeting)
    {
        // Ensure the meeting belongs to the client
        if ($meeting->client_id !== auth()->user()->client->id) {
            abort(403, 'Unauthorized');
        }

        // Delete the meeting (this will cascade delete the agenda due to the relationship)
        $meeting->delete();

        session()->flash('success', 'Meeting deleted successfully!');
        return redirect()->route('admin.meetings.index');
    }
}