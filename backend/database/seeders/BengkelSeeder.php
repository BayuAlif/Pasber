<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BengkelSeeder extends Seeder
{
            public function run(): void
            {
                DB::table('bengkel')->insert([

            [
                'nama' => 'Pasber Cimahi',

                'alamat' => 'Cimahi',

                'lat' => -6.8722,

                'lng' => 107.5420,

                'created_at' => now(),

                'updated_at' => now(),
            ],

            [
                'nama' => 'Pasber Bandung',

                'alamat' => 'Bandung',

                'lat' => -6.9147,

                'lng' => 107.6098,

                'created_at' => now(),

                'updated_at' => now(),
            ],
        ]);
    }
}
