import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Result({ auth, hasil }) {
    
    // 1. Handle jika siswa belum mengisi data tapi paksa buka URL ini
    if (!hasil) {
        return (
            <AuthenticatedLayout user={auth.user}>
                 <div className="py-12 text-center">
                    <h3 className="text-lg font-bold text-gray-700">Data belum tersedia</h3>
                    <p className="text-gray-500 mb-4">Silakan isi data penilaian terlebih dahulu.</p>
                    <Link href={route('siswa.input')} className="text-blue-600 underline">Ke Halaman Input</Link>
                 </div>
            </AuthenticatedLayout>
        )
    }

    // 2. Tentukan Warna & Icon berdasarkan Keputusan
    let themeColor = 'bg-blue-600';
    let description = '';
    
    switch (hasil.keputusan_terbaik) {
        case 'Melanjutkan Studi':
            themeColor = 'bg-indigo-600';
            description = 'Berdasarkan analisis Nilai Akademik (C1) dan Minat Studi (C2), Anda memiliki potensi besar untuk sukses di jenjang Pendidikan Tinggi.';
            break;
        case 'Bekerja':
            themeColor = 'bg-emerald-600';
            description = 'Analisis menunjukkan Ketersediaan Lapangan Kerja (C6) dan Skill Praktis Anda sangat kuat untuk langsung terjun ke Dunia Industri.';
            break;
        case 'Berwirausaha':
            themeColor = 'bg-orange-500';
            description = 'Profil Anda menunjukkan Minat Usaha (C7) dan dukungan Modal/Aset (C8) yang kuat. Jalur Wirausaha sangat direkomendasikan.';
            break;
        default:
            themeColor = 'bg-gray-600';
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Hasil Analisis Karir</h2>}
        >
            <Head title="Hasil Rekomendasi" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    {/* --- BAGIAN 1: REKOMENDASI UTAMA & DETAIL SKOR (GRID) --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* KIRI: KARTU HASIL UTAMA */}
                        <div className="bg-white overflow-hidden shadow-lg rounded-xl border-t-8 border-indigo-500">
                            <div className="p-8 text-center flex flex-col items-center justify-center h-full">
                                <h3 className="text-gray-500 font-medium uppercase tracking-wider text-sm mb-2">
                                    Rekomendasi Utama
                                </h3>
                                <div className={`text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 px-4 py-2 rounded-lg bg-gray-50 border border-gray-200`}>
                                    {hasil.keputusan_terbaik.toUpperCase()}
                                </div>
                                <p className="text-gray-600 mb-6 px-4">
                                    {description}
                                </p>
                                <button className="px-6 py-2 bg-gray-800 text-white rounded-full text-sm hover:bg-gray-700 transition">
                                    Lihat Rekomendasi Jurusan/Loker
                                </button>
                            </div>
                        </div>

                        {/* KANAN: DETAIL PERHITUNGAN MOORA */}
                        <div className="bg-white overflow-hidden shadow-sm rounded-xl p-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">
                                Detail Perhitungan (Metode MOORA)
                            </h3>
                            
                            <div className="space-y-6">
                                {/* Baris Skor Studi */}
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">Melanjutkan Studi</span>
                                        <span className="text-sm font-bold text-gray-900">{hasil.skor_studi?.toFixed(4)}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${hasil.skor_studi * 100}%` }}></div>
                                    </div>
                                </div>

                                {/* Baris Skor Kerja */}
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">Bekerja (Industri)</span>
                                        <span className="text-sm font-bold text-gray-900">{hasil.skor_kerja?.toFixed(4)}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${hasil.skor_kerja * 100}%` }}></div>
                                    </div>
                                </div>

                                {/* Baris Skor Wirausaha */}
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">Berwirausaha</span>
                                        <span className="text-sm font-bold text-gray-900">{hasil.skor_wirausaha?.toFixed(4)}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${hasil.skor_wirausaha * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 bg-blue-50 p-4 rounded-md border border-blue-100">
                                <p className="text-xs text-blue-800">
                                    <strong>Info:</strong> Skor dihitung menggunakan metode MOORA dengan bobot kriteria yang telah divalidasi oleh Pakar (Guru BK) menggunakan metode BWM. Alternatif dengan skor tertinggi menjadi rekomendasi utama.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* --- BAGIAN 2: JEJAK ALUMNI (Mock Data Sesuai Wireframe) --- */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                            Jejak Alumni (Referensi Karir)
                            <span className="ml-2 px-2 py-0.5 rounded text-xs bg-gray-200 text-gray-600">Mock Data</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            
                            {/* Card Alumni 1 */}
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition">
                                <div className="font-bold text-gray-800">Budi Santoso, S.Kom</div>
                                <div className="text-xs text-gray-500 mb-2">Alumni TKJ 2020</div>
                                <div className="text-sm text-indigo-600 font-semibold">Kuliah: Teknik Informatika UNG</div>
                            </div>

                            {/* Card Alumni 2 */}
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition">
                                <div className="font-bold text-gray-800">Rina Wati</div>
                                <div className="text-xs text-gray-500 mb-2">Alumni TKJ 2021</div>
                                <div className="text-sm text-emerald-600 font-semibold">Kerja: PT Telkom Akses</div>
                            </div>

                            {/* Card Alumni 3 */}
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition">
                                <div className="font-bold text-gray-800">Dewi Putri</div>
                                <div className="text-xs text-gray-500 mb-2">Alumni TKJ 2019</div>
                                <div className="text-sm text-gray-700 font-semibold">Sukses sebagai Data Analyst</div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}