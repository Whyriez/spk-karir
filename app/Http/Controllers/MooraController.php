<?php

namespace App\Http\Controllers;

use App\Models\Kriteria;
use App\Models\NilaiSiswa;
use App\Models\HasilRekomendasi;
use App\Models\Jurusan;
use App\Models\Periode;
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
        return Inertia::render('Siswa/InputData', [
            'kriteria_akademik' => Kriteria::where('kategori', 'akademik')->get(),
            'kriteria_kuesioner' => Kriteria::where('kategori', 'kuesioner')->get(),
            'existing_data' => NilaiSiswa::where('siswa_id', Auth::id())->get()->keyBy('kriteria_id')
        ]);
    }

    public function create()
    {
        $user = Auth::user();

        // 1. Cek Apakah Ada Periode Penilaian yang Aktif?
        // (Penting agar data tidak masuk ke "antah berantah")
        $periodeAktif = \App\Models\Periode::where('is_active', true)->first();

        if (!$periodeAktif) {
            return redirect()->route('dashboard')
                ->with('error', 'Maaf, periode penilaian belum dibuka oleh Guru BK.');
        }

        // 2. Ambil Kelas User Saat Ini dari Database
        $userKelas = $user->kelas_saat_ini;

        // 3. Cek Status Alumni
        // Jika statusnya 'alumni', tendang balik ke dashboard
        if ($userKelas === 'alumni') {
            return redirect()->route('dashboard')
                ->with('error', 'Status Anda adalah Alumni. Anda tidak perlu mengisi kuesioner lagi.');
        }

        // 4. Ambil Data Kriteria
        // Pisahkan antara input Angka (Rapor) dan Pilihan (Kuesioner) agar tampilan rapi

        // a. Kriteria Akademik (Input Angka 0-100)
        // Biasanya C1 (Nilai Rapor). Kita ambil yang tipe inputnya 'number'
        $kriteriaAkademik = \App\Models\Kriteria::where('tipe_input', 'number')
            ->orderBy('id', 'asc')
            ->get();

        // b. Kriteria Kuesioner (Input Pilihan 1-5 / Skala Likert)
        // Kita ambil yang tipe inputnya 'select'
        // PENTING: C6 (Lapangan Kerja) biasanya otomatis dari jurusan, jadi kita sembunyikan (exclude)
        // Sesuaikan 'C6' dengan kode kriteria Lapangan Kerja di databasemu
        $kriteriaKuesioner = \App\Models\Kriteria::where('tipe_input', 'select')
            ->where('kode', '!=', 'C6')
            ->orderBy('id', 'asc')
            ->get();

        // 5. Cek Data Lama (Optional - Agar form terisi data sebelumnya jika ada di periode ini)
        // Fitur ini bagus agar siswa tidak input ulang dari nol jika ingin edit
        $existingData = \App\Models\NilaiSiswa::where('siswa_id', $user->id)
            ->where('periode_id', $periodeAktif->id)
            ->where('tingkat_kelas', $userKelas)
            ->pluck('nilai_input', 'kriteria_id');

        // 6. Kirim ke Frontend (Inertia)
        return Inertia::render('Siswa/InputData', [
            'kriteria_akademik' => $kriteriaAkademik,
            'kriteria_kuesioner' => $kriteriaKuesioner,
            'user_kelas' => $userKelas,   // <--- Data untuk mengunci Dropdown Kelas
            'existing_data' => $existingData // <--- Data nilai lama (jika ada)
        ]);
    }

    /**
     * Simpan Data Siswa & Hitung MOORA Otomatis.
     */
    public function store(Request $request)
    {
        $user = Auth::user();


        $tingkatKelas = $user->kelas_saat_ini;

        // 1. Cek Periode Aktif
        $periodeAktif = Periode::where('is_active', true)->first();
        if (!$periodeAktif) return back()->withErrors(['msg' => 'Tidak ada periode aktif.']);

        if (!$periodeAktif) {
            return back()->withErrors(['msg' => 'Tidak ada periode penilaian yang sedang aktif. Hubungi Guru BK.']);
        }

        $input = $request->input('nilai');
        foreach ($input as $kriteriaId => $nilai) {
            if ($nilai === null || $nilai === '') continue;

            NilaiSiswa::updateOrCreate(
                [
                    'siswa_id' => $user->id,
                    'kriteria_id' => $kriteriaId,
                    'periode_id' => $periodeAktif->id // <-- KUNCI AGAR TIDAK MENIMPA DATA LAMA
                ],
                [
                    'nilai_input' => $nilai,
                    'tingkat_kelas' => $tingkatKelas
                ]
            );
        }

        // 3. Simpan Nilai C6 (Lapangan Kerja) Otomatis
        // Code lama tetap dipakai, tambah periode_id saja
        $jurusan = Jurusan::find($user->jurusan_id);
        $kriteriaC6 = Kriteria::where('kode', 'C6')->first();

        if ($jurusan && $kriteriaC6) {
            NilaiSiswa::updateOrCreate(
                [
                    'siswa_id' => $user->id,
                    'kriteria_id' => $kriteriaC6->id,
                    'periode_id' => $periodeAktif->id
                ],
                [
                    'nilai_input' => $jurusan->nilai_lapangan_kerja,
                    'tingkat_kelas' => $tingkatKelas
                ]
            );
        }

        // 4. Hitung Ranking (Pass Periode Aktif ke fungsi kalkulasi)
        $this->calculateRanking($periodeAktif, $tingkatKelas);

        return to_route('siswa.result');
    }

    /**
     * Halaman Hasil Rekomendasi.
     */
    public function result(Request $request)
    {
        $user = Auth::user();
        $hasil = null;

        // KASUS 1: Jika Siswa mengklik "Lihat Detail" dari Tabel Riwayat Dashboard
        // (Misal mau lihat hasil Kelas 10)
        if ($request->has('id')) {
            $hasil = HasilRekomendasi::with('periode')
                ->where('siswa_id', $user->id)
                ->where('id', $request->id)
                ->first();
        }

        // KASUS 2: Default (Buka Menu Hasil Rekomendasi)
        // Tampilkan data dari PERIODE AKTIF (Kelas 12)
        else {
            $periodeAktif = Periode::where('is_active', true)->first();

            if ($periodeAktif) {
                $hasil = HasilRekomendasi::with('periode')
                    ->where('siswa_id', $user->id)
                    ->where('periode_id', $periodeAktif->id)
                    ->first();
            }

            // Fallback: Jika di periode aktif belum ada data, ambil data paling terakhir yang pernah ada
            if (!$hasil) {
                $hasil = HasilRekomendasi::with('periode')
                    ->where('siswa_id', $user->id)
                    ->latest('id') // Ambil berdasarkan ID terbesar (paling baru diinput)
                    ->first();
            }
        }

        return Inertia::render('Siswa/Result', [
            'hasil' => $hasil
        ]);
    }

    /**
     * Logika Inti MOORA.
     */
    // Terima parameter $periode dari method store()
    private function calculateRanking($periode, $tingkatKelas)
    {
        // A. Ambil Data Siswa (untuk tahu jurusannya)
        $userId = Auth::id();
        $user = Auth::user(); // Asumsi user punya kolom 'jurusan_id'

        // B. Ambil Nilai Siswa (Hanya untuk perhitungan normalisasi MOORA)
        $allNilai = NilaiSiswa::where('periode_id', $periode->id)
            ->where('tingkat_kelas', $tingkatKelas)
            ->get();

        // C. Siapkan Array Bobot Final (Gabungan BK & Kaprodi)
        // ---------------------------------------------------

        // 1. Ambil Bobot Global (Guru BK - jurusan_id IS NULL)
        $bobotGlobal = \App\Models\BobotKriteria::whereNull('jurusan_id')
            ->pluck('nilai_bobot', 'kriteria_id')
            ->toArray();

        // 2. Ambil Bobot Lokal (Kaprodi - sesuai jurusan siswa)
        $bobotLokal = \App\Models\BobotKriteria::where('jurusan_id', $user->jurusan_id)
            ->pluck('nilai_bobot', 'kriteria_id')
            ->toArray();

        // 3. Gabungkan (Merge) - Array key adalah kriteria_id
        // Contoh: [1 => 0.2, 2 => 0.15] + [3 => 0.3]
        $bobotGabungan = $bobotGlobal + $bobotLokal;

        // 4. Normalisasi Ulang (PENTING AGAR TOTAL 1.0)
        $totalBobot = array_sum($bobotGabungan);
        $finalWeights = []; // Array [kriteria_id => bobot_bersih]

        if ($totalBobot > 0) {
            foreach ($bobotGabungan as $kId => $val) {
                $finalWeights[$kId] = $val / $totalBobot;
            }
        } else {
            // Fallback jika belum ada bobot sama sekali (hindari error division by zero)
            return;
        }
        // ---------------------------------------------------

        // D. Hitung Pembagi Normalisasi (MOORA)
        $divisors = [];
        // Kita loop berdasarkan key bobot yang ada saja (efisiensi)
        foreach (array_keys($finalWeights) as $kId) {
            $sumSquares = $allNilai->where('kriteria_id', $kId)
                ->sum(fn($row) => pow($row->nilai_input, 2));

            $divisors[$kId] = sqrt($sumSquares);
        }

        // E. Ambil Nilai User yang Login
        $userNilai = NilaiSiswa::where('siswa_id', $userId)
            ->where('periode_id', $periode->id)
            ->where('tingkat_kelas', $tingkatKelas)
            ->get();

        if ($userNilai->isEmpty()) return;

        // F. Hitung Skor Akhir (Yi)
        $yStudi = 0;
        $yKerja = 0;
        $yWirausaha = 0;

        // Helper untuk mapping Kode Kriteria (K1, K2...) ke ID
        // Karena $finalWeights kuncinya ID, tapi logic if pakai Kode (C1, C2)
        // Kita butuh map ID -> Kode
        $kriteriaMap = Kriteria::pluck('kode', 'id')->toArray(); // [1 => 'C1', 2 => 'C2']

        foreach ($userNilai as $n) {
            $kId = $n->kriteria_id;

            // Pastikan bobot untuk kriteria ini ada (jika tidak ada, skip/anggap 0)
            if (!isset($finalWeights[$kId])) continue;

            $kode = $kriteriaMap[$kId] ?? '';
            $bobot = $finalWeights[$kId];
            $divisor = (isset($divisors[$kId]) && $divisors[$kId] > 0) ? $divisors[$kId] : 1;

            // Rumus MOORA: (Nilai / Akar Kuadrat) * Bobot
            $normalizedValue = ($n->nilai_input / $divisor) * $bobot;

            // Logika Pengelompokan Alternatif (Sesuai Proposal)
            // Pastikan kode C1, C2 dst sesuai database Anda
            if (in_array($kode, ['C1', 'C2', 'C4', 'C5'])) $yStudi += $normalizedValue;
            if (in_array($kode, ['C3', 'C6', 'C5'])) $yKerja += $normalizedValue;
            if (in_array($kode, ['C7', 'C8', 'C4', 'C5'])) $yWirausaha += $normalizedValue;
        }

        // G. Tentukan Keputusan Terbaik
        $scores = [
            'Melanjutkan Studi' => $yStudi,
            'Bekerja' => $yKerja,
            'Berwirausaha' => $yWirausaha
        ];

        $bestDecision = array_keys($scores, max($scores))[0];

        // H. Simpan Hasil
        HasilRekomendasi::updateOrCreate(
            [
                'siswa_id' => $userId,
                'periode_id' => $periode->id,
                'tingkat_kelas' => $tingkatKelas
            ],
            [
                'skor_studi' => $yStudi,
                'skor_kerja' => $yKerja,
                'skor_wirausaha' => $yWirausaha,
                'keputusan_terbaik' => $bestDecision,
                'tingkat_kelas' => $tingkatKelas,
                'tanggal_hitung' => now(),
            ]
        );
    }
}
