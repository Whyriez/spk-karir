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
        Schema::create('hasil_rekomendasi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('users')->onDelete('cascade');
            
            $table->float('skor_studi')->nullable();
            $table->float('skor_kerja')->nullable();
            $table->float('skor_wirausaha')->nullable();
            
            // Menyimpan teks keputusan: "Melanjutkan Studi", "Bekerja", dll.
            $table->string('keputusan_terbaik');
            
            $table->timestamp('tanggal_hitung')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hasil_rekomendasi');
    }
};
