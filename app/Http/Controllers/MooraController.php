<?php

namespace App\Http\Controllers;

use App\Models\Kriteria;
use App\Models\NilaiSiswa;
use App\Models\HasilRekomendasi;
use App\Models\Jurusan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class MooraController extends Controller
{
    /**
     * Halaman Input Data Siswa.
     */
    public function index()
    {
        $kriteria = Kriteria::where('is_static', false)->get(); // Kuesioner saja
        $staticKriteria = Kriteria::where('is_static', true)->get(); // Nilai Rapor & Ekonomi
        
        return Inertia::render('Siswa/InputData', [
            'kriteria_kuesioner' => $kriteria,
            'kriteria_static' => $staticKriteria,
            'existing_data' => NilaiSiswa::where('siswa_id', Auth::id())->get()->keyBy('kriteria_id')
        ]);
    }

    /**
     * Simpan Data Siswa & Hitung MOORA Otomatis.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        $input = $request->input('nilai'); // Array [kriteria_id => nilai]

        // 1. Simpan/Update Nilai Siswa (Input Manual)
        foreach ($input as $kriteriaId => $nilai) {
            
            // --- PERBAIKAN DI SINI ---
            // Jika nilai kosong atau null (seperti C6 yang hidden), skip saja.
            if ($nilai === null || $nilai === '') {
                continue; 
            }
            // ------------------------

            NilaiSiswa::updateOrCreate(
                ['siswa_id' => $user->id, 'kriteria_id' => $kriteriaId],
                ['nilai_input' => $nilai]
            );
        }

        // --- Logika C6 Otomatis (Tetap biarkan seperti sebelumnya) ---
        // Tambahkan Nilai C6 (Lapangan Kerja) Otomatis dari Jurusan
        $jurusan = Jurusan::find($user->jurusan_id);
        $kriteriaC6 = Kriteria::where('kode', 'C6')->first();
        
        if ($jurusan && $kriteriaC6) {
             NilaiSiswa::updateOrCreate(
                ['siswa_id' => $user->id, 'kriteria_id' => $kriteriaC6->id],
                ['nilai_input' => $jurusan->nilai_lapangan_kerja]
            );
        }

        // 2. Kalkulasi MOORA
        $this->calculateRanking();

        return to_route('siswa.result');
    }

    /**
     * Halaman Hasil Rekomendasi.
     */
    public function result()
    {
        $hasil = HasilRekomendasi::where('siswa_id', Auth::id())->first();
        return Inertia::render('Siswa/Result', ['hasil' => $hasil]);
    }

    /**
     * Logika Inti MOORA.
     */
    private function calculateRanking()
    {
        // A. Ambil Data Semua Siswa & Kriteria (Untuk Normalisasi)
        $allNilai = NilaiSiswa::all(); 
        $kriteria = Kriteria::all();
        
        // B. Hitung Pembagi Normalisasi (Akar dari Sum Kuadrat per Kriteria)
        $divisors = [];
        foreach ($kriteria as $k) {
            $sumSquares = $allNilai->where('kriteria_id', $k->id)->sum(fn($row) => pow($row->nilai_input, 2));
            $divisors[$k->id] = sqrt($sumSquares);
        }

        // C. Hitung Skor Optimasi (Yi) untuk User yg sedang login
        $userId = Auth::id();
        $userNilai = NilaiSiswa::where('siswa_id', $userId)->get();
        
        // Inisialisasi Skor
        $yStudi = 0; $yKerja = 0; $yWirausaha = 0;

        foreach ($userNilai as $n) {
            $k = $kriteria->find($n->kriteria_id);
            $bobot = $k->bobot_bwm;
            $divisor = $divisors[$k->id] > 0 ? $divisors[$k->id] : 1;
            
            // Nilai Ternormalisasi Terbobot
            $normalizedValue = ($n->nilai_input / $divisor) * $bobot;

            // Mapping Nilai ke Alternatif (Sesuai Bab III Poin 3.4.2)
            // Kriteria Benefit (+)
            
            // Logika Pemetaan Kriteria ke Alternatif
            // C1 (Akademik), C4 (Ekonomi), C5 (Motivasi) -> Masuk ke semua/spesifik
            // Disini kita sederhanakan sesuai matriks:
            
            // Contoh Logic Sederhana (Perlu disesuaikan detail Bab III nanti):
            // Jika Kriteria relevan dengan Studi (misal C1, C2), tambahkan ke yStudi
            if (in_array($k->kode, ['C1', 'C2', 'C4', 'C5'])) $yStudi += $normalizedValue;
            
            // Jika Kriteria relevan dengan Kerja (misal C3, C6), tambahkan ke yKerja
            if (in_array($k->kode, ['C3', 'C6', 'C5'])) $yKerja += $normalizedValue;
            
            // Jika Kriteria relevan dengan Wirausaha (misal C7, C8), tambahkan ke yWirausaha
            if (in_array($k->kode, ['C7', 'C8', 'C4', 'C5'])) $yWirausaha += $normalizedValue;
        }

        // D. Tentukan Peringkat
        $scores = [
            'Melanjutkan Studi' => $yStudi,
            'Bekerja' => $yKerja,
            'Berwirausaha' => $yWirausaha
        ];
        
        $bestDecision = array_keys($scores, max($scores))[0];

        // E. Simpan Hasil
        HasilRekomendasi::updateOrCreate(
            ['siswa_id' => $userId],
            [
                'skor_studi' => $yStudi,
                'skor_kerja' => $yKerja,
                'skor_wirausaha' => $yWirausaha,
                'keputusan_terbaik' => $bestDecision
            ]
        );
    }
}