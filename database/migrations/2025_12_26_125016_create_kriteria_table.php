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
            $table->string('kode')->unique(); // C1, C2, dst
            $table->string('nama'); // Nilai Akademik, Minat Studi, dst
            
            $table->enum('atribut', ['benefit', 'cost'])->default('benefit');
            
            // Menyimpan hasil hitungan bobot BWM nanti
            $table->float('bobot_bwm')->nullable();
            
            // Penanda apakah nilai diambil otomatis (seperti C1 Raport) atau Kuesioner
            $table->boolean('is_static')->default(false); 
            
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
