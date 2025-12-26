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
        Schema::create('bwm_comparisons', function (Blueprint $table) {
            $table->id();
            // Siapa pakar yang menilai
            $table->foreignId('pakar_id')->constrained('users')->onDelete('cascade');
            
            // Referensi Kriteria Terbaik & Terburuk yang dipilih pakar
            $table->foreignId('best_criterion_id')->constrained('kriteria');
            $table->foreignId('worst_criterion_id')->constrained('kriteria');
            
            // Jenis perbandingan: Best-to-Others atau Others-to-Worst
            $table->enum('comparison_type', ['best_to_others', 'others_to_worst']);
            
            // Kriteria yang sedang dibandingkan dengan Best/Worst
            $table->foreignId('compared_criterion_id')->constrained('kriteria');
            
            $table->integer('value');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bwm_comparisons');
    }
};
