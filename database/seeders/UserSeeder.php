<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        
        User::create([
            # client admin
            'name' => 'Ryan Mueller',
            'password' => Hash::make('password'),
            'email' => 'ryan@starplot.ai',
            'password_set' => true,
            'email_verified_at' => now(),
            'client_id' => 1,
            'role_id' => 2,

        ]);

        User::create([
            # client member
            'name' => 'Andrew McDowell',
            'password' => Hash::make('password'),
            'email' => 'andrew@starplot.ai',
            'password_set' => true,
            'email_verified_at' => now(),
            'client_id' => 1,
            'role_id' => 3,
        ]);
    }
}
