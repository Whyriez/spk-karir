<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Akun Admin (Guru BK)
        DB::table('users')->insert([
            'name' => 'Administrator BK',
            'email' => 'admin@smk.id',
            'username' => 'admin',
            'password' => Hash::make('password'), // password default
            'role' => 'admin',
            'created_at' => now(), 'updated_at' => now()
        ]);

        // 2. Akun Pakar (Kaprodi / Guru Senior)
        DB::table('users')->insert([
            'name' => 'Pakar Penilai',
            'email' => 'pakar@smk.id',
            'username' => 'pakar',
            'password' => Hash::make('password'),
            'role' => 'pakar',
            'created_at' => now(), 'updated_at' => now()
        ]);

        // 3. Akun Siswa (Contoh)
        // Pastikan ID Jurusan 1 (TKJ) sudah ada dari JurusanSeeder
        DB::table('users')->insert([
            'name' => 'Alim Suma',
            'username' => '531422058', // Login pakai NISN
            'email' => 'alim@student.ung.ac.id',
            'password' => Hash::make('password'),
            'role' => 'siswa',
            'nisn' => '531422058',
            'jurusan_id' => 1, // Asumsi 1 adalah TKJ
            'asal_sekolah' => 'SMKN 1 Kota Gorontalo',
            'created_at' => now(), 'updated_at' => now()
        ]);
    }
}
