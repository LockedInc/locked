<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Crud\ClientAdmin\UserController as ClientAdminUserController;
use App\Http\Controllers\Crud\ClientAdmin\TaskController as ClientAdminTaskController;
use App\Http\Controllers\Crud\ClientAdmin\MeetingController as ClientAdminMeetingController;
use App\Http\Middleware\CheckRole;
use App\Http\Controllers\ClientAdmin\AdminDashboardController;
use App\Http\Controllers\Member\MemberDashboardController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified',  'role:Client-Admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])
        ->name('dashboard');

    // Admin Task Routes
    Route::get('admin/tasks', [ClientAdminTaskController::class, 'index'])->name('admin.tasks.index');
    Route::post('admin/tasks', [ClientAdminTaskController::class, 'store'])->name('admin.tasks.store');
    Route::get('admin/tasks/{task}', [ClientAdminTaskController::class, 'show'])->name('admin.tasks.show');
    Route::put('admin/tasks/{task}', [ClientAdminTaskController::class, 'update'])->name('admin.tasks.update');
    Route::delete('admin/tasks/{task}', [ClientAdminTaskController::class, 'destroy'])->name('admin.tasks.destroy');

    // Admin User Routes
    Route::get('admin/users', [ClientAdminUserController::class, 'index'])->name('admin.users.index');
    Route::post('admin/users', [ClientAdminUserController::class, 'store'])->name('admin.users.store');
    Route::get('admin/users/{user}', [ClientAdminUserController::class, 'show'])->name('admin.users.show');
    Route::put('admin/users/{user}', [ClientAdminUserController::class, 'update'])->name('admin.users.update');
    Route::delete('admin/users/{user}', [ClientAdminUserController::class, 'destroy'])->name('admin.users.destroy');

    // Admin Meeting Routes
    Route::get('admin/meetings', [ClientAdminMeetingController::class, 'index'])->name('admin.meetings.index');
    Route::post('admin/meetings', [ClientAdminMeetingController::class, 'store'])->name('admin.meetings.store');
    Route::get('admin/meetings/{meeting}', [ClientAdminMeetingController::class, 'show'])->name('admin.meetings.show');
    Route::put('admin/meetings/{meeting}', [ClientAdminMeetingController::class, 'update'])->name('admin.meetings.update');
    Route::delete('admin/meetings/{meeting}', [ClientAdminMeetingController::class, 'destroy'])->name('admin.meetings.destroy');
});

// Route::middleware(['auth', 'verified', 'role:Member'])->group(function () {
//     Route::get('member/tasks', [MemberTaskController::class, 'index'])->name('member.tasks.index');
// });

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
