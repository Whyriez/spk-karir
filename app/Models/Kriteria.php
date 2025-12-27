<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Inertia\Testing\Concerns\Has;

class Kriteria extends Model
{
    use HasFactory;
    protected $table = 'kriteria';
    protected $fillable = [
        'kode',
        'nama',
        'pertanyaan',
        'atribut',
        'tipe_input',
        'opsi_pilihan',
        'kategori',
        'penanggung_jawab',
    ];

    protected $casts = [
        'opsi_pilihan' => 'array', // Otomatis convert JSON DB ke Array PHP/JS
    ];
}
