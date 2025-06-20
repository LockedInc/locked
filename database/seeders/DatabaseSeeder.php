<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
            ClientSeeder::class,
            SystemAdminSeeder::class,
            UserSeeder::class,
            TaskSeeder::class,
            AgendaSeeder::class,
            MeetingSeeder::class,
            AlertSeeder::class,
        ]);
    }
}
