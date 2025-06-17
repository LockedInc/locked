<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;



class SystemAdminSeeder extends Seeder
{
    public function run()
    {

        $adminUsers = [
            [
                'fname' => 'System',
                'lname' => 'Admin',
                'email' => 'systemadmin@lockedinc.com',
                'role' => 'System-Admin',
            ],
        ];

        foreach ($adminUsers as $admin) {
            $userId = DB::table('users')->insertGetId([
                'fname' => $admin['fname'],
                'lname' => $admin['lname'],
                'email' => $admin['email'],
                'role_id' => 1,
                'password' => Hash::make('password'), 
                'password_set' => true,
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

        }
    }
}