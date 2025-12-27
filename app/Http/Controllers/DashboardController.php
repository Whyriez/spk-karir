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

        // --- DASHBOARD SISWA (Logic Lama Tetap Ada) ---
        if ($user->role === 'siswa') {
            $history = HasilRekomendasi::with('periode')
                ->where('siswa_id', $user->id)
                ->orderBy('periode_id', 'asc')
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'label' => $item->periode->nama_periode,
                        'kelas' => $item->tingkat_kelas,
                        'skor_studi' => $item->skor_studi,
                        'skor_kerja' => $item->skor_kerja,
                        'skor_wirausaha' => $item->skor_wirausaha,
                        'keputusan' => $item->keputusan_terbaik,
                    ];
                });

            return Inertia::render('Dashboard', [
                'auth' => ['user' => $user],
                'history' => $history
            ]);
        }

        // --- DASHBOARD ADMIN & PAKAR (LOGIC BARU) ---

        // 1. Hitung Statistik Utama
        $totalSiswa = User::where('role', 'siswa')->count();
        $sudahMengisi = HasilRekomendasi::distinct('siswa_id')->count();

        $stats = [
            'total_siswa' => $totalSiswa,
            'sudah_mengisi' => $sudahMengisi,
            'belum_mengisi' => $totalSiswa - $sudahMengisi, // Info penting untuk tindak lanjut
            'rekomendasi_studi' => HasilRekomendasi::where('keputusan_terbaik', 'Melanjutkan Studi')->count(),
            'rekomendasi_kerja' => HasilRekomendasi::where('keputusan_terbaik', 'Bekerja')->count(),
            'rekomendasi_wirausaha' => HasilRekomendasi::where('keputusan_terbaik', 'Berwirausaha')->count(),
        ];

        // 2. Data Grafik Distribusi (Pie/Doughnut Chart)
        $chart_distribution = [
            'labels' => ['Melanjutkan Studi', 'Bekerja', 'Berwirausaha'],
            'data' => [
                $stats['rekomendasi_studi'],
                $stats['rekomendasi_kerja'],
                $stats['rekomendasi_wirausaha']
            ],
            'colors' => ['#4F46E5', '#10B981', '#F97316'] // Indigo, Emerald, Orange
        ];

        // 3. Data Rekapitulasi Terbaru (5 Terakhir saja untuk dashboard, biar gak penuh)
        $rekapitulasi = HasilRekomendasi::with(['user.jurusan'])
            ->latest('tanggal_hitung')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nisn' => $item->user->nisn,
                    'nama' => $item->user->name,
                    'jurusan' => $item->user->jurusan->nama_jurusan ?? '-',
                    'nilai_optima' => max($item->skor_studi, $item->skor_kerja, $item->skor_wirausaha),
                    'keputusan' => $item->keputusan_terbaik,
                    'tanggal' => $item->tanggal_hitung,
                ];
            });

        return Inertia::render('Dashboard', [
            'auth' => ['user' => $user],
            'stats' => $stats,
            'chart_distribution' => $chart_distribution,
            'rekapitulasi' => $rekapitulasi
        ]);
    }
}
