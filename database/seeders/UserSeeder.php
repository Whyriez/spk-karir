<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Akun Admin (Super User)
        // Tugas: Buka Periode, Manajemen User, CRUD Kriteria
        DB::table('users')->insert([
            'name' => 'Administrator Sistem',
            'email' => 'admin@smk.id',
            'username' => 'admin',
            'password' => Hash::make('123'),
            'role' => 'admin',
            'jenis_pakar' => null, // Admin bukan pakar spesifik
            'created_at' => now(), 
            'updated_at' => now()
        ]);

        // 2. Akun Pakar 1: GURU BK
        // Tugas: Input Bobot BWM untuk kriteria 'gurubk' (Minat, Psikologis)
        DB::table('users')->insert([
            'name' => 'Ibu Guru BK',
            'email' => 'gurubk@smk.id',
            'username' => 'gurubk',
            'password' => Hash::make('123'),
            'role' => 'pakar',
            'jenis_pakar' => 'gurubk', // <--- PENTING
            'created_at' => now(), 
            'updated_at' => now()
        ]);

        // 3. Akun Pakar 2: KAPRODI
        // Tugas: Input Bobot BWM untuk kriteria 'kaprodi' (Gaji, Lapangan Kerja)
        DB::table('users')->insert([
            'name' => 'Bapak Kaprodi TKJ',
            'email' => 'kaprodi@smk.id',
            'username' => 'kaprodi',
            'password' => Hash::make('123'),
            'role' => 'pakar',
            'jenis_pakar' => 'kaprodi', // <--- PENTING
            'jurusan_id' => 1,
            'created_at' => now(), 
            'updated_at' => now()
        ]);

        // 4. Akun Siswa 1: KELAS 12 (Siap Lulus)
        // Tugas: Simulasi melihat hasil akhir
        DB::table('users')->insert([
            'name' => 'Alim Suma (Kls 12)',
            'username' => 'siswa12', 
            'email' => 'alim@student.ung.ac.id',
            'password' => Hash::make('123'),
            'role' => 'siswa',
            'jenis_pakar' => null,
            'nisn' => '531422058',
            'jurusan_id' => 1, 
            'kelas_saat_ini' => '12', // <--- Simulasi siswa tingkat akhir
            'created_at' => now(), 
            'updated_at' => now()
        ]);

        // 5. Akun Siswa 2: KELAS 10 (Siswa Baru)
        // Tugas: Simulasi fitur 'Promosi Kenaikan Kelas'
        DB::table('users')->insert([
            'name' => 'Budi Santoso (Kls 10)',
            'username' => 'siswa10', 
            'email' => 'budi@smk.id',
            'password' => Hash::make('123'),
            'role' => 'siswa',
            'jenis_pakar' => null,
            'nisn' => '123456789',
            'jurusan_id' => 1, 
            'kelas_saat_ini' => '10', // <--- Simulasi siswa baru
            'created_at' => now(), 
            'updated_at' => now()
        ]);
    }
}