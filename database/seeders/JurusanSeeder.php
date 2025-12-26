<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JurusanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jurusan = [
            [
                'kode_jurusan' => 'TKJ',
                'nama_jurusan' => 'Teknik Komputer dan Jaringan',
                'nilai_lapangan_kerja' => 4, // Skala 1-5 (Prospek Tinggi)
                'created_at' => now(), 'updated_at' => now()
            ],
            [
                'kode_jurusan' => 'RPL',
                'nama_jurusan' => 'Rekayasa Perangkat Lunak',
                'nilai_lapangan_kerja' => 5, // Sangat Tinggi
                'created_at' => now(), 'updated_at' => now()
            ],
            [
                'kode_jurusan' => 'MM',
                'nama_jurusan' => 'Multimedia', // Atau DKV
                'nilai_lapangan_kerja' => 3, 
                'created_at' => now(), 'updated_at' => now()
            ],
            [
                'kode_jurusan' => 'AKL',
                'nama_jurusan' => 'Akuntansi dan Keuangan Lembaga',
                'nilai_lapangan_kerja' => 4,
                'created_at' => now(), 'updated_at' => now()
            ],
            [
                'kode_jurusan' => 'OTKP',
                'nama_jurusan' => 'Otomatisasi Tata Kelola Perkantoran',
                'nilai_lapangan_kerja' => 3,
                'created_at' => now(), 'updated_at' => now()
            ],
        ];

        DB::table('jurusan')->insert($jurusan);
    }
}
