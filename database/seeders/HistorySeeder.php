<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Periode;
use App\Models\User;
use App\Models\Kriteria;

class HistorySeeder extends Seeder
{
    public function run(): void
    {
        // 1. Buat 3 Periode (Kelas 10, 11, 12)
        $p1 = Periode::create(['nama_periode' => 'TA 2022/2023 (Kelas 10)', 'is_active' => false]);
        $p2 = Periode::create(['nama_periode' => 'TA 2023/2024 (Kelas 11)', 'is_active' => false]);
        $p3 = Periode::create(['nama_periode' => 'TA 2024/2025 (Kelas 12)', 'is_active' => true]); // Aktif skrg

        // 2. Ambil User Siswa "Alim Suma" (atau user pertama)
        $siswa = User::where('role', 'siswa')->first();
        if(!$siswa) return;

        // 3. Simulasi Data Kelas 10 (Masih bingung, skor rendah)
        $this->insertHasil($siswa->id, $p1->id, '10', 0.4, 0.4, 0.3, 'Bekerja');

        // 4. Simulasi Data Kelas 11 (Mulai minat studi naik)
        $this->insertHasil($siswa->id, $p2->id, '11', 0.6, 0.45, 0.35, 'Melanjutkan Studi');

        // 5. Simulasi Data Kelas 12 (Mantap studi)
        $this->insertHasil($siswa->id, $p3->id, '12', 0.85, 0.5, 0.4, 'Melanjutkan Studi', 'Sangat direkomendasikan masuk Teknik Informatika.');
    }

    private function insertHasil($siswaId, $periodeId, $kelas, $studi, $kerja, $wirausaha, $keputusan, $catatan = null)
    {
        DB::table('hasil_rekomendasi')->insert([
            'siswa_id' => $siswaId,
            'skor_studi' => $studi,
            'skor_kerja' => $kerja,
            'skor_wirausaha' => $wirausaha,
            'keputusan_terbaik' => $keputusan,
            'periode_id' => $periodeId,
            'tingkat_kelas' => $kelas,
            'catatan_guru_bk' => $catatan,
            'tanggal_hitung' => now(),
            'created_at' => now(), 'updated_at' => now()
        ]);
    }
}