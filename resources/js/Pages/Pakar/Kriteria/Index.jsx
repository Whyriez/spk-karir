import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";

export default function Index({ auth, kriterias }) {
    const [editingKriteria, setEditingKriteria] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Form setup
    const { data, setData, patch, processing, errors, reset } = useForm({
        pertanyaan: "",
    });

    const openEditModal = (kriteria) => {
        setEditingKriteria(kriteria);
        setData("pertanyaan", kriteria.pertanyaan || ""); // Isi existing value
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingKriteria(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route("pakar.kriteria.update", editingKriteria.id), {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manajemen Pertanyaan Kriteria
                </h2>
            }
        >
            <Head title="Manajemen Pertanyaan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <p className="text-gray-600 mb-6">
                            Silakan atur pertanyaan untuk setiap kriteria yang
                            menjadi tanggung jawab Anda. Pertanyaan ini akan
                            muncul saat siswa mengisi kuesioner.
                        </p>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kode
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kriteria
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tipe Input
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Pertanyaan Saat Ini
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {kriterias.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {item.kode}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.nama}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {item.tipe_input}
                                                </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                                            {item.pertanyaan ? (
                                                item.pertanyaan
                                            ) : (
                                                <span className="text-red-400 italic">
                                                        Belum diatur
                                                    </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() =>
                                                    openEditModal(item)
                                                }
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {kriterias.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-4 text-center text-gray-500"
                                        >
                                            Tidak ada kriteria yang ditugaskan
                                            kepada Anda.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL EDIT PERTANYAAN */}
            <Modal show={showModal} onClose={closeModal}>
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Edit Pertanyaan: {editingKriteria?.nama}
                    </h2>

                    <div className="mt-4">
                        <InputLabel
                            htmlFor="pertanyaan"
                            value="Teks Pertanyaan"
                        />
                        <textarea
                            id="pertanyaan"
                            className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1"
                            rows="4"
                            value={data.pertanyaan}
                            onChange={(e) => setData("pertanyaan", e.target.value)}
                            placeholder="Contoh: Berapa rata-rata nilai Matematika Anda? atau Seberapa sering Anda..."
                        ></textarea>
                        <InputError
                            message={errors.pertanyaan}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            Batal
                        </SecondaryButton>

                        <PrimaryButton className="ml-3" disabled={processing}>
                            Simpan Pertanyaan
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
