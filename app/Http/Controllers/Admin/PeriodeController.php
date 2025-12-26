<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Periode;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use App\Models\Setting;

class PeriodeController extends Controller
{
    public function index()
    {
        // 1. Ambil Status Auto Pilot
        $autoPeriode = Setting::where('key', 'auto_periode')->value('value');

        // 2. Ambil Jadwal Setting (Default 1 Juli jika belum diset)
        $bulan = Setting::where('key', 'periode_bulan')->value('value') ?? 7;
        $tanggal = Setting::where('key', 'periode_tanggal')->value('value') ?? 1;

        return Inertia::render('Admin/Periode/Index', [
            'periodes' => \App\Models\Periode::orderBy('created_at', 'desc')->get(),
            'auto_setting' => $autoPeriode === 'true',

            // --- KIRIM DATA INI ---
            'jadwal_bulan' => (int)$bulan,
            'jadwal_tanggal' => (int)$tanggal,
        ]);
    }

    public function toggleAuto(Request $request)
    {
        // Update setting
        \App\Models\Setting::updateOrCreate(
            ['key' => 'auto_periode'],
            ['value' => $request->active ? 'true' : 'false']
        );

        $status = $request->active ? 'diaktifkan' : 'dimatikan';
        return back()->with('success', "Otomatisasi periode berhasil $status.");
    }

    public function store(Request $request)
    {
        // VALIDASI DIPERKETAT
        $request->validate([
            'nama_periode' => [
                'required',
                'string',
                'unique:periodes,nama_periode' // <--- INI SATPAMNYA
            ]
        ], [
            // Pesan Error Custom (Biar enak dibaca)
            'nama_periode.unique' => 'Nama periode ini sudah ada, tidak boleh duplikat!'
        ]);

        Periode::create(['nama_periode' => $request->nama_periode]);

        return back()->with('success', 'Periode berhasil dibuat.');
    }

    public function update(Request $request, $id)
    {
        $periode = Periode::findOrFail($id);

        $request->validate([
            'nama_periode' => [
                'required',
                'string',
                // Trik Validasi: Unik, tapi KECUALI id diri sendiri ($id)
                Rule::unique('periodes', 'nama_periode')->ignore($id)
            ]
        ], [
            'nama_periode.unique' => 'Nama periode sudah digunakan.'
        ]);

        $periode->update(['nama_periode' => $request->nama_periode]);

        return back()->with('success', 'Periode berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $periode = Periode::findOrFail($id);

        // Opsional: Cegah hapus periode yang sedang aktif
        if ($periode->is_active) {
            return back()->withErrors(['msg' => 'Tidak bisa menghapus periode yang sedang Aktif!']);
        }

        // Hapus data terkait (Cascade) atau hapus periodenya saja
        // Pastikan di database foreign key sudah 'onDelete cascade' kalau mau otomatis
        $periode->delete();

        return back()->with('success', 'Periode berhasil dihapus.');
    }

    public function activate($id)
    {
        // Nonaktifkan semua, lalu aktifkan yang dipilih
        Periode::query()->update(['is_active' => false]);
        Periode::where('id', $id)->update(['is_active' => true]);

        return back()->with('success', 'Periode penilaian telah diaktifkan.');
    }
}
