<?php

namespace App\Imports;

use App\Models\Alumni;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class AlumniImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        // 1. Logic pengambilan data (sama seperti sebelumnya)
        $status = $row['status_kuliahkerjawirausaha']
            ?? $row['status_kuliah_kerja_wirausaha']
            ?? $row['status']
            ?? '-';

        $name   = $row['nama_lengkap'] ?? $row['nama'] ?? 'Tanpa Nama';
        $batch  = $row['angkatan_tahun'] ?? $row['angkatan'] ?? date('Y');
        $major  = $row['jurusan_sekolah'] ?? $row['jurusan'] ?? 'Umum';

        // 2. Mencegah Duplikasi dengan updateOrCreate
        // Kita anggap data UNIK jika kombinasi 'name' dan 'batch' (Angkatan) sama.
        return Alumni::updateOrCreate(
            [
                // KUNCI PENCARIAN (Unique Key)
                'name'   => $name,
                'batch'  => $batch,
            ],
            [
                // DATA YANG AKAN DI-UPDATE / DI-INSERT
                // Jika nama & angkatan sama, maka jurusan dan status akan diperbarui
                'major'  => $major,
                'status' => $status,
            ]
        );
    }
}
