<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\HasilRekomendasi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'siswa') {
            // AMBIL DATA HISTORY UNTUK GRAFIK
            $history = HasilRekomendasi::with('periode')
                ->where('siswa_id', $user->id)
                ->orderBy('periode_id', 'asc') // Urutkan dari periode lama ke baru
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'label' => $item->periode->nama_periode, // "Kelas 10", "Kelas 11"
                        'kelas' => $item->tingkat_kelas,
                        'skor_studi' => $item->skor_studi,
                        'skor_kerja' => $item->skor_kerja,
                        'skor_wirausaha' => $item->skor_wirausaha,
                        'keputusan' => $item->keputusan_terbaik,
                    ];
                });

            return Inertia::render('Dashboard', [
                'history' => $history // Kirim ke React
            ]);
        }

        // 1. Hitung Statistik untuk Cards (Sesuai Gambar 3.5)
        $stats = [
            'total_siswa' => User::where('role', 'siswa')->count(),
            'sudah_mengisi' => HasilRekomendasi::count(),
            'rekomendasi_studi' => HasilRekomendasi::where('keputusan_terbaik', 'Melanjutkan Studi')->count(),
            'rekomendasi_kerja' => HasilRekomendasi::where('keputusan_terbaik', 'Bekerja')->count(),
            'rekomendasi_wirausaha' => HasilRekomendasi::where('keputusan_terbaik', 'Berwirausaha')->count(),
        ];

        // 2. Ambil Data Rekapitulasi Siswa (Tabel)
        // Kita join dengan tabel User dan Jurusan untuk menampilkan Nama & Jurusan
        $rekapitulasi = HasilRekomendasi::with(['user.jurusan'])
            ->latest('tanggal_hitung')
            ->get()
            ->map(function ($item) {
                // Format ulang data agar rapi di tabel React
                return [
                    'id' => $item->id,
                    'nisn' => $item->user->nisn,
                    'nama' => $item->user->name,
                    'jurusan' => $item->user->jurusan->nama_jurusan ?? '-',
                    // Ambil skor tertinggi untuk ditampilkan di kolom "Nilai Optima"
                    'nilai_optima' => max($item->skor_studi, $item->skor_kerja, $item->skor_wirausaha),
                    'keputusan' => $item->keputusan_terbaik,
                    'tanggal' => $item->tanggal_hitung,
                ];
            });

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'rekapitulasi' => $rekapitulasi
        ]);
    }
}
