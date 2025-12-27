<?php

namespace App\Http\Controllers;

use App\Models\BobotKriteria;
use App\Models\Kriteria;
use App\Models\BwmComparison;
use App\Models\Setting;
use App\Services\BwmService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        $user = Auth::user();

        // 1. Ambil Settingan FGD
        $bestId = Setting::where('key', 'bwm_best_id')->value('value');
        $worstId = Setting::where('key', 'bwm_worst_id')->value('value');

        if (!$bestId || !$worstId) {
            return Inertia::render('Pakar/BwmError', [
                'msg' => 'Admin belum menginput hasil FGD. Hubungi Admin.'
            ]);
        }

        $globalBest = Kriteria::find($bestId);
        $globalWorst = Kriteria::find($worstId);

        // 2. Filter Kriteria
        $query = Kriteria::query();
        if ($user->jenis_pakar === 'gurubk') {
            $query->whereIn('penanggung_jawab', ['gurubk', 'umum']);
        } elseif ($user->jenis_pakar === 'kaprodi') {
            $query->whereIn('penanggung_jawab', ['kaprodi', 'umum']);
        }
        $kriteriaUser = $query->orderBy('kode', 'asc')->get();

        // --- BARU: AMBIL DATA LAMA DARI DATABASE ---
        $savedComparisons = BwmComparison::where('pakar_id', $user->id)
            ->where('best_criterion_id', $bestId) // Pastikan referensinya sama
            ->get();

        // Format data agar sesuai dengan state React (Object key-value)
        $savedBestToOthers = [];
        $savedOthersToWorst = [];

        foreach ($savedComparisons as $item) {
            if ($item->comparison_type === 'best_to_others') {
                $savedBestToOthers[$item->compared_criterion_id] = $item->value;
            } else {
                $savedOthersToWorst[$item->compared_criterion_id] = $item->value;
            }
        }
        // -------------------------------------------

        return Inertia::render('Pakar/BwmInput', [
            'kriteria_list' => $kriteriaUser,
            'global_best' => $globalBest,
            'global_worst' => $globalWorst,
            'user_role' => $user->jenis_pakar,
            // Kirim data lama ke frontend
            'saved_best_to_others' => $savedBestToOthers,
            'saved_others_to_worst' => $savedOthersToWorst
        ]);
    }

    /**
     * Proses Hitung dan Simpan Bobot.
     */
    public function store(Request $request)
    {
        // 1. Validasi Input
        $request->validate([
            'best_to_others' => 'required|array',
            'others_to_worst' => 'required|array',
        ]);

        $user = Auth::user();

        // 2. Ambil Settingan FGD (ID Best & Worst)
        $bestId = (int) Setting::where('key', 'bwm_best_id')->value('value');
        $worstId = (int) Setting::where('key', 'bwm_worst_id')->value('value');

        // Ambil Data Inputan Pakar
        $bestToOthers = $request->best_to_others; // Array [id_kriteria => nilai 1-9]
        $othersToWorst = $request->others_to_worst; // Array [id_kriteria => nilai 1-9]

        // 1. Simpan Best to Others
        foreach ($bestToOthers as $kriteriaId => $val) {
            BwmComparison::updateOrCreate(
                [
                    'pakar_id' => $user->id,
                    'best_criterion_id' => $bestId,
                    'worst_criterion_id' => $worstId,
                    'comparison_type' => 'best_to_others',
                    'compared_criterion_id' => $kriteriaId
                ],
                ['value' => $val]
            );
        }

        // 2. Simpan Others to Worst
        foreach ($othersToWorst as $kriteriaId => $val) {
            BwmComparison::updateOrCreate(
                [
                    'pakar_id' => $user->id,
                    'best_criterion_id' => $bestId,
                    'worst_criterion_id' => $worstId,
                    'comparison_type' => 'others_to_worst',
                    'compared_criterion_id' => $kriteriaId
                ],
                ['value' => $val]
            );
        }

        $val_BestToWorst = isset($bestToOthers[$worstId]) ? (int)$bestToOthers[$worstId] : 1;

        // B. Ambil Semua Kriteria yang Menjadi Tanggung Jawab User Ini
        // (Kita harus meloop kriteria yang sesuai role pakar saja)
        $query = Kriteria::query();
        if ($user->jenis_pakar === 'gurubk') {
            $query->whereIn('penanggung_jawab', ['gurubk', 'umum']);
        } elseif ($user->jenis_pakar === 'kaprodi') {
            $query->whereIn('penanggung_jawab', ['kaprodi', 'umum']);
        }
        $kriterias = $query->get();

        $rawWeights = [];

        // C. Hitung Raw Weight (Bobot Mentah) untuk setiap Kriteria
        foreach ($kriterias as $k) {
            $id = $k->id;

            if ($id === $bestId) {
                // 1. Jika ini Kriteria BEST, bobot mentahnya pasti 1.0 (Referensi)
                $rawWeights[$id] = 1.0;
            } elseif ($id === $worstId) {
                // 2. Jika ini Kriteria WORST, bobotnya adalah 1 dibagi (Best vs Worst)
                // Contoh: Jika Best 9x lebih penting dari Worst, maka Worst = 1/9
                $rawWeights[$id] = 1.0 / $val_BestToWorst;
            } else {
                // 3. Jika Kriteria LAIN (Di tengah-tengah)
                // Kita hitung dari dua arah untuk akurasi (Rata-rata)

                // Jalur 1: Dari Best (1 / a_Bj)
                // Nilai Best vs This
                $val_BestVsThis = isset($bestToOthers[$id]) ? (int)$bestToOthers[$id] : 1;
                $w1 = 1.0 / $val_BestVsThis;

                // Jalur 2: Dari Worst (a_jW / a_BW)
                // Nilai This vs Worst
                $val_ThisVsWorst = isset($othersToWorst[$id]) ? (int)$othersToWorst[$id] : 1;
                $w2 = $val_ThisVsWorst / $val_BestToWorst;

                // Ambil Rata-rata dari kedua jalur
                $rawWeights[$id] = ($w1 + $w2) / 2;
            }
        }

        // D. Normalisasi Bobot (Agar Total = 1.0)
        // Rumus: Bobot Akhir = Bobot Mentah / Total Bobot Mentah
        $totalRawScore = array_sum($rawWeights);
        $finalWeights = [];

        foreach ($rawWeights as $id => $val) {
            // Cegah pembagian nol
            $finalWeights[$id] = $totalRawScore > 0 ? ($val / $totalRawScore) : 0;
        }

        // ---------------------------------------------------------
        // SELESAI HITUNG - SEKARANG SIMPAN KE DATABASE
        // ---------------------------------------------------------

        // Tentukan scope jurusan (Apakah Global atau Spesifik Jurusan)
        $scopeJurusan = ($user->jenis_pakar === 'kaprodi') ? $user->jurusan_id : null;

        foreach ($finalWeights as $kriteriaId => $nilaiBobot) {
            BobotKriteria::updateOrCreate(
                [
                    'kriteria_id' => $kriteriaId,
                    'jurusan_id' => $scopeJurusan // Kunci pembeda (Global vs Jurusan)
                ],
                [
                    'nilai_bobot' => $nilaiBobot
                ]
            );
        }

        return back()->with('success', 'Perhitungan BWM selesai dan data tersimpan!');
    }
}
