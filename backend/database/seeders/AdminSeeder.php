<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->insert([

            // =========================
            // PASBER CIMAHI
            // =========================
            [
                'name' => 'Admin Cimahi 1',
                'email' => 'cimahi1@pasber.com',
                'password' => Hash::make('Cmh#1234'),
                'role' => 'admin',
                'bengkel_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'name' => 'Admin Cimahi 2',
                'email' => 'cimahi2@pasber.com',
                'password' => Hash::make('Cmh@5678'),
                'role' => 'admin',
                'bengkel_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'name' => 'Admin Cimahi 3',
                'email' => 'cimahi3@pasber.com',
                'password' => Hash::make('Cmh!9012'),
                'role' => 'admin',
                'bengkel_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // =========================
            // PASBER BANDUNG
            // =========================
            [
                'name' => 'Admin Bandung 1',
                'email' => 'bandung1@pasber.com',
                'password' => Hash::make('Bdg#1234'),
                'role' => 'admin',
                'bengkel_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'name' => 'Admin Bandung 2',
                'email' => 'bandung2@pasber.com',
                'password' => Hash::make('Bdg@5678'),
                'role' => 'admin',
                'bengkel_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'name' => 'Admin Bandung 3',
                'email' => 'bandung3@pasber.com',
                'password' => Hash::make('Bdg!9012'),
                'role' => 'admin',
                'bengkel_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // =========================
            // PASBER JAKARTA SELATAN
            // =========================
            [
                'name' => 'Admin Jaksel 1',
                'email' => 'jaksel1@pasber.com',
                'password' => Hash::make('Jks#1234'),
                'role' => 'admin',
                'bengkel_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'name' => 'Admin Jaksel 2',
                'email' => 'jaksel2@pasber.com',
                'password' => Hash::make('Jks@5678'),
                'role' => 'admin',
                'bengkel_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'name' => 'Admin Jaksel 3',
                'email' => 'jaksel3@pasber.com',
                'password' => Hash::make('Jks!9012'),
                'role' => 'admin',
                'bengkel_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // =========================
            // PASBER BEKASI
            // =========================
            [
                'name' => 'Admin Bekasi 1',
                'email' => 'bekasi1@pasber.com',
                'password' => Hash::make('Bks#1234'),
                'role' => 'admin',
                'bengkel_id' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'name' => 'Admin Bekasi 2',
                'email' => 'bekasi2@pasber.com',
                'password' => Hash::make('Bks@5678'),
                'role' => 'admin',
                'bengkel_id' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'name' => 'Admin Bekasi 3',
                'email' => 'bekasi3@pasber.com',
                'password' => Hash::make('Bks!9012'),
                'role' => 'admin',
                'bengkel_id' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // =========================
            // PASBER TANGERANG
            // =========================
            [
                'name' => 'Admin Tangerang 1',
                'email' => 'tangerang1@pasber.com',
                'password' => Hash::make('Tgr#1234'),
                'role' => 'admin',
                'bengkel_id' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'name' => 'Admin Tangerang 2',
                'email' => 'tangerang2@pasber.com',
                'password' => Hash::make('Tgr@5678'),
                'role' => 'admin',
                'bengkel_id' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'name' => 'Admin Tangerang 3',
                'email' => 'tangerang3@pasber.com',
                'password' => Hash::make('Tgr!9012'),
                'role' => 'admin',
                'bengkel_id' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // =========================
            // PASBER DEPOK
            // =========================
            [
                'name' => 'Admin Depok 1',
                'email' => 'depok1@pasber.com',
                'password' => Hash::make('Dpk#1234'),
                'role' => 'admin',
                'bengkel_id' => 6,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'name' => 'Admin Depok 2',
                'email' => 'depok2@pasber.com',
                'password' => Hash::make('Dpk@5678'),
                'role' => 'admin',
                'bengkel_id' => 6,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'name' => 'Admin Depok 3',
                'email' => 'depok3@pasber.com',
                'password' => Hash::make('Dpk!9012'),
                'role' => 'admin',
                'bengkel_id' => 6,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // =========================
            // PASBER SURABAYA
            // =========================
            [
                'name' => 'Admin Surabaya 1',
                'email' => 'surabaya1@pasber.com',
                'password' => Hash::make('Sby#1234'),
                'role' => 'admin',
                'bengkel_id' => 7,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'name' => 'Admin Surabaya 2',
                'email' => 'surabaya2@pasber.com',
                'password' => Hash::make('Sby@5678'),
                'role' => 'admin',
                'bengkel_id' => 7,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'name' => 'Admin Surabaya 3',
                'email' => 'surabaya3@pasber.com',
                'password' => Hash::make('Sby!9012'),
                'role' => 'admin',
                'bengkel_id' => 7,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // =========================
            // PASBER YOGYAKARTA
            // =========================
            [
                'name' => 'Admin Jogja 1',
                'email' => 'jogja1@pasber.com',
                'password' => Hash::make('Jgj#1234'),
                'role' => 'admin',
                'bengkel_id' => 8,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'name' => 'Admin Jogja 2',
                'email' => 'jogja2@pasber.com',
                'password' => Hash::make('Jgj@5678'),
                'role' => 'admin',
                'bengkel_id' => 8,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'name' => 'Admin Jogja 3',
                'email' => 'jogja3@pasber.com',
                'password' => Hash::make('Jgj!9012'),
                'role' => 'admin',
                'bengkel_id' => 8,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // =========================
            // PASBER SEMARANG
            // =========================
            [
                'name' => 'Admin Semarang 1',
                'email' => 'semarang1@pasber.com',
                'password' => Hash::make('Smg#1234'),
                'role' => 'admin',
                'bengkel_id' => 9,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'name' => 'Admin Semarang 2',
                'email' => 'semarang2@pasber.com',
                'password' => Hash::make('Smg@5678'),
                'role' => 'admin',
                'bengkel_id' => 9,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'name' => 'Admin Semarang 3',
                'email' => 'semarang3@pasber.com',
                'password' => Hash::make('Smg!9012'),
                'role' => 'admin',
                'bengkel_id' => 9,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // =========================
            // PASBER BALI
            // =========================
            [
                'name' => 'Admin Bali 1',
                'email' => 'bali1@pasber.com',
                'password' => Hash::make('Bli#1234'),
                'role' => 'admin',
                'bengkel_id' => 10,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'name' => 'Admin Bali 2',
                'email' => 'bali2@pasber.com',
                'password' => Hash::make('Bli@5678'),
                'role' => 'admin',
                'bengkel_id' => 10,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'name' => 'Admin Bali 3',
                'email' => 'bali3@pasber.com',
                'password' => Hash::make('Bli!9012'),
                'role' => 'admin',
                'bengkel_id' => 10,
                'created_at' => now(),
                'updated_at' => now(),
            ],

        ]);
    }
}
