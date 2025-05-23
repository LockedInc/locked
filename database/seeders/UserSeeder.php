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
        $users = [
            [
                'name' => 'Ryan Mueller',
                'email' => 'ryan@equippers.com',
                'role_id' => 2, // Client-Admin
            ],
            [
                'name' => 'Andrew McDowell',
                'email' => 'andrew@equippers.com',
                'role_id' => 3, // Member
            ],
            [
                'name' => 'Allison Port',
                'email' => 'allison@equippers.com',
                'role_id' => 3,
            ],
            [
                'name' => 'George Kalafatis',
                'email' => 'george@equippers.com',
                'role_id' => 3,
            ],
            [
                'name' => 'John Doe',
                'email' => 'john@equippers.com',
                'role_id' => 3,
            ],
            [
                'name' => 'Sarah Johnson',
                'email' => 'sarah@equippers.com',
                'role_id' => 3,
            ],
            [
                'name' => 'Michael Chen',
                'email' => 'michael@equippers.com',
                'role_id' => 3,
            ],
            [
                'name' => 'Emma Wilson',
                'email' => 'emma@equippers.com',
                'role_id' => 3,
            ],
            [
                'name' => 'David Brown',
                'email' => 'david@equippers.com',
                'role_id' => 3,
            ],
            [
                'name' => 'Lisa Anderson',
                'email' => 'lisa@equippers.com',
                'role_id' => 3,
            ],
            [
                'name' => 'James Taylor',
                'email' => 'james@equippers.com',
                'role_id' => 3,
            ],
            [
                'name' => 'Rachel Martinez',
                'email' => 'rachel@equippers.com',
                'role_id' => 3,
            ],
            [
                'name' => 'Thomas White',
                'email' => 'thomas@equippers.com',
                'role_id' => 3,
            ],
            [
                'name' => 'Olivia Lee',
                'email' => 'olivia@equippers.com',
                'role_id' => 3,
            ],
            [
                'name' => 'Daniel Kim',
                'email' => 'daniel@equippers.com',
                'role_id' => 3,
            ],
            [
                'name' => 'Sophia Garcia',
                'email' => 'sophia@equippers.com',
                'role_id' => 3,
            ],
            [
                'name' => 'William Clark',
                'email' => 'william@equippers.com',
                'role_id' => 3,
            ],
            [
                'name' => 'Ava Rodriguez',
                'email' => 'ava@equippers.com',
                'role_id' => 3,
            ],
            [
                'name' => 'Ethan Moore',
                'email' => 'ethan@equippers.com',
                'role_id' => 3,
            ],
            [
                'name' => 'Isabella Thompson',
                'email' => 'isabella@equippers.com',
                'role_id' => 3,
            ],
        ];

        foreach ($users as $userData) {
            User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => Hash::make('password'),
                'password_set' => true,
                'email_verified_at' => now(),
                'client_id' => 1,
                'role_id' => $userData['role_id'],
            ]);
        }
    }
}
