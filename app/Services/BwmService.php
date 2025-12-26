<?php

namespace App\Services;

class BwmService
{
    /**
     * Tabel Consistency Index (CI) berdasarkan Rezaei (2016).
     * Key: Skala perbandingan (1-9), Value: Nilai CI
     * Referensi: Proposal Bab II Tabel 2.1
     */
    protected $consistencyIndexTable = [
        1 => 0.00,
        2 => 0.44,
        3 => 1.00,
        4 => 1.63,
        5 => 2.30,
        6 => 3.00,
        7 => 3.73,
        8 => 4.47,
        9 => 5.23,
    ];

    /**
     * Hitung Bobot dan Rasio Konsistensi (CR).
     *
     * @param string $bestCriterionCode Kode Kriteria Terbaik (Contoh: 'C2')
     * @param string $worstCriterionCode Kode Kriteria Terburuk (Contoh: 'C4')
     * @param array $bestToOthers Array perbandingan Best ke yang lain ['C1' => 2, 'C2' => 1, ...]
     * @param array $othersToWorst Array perbandingan Yang lain ke Worst ['C1' => 2, 'C4' => 1, ...]
     * @return array
     */
    public function calculate(string $bestCriterionCode, string $worstCriterionCode, array $bestToOthers, array $othersToWorst)
    {
        // 1. Hitung Bobot Sementara berdasarkan vektor Best-to-Others
        // Rumus: w_j = w_best / a_Bj
        // Kita cari w_best dulu: w_best = 1 / Sigma(1/a_Bj)
        
        $sumReciprocal = 0;
        foreach ($bestToOthers as $code => $value) {
            // Validasi deviasi nol
            if ($value == 0) $value = 1; 
            $sumReciprocal += (1 / $value);
        }

        // Bobot kriteria terbaik
        $weightBest = 1 / $sumReciprocal;

        // Hitung bobot kriteria lainnya
        $weights = [];
        foreach ($bestToOthers as $code => $value) {
            $weights[$code] = $weightBest / $value;
        }

        // 2. Hitung Nilai Konsistensi (Ksi / Xi)
        // Kita cek deviasi maksimal dari input user vs hasil hitungan
        $maxDiff = 0;

        // Cek Deviasi 1: Best-to-Others (Harusnya kecil/nol karena ini basis hitungan)
        foreach ($bestToOthers as $j => $aBj) {
            // |wB / wj - aBj|
            $diff = abs(($weights[$bestCriterionCode] / $weights[$j]) - $aBj);
            if ($diff > $maxDiff) $maxDiff = $diff;
        }

        // Cek Deviasi 2: Others-to-Worst (Ini validasi sesungguhnya)
        // Rumus: |wj / wW - ajW|
        $weightWorst = $weights[$worstCriterionCode];
        foreach ($othersToWorst as $j => $ajW) {
            // |wj / wW - ajW|
            $diff = abs(($weights[$j] / $weightWorst) - $ajW);
            if ($diff > $maxDiff) $maxDiff = $diff;
        }

        // 3. Hitung Consistency Ratio (CR)
        // Ambil nilai perbandingan terbesar yang dilakukan pakar (max scale) untuk cari CI
        // Biasanya diambil dari aBW (Best to Worst)
        $aBW = $bestToOthers[$worstCriterionCode]; // Nilai Best terhadap Worst
        $ci = $this->getConsistencyIndex($aBW);

        $cr = ($ci == 0) ? 0 : ($maxDiff / $ci);

        return [
            'weights' => $weights,
            'consistency_ratio' => round($cr, 4),
            'is_consistent' => $cr <= 0.10, // Sesuai syarat CR <= 0.1 
            'xi' => $maxDiff,
            'ci_used' => $ci
        ];
    }

    /**
     * Ambil nilai CI dari tabel referensi.
     */
    private function getConsistencyIndex($scale)
    {
        // Pastikan scale integer dan dalam range 1-9
        $scale = intval($scale);
        
        if ($scale < 1) return 0.00;
        if ($scale > 9) return 5.23; // Nilai max

        return $this->consistencyIndexTable[$scale];
    }
}