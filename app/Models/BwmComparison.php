<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BwmComparison extends Model
{
    protected $table = 'bwm_comparisons';

    protected $fillable = [
        'pakar_id',              // <-- Di migration namanya pakar_id
        'best_criterion_id',
        'worst_criterion_id',
        'comparison_type',
        'compared_criterion_id', // <-- Di migration namanya compared_criterion_id
        'value',
    ];
}
