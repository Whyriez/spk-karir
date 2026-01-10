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
        // 1. Inisialisasi Bobot Awal (Menggunakan Metode Reciprocal Sederhana sebagai Start Point)
        // Ini membantu solver menemukan solusi lebih cepat
        $initialWeights = [];
        $sumReciprocal = 0;
        foreach ($bestToOthers as $code => $val) {
            $val = ($val == 0) ? 1 : $val;
            $sumReciprocal += (1 / $val);
        }
        $wBestInitial = 1 / $sumReciprocal;

        foreach ($bestToOthers as $code => $val) {
            $initialWeights[$code] = $wBestInitial / (($val == 0) ? 1 : $val);
        }

        // 2. Jalankan Solver Optimasi untuk Meminimalkan Xi (Sesuai Rumus 2.3)
        // Kita mencari set bobot yang meminimalkan error maksimum
        $optimizationResult = $this->optimizeWeights(
            $initialWeights,
            $bestCriterionCode,
            $worstCriterionCode,
            $bestToOthers,
            $othersToWorst
        );

        $finalWeights = $optimizationResult['weights'];
        $xi = $optimizationResult['xi']; // Nilai Xi min-max optimal

        // 3. Hitung Consistency Ratio (CR)
        // Ambil skala perbandingan terbesar (biasanya aBW) untuk menentukan CI
        $aBW = $bestToOthers[$worstCriterionCode] ?? 9;
        $ci = $this->getConsistencyIndex($aBW);

        $cr = ($ci == 0) ? 0 : ($xi / $ci);

        return [
            'weights' => $finalWeights,
            'consistency_ratio' => round($cr, 4),
            'is_consistent' => $cr <= 0.10,
            'xi' => $xi,
            'ci_used' => $ci
        ];
    }

    /**
     * Solver Numerik untuk Model BWM (Iterative Hill Climbing / Random Mutation).
     * Tujuan: Menemukan bobot yang meminimalkan deviasi maksimum (Xi).
     * Sesuai batasan: |wB - aBj*wj| <= xi*wj dan |wj - ajW*wW| <= xi*wW
     */
    private function optimizeWeights($currentWeights, $bestCode, $worstCode, $bestToOthers, $othersToWorst)
    {
        $bestError = $this->calculateMaxError($currentWeights, $bestCode, $worstCode, $bestToOthers, $othersToWorst);
        $bestWeights = $currentWeights;

        // Parameter Optimasi
        $iterations = 5000; // Jumlah iterasi (semakin banyak semakin akurat)
        $learningRate = 0.1; // Seberapa besar perubahan bobot per iterasi
        $codes = array_keys($currentWeights);

        // Algoritma: Random Mutation Hill Climbing
        // Sederhana namun sangat efektif untuk masalah konveks seperti BWM
        for ($i = 0; $i < $iterations; $i++) {
            // 1. Buat kandidat bobot baru dengan mutasi kecil
            $candidateWeights = $bestWeights;

            // Pilih satu kriteria acak untuk diubah
            $randomKey = $codes[array_rand($codes)];
            $mutation = (mt_rand(-1000, 1000) / 1000) * $learningRate; // Random float antara -LR sampai +LR

            $candidateWeights[$randomKey] += $mutation;

            // Pastikan tidak negatif
            if ($candidateWeights[$randomKey] < 0.0001) {
                $candidateWeights[$randomKey] = 0.0001;
            }

            // 2. Normalisasi agar total bobot tetap 1
            $total = array_sum($candidateWeights);
            foreach ($candidateWeights as $k => $v) {
                $candidateWeights[$k] = $v / $total;
            }

            // 3. Hitung Error (Xi) untuk kandidat ini
            $candidateError = $this->calculateMaxError($candidateWeights, $bestCode, $worstCode, $bestToOthers, $othersToWorst);

            // 4. Jika error lebih kecil, simpan sebagai solusi terbaik baru
            if ($candidateError < $bestError) {
                $bestWeights = $candidateWeights;
                $bestError = $candidateError;
            }

            // Cooling schedule: kurangi learning rate perlahan agar konvergen
            if ($i % 500 == 0) {
                $learningRate *= 0.90;
            }
        }

        return [
            'weights' => $bestWeights,
            'xi' => $bestError
        ];
    }

    /**
     * Fungsi Objektif: Menghitung Maksimum Error (Xi) dari set bobot saat ini.
     * Mengimplementasikan constraints dari Rumus 2.3 Laporan.
     */
    private function calculateMaxError($weights, $bestCode, $worstCode, $bestToOthers, $othersToWorst)
    {
        $maxError = 0;
        $wBest = $weights[$bestCode];
        $wWorst = $weights[$worstCode];

        // Constraint 1: |wB - aBj * wj| <= xi * wj
        // Error terstandarisasi: |(wB / wj) - aBj| (Non-linear Input Based)
        // Atau jika mengikuti text formula 2.3 mutlak: |wB - aBj * wj| / wj
        foreach ($bestToOthers as $j => $aBj) {
            $wj = $weights[$j];
            if ($wj == 0) continue; // Hindari division by zero

            // Menggunakan bentuk Absolute Error Relative (sesuai interpretasi umum Formula 2.3 yang ada wj di ruas kanan)
            // |wB - aBj * wj| / wj  <= xi
            $error = abs($wBest - ($aBj * $wj)) / $wj;

            if ($error > $maxError) {
                $maxError = $error;
            }
        }

        // Constraint 2: |wj - ajW * wW| <= xi * wW
        // Error terstandarisasi: |(wj / wW) - ajW|
        foreach ($othersToWorst as $j => $ajW) {
            $wj = $weights[$j];

            // |wj - ajW * wW| / wW <= xi
            // Asumsi wWorst tidak 0 (karena ini kriteria terburuk, bobotnya pasti > 0)
            if ($wWorst == 0) $wWorst = 0.0001;

            $error = abs($wj - ($ajW * $wWorst)) / $wWorst;

            if ($error > $maxError) {
                $maxError = $error;
            }
        }

        return $maxError;
    }

    /**
     * Ambil nilai CI dari tabel referensi.
     */
    private function getConsistencyIndex($scale)
    {
        $scale = intval($scale);
        if ($scale < 1) return 0.00;
        if ($scale > 9) return 5.23;
        return $this->consistencyIndexTable[$scale] ?? 5.23;
    }
}
