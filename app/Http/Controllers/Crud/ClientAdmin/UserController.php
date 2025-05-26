<?php

namespace App\Http\Controllers\Crud\ClientAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;


class UserController extends Controller
{
    public function index()
    {
        $users = User::where('client_id', auth()->user()->client_id)
            ->with('role:id,name')
            ->get();
        return Inertia::render('admin/admin-user-list', [
            'users' => $users,
            'roles' => Role::all(['id', 'name'])->except(1)//exclude the system admin role
        ]);        
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'client_id' => 'required|integer',
            'role_id' => 'required|integer|exists:roles,id',
        ]);

        if ($request->client_id !== auth()->user()->client_id) {
            abort(403, 'Unauthorized');
        }

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'client_id' => $request->client_id,
            'role_id' => $request->role_id,
        ]);
        session()->flash('success', 'User created successfully!');
        return back();
    }
    
    public function update(Request $request, User $user)
    {   
        if ($user->client_id !== auth()->user()->client_id) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
        ]);


        $user->update($validated);
        session()->flash('success', 'User updated successfully!');
        return back();
    }

    public function show(User $user, Request $request)
    {
        if ($user->client_id !== auth()->user()->client_id) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('admin/admin-user-details', [
            'user' => $user,
            'from_meeting' => $request->query('from_meeting')
        ]);
    }

    public function destroy(User $user)
    {
        $user->delete();
        session()->flash('success', 'User deleted successfully!');
        return redirect()->route('admin.users.index');
    }
    
    
}

