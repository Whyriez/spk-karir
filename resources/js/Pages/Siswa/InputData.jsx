import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function InputData({ auth, kriteria_akademik, kriteria_kuesioner, existing_data }) {

    // Gabungkan semua kriteria untuk inisialisasi form
    const allKriteria = [...kriteria_akademik, ...kriteria_kuesioner];

    const initialValues = {};
    allKriteria.forEach(k => {
        const savedValue = existing_data[k.id]?.nilai_input;
        initialValues[k.id] = savedValue || '';
    });

    const { data, setData, post, processing } = useForm({
        nilai: initialValues
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('siswa.store'), {
            onSuccess: () => alert('Data berhasil disimpan!'),
        });
    };

    const handleChange = (kriteriaId, value) => {
        setData('nilai', { ...data.nilai, [kriteriaId]: value });
    };

    // --- KOMPONEN INPUT DINAMIS ---
    // Fungsi ini akan merender input sesuai 'tipe_input' dari database
    const renderInputField = (k) => {
        // 1. Tipe NUMBER (Cth: Nilai Rapor)
        if (k.tipe_input === 'number') {
            if(k.kode === 'C6') return null; // Pengecualian khusus jika C6 hidden
            return (
                <div className="flex items-center">
                    <input
                        type="number" step="0.01" max="100"
                        className="w-full md:w-1/2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Masukkan Angka"
                        value={data.nilai[k.id]}
                        onChange={(e) => handleChange(k.id, e.target.value)}
                        required
                    />
                </div>
            );
        }

        // 2. Tipe SELECT / DROPDOWN (Cth: Ekonomi)
        if (k.tipe_input === 'select') {
            return (
                <select
                    className="w-full md:w-1/2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={data.nilai[k.id]}
                    onChange={(e) => handleChange(k.id, e.target.value)}
                    required
                >
                    <option value="">-- Pilih Opsi --</option>
                    {/* Render Opsi dari JSON Database */}
                    {k.opsi_pilihan && k.opsi_pilihan.map((opt, idx) => (
                        <option key={idx} value={opt.val}>{opt.label}</option>
                    ))}
                </select>
            );
        }

        // 3. Tipe LIKERT (Cth: Minat)
        if (k.tipe_input === 'likert') {
            const likertOptions = [
                { val: 1, label: 'STS' }, { val: 2, label: 'TS' },
                { val: 3, label: 'N' }, { val: 4, label: 'S' }, { val: 5, label: 'SS' }
            ];
            return (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
                    {likertOptions.map(opt => (
                        <label key={opt.val} className={`
                            flex flex-col items-center justify-center p-3 border rounded-md cursor-pointer transition-all
                            ${data.nilai[k.id] == opt.val ? 'bg-indigo-100 border-indigo-500 text-indigo-700 ring-2' : 'bg-white hover:bg-gray-50'}
                        `}>
                            <input
                                type="radio" name={`k_${k.id}`} value={opt.val}
                                checked={data.nilai[k.id] == opt.val}
                                onChange={(e) => handleChange(k.id, e.target.value)}
                                className="sr-only"
                            />
                            <span className="font-bold">{opt.val}</span>
                            <span className="text-xs">{opt.label}</span>
                        </label>
                    ))}
                </div>
            );
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800">Input Data Siswa</h2>}>
            <Head title="Input Data" />
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-8">

                        {/* LOOP 1: DATA AKADEMIK (Semua yang kategori 'akademik') */}
                        <div className="bg-white p-6 shadow-sm rounded-lg">
                            <h3 className="text-lg font-bold mb-4 border-b pb-2">1. Data Akademik & Ekonomi</h3>
                            <div className="space-y-6">
                                {kriteria_akademik.map(k => (
                                    k.kode !== 'C6' && ( // Cek hidden
                                        <div key={k.id}>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {k.kode} - {k.nama}
                                            </label>
                                            <p className="text-xs text-gray-500 mb-2">{k.pertanyaan}</p>
                                            {renderInputField(k)}
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>

                        {/* LOOP 2: KUESIONER (Semua yang kategori 'kuesioner') */}
                        <div className="bg-white p-6 shadow-sm rounded-lg">
                            <h3 className="text-lg font-bold mb-4 border-b pb-2">2. Kuesioner Minat</h3>
                            <div className="space-y-8">
                                {kriteria_kuesioner.map(k => (
                                    <div key={k.id} className="bg-gray-50 p-4 rounded-lg">
                                        <label className="block font-semibold text-gray-800">{k.kode} - {k.nama}</label>
                                        <p className="text-sm text-gray-600 mb-3 italic">"{k.pertanyaan}"</p>
                                        {renderInputField(k)}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button type="submit" disabled={processing} className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">
                                Simpan Data
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
