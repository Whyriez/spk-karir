import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

export default function MonitoringIndex({ auth, results, periodes, filters }) {
    
    // State untuk Search Filter
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedPeriode, setSelectedPeriode] = useState(filters.periode_id || '');

    // State untuk Modal Catatan
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResult, setSelectedResult] = useState(null);
    const { data, setData, post, processing, reset, errors } = useForm({
        catatan_guru_bk: ''
    });

    // Handle Search (Debounce manual atau enter)
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.monitoring.index'), { 
            search: searchTerm, 
            periode_id: selectedPeriode 
        }, { preserveState: true });
    };

    // Buka Modal Edit
    const openModal = (item) => {
        setSelectedResult(item);
        setData('catatan_guru_bk', item.catatan_guru_bk || ''); // Isi jika sudah ada sebelumnya
        setIsModalOpen(true);
    };

    // Submit Catatan
    const submitCatatan = (e) => {
        e.preventDefault();
        post(route('admin.monitoring.update', selectedResult.id), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
            preserveScroll: true
        });
    };

    // Pagination Link
    const Pagination = ({ links }) => (
        <div className="flex justify-center gap-1 mt-6">
            {links.map((link, i) => (
                <button
                    key={i}
                    onClick={() => link.url && router.get(link.url)}
                    disabled={!link.url || link.active}
                    className={`px-3 py-1 border rounded text-sm ${link.active ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800">Monitoring Hasil Siswa</h2>}>
            <Head title="Monitoring Siswa" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
                
                {/* FILTER SECTION */}
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex gap-2 w-full md:w-auto">
                        <select 
                            className="border-gray-300 rounded-md text-sm"
                            value={selectedPeriode}
                            onChange={(e) => setSelectedPeriode(e.target.value)}
                        >
                            <option value="">Semua Periode</option>
                            {periodes.map(p => (
                                <option key={p.id} value={p.id}>{p.nama_periode}</option>
                            ))}
                        </select>
                        <form onSubmit={handleSearch} className="flex gap-2 w-full">
                            <input 
                                type="text" 
                                placeholder="Cari nama siswa..." 
                                className="border-gray-300 rounded-md text-sm w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700">Cari</button>
                        </form>
                    </div>
                </div>

                {/* TABLE SECTION */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Siswa / Kelas</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rekomendasi Sistem</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Skor Tertinggi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catatan Guru BK</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {results.data.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-gray-900">{item.user?.name}</div>
                                        <div className="text-xs text-gray-500">
                                            Kls {item.tingkat_kelas} | {item.periode?.nama_periode}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                                            ${item.keputusan_terbaik === 'Melanjutkan Studi' ? 'bg-indigo-100 text-indigo-800' : ''}
                                            ${item.keputusan_terbaik === 'Bekerja' ? 'bg-emerald-100 text-emerald-800' : ''}
                                            ${item.keputusan_terbaik === 'Berwirausaha' ? 'bg-orange-100 text-orange-800' : ''}
                                        `}>
                                            {item.keputusan_terbaik}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {Math.max(item.skor_studi, item.skor_kerja, item.skor_wirausaha).toFixed(4)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.catatan_guru_bk ? (
                                            <div className="text-sm text-gray-700 italic truncate max-w-xs">
                                                "{item.catatan_guru_bk}"
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400">- Belum ada -</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => openModal(item)}
                                            className="text-indigo-600 hover:text-indigo-900 text-sm font-bold border border-indigo-200 px-3 py-1 rounded hover:bg-indigo-50 transition"
                                        >
                                            {item.catatan_guru_bk ? 'Edit Catatan' : 'Beri Catatan'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {results.data.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-400">Belum ada data siswa yang masuk.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                <Pagination links={results.links} />
            </div>

            {/* MODAL BERI CATATAN */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Catatan untuk {selectedResult?.user?.name}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                ✕
                            </button>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded mb-4 text-sm">
                            <p><strong>Rekomendasi Sistem:</strong> {selectedResult?.keputusan_terbaik}</p>
                            <p><strong>Skor Studi:</strong> {selectedResult?.skor_studi.toFixed(4)}</p>
                            <p><strong>Skor Kerja:</strong> {selectedResult?.skor_kerja.toFixed(4)}</p>
                            <p><strong>Skor Wirausaha:</strong> {selectedResult?.skor_wirausaha.toFixed(4)}</p>
                        </div>

                        <form onSubmit={submitCatatan}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Isi Catatan / Saran:</label>
                            <textarea 
                                rows="4"
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Contoh: Sangat disarankan untuk mengambil jurusan Teknik Informatika di UNG karena nilai akademik matematikanya sangat menunjang..."
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