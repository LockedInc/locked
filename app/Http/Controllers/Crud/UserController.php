<?php

namespace App\Http\Controllers\Crud;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();
        return Inertia::render('Users/user-list', [
            'users' => $users
        ]);        
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'client_id' => 'required|integer',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'client_id' => $request->client_id,
        ]);

        return back();
    }
    
    public function update(Request $request, User $user)
    {   
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
        ]);
        $user->update($request->validated());
        return back();
    }

    public function show(User $user)
    {
        return Inertia::render('Users/user-details', [
            'user' => $user
        ]);
    }
    
    
}

