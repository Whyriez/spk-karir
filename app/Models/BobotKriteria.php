<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BobotKriteria extends Model
{
    protected $table = 'bobot_kriterias';

    protected $fillable = [
        'kriteria_id',
        'jurusan_id',
        'nilai_bobot',
    ];
}
