<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Client;
use Illuminate\Support\Facades\Hash;
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $client = Client::create([
            'name' => 'Test Client',
        ]);

        User::create([
            'name' => 'Test User',
            'password' => Hash::make('password'),
            'email' => 'test@example.com',
            'client_id' => $client->id,
        ]);
    }
}
