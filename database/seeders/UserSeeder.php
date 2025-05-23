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
            'email' => 'ryan@equippers.com',
            'password_set' => true,
            'email_verified_at' => now(),
            'client_id' => 1,
            'role_id' => 2,

        ]);

        User::create([
            # client member
            'name' => 'Andrew McDowell',
            'password' => Hash::make('password'),
            'email' => 'andrew@equippers.com',
            'password_set' => true,
            'email_verified_at' => now(),
            'client_id' => 1,
            'role_id' => 3,
        ]);

        User::create([
            # client member
            'name' => 'Allison Port',
            'password' => Hash::make('password'),
            'email' => 'allison@equippers.com',
            'password_set' => true,
            'email_verified_at' => now(),
            'client_id' => 1,
            'role_id' => 3,
        ]);

        User::create([
            # client member
            'name' => 'George Kalafatis',
            'password' => Hash::make('password'),
            'email' => 'george@equippers.com',
            'password_set' => true,
            'email_verified_at' => now(),
            'client_id' => 1,
            'role_id' => 3,
        ]);

        User::create([
            # client member
            'name' => 'John Doe',
            'password' => Hash::make('password'),
            'email' => 'john@equippers.com',
            'password_set' => true,
            'email_verified_at' => now(),
            'client_id' => 1,
            'role_id' => 3,
        ]);
    }
}
