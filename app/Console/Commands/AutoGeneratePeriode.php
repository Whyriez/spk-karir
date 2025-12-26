<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Periode;
use App\Models\Setting;
use Carbon\Carbon;

class AutoGeneratePeriode extends Command
{
    // Nama perintah robotnya
    protected $signature = 'periode:auto-generate';
    protected $description = 'Otomatis membuat periode tahun ajaran baru jika setting aktif';

    public function handle()
    {
        // 1. Cek Apakah Fitur Dinyalakan Admin?
        $setting = Setting::where('key', 'auto_periode')->first();
        if (!$setting || $setting->value !== 'true') {
            $this->info('Fitur Auto Periode tidak aktif.');
            return;
        }

        // 2. Cek Tanggal (Misal: Kita ingin jalan setiap 1 Juli)
        // Logika: Ambil tahun sekarang
        $now = Carbon::now();
        
        // Format Nama: "Tahun Ajaran 2025/2026"
        $namaPeriode = "Tahun Ajaran " . $now->year . "/" . ($now->year + 1);

        // 3. Cek Apakah Periode Sudah Ada? (Biar gak duplikat)
        $exists = Periode::where('nama_periode', $namaPeriode)->exists();

        if ($exists) {
            $this->info("Periode $namaPeriode sudah ada. Skip.");
            return;
        }

        // 4. Buat Periode Baru & Aktifkan
        // Nonaktifkan yang lama dulu
        Periode::query()->update(['is_active' => false]);

        // Buat yang baru
        Periode::create([
            'nama_periode' => $namaPeriode,
            'is_active' => true
        ]);

        $this->info("Berhasil membuat dan mengaktifkan: $namaPeriode");
    }
}