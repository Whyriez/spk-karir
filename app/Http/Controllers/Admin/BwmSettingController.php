<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kriteria;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BwmSettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Bwm/Setting', [
            'kriterias' => Kriteria::all(),
            'current_best' => Setting::where('key', 'bwm_best_id')->value('value'),
            'current_worst' => Setting::where('key', 'bwm_worst_id')->value('value'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'best_id' => 'required|exists:kriteria,id',
            'worst_id' => 'required|exists:kriteria,id|different:best_id',
        ]);

        Setting::updateOrCreate(['key' => 'bwm_best_id'], ['value' => $request->best_id]);
        Setting::updateOrCreate(['key' => 'bwm_worst_id'], ['value' => $request->worst_id]);

        return back()->with('success', 'Hasil FGD (Best & Worst) berhasil dikunci!');
    }
}
