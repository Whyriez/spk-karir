import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router, usePage } from "@inertiajs/react";

export default function PeriodeIndex({
    auth,
    periodes,
    errors,
    auto_setting,
    jadwal_bulan,
    jadwal_tanggal,
}) {
    // Terima props errors
    const { data, setData, post, processing, reset } = useForm({
        nama_periode: "",
    });

    const namaBulan = [
        "",
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
    ];

    // State untuk Edit
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ id: null, nama: "" });

    // Form Helper untuk Update (Manual request biar fleksibel)
    const [processingEdit, setProcessingEdit] = useState(false);

    // --- FUNGSI TAMBAH ---
    const submit = (e) => {
        e.preventDefault();
        post(route("admin.periode.store"), {
            onSuccess: () => reset(),
            preserveScroll: true,
        });
    };

    const toggleAuto = (e) => {
        const isChecked = e.target.checked;
        router.post(
            route("admin.periode.toggle"),
            { active: isChecked },
            { preserveScroll: true }
        );
    };

    // --- FUNGSI AKTIVASI ---
    const activatePeriode = (id) => {
        if (confirm("Aktifkan periode ini? Periode lain akan dinonaktifkan.")) {
            router.post(route("admin.periode.activate", id));
        }
    };

    // --- FUNGSI HAPUS ---
    const deletePeriode = (id) => {
        if (
            confirm(
                "Yakin hapus periode ini? Data nilai siswa di periode ini juga akan terhapus!"
            )
        ) {
            router.delete(route("admin.periode.destroy", id), {
                preserveScroll: true,
            });
        }
    };

    // --- FUNGSI EDIT (BUKA MODAL) ---
    const openEditModal = (p) => {
        setEditData({ id: p.id, nama: p.nama_periode });
        setIsEditing(true);
    };

    // --- FUNGSI SUBMIT EDIT ---
    const submitEdit = (e) => {
        e.preventDefault();
        setProcessingEdit(true);
        router.put(
            route("admin.periode.update", editData.id),
            {
                nama_periode: editData.nama,
            },
            {
                onSuccess: () => {
                    setIsEditing(false);
                    setProcessingEdit(false);
                },
                onError: () => setProcessingEdit(false),
                preserveScroll: true,
            }
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800">
                    Manajemen Periode
                </h2>
            }
        >
            <Head title="Periode" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                {/* Pesan Error Global (jika ada) */}
                {errors.msg && (
                    <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                        {errors.msg}
                    </div>
                )}

                {/* --- BOX SETTING OTOMATISASI --- */}
                <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 flex justify-between items-center rounded-r shadow-sm">
                    <div>
                        <h3 className="text-indigo-800 font-bold flex items-center gap-2">
                            🤖 Otomatisasi Periode (Auto-Pilot)
                        </h3>
                        <p className="text-sm text-indigo-600 mt-1">
                            Jika aktif, sistem akan otomatis membuat "Tahun
                            Ajaran Baru" setiap tanggal: <br />
                            <span className="font-bold bg-white px-2 py-0.5 rounded text-indigo-800 border border-indigo-200 mt-1 inline-block">
                                {/* 3. TAMPILKAN DINAMIS DISINI */}
                                {jadwal_tanggal} {namaBulan[jadwal_bulan]}
                            </span>
                        </p>
                    </div>

                    {/* Switch Toggle Sederhana */}
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={auto_setting}
                            onChange={toggleAuto}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        <span className="ml-3 text-sm font-medium text-gray-900">
                            {auto_setting ? "ON" : "OFF"}
                        </span>
                    </label>
                </div>

                {/* FORM TAMBAH */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-700 mb-4">
                        Buat Periode Baru
                    </h3>
                    <form onSubmit={submit} className="flex gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Contoh: Ganjil 2025/2026"
                                value={data.nama_periode}
                                onChange={(e) =>
                                    setData("nama_periode", e.target.value)
                                }
                                required
                            />
                            {errors.nama_periode && (
                                <div className="text-red-500 text-sm mt-1">
                                    {errors.nama_periode}
                                </div>
                            )}
                        </div>
                        <button
                            disabled={processing}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {processing ? "Menyimpan..." : "Tambah"}
                        </button>
                    </form>
                </div>

                {/* TABEL PERIODE */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Periode
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {periodes.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {p.nama_periode}
                                    </td>
                                    <td className="px-6 py-4">
                                        {p.is_active ? (
                                            <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-bold shadow-sm">
                                                AKTIF
                                            </span>
                                        ) : (
                                            <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full border border-gray-300">
                                                Non-Aktif
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        {!p.is_active && (
                                            <button
                                                onClick={() =>
                                                    activatePeriode(p.id)
                                                }
                                                className="text-green-600 hover:text-green-800 font-medium text-sm hover:underline"
                                            >
                                                Aktifkan
                                            </button>
                                        )}
                                        <button
                                            onClick={() => openEditModal(p)}
                                            className="text-indigo-600 hover:text-indigo-800 font-medium text-sm hover:underline"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deletePeriode(p.id)}
                                            className="text-red-600 hover:text-red-800 font-medium text-sm hover:underline"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {periodes.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="3"
                                        className="px-6 py-8 text-center text-gray-400 italic"
                                    >
                                        Belum ada data periode.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL EDIT (Pop-up Sederhana) */}
            {isEditing && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
                        <h3 className="text-lg font-bold mb-4 text-gray-800">
                            Edit Nama Periode
                        </h3>
                        <form onSubmit={submitEdit}>
                            <input
                                type="text"
                                className="w-full border-gray-300 rounded-md mb-4 focus:ring-indigo-500 focus:border-indigo-500"
                                value={editData.nama}
                                onChange={(e) =>
                                    setEditData({
                                        ...editData,
                                        nama: e.target.value,
                                    })
                                }
                                required
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processingEdit}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {processingEdit
                                        ? "Menyimpan..."
                                        : "Simpan Perubahan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
