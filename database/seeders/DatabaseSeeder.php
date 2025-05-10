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
            'name' => 'Starplot',
        ]);

        User::create([
            'name' => 'Ryan Mueller',
            'password' => Hash::make('password'),
            'email' => 'ryan@starplot.ai',
            'client_id' => $client->id,
        ]);

        User::create([
            'name' => 'Andrew McDowell',
            'password' => Hash::make('password'),
            'email' => 'andrew@starplot.ai',
            'client_id' => $client->id,
        ]);
        
    }
}
