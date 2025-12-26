<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HasilRekomendasi extends Model
{
    use HasFactory;
    protected $table = 'hasil_rekomendasi';
    protected $fillable = ['siswa_id', 'skor_studi', 'skor_kerja', 'skor_wirausaha', 'keputusan_terbaik', 'tanggal_hitung'];

    public function user()
    {
        return $this->belongsTo(User::class, 'siswa_id');
    }
}
