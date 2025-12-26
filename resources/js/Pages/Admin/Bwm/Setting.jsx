import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function BwmSetting({ auth, kriterias, current_best, current_worst, flash }) {
    
    // Inisialisasi form dengan data yang sudah ada (jika ada)
    const { data, setData, post, processing, errors } = useForm({
        best_id: current_best || '',
        worst_id: current_worst || '',
    });

    const submit = (e) => {
        e.preventDefault();
        
        if (data.best_id && data.worst_id && data.best_id === data.worst_id) {
            alert("Kriteria Terbaik dan Terburuk tidak boleh sama!");
            return;
        }

        // Kirim ke route admin.bwm.setting.store (Pastikan route ini sudah dibuat)
        post(route('admin.bwm.setting.store'), {
            onSuccess: () => alert('Konfigurasi FGD berhasil disimpan!'),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800">Konfigurasi BWM (Hasil FGD)</h2>}
        >
            <Head title="Setting BWM" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Flash Message */}
                    {flash?.success && (
                        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                            <strong className="font-bold">Sukses!</strong>
                            <span className="block sm:inline ml-2">{flash.success}</span>
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            
                            <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                                <div className="flex">
                                    <div className="ml-3">
                                        <h3 className="text-lg font-medium text-yellow-800">Instruksi Admin</h3>
                                        <p className="text-sm text-yellow-700 mt-2">
                                            Halaman ini digunakan untuk menginput hasil kesepakatan <strong>FGD (Focus Group Discussion)</strong>. 
                                            Kriteria yang Anda pilih di sini akan menjadi <strong>referensi terkunci</strong> bagi seluruh Pakar (Guru BK & Kaprodi).
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={submit} className="space-y-8">
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* PILIH BEST */}
                                    <div className="bg-green-50 p-6 rounded-xl border-2 border-green-100">
                                        <label className="block text-lg font-bold text-green-800 mb-2">
                                            🏆 Kriteria Terbaik (Best)
                                        </label>
                                        <p className="text-sm text-green-600 mb-4">
                                            Kriteria yang disepakati paling penting.
                                        </p>
                                        <select
                                            className="w-full border-green-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 text-lg"
                                            value={data.best_id}
                                            onChange={(e) => setData('best_id', e.target.value)}
                                            required
                                        >
                                            <option value="">-- Pilih Kriteria --</option>
                                            {kriterias.map((k) => (
                                                <option key={k.id} value={k.id} disabled={k.id == data.worst_id}>
                                                    ({k.kode}) {k.nama}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.best_id && <p className="text-red-500 text-sm mt-1">{errors.best_id}</p>}
                                    </div>

                                    {/* PILIH WORST */}
                                    <div className="bg-red-50 p-6 rounded-xl border-2 border-red-100">
                                        <label className="block text-lg font-bold text-red-800 mb-2">
                                            🔻 Kriteria Terburuk (Worst)
                                        </label>
                                        <p className="text-sm text-red-600 mb-4">
                                            Kriteria yang disepakati paling kurang penting.
                                        </p>
                                        <select
                                            className="w-full border-red-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 text-lg"
                                            value={data.worst_id}
                                            onChange={(e) => setData('worst_id', e.target.value)}
                                            required
                                        >
                                            <option value="">-- Pilih Kriteria --</option>
                                            {kriterias.map((k) => (
                                                <option key={k.id} value={k.id} disabled={k.id == data.best_id}>
                                                    ({k.kode}) {k.nama}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.worst_id && <p className="text-red-500 text-sm mt-1">{errors.worst_id}</p>}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end border-t pt-6">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-6 py-3 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
                                    >
                                        {processing ? 'Menyimpan...' : 'Kunci & Simpan Hasil FGD'}
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>

                    {/* Preview Sederhana */}
                    {(data.best_id && data.worst_id) && (
                        <div className="mt-8 text-center">
                            <p className="text-gray-500 text-sm uppercase tracking-wide">Preview Logika Sistem</p>
                            <div className="mt-2 inline-flex items-center gap-4 text-lg font-bold text-gray-700 bg-white px-6 py-3 rounded-full shadow-sm">
                                <span>{kriterias.find(k => k.id == data.best_id)?.nama} (Best)</span>
                                <span className="text-gray-300">➔</span>
                                <span className="text-gray-400">Kriteria Lain</span>
                                <span className="text-gray-300">➔</span>
                                <span>{kriterias.find(k => k.id == data.worst_id)?.nama} (Worst)</span>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}