<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Setting;

class SettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Settings', [
            'nama_sekolah' => Setting::where('key', 'nama_sekolah')->value('value'),
            'timezone' => Setting::where('key', 'timezone')->value('value') ?? 'Asia/Jakarta',

            // --- TAMBAHAN BARU ---
            'periode_bulan' => Setting::where('key', 'periode_bulan')->value('value') ?? '7', // Default Juli
            'periode_tanggal' => Setting::where('key', 'periode_tanggal')->value('value') ?? '1', // Default Tgl 1
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'nama_sekolah' => 'required|string|max:255',
            'timezone' => 'required|string',
            // Validasi Tanggal & Bulan
            'periode_bulan' => 'required|integer|between:1,12',
            'periode_tanggal' => 'required|integer|between:1,31',
        ]);

        // Simpan Setting (Looping biar rapi)
        $settings = [
            'nama_sekolah' => $request->nama_sekolah,
            'timezone' => $request->timezone,
            'periode_bulan' => $request->periode_bulan,
            'periode_tanggal' => $request->periode_tanggal,
        ];

        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        return back()->with('success', 'Pengaturan sekolah berhasil diperbarui.');
    }
}
