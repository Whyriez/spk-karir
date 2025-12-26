<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // 1. Ubah ENUM Role jadi 3 saja
            // Note: Kita pakai raw statement agar bisa ubah enum (Laravel kadang restrict ubah enum)
            DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'pakar', 'siswa') DEFAULT 'siswa'");

            // 2. Tambah kolom spesialisasi (Hanya diisi jika role = pakar)
            // Values: 'gurubk', 'kaprodi', atau NULL (untuk admin/siswa)
            $table->enum('jenis_pakar', ['gurubk', 'kaprodi'])->nullable()->after('role');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('jenis_pakar');
        });
    }
};
