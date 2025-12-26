<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KriteriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kriteria = [
            // C1: Nilai Akademik (Input Angka Rapor)
            [
                'kode' => 'C1', 
                'nama' => 'Nilai Akademik', 
                'atribut' => 'benefit', 
                'is_static' => true, // Bukan kuesioner likert, tapi nilai rapor
                'created_at' => now(), 'updated_at' => now()
            ],
            // C2: Minat Lanjut Studi (Kuesioner Likert)
            [
                'kode' => 'C2', 
                'nama' => 'Minat Lanjut Studi', 
                'atribut' => 'benefit', 
                'is_static' => false,
                'created_at' => now(), 'updated_at' => now()
            ],
            // C3: Minat Lanjut Kerja (Kuesioner Likert)
            [
                'kode' => 'C3', 
                'nama' => 'Minat Lanjut Kerja', 
                'atribut' => 'benefit', 
                'is_static' => false,
                'created_at' => now(), 'updated_at' => now()
            ],
            // C4: Kondisi Ekonomi (Input Angka Penghasilan/Kategori)
            [
                'kode' => 'C4', 
                'nama' => 'Kondisi Ekonomi', 
                'atribut' => 'benefit', 
                'is_static' => true, // Diinput sebagai range nominal/kategori
                'created_at' => now(), 'updated_at' => now()
            ],
            // C5: Motivasi Diri/Dukungan Orang Tua (Kuesioner Likert)
            [
                'kode' => 'C5', 
                'nama' => 'Motivasi Diri & Dukungan Ortu', 
                'atribut' => 'benefit', 
                'is_static' => false,
                'created_at' => now(), 'updated_at' => now()
            ],
            // C6: Ketersediaan Lapangan Kerja (Otomatis dari Jurusan)
            [
                'kode' => 'C6', 
                'nama' => 'Ketersediaan Lapangan Kerja', 
                'atribut' => 'benefit', 
                'is_static' => true, // Diambil dari tabel jurusan, bukan input siswa
                'created_at' => now(), 'updated_at' => now()
            ],
            // C7: Minat Usaha (Kuesioner Likert)
            [
                'kode' => 'C7', 
                'nama' => 'Minat Usaha', 
                'atribut' => 'benefit', 
                'is_static' => false,
                'created_at' => now(), 'updated_at' => now()
            ],
            // C8: Modal/Aset (Input/Kuesioner)
            [
                'kode' => 'C8', 
                'nama' => 'Ketersediaan Modal/Aset', 
                'atribut' => 'benefit', 
                'is_static' => false,
                'created_at' => now(), 'updated_at' => now()
            ],
        ];

        DB::table('kriteria')->insert($kriteria);
    }
}
