<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NilaiSiswa extends Model
{
    use HasFactory;
    protected $table = 'nilai_siswa';
    protected $fillable = ['siswa_id', 'kriteria_id', 'nilai_input', 'periode_id', 'tingkat_kelas'];
    public function periode()
    {
        return $this->belongsTo(Periode::class);
    }
}
