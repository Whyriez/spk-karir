import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router, usePage } from "@inertiajs/react";

export default function KriteriaIndex({ auth, kriterias }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const { flash } = usePage().props;

    // Form State
    const { data, setData, post, put, processing, reset, errors } = useForm({
        id: "",
        kode: "",
        nama: "",
        tipe_input: "number",
        penanggung_jawab: "gurubk", // Default owner
    });

    const openModalAdd = () => {
        reset();
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const openModalEdit = (item) => {
        setData({
            id: item.id,
            kode: item.kode, // Kode read-only saat edit
            nama: item.nama,
            tipe_input: item.tipe_input,
            penanggung_jawab: item.penanggung_jawab,
        });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();

        // 1. Definisikan Options (Callback UI)
        const options = {
            onSuccess: () => {
                setIsModalOpen(false); // Tutup Modal
                reset(); // Bersihkan Form
            },
            onError: (errors) => {
                console.log("Error:", errors);
                // Modal tetap terbuka agar user bisa lihat error
            },
            preserveScroll: true, // Opsional: Agar halaman tidak scroll ke atas
        };

        // 2. Eksekusi Request
        // PERHATIKAN: Cukup (URL, OPTIONS). Jangan masukkan 'data' lagi.
        if (isEditing) {
            put(route("admin.kriteria.update", data.id), options);
        } else {
            post(route("admin.kriteria.store"), options);
        }
    };

    const deleteKriteria = (id) => {
        if (
            confirm(
                "HATI-HATI! Menghapus kriteria akan menghapus seluruh data nilai siswa pada kriteria ini. Lanjutkan?"
            )
        ) {
            router.delete(route("admin.kriteria.destroy", id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800">
                    Manajemen Kriteria
                </h2>
            }
        >
            <Head title="Kriteria" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
                {flash && flash.success && (
                    <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                        <strong className="font-bold">Sukses!</strong>
                        <span className="block sm:inline ml-2">
                            {flash.success}
                        </span>
                    </div>
                )}

                <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-700">
                            Daftar Kriteria SPK
                        </h3>
                        <button
                            onClick={openModalAdd}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                        >
                            + Tambah Kriteria
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Kode
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Nama Kriteria
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Tipe Input
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Penanggung Jawab
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {kriterias.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 font-bold text-gray-900">
                                            {item.kode}
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">
                                            {item.nama}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full ${
                                                    item.tipe_input === "number"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-purple-100 text-purple-800"
                                                }`}
                                            >
                                                {item.tipe_input === "number"
                                                    ? "Angka (Rapor)"
                                                    : "Pilihan (Kuesioner)"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {/* Badge Penanggung Jawab */}
                                            {item.penanggung_jawab ===
                                                "gurubk" && (
                                                <span className="px-2 py-1 text-xs rounded-full bg-pink-100 text-pink-800 border border-pink-200">
                                                    Guru BK
                                                </span>
                                            )}
                                            {item.penanggung_jawab ===
                                                "kaprodi" && (
                                                <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                                                    Kaprodi
                                                </span>
                                            )}
                                            {item.penanggung_jawab ===
                                                "umum" && (
                                                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                                                    Umum
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() =>
                                                    openModalEdit(item)
                                                }
                                                className="text-indigo-600 hover:underline text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    deleteKriteria(item.id)
                                                }
                                                className="text-red-600 hover:underline text-sm"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL FORM */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">
                            {isEditing
                                ? "Edit Kriteria"
                                : "Tambah Kriteria Baru"}
                        </h3>
                        <form onSubmit={submit} className="space-y-4">
                            {/* KODE (Hanya bisa isi saat Tambah Baru) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Kode Kriteria
                                </label>
                                <input
                                    type="text"
                                    className={`w-full border-gray-300 rounded-md ${
                                        isEditing
                                            ? "bg-gray-100 cursor-not-allowed"
                                            : ""
                                    }`}
                                    placeholder="Contoh: C1"
                                    value={data.kode}
                                    onChange={(e) =>
                                        setData("kode", e.target.value)
                                    }
                                    disabled={isEditing}
                                    required
                                />
                                {errors.kode && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.kode}
                                    </p>
                                )}
                            </div>

                            {/* NAMA */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Nama Kriteria
                                </label>
                                <input
                                    type="text"
                                    className="w-full border-gray-300 rounded-md"
                                    value={data.nama}
                                    onChange={(e) =>
                                        setData("nama", e.target.value)
                                    }
                                    required
                                />
                            </div>

                            {/* TIPE INPUT */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Tipe Input Siswa
                                </label>
                                <select
                                    className="w-full border-gray-300 rounded-md"
                                    value={data.tipe_input}
                                    onChange={(e) =>
                                        setData("tipe_input", e.target.value)
                                    }
                                >
                                    <option value="number">
                                        Angka (Rapor 0-100)
                                    </option>
                                    <option value="select">
                                        Pilihan (Kuesioner 1-5)
                                    </option>
                                </select>
                            </div>

                            {/* PENANGGUNG JAWAB (FITUR UTAMA) */}
                            <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                                <label className="block text-sm font-bold text-yellow-800 mb-1">
                                    Siapa yang mengatur Bobot?
                                </label>
                                <select
                                    className="w-full border-yellow-300 rounded-md focus:ring-yellow-500"
                                    value={data.penanggung_jawab}
                                    onChange={(e) =>
                                        setData(
                                            "penanggung_jawab",
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="gurubk">
                                        Guru BK (Aspek Psikologis/Akademik)
                                    </option>
                                    <option value="kaprodi">
                                        Kaprodi (Aspek Industri/Pasar)
                                    </option>
                                    <option value="umum">
                                        Semua (Bisa diedit keduanya)
                                    </option>
                                </select>
                                <p className="text-xs text-yellow-700 mt-1">
                                    Pakar lain tidak akan bisa mengubah bobot
                                    kriteria ini.
                                </p>
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-200 rounded text-gray-700"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
