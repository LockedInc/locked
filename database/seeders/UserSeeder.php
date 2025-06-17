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
                'fname' => 'Ryan',
                'mname' => 'Philip',
                'lname' => 'Mueller',
                'email' => 'ryan@equippers.com',
                'role_id' => 2, // Client-Admin
            ],
            [
                'fname' => 'Andrew',
                'lname' => 'McDowell',
                'email' => 'andrew@equippers.com',
                'role_id' => 3, // Member
            ],
            [
                'fname' => 'Allison',
                'mname' => 'Joyce',
                'lname' => 'Port',
                'email' => 'allison@equippers.com',
                'role_id' => 3,
            ],
            [
                'fname' => 'George',
                'lname' => 'Kalafatis',
                'email' => 'george@equippers.com',
                'role_id' => 3,
            ],
            [
                'fname' => 'John',
                'lname' => 'Doe',
                'email' => 'john@equippers.com',
                'role_id' => 3,
            ],
            [
                'fname' => 'Sarah',
                'lname' => 'Johnson',
                'email' => 'sarah@equippers.com',
                'role_id' => 3,
            ],
            [
                'fname' => 'Michael',
                'lname' => 'Chen',
                'email' => 'michael@equippers.com',
                'role_id' => 3,
            ],
            [
                'fname' => 'Emma',
                'lname' => 'Wilson',
                'email' => 'emma@equippers.com',
                'role_id' => 3,
            ],
            [
                'fname' => 'David',
                'lname' => 'Brown',
                'email' => 'david@equippers.com',
                'role_id' => 3,
            ],
            [
                'fname' => 'Lisa',
                'lname' => 'Anderson',
                'email' => 'lisa@equippers.com',
                'role_id' => 3,
            ],
            [
                'fname' => 'James',
                'lname' => 'Taylor',
                'email' => 'james@equippers.com',
                'role_id' => 3,
            ],
            [
                'fname' => 'Rachel',
                'lname' => 'Martinez',
                'email' => 'rachel@equippers.com',
                'role_id' => 3,
            ],
            [
                'fname' => 'Thomas',
                'lname' => 'White',
                'email' => 'thomas@equippers.com',
                'role_id' => 3,
            ],
            [
                'fname' => 'Olivia',
                'lname' => 'Lee',
                'email' => 'olivia@equippers.com',
                'role_id' => 3,
            ],
            [
                'fname' => 'Daniel',
                'lname' => 'Kim',
                'email' => 'daniel@equippers.com',
                'role_id' => 3,
            ],
            [
                'fname' => 'Sophia',
                'lname' => 'Garcia',
                'email' => 'sophia@equippers.com',
                'role_id' => 3,
            ],
            [
                'fname' => 'William',
                'lname' => 'Clark',
                'email' => 'william@equippers.com',
                'role_id' => 3,
            ],
            [
                'fname' => 'Ava',
                'lname' => 'Rodriguez',
                'email' => 'ava@equippers.com',
                'role_id' => 3,
            ],
            [
                'fname' => 'Ethan',
                'lname' => 'Moore',
                'email' => 'ethan@equippers.com',
                'role_id' => 3,
            ],
            [
                'fname' => 'Isabella',
                'lname' => 'Thompson',
                'email' => 'isabella@equippers.com',
                'role_id' => 3,
            ],
        ];

        foreach ($users as $userData) {
            User::create([
                'fname' => $userData['fname'],
                'mname' => $userData['mname'] ?? null,
                'lname' => $userData['lname'],
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
