<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HasilRekomendasi extends Model
{
    use HasFactory;
    protected $table = 'hasil_rekomendasi';
    protected $fillable = [
        'siswa_id', 'skor_studi', 'skor_kerja', 'skor_wirausaha', 
        'keputusan_terbaik', 'tanggal_hitung',
        'periode_id', 'tingkat_kelas', 'catatan_guru_bk' // <-- Baru
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'siswa_id');
    }

    public function periode()
    {
        return $this->belongsTo(Periode::class);
    }
}
