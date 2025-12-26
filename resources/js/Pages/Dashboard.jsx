import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth, stats, rekapitulasi }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard Admin (Guru BK)</h2>}
        >
            <Head title="Dashboard SPK" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    {/* --- BAGIAN 1: STATISTIK CARDS (Sesuai Gambar 3.5) --- */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Card Total Siswa */}
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg p-6 border-l-4 border-blue-500">
                            <div className="text-gray-500 text-sm font-medium">Total Siswa (Kelas 12)</div>
                            <div className="text-3xl font-bold text-gray-800 mt-2">{stats.total_siswa}</div>
                        </div>

                        {/* Card Sudah Mengisi */}
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg p-6 border-l-4 border-green-500">
                            <div className="text-gray-500 text-sm font-medium">Sudah Mengisi Data</div>
                            <div className="text-3xl font-bold text-gray-800 mt-2">
                                {stats.sudah_mengisi} <span className="text-sm text-gray-400 font-normal">/ {stats.total_siswa}</span>
                            </div>
                        </div>

                        {/* Card Rekomendasi Studi */}
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg p-6 border-l-4 border-indigo-500">
                            <div className="text-gray-500 text-sm font-medium">Rekomendasi Studi</div>
                            <div className="text-3xl font-bold text-indigo-600 mt-2">{stats.rekomendasi_studi}</div>
                            <div className="text-xs text-gray-400 mt-1">Siswa</div>
                        </div>

                        {/* Card Rekomendasi Kerja */}
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg p-6 border-l-4 border-emerald-500">
                            <div className="text-gray-500 text-sm font-medium">Rekomendasi Kerja</div>
                            <div className="text-3xl font-bold text-emerald-600 mt-2">{stats.rekomendasi_kerja}</div>
                            <div className="text-xs text-gray-400 mt-1">Siswa</div>
                        </div>
                    </div>

                    {/* --- BAGIAN 2: TABEL REKAPITULASI (Sesuai Gambar 3.5) --- */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800">Rekapitulasi Hasil Rekomendasi Terbaru</h3>
                            <button className="bg-gray-800 text-white text-sm px-4 py-2 rounded hover:bg-gray-700">
                                Export Data / Cetak
                            </button>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            NISN / Nama Siswa
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Jurusan
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nilai Optima (Yi)
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Keputusan
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {rekapitulasi.length > 0 ? (
                                        rekapitulasi.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{item.nama}</div>
                                                    <div className="text-sm text-gray-500">{item.nisn}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                        {item.jurusan}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item.nilai_optima.toFixed(4)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                        ${item.keputusan === 'Melanjutkan Studi' ? 'bg-indigo-100 text-indigo-800' : 
                                                          item.keputusan === 'Bekerja' ? 'bg-emerald-100 text-emerald-800' : 
                                                          'bg-orange-100 text-orange-800'}`}>
                                                        {item.keputusan}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <a href="#" className="text-indigo-600 hover:text-indigo-900 font-bold">Detail</a>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                                Belum ada data siswa yang masuk.
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