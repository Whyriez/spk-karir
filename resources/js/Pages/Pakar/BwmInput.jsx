import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";

export default function BwmInput({ auth, kriteria }) {
    // State lokal untuk trigger UI update
    const [bestId, setBestId] = useState("");
    const [worstId, setWorstId] = useState("");

    // Inertia Form Helper
    const { data, setData, post, processing, errors, reset } = useForm({
        best_criterion_id: "",
        worst_criterion_id: "",
        best_to_others: {}, // Format: { id_kriteria: nilai }
        others_to_worst: {}, // Format: { id_kriteria: nilai }
    });

    // Reset form perbandingan jika Best/Worst berubah
    useEffect(() => {
        setData((prev) => ({
            ...prev,
            best_criterion_id: bestId,
            worst_criterion_id: worstId,
            // Reset nilai perbandingan agar bersih
            best_to_others: {},
            others_to_worst: {},
        }));
    }, [bestId, worstId]);

    const submit = (e) => {
        e.preventDefault();
        post(route("pakar.bwm.store"), {
            onSuccess: () => alert("Bobot berhasil disimpan!"),
            onError: () => alert("Terdapat kesalahan atau inkonsistensi data."),
        });
    };

    // Helper untuk update nilai input dinamis
    const handleComparisonChange = (type, targetId, value) => {
        const key = type === "best" ? "best_to_others" : "others_to_worst";
        setData(key, {
            ...data[key],
            [targetId]: parseInt(value),
        });
    };

    // Opsi Skala 1-9 (Saaty/BWM)
    const scaleOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Input Penilaian Pakar (BWM)
                </h2>
            }
        >
            <Head title="BWM Input" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Tampilkan Error CR jika ada */}
                    {Object.keys(errors).length > 0 && (
                        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            <strong className="font-bold">
                                Terjadi Kesalahan:
                            </strong>
                            <ul className="mt-2 list-disc list-inside text-sm">
                                {Object.keys(errors).map((key) => (
                                    <li key={key}>
                                        <span className="capitalize font-semibold">
                                            {key}:
                                        </span>{" "}
                                        {errors[key]}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        {/* CARD 1: TENTUKAN REFERENSI */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Langkah 1: Tentukan Kriteria Referensi
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Kriteria Terbaik */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Kriteria Terbaik (Best)
                                    </label>
                                    <select
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={bestId}
                                        onChange={(e) =>
                                            setBestId(e.target.value)
                                        }
                                        required
                                    >
                                        <option value="">
                                            -- Pilih Kriteria Terbaik --
                                        </option>
                                        {kriteria.map((k) => (
                                            <option
                                                key={k.id}
                                                value={k.id}
                                                disabled={k.id == worstId}
                                            >
                                                {k.kode} - {k.nama}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.best_criterion_id && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.best_criterion_id}
                                        </p>
                                    )}
                                </div>

                                {/* Kriteria Terburuk */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Kriteria Terburuk (Worst)
                                    </label>
                                    <select
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={worstId}
                                        onChange={(e) =>
                                            setWorstId(e.target.value)
                                        }
                                        required
                                    >
                                        <option value="">
                                            -- Pilih Kriteria Terburuk --
                                        </option>
                                        {kriteria.map((k) => (
                                            <option
                                                key={k.id}
                                                value={k.id}
                                                disabled={k.id == bestId}
                                            >
                                                {k.kode} - {k.nama}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.worst_criterion_id && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.worst_criterion_id}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tampilkan Form Perbandingan HANYA jika Best & Worst sudah dipilih */}
                        {bestId && worstId && (
                            <>
                                {/* CARD 2: BEST TO OTHERS */}
                                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Langkah 2: Perbandingan Best-to-Others
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Seberapa lebih penting kriteria{" "}
                                        <strong>
                                            Best (
                                            {
                                                kriteria.find(
                                                    (k) => k.id == bestId
                                                )?.nama
                                            }
                                            )
                                        </strong>{" "}
                                        dibandingkan kriteria lain? (Nilai 1 =
                                        Sama penting, 9 = Mutlak lebih penting)
                                    </p>

                                    <div className="grid grid-cols-1 gap-4">
                                        {kriteria.map((k) => {
                                            if (k.id == bestId) return null; // Skip Best vs Best
                                            return (
                                                <div
                                                    key={k.id}
                                                    className="flex items-center justify-between border-b pb-2"
                                                >
                                                    <span className="text-gray-700 w-1/2">
                                                        Best <strong>vs</strong>{" "}
                                                        {k.kode} ({k.nama})
                                                    </span>
                                                    <select
                                                        className="w-1/3 border-gray-300 rounded-md shadow-sm"
                                                        onChange={(e) =>
                                                            handleComparisonChange(
                                                                "best",
                                                                k.id,
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                    >
                                                        <option value="">
                                                            Pilih Nilai
                                                        </option>
                                                        {scaleOptions.map(
                                                            (val) => (
                                                                <option
                                                                    key={val}
                                                                    value={val}
                                                                >
                                                                    {val}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* CARD 3: OTHERS TO WORST */}
                                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Langkah 3: Perbandingan Others-to-Worst
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Seberapa lebih penting kriteria lain
                                        dibandingkan kriteria{" "}
                                        <strong>
                                            Worst (
                                            {
                                                kriteria.find(
                                                    (k) => k.id == worstId
                                                )?.nama
                                            }
                                            )
                                        </strong>
                                        ?
                                    </p>

                                    <div className="grid grid-cols-1 gap-4">
                                        {kriteria.map((k) => {
                                            if (k.id == worstId) return null; // Skip Worst vs Worst
                                            return (
                                                <div
                                                    key={k.id}
                                                    className="flex items-center justify-between border-b pb-2"
                                                >
                                                    <span className="text-gray-700 w-1/2">
                                                        {k.kode} ({k.nama}){" "}
                                                        <strong>vs</strong>{" "}
                                                        Worst
                                                    </span>
                                                    <select
                                                        className="w-1/3 border-gray-300 rounded-md shadow-sm"
                                                        onChange={(e) =>
                                                            handleComparisonChange(
                                                                "others",
                                                                k.id,
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                    >
                                                        <option value="">
                                                            Pilih Nilai
                                                        </option>
                                                        {scaleOptions.map(
                                                            (val) => (
                                                                <option
                                                                    key={val}
                                                                    value={val}
                                                                >
                                                                    {val}
                                                                </option>
                                                            )
                                                        )}
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
                                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                                    >
                                        {processing
                                            ? "Menghitung..."
                                            : "Hitung & Simpan Bobot"}
                                    </button>
                                </div>
                            </>
                        )}
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
