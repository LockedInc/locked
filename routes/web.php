<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Crud\ClientAdmin\UserController as ClientAdminUserController;
use App\Http\Controllers\Crud\ClientAdmin\TaskController as ClientAdminTaskController;
use App\Http\Controllers\Crud\ClientAdmin\MeetingController as ClientAdminMeetingController;
use App\Http\Middleware\CheckRole;
use App\Http\Controllers\ClientAdmin\AdminDashboardController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])
        ->name('dashboard');

    // Admin Task Routes
    Route::middleware(['role:Client-Admin'])->group(function () {
        Route::get('tasks', [ClientAdminTaskController::class, 'index'])->name('admin.tasks.index');
        Route::post('tasks', [ClientAdminTaskController::class, 'store'])->name('admin.tasks.store');
        Route::get('tasks/{task}', [ClientAdminTaskController::class, 'show'])->name('admin.tasks.show');
        Route::put('tasks/{task}', [ClientAdminTaskController::class, 'update'])->name('admin.tasks.update');
        Route::delete('tasks/{task}', [ClientAdminTaskController::class, 'destroy'])->name('admin.tasks.destroy');
    });

    // Admin User Routes
    Route::middleware(['role:Client-Admin'])->group(function () {
        Route::get('users', [ClientAdminUserController::class, 'index'])->name('admin.users.index');
        Route::post('users', [ClientAdminUserController::class, 'store'])->name('admin.users.store');
        Route::get('users/{user}', [ClientAdminUserController::class, 'show'])->name('admin.users.show');
        Route::put('users/{user}', [ClientAdminUserController::class, 'update'])->name('admin.users.update');
        Route::delete('users/{user}', [ClientAdminUserController::class, 'destroy'])->name('admin.users.destroy');
    });

    // Admin Meeting Routes
    Route::middleware(['role:Client-Admin'])->group(function () {
        Route::get('meetings', [ClientAdminMeetingController::class, 'index'])->name('admin.meetings.index');
        Route::post('meetings', [ClientAdminMeetingController::class, 'store'])->name('admin.meetings.store');
        Route::get('meetings/{meeting}', [ClientAdminMeetingController::class, 'show'])->name('admin.meetings.show');
        Route::put('meetings/{meeting}', [ClientAdminMeetingController::class, 'update'])->name('admin.meetings.update');
        Route::delete('meetings/{meeting}', [ClientAdminMeetingController::class, 'destroy'])->name('admin.meetings.destroy');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
