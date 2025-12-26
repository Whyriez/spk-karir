<?php

namespace App\Http\Controllers;

use App\Models\Kriteria;
use App\Models\BwmComparison;
use App\Services\BwmService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BwmController extends Controller
{
    protected $bwmService;

    public function __construct(BwmService $bwmService)
    {
        $this->bwmService = $bwmService;
    }

    /**
     * Tampilkan Halaman Input BWM (React Page).
     */
    public function index()
    {
        // Ambil data kriteria untuk dropdown
        $kriteria = Kriteria::select('id', 'kode', 'nama')->get();

        return Inertia::render('Pakar/BwmInput', [
            'kriteria' => $kriteria
        ]);
    }

    /**
     * Proses Hitung dan Simpan Bobot.
     */
    public function store(Request $request)
    {
        // 1. Validasi Input
        $request->validate([
            'best_criterion_id' => 'required|exists:kriteria,id',
            'worst_criterion_id' => 'required|exists:kriteria,id|different:best_criterion_id',
            'best_to_others' => 'required|array',
            'others_to_worst' => 'required|array',
        ]);

        // 2. Ambil Data Kriteria
        $bestCriteria = Kriteria::find($request->best_criterion_id);
        $worstCriteria = Kriteria::find($request->worst_criterion_id);
        $allKriteria = Kriteria::all()->keyBy('id');
        
        // 3. Mapping Input ID ke Kode (C1, C2...)
        $bestToOthersMap = [];
        foreach ($request->best_to_others as $id => $val) {
            if (isset($allKriteria[$id])) {
                $code = $allKriteria[$id]->kode;
                $bestToOthersMap[$code] = (int)$val;
            }
        }

        $othersToWorstMap = [];
        foreach ($request->others_to_worst as $id => $val) {
             if (isset($allKriteria[$id])) {
                $code = $allKriteria[$id]->kode;
                $othersToWorstMap[$code] = (int)$val;
            }
        }

        // --- FIX: Tambahkan Manual Nilai Self-Comparison (Nilai 1) ---
        // Karena React tidak mengirim data Best vs Best atau Worst vs Worst
        
        // a. Best vs Best = 1
        $bestToOthersMap[$bestCriteria->kode] = 1;
        
        // b. Worst vs Worst = 1
        $othersToWorstMap[$worstCriteria->kode] = 1;

        // -----------------------------------------------------------

        // 4. Panggil BwmService
        $result = $this->bwmService->calculate(
            $bestCriteria->kode,
            $worstCriteria->kode,
            $bestToOthersMap,
            $othersToWorstMap
        );

        // 5. Cek Konsistensi
        if (!$result['is_consistent']) {
            return back()->withErrors([
                'cr' => 'Nilai Rasio Konsistensi (CR) adalah ' . $result['consistency_ratio'] . '. Nilai harus <= 0.1. Silakan revisi penilaian Anda.'
            ]);
        }

        // 6. Simpan jika Valid
        try {
            DB::beginTransaction();

            foreach ($result['weights'] as $code => $weight) {
                Kriteria::where('kode', $code)->update(['bobot_bwm' => $weight]);
            }

            DB::commit();

            // Ubah redirect sesuai route dashboard kamu, atau back()
            return back()->with('success', 'Bobot berhasil disimpan! CR: ' . $result['consistency_ratio']);

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['system' => 'Terjadi kesalahan sistem: ' . $e->getMessage()]);
        }
    }
}