<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\HasilRekomendasi;
use App\Models\Periode;

class MonitoringController extends Controller
{
    public function index(Request $request)
    {
        // 1. Ambil Parameter Pencarian & Filter
        $search = $request->input('search');
        $periodeId = $request->input('periode_id');
        $status = $request->input('status', 'sudah'); // Default 'sudah'

        // Ambil Data Periode untuk Dropdown
        $periodes = Periode::orderBy('created_at', 'desc')->get();

        // JIKA FILTER: SUDAH MENGISI (Logic Lama)
        if ($status === 'sudah') {
            $query = HasilRekomendasi::with(['user', 'periode'])
                ->orderBy('created_at', 'desc');

            if ($search) {
                $query->whereHas('user', function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('nisn', 'like', "%{$search}%");
                });
            }

            if ($periodeId) {
                $query->where('periode_id', $periodeId);
            }

            $results = $query->paginate(10)->withQueryString();
        }

        // JIKA FILTER: BELUM MENGISI (Logic Baru)
        else {
            // Ambil Siswa
            $query = \App\Models\User::with('jurusan')->where('role', 'siswa');

            // Filter Search
            if ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('nisn', 'like', "%{$search}%");
                });
            }

            // Filter Logic "Belum Mengisi"
            // Cari siswa yang TIDAK PUNYA data hasil_rekomendasi di periode terpilih
            $query->whereDoesntHave('hasilRekomendasi', function($q) use ($periodeId) {
                if ($periodeId) {
                    $q->where('periode_id', $periodeId);
                }
            });

            $results = $query->paginate(10)->withQueryString();
        }

        return Inertia::render('Admin/Monitoring/Index', [
            'results' => $results,
            'periodes' => $periodes,
            'filters' => array_merge($request->only(['search', 'periode_id', 'status']), [
                'status' => $status // Pastikan status terkirim balik
            ])
        ]);
    }

    public function updateCatatan(Request $request, $id)
    {
        $request->validate([
            'catatan_guru_bk' => 'required|string|max:500',
        ]);

        $hasil = HasilRekomendasi::findOrFail($id);

        $hasil->update([
            'catatan_guru_bk' => $request->catatan_guru_bk
        ]);

        return back()->with('success', 'Catatan Guru BK berhasil disimpan.');
    }
}
