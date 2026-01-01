import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function Index({ auth, jurusans, kriteria_statis }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [modalTitle, setModalTitle] = useState('');

    // Form State
    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        id: '',
        kode_jurusan: '',
        nama_jurusan: '',
        nilai_statis: {} // Object untuk menyimpan { kriteria_id: nilai }
    });

    // Buka Modal Tambah
    const openAddModal = () => {
        reset();
        setIsEditing(false);
        setModalTitle('Tambah Jurusan Baru');

        // Reset nilai statis kosong
        const emptyStatis = {};
        kriteria_statis.forEach(k => emptyStatis[k.id] = '');
        setData(d => ({ ...d, nilai_statis: emptyStatis }));

        setIsModalOpen(true);
    };

    // Buka Modal Edit
    const openEditModal = (item) => {
        // Mapping nilai statis dari database ke format form
        const currentNilai = {};
        // Default kosong dulu
        kriteria_statis.forEach(k => currentNilai[k.id] = '');

        // Isi dengan data dari DB (item.nilai_statis dikirim dari controller 'with')
        if (item.nilai_statis) {
            item.nilai_statis.forEach(ns => {
                currentNilai[ns.kriteria_id] = ns.nilai;
            });
        }

        setData({
            id: item.id,
            kode_jurusan: item.kode_jurusan,
            nama_jurusan: item.nama_jurusan,
            nilai_statis: currentNilai
        });

        setIsEditing(true);
        setModalTitle('Edit Jurusan');
        setIsModalOpen(true);
    };

    // Submit Form
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('admin.jurusan.update', data.id), {
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            post(route('admin.jurusan.store'), {
                onSuccess: () => setIsModalOpen(false),
            });
        }
    };

    // Hapus Jurusan
    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus jurusan ini? Data siswa terkait mungkin akan ikut terhapus.')) {
            destroy(route('admin.jurusan.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Jurusan</h2>}
        >
            <Head title="Data Jurusan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">

                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-medium text-gray-900">Daftar Jurusan SMK</h3>
                            <PrimaryButton onClick={openAddModal}>+ Tambah Jurusan</PrimaryButton>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 border">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Jurusan</th>
                                    {/* Tampilkan Kolom Kriteria Statis (Contoh: Lapangan Kerja) di header tabel jika muat */}
                                    {kriteria_statis.map(k => (
                                        <th key={k.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {k.nama} (Nilai)
                                        </th>
                                    ))}
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {jurusans.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{item.kode_jurusan}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.nama_jurusan}</td>

                                        {/* Loop Nilai Statis per Jurusan untuk ditampilkan di tabel */}
                                        {kriteria_statis.map(k => {
                                            // Cari nilai yang cocok
                                            const val = item.nilai_statis?.find(ns => ns.kriteria_id === k.id)?.nilai;
                                            return (
                                                <td key={k.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {val ? (
                                                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                                                {val}
                                                            </span>
                                                    ) : '-'}
                                                </td>
                                            );
                                        })}

                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => openEditModal(item)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                            <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">Hapus</button>
                                        </td>
                                    </tr>
                                ))}
                                {jurusans.length === 0 && (
                                    <tr>
                                        <td colSpan={3 + kriteria_statis.length} className="px-6 py-4 text-center text-gray-500">
                                            Belum ada data jurusan.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL FORM */}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">{modalTitle}</h2>

                    {/* Kode Jurusan */}
                    <div className="mb-4">
                        <InputLabel htmlFor="kode_jurusan" value="Kode Jurusan (Singkatan)" />
                        <TextInput
                            id="kode_jurusan"
                            value={data.kode_jurusan}
                            onChange={(e) => setData('kode_jurusan', e.target.value)}
                            className="mt-1 block w-full"
                            placeholder="Contoh: TKJ"
                            required
                        />
                        <InputError message={errors.kode_jurusan} className="mt-2" />
                    </div>

                    {/* Nama Jurusan */}
                    <div className="mb-4">
                        <InputLabel htmlFor="nama_jurusan" value="Nama Lengkap Jurusan" />
                        <TextInput
                            id="nama_jurusan"
                            value={data.nama_jurusan}
                            onChange={(e) => setData('nama_jurusan', e.target.value)}
                            className="mt-1 block w-full"
                            placeholder="Contoh: Teknik Komputer dan Jaringan"
                            required
                        />
                        <InputError message={errors.nama_jurusan} className="mt-2" />
                    </div>

                    {/* INPUT NILAI STATIS (DINAMIS LOOP) */}
                    {kriteria_statis.length > 0 && (
                        <div className="mt-6 p-4 bg-gray-50 border rounded-lg">
                            <h4 className="text-sm font-bold text-gray-800 mb-1">Penilaian Statis Jurusan</h4>
                            <p className="text-xs text-gray-500 mb-4">
                                Masukkan nilai untuk kriteria yang melekat pada jurusan ini (bukan diisi siswa).
                            </p>

                            <div className="space-y-3">
                                {kriteria_statis.map((k) => (
                                    <div key={k.id}>
                                        <InputLabel value={`${k.kode} - ${k.nama}`} />
                                        <div className="flex items-center gap-2 mt-1">
                                            <TextInput
                                                type="number"
                                                step="0.1"
                                                className="w-full md:w-1/3"
                                                placeholder="Nilai (1-5)"
                                                value={data.nilai_statis[k.id] || ''}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setData('nilai_statis', {
                                                        ...data.nilai_statis,
                                                        [k.id]: val
                                                    });
                                                }}
                                            />
                                            <span className="text-xs text-gray-500">
                                                (Masukkan skala 1-5 atau sesuai bobot)
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-6 flex justify-end gap-2">
                        <SecondaryButton onClick={() => setIsModalOpen(false)}>Batal</SecondaryButton>
                        <PrimaryButton disabled={processing}>Simpan</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
