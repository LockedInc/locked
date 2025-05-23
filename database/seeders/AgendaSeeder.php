<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\Agenda;

class AgendaSeeder extends Seeder
{
    public function run()
    {
        Agenda::create([
            'text' => 'Agenda 1',
        ]);

        Agenda::create([
            'text' => 'Agenda 2',
        ]);

        Agenda::create([
            'text' => 'Agenda 3',
        ]);
    }
}
