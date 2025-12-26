<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Update Tabel Nilai Siswa
        Schema::table('nilai_siswa', function (Blueprint $table) {
            // Tambah Periode ID (Nullable dulu biar ga error data lama, nanti diisi seeder)
            $table->foreignId('periode_id')->nullable()->constrained('periodes')->onDelete('cascade');

            // Tambah Tingkat Kelas (10, 11, 12)
            $table->enum('tingkat_kelas', ['10', '11', '12'])->default('12');
        });

        // 2. Update Tabel Hasil Rekomendasi
        Schema::table('hasil_rekomendasi', function (Blueprint $table) {
            $table->foreignId('periode_id')->nullable()->constrained('periodes')->onDelete('cascade');
            $table->enum('tingkat_kelas', ['10', '11', '12'])->default('12');

            // Fitur Tindak Lanjut Guru BK (Catatan/Validasi)
            $table->text('catatan_guru_bk')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('nilai_siswa', function (Blueprint $table) {
            $table->dropForeign(['periode_id']);
            $table->dropColumn(['periode_id', 'tingkat_kelas']);
        });

        Schema::table('hasil_rekomendasi', function (Blueprint $table) {
            $table->dropForeign(['periode_id']);
            $table->dropColumn(['periode_id', 'tingkat_kelas', 'catatan_guru_bk']);
        });
    }
};
