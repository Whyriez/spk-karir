import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function InputData({ auth, kriterias, existing_data }) {

    // Gabungkan semua kriteria untuk inisialisasi form
    const initialValues = {};
    kriterias.forEach(k => {
        // Ambil nilai lama dari existing_data (jika ada)
        const savedValue = existing_data && existing_data[k.id] ? existing_data[k.id] : '';
        initialValues[k.id] = savedValue;
    });

    const { data, setData, post, processing } = useForm({
        nilai: initialValues
    });

    const listAkademik = kriterias.filter(k =>
        k.kategori === 'akademik' && k.sumber_nilai === 'input_siswa'
    );
    const listKuesioner = kriterias.filter(k =>
        k.kategori === 'kuesioner' && k.sumber_nilai === 'input_siswa'
    );

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
        // CATATAN: Tidak perlu lagi cek hidden (C6), karena data 'k' disini
        // sudah pasti yang 'tampil_di_siswa' = true dari controller.

        // 1. Tipe NUMBER
        if (k.tipe_input === 'number') {
            return (
                <div className="flex items-center">
                    <input
                        type="number" step="0.01"
                        className="w-full md:w-1/2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder={`Masukkan nilai ${k.nama}`}
                        value={data.nilai[k.id]}
                        onChange={(e) => handleChange(k.id, e.target.value)}
                        required
                    />
                </div>
            );
        }

        // 2. Tipe SELECT / DROPDOWN
        if (k.tipe_input === 'select') {
            return (
                <select
                    className="w-full md:w-1/2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={data.nilai[k.id]}
                    onChange={(e) => handleChange(k.id, e.target.value)}
                    required
                >
                    <option value="">-- Pilih Opsi --</option>
                    {/* Mengambil opsi dari kolom JSON database */}
                    {k.opsi_pilihan && k.opsi_pilihan.map((opt, idx) => (
                        <option key={idx} value={opt.val}>{opt.label}</option>
                    ))}
                </select>
            );
        }

        // 3. Tipe LIKERT (Radio Button)
        if (k.tipe_input === 'likert') {
            const likertOptions = [
                { val: 1, label: 'STS' }, { val: 2, label: 'TS' },
                { val: 3, label: 'N' }, { val: 4, label: 'S' }, { val: 5, label: 'SS' }
            ];
            return (
                <div className="grid grid-cols-5 gap-2 mt-2 md:w-3/4">
                    {likertOptions.map(opt => (
                        <label key={opt.val} className={`
                            cursor-pointer border rounded-md p-2 text-center transition-all
                            ${data.nilai[k.id] == opt.val
                            ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-300'
                            : 'bg-white text-gray-700 hover:bg-gray-50'}
                        `}>
                            <input
                                type="radio" name={`k_${k.id}`} value={opt.val}
                                checked={data.nilai[k.id] == opt.val}
                                onChange={(e) => handleChange(k.id, e.target.value)}
                                className="sr-only" // Sembunyikan radio asli
                            />
                            <div className="font-bold text-lg">{opt.val}</div>
                            <div className="text-[10px] uppercase">{opt.label}</div>
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

                        {/* BAGIAN 1: Loop Data Akademik */}
                        {listAkademik.length > 0 && (
                            <div className="bg-white p-6 shadow-sm rounded-lg border-l-4 border-blue-500">
                                <h3 className="text-lg font-bold mb-4 text-gray-800">1. Data Akademik & Ekonomi</h3>
                                <div className="space-y-6">
                                    {listAkademik.map(k => (
                                        <div key={k.id}>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                {k.kode} - {k.nama}
                                            </label>
                                            {/* Tampilkan pertanyaan jika ada */}
                                            {k.pertanyaan && (
                                                <p className="text-xs text-gray-500 mb-2">{k.pertanyaan}</p>
                                            )}
                                            {renderInputField(k)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* BAGIAN 2: Loop Data Kuesioner */}
                        {listKuesioner.length > 0 && (
                            <div className="bg-white p-6 shadow-sm rounded-lg border-l-4 border-green-500">
                                <h3 className="text-lg font-bold mb-4 text-gray-800">2. Kuesioner Minat</h3>
                                <div className="space-y-8">
                                    {listKuesioner.map(k => (
                                        <div key={k.id} className="border-b pb-6 last:border-0 last:pb-0">
                                            <label className="block text-base font-semibold text-gray-900">
                                                {k.kode} - {k.nama}
                                            </label>
                                            <p className="text-sm text-gray-600 mb-3 mt-1 italic">
                                                "{k.pertanyaan || 'Silakan isi nilai sesuai kondisi Anda'}"
                                            </p>
                                            {renderInputField(k)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 font-semibold shadow-lg transition-all transform hover:scale-105"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Data'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
