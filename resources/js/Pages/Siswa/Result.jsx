import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Result({ auth, hasil }) {
    
    // 1. Handle jika siswa belum mengisi data tapi paksa buka URL ini
    if (!hasil) {
        return (
            <AuthenticatedLayout user={auth.user}>
                 <div className="py-20 text-center">
                    <div className="inline-block p-4 bg-yellow-100 rounded-full mb-4">
                        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Data Penilaian Belum Tersedia</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        Anda belum memiliki data hasil analisis untuk periode aktif saat ini. Silakan isi kuesioner terlebih dahulu.
                    </p>
                    <Link href={route('siswa.input')} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold">
                        Mulai Input Data
                    </Link>
                 </div>
            </AuthenticatedLayout>
        )
    }

    // 2. Tentukan Warna & Deskripsi berdasarkan Keputusan
    let themeClass = 'border-gray-500 text-gray-700';
    let bgClass = 'bg-gray-50';
    let description = '';
    
    switch (hasil.keputusan_terbaik) {
        case 'Melanjutkan Studi':
            themeClass = 'border-indigo-500 text-indigo-700';
            bgClass = 'bg-indigo-50';
            description = 'Berdasarkan analisis potensi akademik dan minat studi Anda yang dominan, sistem sangat menyarankan Anda untuk melanjutkan pendidikan ke jenjang Perguruan Tinggi.';
            break;
        case 'Bekerja':
            themeClass = 'border-emerald-500 text-emerald-700';
            bgClass = 'bg-emerald-50';
            description = 'Analisis menunjukkan kesiapan kerja praktis dan orientasi karir industri Anda sangat kuat. Memasuki dunia kerja langsung setelah lulus adalah pilihan strategis.';
            break;
        case 'Berwirausaha':
            themeClass = 'border-orange-500 text-orange-700';
            bgClass = 'bg-orange-50';
            description = 'Profil Anda menunjukkan jiwa entrepreneurship yang tinggi didukung dengan modal/aset yang memadai. Merintis usaha mandiri adalah potensi terbaik Anda.';
            break;
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Laporan Hasil Analisis Karir</h2>}
        >
            <Head title="Hasil Rekomendasi" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    {/* HEADER INFO PERIODE */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500 flex justify-between items-center">
                        <div>
                            <span className="text-xs font-bold text-blue-500 uppercase tracking-wide">Periode Penilaian</span>
                            <h3 className="text-lg font-bold text-gray-800">
                                {hasil.periode ? hasil.periode.nama_periode : `Kelas ${hasil.tingkat_kelas}`}
                            </h3>
                            <p className="text-sm text-gray-500">Dihitung pada: {new Date(hasil.tanggal_hitung).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <Link href={route('dashboard')} className="text-sm text-gray-500 hover:text-gray-800 underline">
                            Lihat Riwayat Lain
                        </Link>
                    </div>

                    {/* GRID UTAMA */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* KOLOM KIRI (2/3): DETAIL HASIL */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* KARTU KEPUTUSAN UTAMA */}
                            <div className={`bg-white overflow-hidden shadow-lg rounded-xl border-t-8 ${themeClass.split(' ')[0]}`}>
                                <div className="p-8 text-center">
                                    <h3 className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-3">
                                        Rekomendasi Terbaik Sistem
                                    </h3>
                                    <div className={`text-3xl md:text-5xl font-extrabold mb-4 py-4 px-6 rounded-xl inline-block ${bgClass} ${themeClass}`}>
                                        {hasil.keputusan_terbaik.toUpperCase()}
                                    </div>
                                    <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
                                        {description}
                                    </p>
                                </div>
                            </div>

                            {/* CATATAN GURU BK (PENTING!) */}
                            <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200">
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
                                    <h3 className="font-bold text-gray-800">Catatan & Validasi Guru BK</h3>
                                </div>
                                <div className="p-6">
                                    {hasil.catatan_guru_bk ? (
                                        <div className="prose text-gray-700">
                                            <p className="italic border-l-4 border-gray-300 pl-4 py-2 bg-gray-50 rounded-r">
                                                "{hasil.catatan_guru_bk}"
                                            </p>
                                            <p className="text-xs text-gray-400 mt-2 text-right">
                                                — Diverifikasi oleh Tim Bimbingan Konseling
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-400 py-4 italic">
                                            Belum ada catatan dari Guru BK untuk hasil ini.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* KOLOM KANAN (1/3): STATISTIK SKOR */}
                        <div className="space-y-6">
                            <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-6 pb-2 border-b">Detail Skor MOORA</h3>
                                <div className="space-y-6">
                                    {/* Item Studi */}
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-gray-600">Minat Studi</span>
                                            <span className="font-bold text-indigo-600">{hasil.skor_studi?.toFixed(4)}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div className="bg-indigo-600 h-2 rounded-full transition-all duration-1000" style={{ width: `${Math.min(hasil.skor_studi * 100, 100)}%` }}></div>
                                        </div>
                                    </div>

                                    {/* Item Kerja */}
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-gray-600">Minat Kerja</span>
                                            <span className="font-bold text-emerald-600">{hasil.skor_kerja?.toFixed(4)}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div className="bg-emerald-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${Math.min(hasil.skor_kerja * 100, 100)}%` }}></div>
                                        </div>
                                    </div>

                                    {/* Item Wirausaha */}
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-gray-600">Minat Wirausaha</span>
                                            <span className="font-bold text-orange-600">{hasil.skor_wirausaha?.toFixed(4)}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div className="bg-orange-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${Math.min(hasil.skor_wirausaha * 100, 100)}%` }}></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-100">
                                    <button onClick={() => window.print()} className="w-full py-2 flex items-center justify-center gap-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition text-sm font-medium">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                                        Cetak Laporan (PDF)
                                    </button>
                                </div>
                            </div>

                            {/* Info Bantuan */}
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <h4 className="font-bold text-blue-800 text-sm mb-2">Butuh Konsultasi Lebih Lanjut?</h4>
                                <p className="text-xs text-blue-700 mb-3">
                                    Jika Anda masih ragu dengan hasil rekomendasi ini, silakan temui Guru BK di ruang konseling untuk diskusi mendalam.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}