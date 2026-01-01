<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Inertia\Testing\Concerns\Has;

class Kriteria extends Model
{
    protected $table = 'kriteria';
    protected $fillable = [
        'kode',
        'nama',
        'pertanyaan',
        'tampil_di_siswa',
        'atribut',
        'tipe_input',
        'opsi_pilihan',
        'kategori',
        'sumber_nilai',
        'penanggung_jawab',
    ];

    protected $casts = [
        'opsi_pilihan' => 'array',
        'tampil_di_siswa' => 'boolean',
    ];
}
