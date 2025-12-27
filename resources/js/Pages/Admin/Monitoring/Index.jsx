import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

export default function MonitoringIndex({ auth, results, periodes, filters }) {

    // State Filter
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedPeriode, setSelectedPeriode] = useState(filters.periode_id || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'sudah'); // State Baru

    // State Modal Catatan
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResult, setSelectedResult] = useState(null);
    const { data, setData, post, processing, reset, errors } = useForm({
        catatan_guru_bk: ''
    });

    // Handle Search / Filter Trigger
    const handleFilterChange = (newStatus, newPeriode, newSearch) => {
        router.get(route('admin.monitoring.index'), {
            search: newSearch ?? searchTerm,
            periode_id: newPeriode ?? selectedPeriode,
            status: newStatus ?? selectedStatus
        }, { preserveState: true });
    };

    // Shortcut untuk event handler
    const onSearch = (e) => { e.preventDefault(); handleFilterChange(null, null, searchTerm); };
    const onStatusChange = (e) => { setSelectedStatus(e.target.value); handleFilterChange(e.target.value, null, null); };
    const onPeriodeChange = (e) => { setSelectedPeriode(e.target.value); handleFilterChange(null, e.target.value, null); };

    // Buka Modal Edit
    const openModal = (item) => {
        setSelectedResult(item);
        setData('catatan_guru_bk', item.catatan_guru_bk || '');
        setIsModalOpen(true);
    };

    const submitCatatan = (e) => {
        e.preventDefault();
        post(route('admin.monitoring.update', selectedResult.id), {
            onSuccess: () => { setIsModalOpen(false); reset(); },
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Monitoring Siswa</h2>}
        >
            <Head title="Monitoring Siswa" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">

                        {/* --- FILTER SECTION --- */}
                        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                            <form onSubmit={onSearch} className="flex gap-2 w-full md:w-1/3">
                                <input
                                    type="text"
                                    placeholder="Cari Nama / NISN..."
                                    className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm w-full"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                                    Cari
                                </button>
                            </form>

                            <div className="flex gap-2 w-full md:w-2/3 justify-end">
                                {/* Filter Status (Baru) */}
                                <select
                                    className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    value={selectedStatus}
                                    onChange={onStatusChange}
                                >
                                    <option value="sudah">Sudah Mengisi</option>
                                    <option value="belum">Belum Mengisi</option>
                                </select>

                                {/* Filter Periode */}
                                <select
                                    className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    value={selectedPeriode}
                                    onChange={onPeriodeChange}
                                >
                                    <option value="">Semua Periode</option>
                                    {periodes.map((p) => (
                                        <option key={p.id} value={p.id}>{p.nama_periode} {p.is_active ? '(Aktif)' : ''}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* --- TABLE SECTION --- */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Siswa</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas / Jurusan</th>

                                    {/* Kolom Kondisional */}
                                    {selectedStatus === 'sudah' ? (
                                        <>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keputusan</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nilai Optima</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catatan BK</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                        </>
                                    ) : (
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    )}
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {results.data.length > 0 ? (
                                    results.data.map((item, index) => {
                                        // Normalisasi Data (Karna struktur beda antara 'sudah' dan 'belum')
                                        const siswaName = item.user ? item.user.name : item.name;
                                        const siswaNisn = item.user ? item.user.nisn : item.nisn;
                                        // Ambil jurusan: jika 'sudah' ambil dari user.jurusan (perlu eager load di controller) atau manual
                                        // Asumsi: item.user ada relasi jurusan, atau item (user) ada relasi jurusan
                                        const jurusanName = (item.user?.jurusan?.nama_jurusan) || (item.jurusan?.nama_jurusan) || '-';
                                        const kelas = item.tingkat_kelas || item.kelas_saat_ini || '-';

                                        return (
                                            <tr key={item.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {(results.current_page - 1) * results.per_page + index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{siswaName}</div>
                                                    <div className="text-sm text-gray-500">{siswaNisn}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {kelas} - {jurusanName}
                                                </td>

                                                {/* KONTEN BERBEDA BERDASARKAN STATUS */}
                                                {selectedStatus === 'sudah' ? (
                                                    <>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                                    ${item.keputusan_terbaik === 'Melanjutkan Studi' ? 'bg-indigo-100 text-indigo-800' :
                                                                    item.keputusan_terbaik === 'Bekerja' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                                                                    {item.keputusan_terbaik}
                                                                </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {Math.max(item.skor_studi, item.skor_kerja, item.skor_wirausaha).toFixed(4)}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                                            {item.catatan_guru_bk || <span className="italic text-gray-300">Belum ada catatan</span>}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button
                                                                onClick={() => openModal(item)}
                                                                className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded-md"
                                                            >
                                                                {item.catatan_guru_bk ? 'Edit Catatan' : '+ Catatan'}
                                                            </button>
                                                        </td>
                                                    </>
                                                ) : (
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                                Belum Mengisi
                                                            </span>
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={selectedStatus === 'sudah' ? 7 : 4} className="px-6 py-8 text-center text-gray-500 italic">
                                            Tidak ada data siswa ditemukan.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination (Jika Anda menggunakan komponen Pagination terpisah, masukkan disini) */}
                        <div className="mt-4">
                            {/* Render link pagination manual atau komponen */}
                            {results.links && results.links.length > 3 && (
                                <div className="flex justify-center gap-1">
                                    {results.links.map((link, k) => (
                                        <button
                                            key={k}
                                            onClick={() => link.url && router.get(link.url, { status: selectedStatus, search: searchTerm, periode_id: selectedPeriode }, { preserveState: true })}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`px-3 py-1 border rounded text-sm ${link.active ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            disabled={!link.url}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* MODAL INPUT CATATAN (Hanya Render jika filter 'sudah') */}
            {isModalOpen && selectedStatus === 'sudah' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            Catatan untuk {selectedResult?.user?.name}
                        </h3>
                        <form onSubmit={submitCatatan}>
                            <textarea
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                rows="4"
                                placeholder="Tuliskan catatan konseling, validasi hasil, atau saran tambahan..."
                                value={data.catatan_guru_bk}
                                onChange={(e) => setData('catatan_guru_bk', e.target.value)}
                                required
                            ></textarea>
                            {errors.catatan_guru_bk && <div className="text-red-500 text-sm mt-1">{errors.catatan_guru_bk}</div>}

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Catatan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
