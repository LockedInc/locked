<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Crud\ClientAdmin\UserController as ClientAdminUserController;
use App\Http\Controllers\Crud\ClientAdmin\TaskController as ClientAdminTaskController;
use App\Http\Controllers\Crud\ClientAdmin\MeetingController as ClientAdminMeetingController;
use App\Http\Middleware\CheckRole;
use App\Http\Controllers\ClientAdmin\AdminDashboardController;
use App\Http\Controllers\Crud\Member\MemberTaskController;
use App\Http\Controllers\Crud\Member\MemberMeetingController;
use App\Http\Controllers\Member\MemberDashboardController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Client Admin Routes
    Route::middleware(['role:Client-Admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        
        // Admin Task Routes
        Route::get('tasks', [ClientAdminTaskController::class, 'index'])->name('tasks.index');
        Route::post('tasks', [ClientAdminTaskController::class, 'store'])->name('tasks.store');
        Route::get('tasks/{task}', [ClientAdminTaskController::class, 'show'])->name('tasks.show');
        Route::put('tasks/{task}', [ClientAdminTaskController::class, 'update'])->name('tasks.update');
        Route::delete('tasks/{task}', [ClientAdminTaskController::class, 'destroy'])->name('tasks.destroy');

        // Admin User Routes
        Route::get('users', [ClientAdminUserController::class, 'index'])->name('users.index');
        Route::post('users', [ClientAdminUserController::class, 'store'])->name('users.store');
        Route::get('users/{user}', [ClientAdminUserController::class, 'show'])->name('users.show');
        Route::put('users/{user}', [ClientAdminUserController::class, 'update'])->name('users.update');
        Route::delete('users/{user}', [ClientAdminUserController::class, 'destroy'])->name('users.destroy');

        // Admin Meeting Routes
        Route::get('meetings', [ClientAdminMeetingController::class, 'index'])->name('meetings.index');
        Route::post('meetings', [ClientAdminMeetingController::class, 'store'])->name('meetings.store');
        Route::get('meetings/{meeting}', [ClientAdminMeetingController::class, 'show'])->name('meetings.show');
        Route::put('meetings/{meeting}', [ClientAdminMeetingController::class, 'update'])->name('meetings.update');
        Route::delete('meetings/{meeting}', [ClientAdminMeetingController::class, 'destroy'])->name('meetings.destroy');
    });

    // Member Routes
    Route::middleware(['role:Member'])->prefix('member')->name('member.')->group(function () {
        Route::get('/dashboard', [MemberDashboardController::class, 'index'])->name('dashboard');
        
        // Member Task Routes
        Route::get('tasks', [MemberTaskController::class, 'index'])->name('tasks.index');
        Route::post('tasks', [MemberTaskController::class, 'store'])->name('tasks.store');
        Route::get('tasks/{task}', [MemberTaskController::class, 'show'])->name('tasks.show');
        Route::put('tasks/{task}', [MemberTaskController::class, 'update'])->name('tasks.update');

        // Member Meeting Routes
        Route::get('meetings', [MemberMeetingController::class, 'index'])->name('meetings.index');
        Route::get('meetings/{meeting}', [MemberMeetingController::class, 'show'])->name('meetings.show');
    });

    // Redirect root dashboard to role-specific dashboard
    Route::get('/dashboard', function () {
        return redirect()->route(request()->user()->role->name === 'Client-Admin' ? 'admin.dashboard' : 'member.dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
