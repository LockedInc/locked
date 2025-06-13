<?php

namespace App\Http\Controllers\Crud\Member;

use App\Http\Controllers\Controller;
use App\Models\Meeting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MemberMeetingController extends Controller
{
    public function index(Request $request)
    {
        $meetings = Meeting::where('client_id', auth()->user()->client_id)
            ->with(['users', 'tasks'])
            ->when($request->input('view') === 'upcoming', function ($query) {
                return $query->where('date', '>=', now());
            })
            ->orderBy('date', 'desc')
            ->get();

        return Inertia::render('member/member-meeting-list', [
            'meetings' => $meetings,
            'users' => auth()->user()->client->users,
            'tasks' => auth()->user()->client->tasks,
        ]);
    }

    public function show(Meeting $meeting)
    {
        $meeting->load(['users', 'tasks']);
        
        return Inertia::render('member/member-meeting-details', [
            'meeting' => $meeting,
            'users' => auth()->user()->client->users,
            'tasks' => auth()->user()->client->tasks,
        ]);
    }
} 