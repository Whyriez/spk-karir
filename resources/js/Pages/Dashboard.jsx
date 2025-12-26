import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function Dashboard({ auth, history, stats, rekapitulasi }) {
    // --- KONFIGURASI GRAFIK ---
    const chartData = {
        labels: history?.map((h) => `Kelas ${h.kelas}`) || [],
        datasets: [
            {
                label: "Minat Studi",
                data: history?.map((h) => h.skor_studi) || [],
                borderColor: "rgb(79, 70, 229)", // Indigo Solid
                backgroundColor: "rgba(79, 70, 229, 0.2)", // Indigo Transparan
                tension: 0.4, // <--- 3. Smooth Curve (Biar tidak kaku)
                fill: true, // <--- 4. Isi warna di bawah garis
                pointRadius: 6, // Titik lebih besar
                pointHoverRadius: 8,
            },
            {
                label: "Minat Kerja",
                data: history?.map((h) => h.skor_kerja) || [],
                borderColor: "rgb(16, 185, 129)",
                backgroundColor: "rgba(16, 185, 129, 0.2)",
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointHoverRadius: 8,
            },
            {
                label: "Minat Wirausaha",
                data: history?.map((h) => h.skor_wirausaha) || [],
                borderColor: "rgb(249, 115, 22)",
                backgroundColor: "rgba(249, 115, 22, 0.2)",
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointHoverRadius: 8,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false, // <--- 5. KUNCI AGAR TIDAK ADA RUANG KOSONG (Ikuti tinggi Div)
        interaction: {
            mode: "index", // Tooltip muncul untuk semua garis sekaligus saat hover
            intersect: false,
        },
        plugins: {
            legend: {
                position: "bottom", // Legend di bawah lebih rapi
                labels: {
                    usePointStyle: true, // Pakai bulatan, bukan kotak
                    padding: 20,
                },
            },
            title: { display: false }, // Hemat tempat
            tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                padding: 12,
                titleFont: { size: 14 },
                bodyFont: { size: 13 },
            },
        },
        scales: {
            x: {
                grid: { display: false }, // Hilangkan grid vertikal (lebih bersih)
            },
            y: {
                min: 0,
                max: 1, // Tetap 0-1
                grid: {
                    borderDash: [5, 5], // Grid putus-putus (estetik)
                    color: "#e5e7eb",
                },
                ticks: {
                    padding: 10,
                },
            },
        },
    };

    // --- TAMPILAN ADMIN (Jika yg login admin) ---
    if (auth.user.role !== "siswa") {
        return (
            <AuthenticatedLayout
                user={auth.user}
                header={
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Dashboard Admin (Guru BK)
                    </h2>
                }
            >
                <Head title="Dashboard SPK" />

                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                        {/* --- BAGIAN 1: STATISTIK CARDS (Sesuai Gambar 3.5) --- */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Card Total Siswa */}
                            <div className="bg-white overflow-hidden shadow-sm rounded-lg p-6 border-l-4 border-blue-500">
                                <div className="text-gray-500 text-sm font-medium">
                                    Total Siswa (Kelas 12)
                                </div>
                                <div className="text-3xl font-bold text-gray-800 mt-2">
                                    {stats.total_siswa}
                                </div>
                            </div>

                            {/* Card Sudah Mengisi */}
                            <div className="bg-white overflow-hidden shadow-sm rounded-lg p-6 border-l-4 border-green-500">
                                <div className="text-gray-500 text-sm font-medium">
                                    Sudah Mengisi Data
                                </div>
                                <div className="text-3xl font-bold text-gray-800 mt-2">
                                    {stats.sudah_mengisi}{" "}
                                    <span className="text-sm text-gray-400 font-normal">
                                        / {stats.total_siswa}
                                    </span>
                                </div>
                            </div>

                            {/* Card Rekomendasi Studi */}
                            <div className="bg-white overflow-hidden shadow-sm rounded-lg p-6 border-l-4 border-indigo-500">
                                <div className="text-gray-500 text-sm font-medium">
                                    Rekomendasi Studi
                                </div>
                                <div className="text-3xl font-bold text-indigo-600 mt-2">
                                    {stats.rekomendasi_studi}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                    Siswa
                                </div>
                            </div>

                            {/* Card Rekomendasi Kerja */}
                            <div className="bg-white overflow-hidden shadow-sm rounded-lg p-6 border-l-4 border-emerald-500">
                                <div className="text-gray-500 text-sm font-medium">
                                    Rekomendasi Kerja
                                </div>
                                <div className="text-3xl font-bold text-emerald-600 mt-2">
                                    {stats.rekomendasi_kerja}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                    Siswa
                                </div>
                            </div>
                        </div>

                        {/* --- BAGIAN 2: TABEL REKAPITULASI (Sesuai Gambar 3.5) --- */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-800">
                                    Rekapitulasi Hasil Rekomendasi Terbaru
                                </h3>
                                <button className="bg-gray-800 text-white text-sm px-4 py-2 rounded hover:bg-gray-700">
                                    Export Data / Cetak
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                NISN / Nama Siswa
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Jurusan
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Nilai Optima (Yi)
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Keputusan
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {rekapitulasi.length > 0 ? (
                                            rekapitulasi.map((item) => (
                                                <tr
                                                    key={item.id}
                                                    className="hover:bg-gray-50 transition"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {item.nama}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {item.nisn}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                            {item.jurusan}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.nilai_optima.toFixed(
                                                            4
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                        ${
                                                            item.keputusan ===
                                                            "Melanjutkan Studi"
                                                                ? "bg-indigo-100 text-indigo-800"
                                                                : item.keputusan ===
                                                                  "Bekerja"
                                                                ? "bg-emerald-100 text-emerald-800"
                                                                : "bg-orange-100 text-orange-800"
                                                        }`}
                                                        >
                                                            {item.keputusan}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <a
                                                            href="#"
                                                            className="text-indigo-600 hover:text-indigo-900 font-bold"
                                                        >
                                                            Detail
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="px-6 py-12 text-center text-gray-500"
                                                >
                                                    Belum ada data siswa yang
                                                    masuk.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard Siswa
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* A. WELCOME BANNER */}
                    <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold">
                                Halo, {auth.user.name}! 👋
                            </h3>
                            <p className="mt-2 text-indigo-100 max-w-2xl">
                                Selamat datang di Sistem Pendukung Keputusan
                                Karir. Pantau terus perkembangan potensimu dari
                                tahun ke tahun untuk masa depan yang lebih
                                cerah.
                            </p>
                            <div className="mt-6 flex gap-3">
                                <Link
                                    href={route("siswa.input")}
                                    className="px-5 py-2.5 bg-white text-indigo-600 font-bold rounded-lg hover:bg-gray-100 transition shadow-sm"
                                >
                                    📝 Update Data Baru
                                </Link>
                                <Link
                                    href={route("siswa.result")}
                                    className="px-5 py-2.5 bg-indigo-700 text-white font-semibold rounded-lg hover:bg-indigo-800 transition border border-indigo-500"
                                >
                                    📄 Lihat Hasil Terakhir
                                </Link>
                            </div>
                        </div>
                        {/* Dekorasi Background */}
                        <div className="absolute right-0 top-0 h-full w-1/3 bg-white opacity-5 transform skew-x-12"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* B. BAGIAN KIRI (GRAFIK) - Lebar 2 Kolom */}
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <svg
                                        className="w-5 h-5 text-indigo-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                                        ></path>
                                    </svg>
                                    Grafik Perkembangan Minat
                                </h3>
                                <span className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-medium">
                                    History Kelas 10-12
                                </span>
                            </div>
                            {history && history.length > 0 ? (
                                <div className="h-80 w-full">
                                    <Line options={options} data={chartData} />
                                </div>
                            ) : (
                                <div className="h-80 flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
                                    <p>Belum ada data history.</p>
                                </div>
                            )}
                        </div>

                        {/* C. BAGIAN KANAN (RINGKASAN SKOR TERAKHIR) - Lebar 1 Kolom */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">
                                Status Terakhir
                            </h3>
                            {history && history.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-center">
                                        <div className="text-sm text-indigo-600 font-medium uppercase tracking-wide">
                                            Rekomendasi Utama
                                        </div>
                                        {/* Ambil Data Terakhir */}
                                        <div className="text-2xl font-extrabold text-indigo-700 mt-1 leading-tight">
                                            {
                                                history[history.length - 1]
                                                    .keputusan
                                            }
                                        </div>
                                        <div className="text-xs text-indigo-500 mt-2">
                                            Periode: Kelas{" "}
                                            {history[history.length - 1].kelas}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Minat Studi</span>
                                            <span className="font-bold">
                                                {history[
                                                    history.length - 1
                                                ].skor_studi?.toFixed(3)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Minat Kerja</span>
                                            <span className="font-bold">
                                                {history[
                                                    history.length - 1
                                                ].skor_kerja?.toFixed(3)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Wirausaha</span>
                                            <span className="font-bold">
                                                {history[
                                                    history.length - 1
                                                ].skor_wirausaha?.toFixed(3)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-400 text-center text-sm">
                                    Data tidak tersedia.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* D. TABEL RIWAYAT PENILAIAN (PENGGANTI JEJAK ALUMNI) */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <svg
                                    className="w-5 h-5 text-emerald-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    ></path>
                                </svg>
                                Riwayat Penilaian Lengkap
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Periode / Kelas
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Skor Studi
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Skor Kerja
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Skor Wirausaha
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Keputusan Sistem
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {history && history.length > 0 ? (
                                        history.map((item, index) => (
                                            <tr
                                                key={index}
                                                className="hover:bg-gray-50 transition"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-bold text-gray-900">
                                                        {item.label}
                                                    </div>
                                                    {/* item.label isinya "Kelas 10 (2022)" dari controller */}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {item.skor_studi?.toFixed(
                                                        4
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {item.skor_kerja?.toFixed(
                                                        4
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {item.skor_wirausaha?.toFixed(
                                                        4
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
        ${
            item.keputusan === "Melanjutkan Studi"
                ? "bg-indigo-100 text-indigo-800"
                : ""
        }
        ${item.keputusan === "Bekerja" ? "bg-emerald-100 text-emerald-800" : ""}
        ${
            item.keputusan === "Berwirausaha"
                ? "bg-orange-100 text-orange-800"
                : ""
        }
    `}
                                                    >
                                                        {item.keputusan}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    {/* Tambahkan Link ini untuk melihat detail masa lalu */}
                                                    <Link
                                                        href={route(
                                                            "siswa.result",
                                                            { id: item.id }
                                                        )}
                                                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium hover:underline"
                                                    >
                                                        Lihat Detail &rarr;
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="px-6 py-8 text-center text-gray-500 italic"
                                            >
                                                Belum ada data riwayat.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
