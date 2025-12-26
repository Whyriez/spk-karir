import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function InputData({ auth, kriteria_kuesioner, kriteria_static, existing_data }) {
    
    // 1. Siapkan Initial State dari Data Existing (jika ada)
    const initialValues = {};
    
    // Gabungkan kriteria statis dan kuesioner untuk inisialisasi form
    [...kriteria_static, ...kriteria_kuesioner].forEach(k => {
        // Cek apakah ada data tersimpan di database untuk kriteria ini
        const savedValue = existing_data[k.id]?.nilai_input;
        // Jika ada pakai nilai lama, jika tidak kosongkan (atau default 0)
        initialValues[k.id] = savedValue || '';
    });

    const { data, setData, post, processing, errors } = useForm({
        nilai: initialValues 
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('siswa.store'), {
            onSuccess: () => alert('Data berhasil disimpan! Sistem akan menghitung rekomendasi Anda.'),
        });
    };

    // Helper untuk update nilai form
    const handleChange = (kriteriaId, value) => {
        setData('nilai', {
            ...data.nilai,
            [kriteriaId]: value // Parse int/float jika perlu
        });
    };

    // Opsi Skala Likert (1-5)
    const likertOptions = [
        { val: 1, label: 'STS (Sangat Tidak Setuju)' },
        { val: 2, label: 'TS (Tidak Setuju)' },
        { val: 3, label: 'N (Netral)' },
        { val: 4, label: 'S (Setuju)' },
        { val: 5, label: 'SS (Sangat Setuju)' },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Input Data & Minat Siswa</h2>}
        >
            <Head title="Input Data Siswa" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-8">
                        
                        {/* --- BAGIAN 1: DATA AKADEMIK & EKONOMI (STATIS) --- */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">
                                1. Data Akademik & Ekonomi
                            </h3>
                            <div className="grid grid-cols-1 gap-6">
                                {kriteria_static.map(k => {
                                    // Skip C6 (Lapangan Kerja) karena otomatis dari Jurusan
                                    if(k.kode === 'C6') return null;

                                    return (
                                        <div key={k.id}>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {k.kode} - {k.nama}
                                            </label>
                                            
                                            {/* Logic Input Khusus per Kode Kriteria */}
                                            {k.kode === 'C1' ? (
                                                <div className="flex items-center">
                                                    <input 
                                                        type="number" 
                                                        step="0.01"
                                                        max="100"
                                                        className="w-full md:w-1/2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                        placeholder="Contoh: 85.50"
                                                        value={data.nilai[k.id]}
                                                        onChange={(e) => handleChange(k.id, e.target.value)}
                                                        required
                                                    />
                                                    <span className="ml-2 text-gray-500 text-sm">/ 100 (Rata-rata Rapor)</span>
                                                </div>
                                            ) : (
                                                // Default Input Angka (misal Ekonomi/C4)
                                                // Di real case, C4 biasanya range gaji (1-5), disini kita asumsi input manual dulu atau dropdown range
                                                <select 
                                                    className="w-full md:w-1/2 border-gray-300 rounded-md shadow-sm"
                                                    value={data.nilai[k.id]}
                                                    onChange={(e) => handleChange(k.id, e.target.value)}
                                                    required
                                                >
                                                    <option value="">-- Pilih Kondisi Ekonomi --</option>
                                                    <option value="1">Kurang Mampu ({"<"} 1 Juta)</option>
                                                    <option value="2">Cukup (1 - 3 Juta)</option>
                                                    <option value="3">Sedang (3 - 5 Juta)</option>
                                                    <option value="4">Mampu (5 - 10 Juta)</option>
                                                    <option value="5">Sangat Mampu ({">"} 10 Juta)</option>
                                                </select>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* --- BAGIAN 2: KUESIONER MINAT (LIKERT) --- */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">
                                2. Kuesioner Minat & Potensi
                            </h3>
                            <p className="text-sm text-gray-600 mb-6">
                                Jawablah pertanyaan berikut sesuai dengan kondisi dan keinginan hati Anda saat ini.
                            </p>

                            <div className="space-y-8">
                                {kriteria_kuesioner.map(k => (
                                    <div key={k.id} className="bg-gray-50 p-4 rounded-lg">
                                        <label className="block text-md font-semibold text-gray-800 mb-3">
                                            {k.kode} - {k.nama}
                                        </label>
                                        
                                        {/* Pertanyaan Kontekstual (Bisa dibuat dinamis dari DB nanti) */}
                                        <p className="text-sm text-gray-600 mb-3 italic">
                                            {k.kode === 'C2' && "Seberapa besar keinginan Anda untuk melanjutkan studi (kuliah)?"}
                                            {k.kode === 'C3' && "Seberapa siap Anda untuk langsung bekerja setelah lulus?"}
                                            {k.kode === 'C5' && "Seberapa besar dukungan orang tua terhadap pilihan karir Anda?"}
                                            {k.kode === 'C7' && "Seberapa besar minat Anda untuk membuka usaha sendiri?"}
                                            {k.kode === 'C8' && "Seberapa siap modal/aset awal Anda jika harus berwirausaha?"}
                                        </p>

                                        {/* Radio Button Likert Scale */}
                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                            {likertOptions.map(opt => (
                                                <label key={opt.val} className={`
                                                    flex flex-col items-center justify-center p-3 border rounded-md cursor-pointer transition-all
                                                    ${data.nilai[k.id] == opt.val 
                                                        ? 'bg-indigo-100 border-indigo-500 text-indigo-700 ring-2 ring-indigo-500' 
                                                        : 'bg-white border-gray-200 hover:bg-gray-50'}
                                                `}>
                                                    <input 
                                                        type="radio" 
                                                        name={`kriteria_${k.id}`}
                                                        value={opt.val}
                                                        checked={data.nilai[k.id] == opt.val}
                                                        onChange={(e) => handleChange(k.id, e.target.value)}
                                                        className="sr-only" // Sembunyikan radio asli, pakai styling label
                                                    />
                                                    <span className="text-lg font-bold mb-1">{opt.val}</span>
                                                    <span className="text-xs text-center">{opt.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="w-full md:w-auto bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Sedang Menganalisis...' : 'Simpan & Lihat Hasil Rekomendasi'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}