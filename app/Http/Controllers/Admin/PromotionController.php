<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PromotionController extends Controller
{
    public function index()
    {
        // Ambil data siswa dikelompokkan per kelas
        return Inertia::render('Admin/Promotion/Index', [
            'siswa_kelas_10' => User::where('role', 'siswa')->where('kelas_saat_ini', '10')->orderBy('name')->get(),
            'siswa_kelas_11' => User::where('role', 'siswa')->where('kelas_saat_ini', '11')->orderBy('name')->get(),
            'siswa_kelas_12' => User::where('role', 'siswa')->where('kelas_saat_ini', '12')->orderBy('name')->get(),
        ]);
    }

    public function promote(Request $request)
    {
        $request->validate([
            'user_ids' => 'required|array',
            'target_kelas' => 'required|in:11,12,alumni', // Tujuan kenaikan
        ]);

        $ids = $request->user_ids;
        $target = $request->target_kelas;

        // Lakukan Update Massal (Bulk Update)
        User::whereIn('id', $ids)->update([
            'kelas_saat_ini' => $target
        ]);

        $pesan = count($ids) . " Siswa berhasil dipromosikan ke " . ($target == 'alumni' ? 'Alumni' : 'Kelas ' . $target);

        return back()->with('success', $pesan);
    }
}