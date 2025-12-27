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
        Schema::create('bobot_kriterias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kriteria_id')->constrained('kriteria')->onDelete('cascade');

            // NULL = Bobot Global (Punya Guru BK)
            // ISI ANGKA = Bobot Spesifik Jurusan (Punya Kaprodi)
            $table->foreignId('jurusan_id')->nullable()->constrained('jurusan')->onDelete('cascade');

            $table->double('nilai_bobot'); // Hasil hitungan BWM (0.15, 0.20, dll)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bobot_kriterias');
    }
};
