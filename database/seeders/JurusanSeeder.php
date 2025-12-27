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
                'created_at' => now(), 'updated_at' => now()
            ],
            [
                'kode_jurusan' => 'RPL',
                'nama_jurusan' => 'Rekayasa Perangkat Lunak',
                'created_at' => now(), 'updated_at' => now()
            ],
            [
                'kode_jurusan' => 'MM',
                'nama_jurusan' => 'Multimedia', // Atau DKV
                'created_at' => now(), 'updated_at' => now()
            ],
            [
                'kode_jurusan' => 'AKL',
                'nama_jurusan' => 'Akuntansi dan Keuangan Lembaga',
                'created_at' => now(), 'updated_at' => now()
            ],
            [
                'kode_jurusan' => 'OTKP',
                'nama_jurusan' => 'Otomatisasi Tata Kelola Perkantoran',
                'created_at' => now(), 'updated_at' => now()
            ],
        ];

        DB::table('jurusan')->insert($jurusan);
    }
}
