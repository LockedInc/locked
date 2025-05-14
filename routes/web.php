<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Crud\ClientAdmin\UserController as ClientAdminUserController;
use App\Http\Middleware\CheckRole;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('tasks', function () {
        return Inertia::render('tasks');
    })->name('tasks');



    Route::middleware(['role:Client-Admin'])->group(function () {
        Route::get('users', [ClientAdminUserController::class, 'index'])->name('users.index');
        Route::post('users', [ClientAdminUserController::class, 'store'])->name('users.store');
        Route::get('users/{user}', [ClientAdminUserController::class, 'show'])->name('users.show');
        Route::put('users/{user}', [ClientAdminUserController::class, 'update'])->name('users.update');
        Route::delete('users/{user}', [ClientAdminUserController::class, 'destroy'])->name('users.destroy');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
