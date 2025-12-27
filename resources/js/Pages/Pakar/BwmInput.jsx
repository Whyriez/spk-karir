import React, { useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";

// Props berubah sesuai controller baru
export default function BwmInput({ auth, kriteria_list, global_best, global_worst, user_role }) {

    // Form Helper
    const { data, setData, post, processing, errors } = useForm({
        best_to_others: {},
        others_to_worst: {},
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("pakar.bwm.store"), {
            onSuccess: () => alert("Bobot penilaian berhasil disimpan!"),
            onError: () => alert("Mohon lengkapi perbandingan."),
        });
    };

    const handleComparisonChange = (type, targetId, value) => {
        const key = type === "best" ? "best_to_others" : "others_to_worst";
        setData(key, {
            ...data[key],
            [targetId]: parseInt(value),
        });
    };

    const scaleOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800">Input BWM (Sesuai FGD)</h2>}
        >
            <Head title="Input BWM" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* INFO ROLE */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                        <p className="text-sm text-blue-700">
                            Login sebagai: <strong>{user_role === 'gurubk' ? 'Guru BK' : 'Kaprodi'}</strong>. <br/>
                            Di bawah ini adalah kriteria yang menjadi tanggung jawab Anda untuk dibandingkan terhadap referensi FGD.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">

                        {/* --- TAMPILAN STATIS BEST & WORST (DARI PROPS) --- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* KOTAK BEST */}
                            <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200 text-center shadow-sm">
                                <span className="text-xs font-bold text-green-600 uppercase tracking-wider">Reference Best (FGD)</span>
                                <div className="text-2xl font-extrabold text-green-800 mt-2">
                                    {global_best.nama}
                                </div>
                                <div className="text-sm text-green-600 font-mono mt-1">Kode: {global_best.kode}</div>
                            </div>

                            {/* KOTAK WORST */}
                            <div className="bg-red-50 p-6 rounded-lg border-2 border-red-200 text-center shadow-sm">
                                <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Reference Worst (FGD)</span>
                                <div className="text-2xl font-extrabold text-red-800 mt-2">
                                    {global_worst.nama}
                                </div>
                                <div className="text-sm text-red-600 font-mono mt-1">Kode: {global_worst.kode}</div>
                            </div>
                        </div>

                        {/* --- FORM PERBANDINGAN --- */}

                        {/* 1. BEST VS LAINNYA (Milik User) */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                                Seberapa lebih penting <u>BEST ({global_best.nama})</u> dibanding kriteria Anda?
                            </h3>
                            <div className="space-y-3">
                                {kriteria_list.map((k) => {
                                    // Jangan bandingkan Best vs Best (Nilai pasti 1)
                                    if (k.id === global_best.id) return null;

                                    return (
                                        <div key={k.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                            <span className="text-gray-700 font-medium w-1/2">
                                                Best ➔ {k.nama} ({k.kode})
                                            </span>
                                            <select
                                                className="w-32 border-gray-300 rounded-md shadow-sm text-sm focus:ring-green-500"
                                                onChange={(e) => handleComparisonChange("best", k.id, e.target.value)}
                                                required
                                            >
                                                <option value="">Pilih...</option>
                                                {scaleOptions.map((val) => (
                                                    <option key={val} value={val}>{val}</option>
                                                ))}
                                            </select>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 2. LAINNYA (Milik User) VS WORST */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                                Seberapa lebih penting kriteria Anda dibanding <u>WORST ({global_worst.nama})</u>?
                            </h3>
                            <div className="space-y-3">
                                {kriteria_list.map((k) => {
                                    // Jangan bandingkan Worst vs Worst (Nilai pasti 1)
                                    if (k.id === global_worst.id) return null;

                                    return (
                                        <div key={k.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                            <span className="text-gray-700 font-medium w-1/2">
                                                {k.nama} ({k.kode}) ➔ Worst
                                            </span>
                                            <select
                                                className="w-32 border-gray-300 rounded-md shadow-sm text-sm focus:ring-red-500"
                                                onChange={(e) => handleComparisonChange("others", k.id, e.target.value)}
                                                required
                                            >
                                                <option value="">Pilih...</option>
                                                {scaleOptions.map((val) => (
                                                    <option key={val} value={val}>{val}</option>
                                                ))}
                                            </select>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* TOMBOL SUBMIT */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 font-bold shadow-lg transition disabled:opacity-50"
                            >
                                {processing ? "Menyimpan..." : "Simpan Bobot"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
