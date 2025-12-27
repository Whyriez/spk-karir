import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Line, Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement, // Penting untuk Pie/Doughnut
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";

// Register ChartJS Components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function Dashboard({ auth, history, stats, chart_distribution, rekapitulasi }) {
    const user = auth.user;

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

    // --- RENDER DASHBOARD SISWA ---
    if (user.role === 'siswa') {
        const lineData = {
            labels: history?.map((h) => `Kelas ${h.kelas}`) || [],
            datasets: [
                {
                    label: "Minat Studi",
                    data: history?.map((h) => h.skor_studi) || [],
                    borderColor: "rgb(79, 70, 229)",
                    backgroundColor: "rgba(79, 70, 229, 0.2)",
                    tension: 0.4,
                    fill: true,
                },
                {
                    label: "Minat Kerja",
                    data: history?.map((h) => h.skor_kerja) || [],
                    borderColor: "rgb(16, 185, 129)",
                    backgroundColor: "rgba(16, 185, 129, 0.2)",
                    tension: 0.4,
                    fill: true,
                },
                {
                    label: "Minat Wirausaha",
                    data: history?.map((h) => h.skor_wirausaha) || [],
                    borderColor: "rgb(249, 115, 22)",
                    backgroundColor: "rgba(249, 115, 22, 0.2)",
                    tension: 0.4,
                    fill: true,
                },
            ],
        };

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

    // --- RENDER DASHBOARD ADMIN & PAKAR ---

    // Config Doughnut Chart
    const doughnutData = {
        labels: chart_distribution?.labels || [],
        datasets: [
            {
                data: chart_distribution?.data || [],
                backgroundColor: chart_distribution?.colors || [],
                hoverOffset: 4,
            },
        ],
    };

    return (
        <AuthenticatedLayout user={user} header={<h2 className="font-semibold text-xl text-gray-800">Dashboard {user.role === 'admin' ? 'Admin' : 'Pakar'}</h2>}>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* 1. STATS CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            title="Total Siswa"
                            value={stats.total_siswa}
                            icon={<svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>}
                            color="bg-blue-50"
                        />
                        <StatCard
                            title="Sudah Dinilai"
                            value={stats.sudah_mengisi}
                            icon={<svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                            color="bg-green-50"
                        />
                        <StatCard
                            title="Belum Mengisi"
                            value={stats.belum_mengisi}
                            icon={<svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                            color="bg-red-50"
                        />
                        <StatCard
                            title="Dominasi Hasil"
                            value={
                                Math.max(stats.rekomendasi_studi, stats.rekomendasi_kerja, stats.rekomendasi_wirausaha) === stats.rekomendasi_studi ? "Studi" :
                                    Math.max(stats.rekomendasi_studi, stats.rekomendasi_kerja, stats.rekomendasi_wirausaha) === stats.rekomendasi_kerja ? "Kerja" : "Wirausaha"
                            }
                            icon={<svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>}
                            color="bg-purple-50"
                        />
                    </div>

                    {/* 2. CHART & ACTION SECTION */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* LEFT: CHART DISTRIBUSI */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 lg:col-span-2">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
                                Distribusi Rekomendasi Karir
                            </h3>
                            <div className="flex flex-col sm:flex-row items-center justify-around h-64">
                                <div className="h-full w-full sm:w-1/2 flex justify-center">
                                    <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
                                </div>
                                <div className="mt-4 sm:mt-0 space-y-3">
                                    <LegendItem color="bg-indigo-600" label="Melanjutkan Studi" value={stats.rekomendasi_studi} total={stats.sudah_mengisi} />
                                    <LegendItem color="bg-emerald-500" label="Bekerja" value={stats.rekomendasi_kerja} total={stats.sudah_mengisi} />
                                    <LegendItem color="bg-orange-500" label="Berwirausaha" value={stats.rekomendasi_wirausaha} total={stats.sudah_mengisi} />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: QUICK ACTIONS / NOTIFICATIONS */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Tindak Lanjut</h3>
                            <div className="space-y-4">
                                {/* Alert jika ada siswa belum mengisi */}
                                {stats.belum_mengisi > 0 && (
                                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm text-yellow-700">
                                                    Ada <span className="font-bold">{stats.belum_mengisi} siswa</span> belum mengisi kuesioner. Segera ingatkan melalui wali kelas.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Menu Cepat */}
                                <div className="grid grid-cols-1 gap-2">
                                    {user.role === 'admin' ? (
                                        <>
                                            <Link href={route('admin.monitoring.index')} className="block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                                                Monitoring Siswa
                                            </Link>
                                            <Link href={route('admin.settings')} className="block w-full text-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                                Pengaturan Sistem
                                            </Link>
                                        </>
                                    ) : (
                                        <Link href={route('pakar.bwm')} className="block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                                            Input Bobot Kriteria (BWM)
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. TABEL REKAPITULASI TERBARU */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800">Aktifitas Penilaian Terbaru</h3>
                            <Link href={route('admin.monitoring.index')} className="text-sm text-indigo-600 hover:underline">Lihat Semua</Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Siswa</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jurusan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nilai Optima</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hasil Rekomendasi</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {rekapitulasi.length > 0 ? (
                                    rekapitulasi.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.nama}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.jurusan}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{item.nilai_optima.toFixed(4)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                        ${item.keputusan === 'Melanjutkan Studi' ? 'bg-indigo-100 text-indigo-800' :
                                                        item.keputusan === 'Bekerja' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                                                        {item.keputusan}
                                                    </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(item.tanggal).toLocaleDateString('id-ID')}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500 italic">Belum ada data penilaian terbaru.</td>
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

// --- SUB-COMPONENTS ---

function StatCard({ title, value, icon, color }) {
    return (
        <div className={`p-6 rounded-lg shadow-sm border border-gray-100 ${color} bg-opacity-30 flex items-center justify-between`}>
            <div>
                <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
            </div>
            <div className={`p-3 rounded-full bg-white bg-opacity-60`}>
                {icon}
            </div>
        </div>
    );
}

function LegendItem({ color, label, value, total }) {
    const percent = total > 0 ? Math.round((value / total) * 100) : 0;
    return (
        <div className="flex items-center justify-between text-sm w-full">
            <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${color}`}></span>
                <span className="text-gray-600">{label}</span>
            </div>
            <div className="font-semibold text-gray-800">
                {value} <span className="text-xs text-gray-400">({percent}%)</span>
            </div>
        </div>
    );
}
