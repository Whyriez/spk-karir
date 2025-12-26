<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KriteriaSeeder extends Seeder
{
    public function run(): void
    {
        $kriteria = [
            // ==========================================================
            // KELOMPOK 1: DATA AKADEMIK & EKONOMI (Input Angka/Select)
            // ==========================================================
            
            // C1: Nilai Akademik
            [
                'kode' => 'C1', 
                'nama' => 'Nilai Akademik', 
                'pertanyaan' => 'Masukkan nilai rata-rata rapor Anda (Skala 0-100).',
                'tipe_input' => 'number',
                'opsi_pilihan' => null,
                'kategori' => 'akademik',
                'atribut' => 'benefit',
                'created_at' => now(), 'updated_at' => now()
            ],
            
            // C4: Kondisi Ekonomi
            [
                'kode' => 'C4', 
                'nama' => 'Kondisi Ekonomi', 
                'pertanyaan' => 'Pilih rentang penghasilan orang tua per bulan.',
                'tipe_input' => 'select',
                // Opsi dinamis (JSON) untuk Dropdown
                'opsi_pilihan' => json_encode([
                    ['val' => 1, 'label' => 'Kurang Mampu (< 1 Juta)'],
                    ['val' => 2, 'label' => 'Cukup (1 - 3 Juta)'],
                    ['val' => 3, 'label' => 'Sedang (3 - 5 Juta)'],
                    ['val' => 4, 'label' => 'Mampu (5 - 10 Juta)'],
                    ['val' => 5, 'label' => 'Sangat Mampu (> 10 Juta)']
                ]),
                'kategori' => 'akademik',
                'atribut' => 'benefit', // Benefit: Semakin mampu, semakin mudah kuliah/wirausaha
                'created_at' => now(), 'updated_at' => now()
            ],

            // C6: Ketersediaan Lapangan Kerja (Hidden/Otomatis)
            [
                'kode' => 'C6', 
                'nama' => 'Ketersediaan Lapangan Kerja', 
                'pertanyaan' => null, // Hidden: Diambil otomatis dari tabel Jurusan
                'tipe_input' => 'number',
                'opsi_pilihan' => null,
                'kategori' => 'akademik',
                'atribut' => 'benefit',
                'created_at' => now(), 'updated_at' => now()
            ],

            // ==========================================================
            // KELOMPOK 2: KUESIONER MINAT (Skala Likert 1-5)
            // ==========================================================

            // C2: Minat Lanjut Studi
            [
                'kode' => 'C2', 
                'nama' => 'Minat Lanjut Studi', 
                'pertanyaan' => 'Seberapa besar keinginan dan rencana Anda untuk melanjutkan pendidikan ke Perguruan Tinggi (Kuliah)?',
                'tipe_input' => 'likert',
                'opsi_pilihan' => null,
                'kategori' => 'kuesioner',
                'atribut' => 'benefit',
                'created_at' => now(), 'updated_at' => now()
            ],

            // C3: Minat Lanjut Kerja
            [
                'kode' => 'C3', 
                'nama' => 'Minat Lanjut Kerja', 
                'pertanyaan' => 'Seberapa siap Anda secara mental dan skill untuk langsung bekerja di dunia industri setelah lulus?',
                'tipe_input' => 'likert',
                'opsi_pilihan' => null,
                'kategori' => 'kuesioner',
                'atribut' => 'benefit',
                'created_at' => now(), 'updated_at' => now()
            ],

            // C5: Motivasi Diri & Dukungan Orang Tua
            [
                'kode' => 'C5', 
                'nama' => 'Motivasi & Dukungan Ortu', 
                'pertanyaan' => 'Seberapa besar dukungan orang tua dan motivasi diri Anda terhadap pilihan karir yang akan diambil?',
                'tipe_input' => 'likert',
                'opsi_pilihan' => null,
                'kategori' => 'kuesioner',
                'atribut' => 'benefit',
                'created_at' => now(), 'updated_at' => now()
            ],

            // C7: Minat Usaha
            [
                'kode' => 'C7', 
                'nama' => 'Minat Wirausaha', 
                'pertanyaan' => 'Seberapa besar ketertarikan Anda untuk memulai dan mengelola bisnis/usaha sendiri?',
                'tipe_input' => 'likert',
                'opsi_pilihan' => null,
                'kategori' => 'kuesioner',
                'atribut' => 'benefit',
                'created_at' => now(), 'updated_at' => now()
            ],

            // C8: Ketersediaan Modal/Aset
            [
                'kode' => 'C8', 
                'nama' => 'Ketersediaan Modal/Aset', 
                'pertanyaan' => 'Seberapa siap ketersediaan modal atau aset awal (tempat/alat) jika Anda memutuskan untuk berwirausaha?',
                'tipe_input' => 'likert', // Kita pakai likert (persepsi kesiapan modal) agar lebih mudah dibanding input nominal rupiah
                'opsi_pilihan' => null,
                'kategori' => 'kuesioner',
                'atribut' => 'benefit',
                'created_at' => now(), 'updated_at' => now()
            ],
        ];
        DB::table('kriteria')->insert($kriteria);
    }
}