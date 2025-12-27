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
        Schema::create('kriteria', function (Blueprint $table) {
            $table->id();
            $table->string('kode')->unique();
            $table->string('nama');
            $table->text('pertanyaan')->nullable();

            // --- TAMBAHAN BARU: DEFINISI UI DARI DATABASE ---
            // 1. Tipe Input: number (angka), select (dropdown), likert (radio 1-5)
            $table->enum('tipe_input', ['number', 'select', 'likert'])->default('likert');

            // 2. Opsi Pilihan: Menyimpan opsi dropdown dalam format JSON (misal untuk Ekonomi)
            $table->json('opsi_pilihan')->nullable();
            // ------------------------------------------------

            $table->enum('atribut', ['benefit', 'cost'])->default('benefit');

            // Kita ganti 'is_static' menjadi 'kategori' agar lebih jelas pengelompokannya di UI
            $table->enum('kategori', ['akademik', 'kuesioner'])->default('kuesioner');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kriteria');
    }
};
