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
        // 1. Ambil Parameter Pencarian (Search)
        $search = $request->input('search');
        $periodeId = $request->input('periode_id');

        // 2. Query Data Hasil Rekomendasi
        $query = HasilRekomendasi::with(['user', 'periode'])
            ->orderBy('created_at', 'desc');

        // Filter by Search (Nama Siswa)
        if ($search) {
            $query->whereHas('user', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        // Filter by Periode (Jika ada, jika tidak default semua atau aktif)
        if ($periodeId) {
            $query->where('periode_id', $periodeId);
        }

        // 3. Ambil Data Periode untuk Dropdown Filter
        $periodes = Periode::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/Monitoring/Index', [
            'results' => $query->paginate(10)->withQueryString(), // Pagination biar ringan
            'periodes' => $periodes,
            'filters' => $request->only(['search', 'periode_id'])
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