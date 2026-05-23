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

            [
                'nama' => 'Pasber Jakarta Selatan',
                'alamat' => 'Jakarta Selatan',
                'lat' => -6.2615,
                'lng' => 106.8106,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'nama' => 'Pasber Bekasi',
                'alamat' => 'Bekasi',
                'lat' => -6.2349,
                'lng' => 106.9896,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'nama' => 'Pasber Tangerang',
                'alamat' => 'Tangerang',
                'lat' => -6.1783,
                'lng' => 106.6319,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'nama' => 'Pasber Depok',
                'alamat' => 'Depok',
                'lat' => -6.4025,
                'lng' => 106.7942,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'nama' => 'Pasber Surabaya',
                'alamat' => 'Surabaya',
                'lat' => -7.2575,
                'lng' => 112.7521,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'nama' => 'Pasber Yogyakarta',
                'alamat' => 'Yogyakarta',
                'lat' => -7.7956,
                'lng' => 110.3695,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'nama' => 'Pasber Semarang',
                'alamat' => 'Semarang',
                'lat' => -6.9667,
                'lng' => 110.4167,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'nama' => 'Pasber Bali',
                'alamat' => 'Denpasar Bali',
                'lat' => -8.6705,
                'lng' => 115.2126,
                'created_at' => now(),
                'updated_at' => now(),
            ],

        ]);
    }
}
