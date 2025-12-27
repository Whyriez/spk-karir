<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Cell\DataValidation;
use Illuminate\Support\Collection;

class AlumniTemplateExport implements FromCollection, WithHeadings, WithStyles, ShouldAutoSize, WithEvents
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        // Kita berikan 1 baris contoh data agar user paham formatnya
        return new Collection([
            [
                'name' => 'Ahmad Contoh',
                'batch' => '2023',
                'major' => 'Rekayasa Perangkat Lunak',
                'status' => 'Kuliah', // Sesuai pilihan dropdown nanti
            ]
        ]);
    }

    public function headings(): array
    {
        return [
            'Nama Lengkap',
            'Angkatan (Tahun)',
            'Jurusan Sekolah',
            'Status (Kuliah/Kerja/Wirausaha)',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Style untuk Baris 1 (Header)
            1 => [
                'font' => [
                    'bold' => true,
                    'color' => ['rgb' => 'FFFFFF'], // Teks Putih
                    'size' => 12,
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '4F46E5'], // Warna Indigo/Biru
                ],
                'alignment' => [
                    'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                    'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                ],
            ],
            // Style untuk Baris 2 (Contoh Data) - Miring (Italic) agar terlihat beda
            2 => [
                'font' => ['italic' => true, 'color' => ['rgb' => '666666']],
            ],
        ];
    }

    /**
     * Register events untuk membuat Dropdown Validation
     */
    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();

                // 1. Set Tinggi Baris Header agar lega
                $sheet->getRowDimension(1)->setRowHeight(30);

                // 2. Membuat Dropdown pada Kolom D (Status) dari baris 2 sampai 1000
                $validation = $sheet->getCell('D2')->getDataValidation();
                $validation->setType(DataValidation::TYPE_LIST);
                $validation->setErrorStyle(DataValidation::STYLE_INFORMATION);
                $validation->setAllowBlank(false);
                $validation->setShowInputMessage(true);
                $validation->setShowErrorMessage(true);
                $validation->setShowDropDown(true);
                $validation->setErrorTitle('Input Error');
                $validation->setError('Nilai tidak ada dalam daftar.');
                $validation->setPromptTitle('Pilih Status');
                $validation->setPrompt('Silakan pilih status dari daftar.');

                // Opsi Dropdown
                $validation->setFormula1('"Kuliah,Kerja,Wirausaha,Mencari Kerja"');

                // Clone validation ke baris D2 sampai D1000
                for ($i = 3; $i <= 1000; $i++) {
                    $sheet->getCell("D$i")->setDataValidation(clone $validation);
                }

                // 3. Tambahkan Border Tipis untuk range data
                $sheet->getStyle('A1:D10')->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);
            },
        ];
    }
}
