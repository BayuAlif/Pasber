<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MekanikSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('mekanik')->insert([
            [
                'bengkel_id' => 1,
                'nama' => 'Ahmad Saputra',
                'email' => 'ahmad@gmail.com',
                'status' => 'available',
            ],
            [
                'bengkel_id' => 1,
                'nama' => 'Budi Santoso',
                'email' => 'budi@gmail.com',
                'status' => 'not available',
            ],
            [
                'bengkel_id' => 1,
                'nama' => 'Rizky Pratama',
                'email' => 'rizky@gmail.com',
                'status' => 'available',
            ],
            [
                'bengkel_id' => 2,
                'nama' => 'Dimas Wijaya',
                'email' => 'dimas@gmail.com',
                'status' => 'not available',
            ],
            [
                'bengkel_id' => 2,
                'nama' => 'Fajar Nugraha',
                'email' => 'fajar@gmail.com',
                'status' => 'available',
            ],
            [
                'bengkel_id' => 2,
                'nama' => 'Yoga Permana',
                'email' => 'yoga@gmail.com',
                'status' => 'not available',
            ],
            [
                'bengkel_id' => 1,
                'nama' => 'Ilham Maulana',
                'email' => 'ilham@gmail.com',
                'status' => 'available',
            ],
            [
                'bengkel_id' => 1,
                'nama' => 'Asep Kurniawan',
                'email' => 'asep@gmail.com',
                'status' => 'not available',
            ],
            [
                'bengkel_id' => 2,
                'nama' => 'Reza Hidayat',
                'email' => 'reza@gmail.com',
                'status' => 'available',
            ],
            [
                'bengkel_id' => 2,
                'nama' => 'Bayu Ramadhan',
                'email' => 'bayu@gmail.com',
                'status' => 'not available',
            ],
        ]);
    }
}
