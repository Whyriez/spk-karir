import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function PromotionIndex({ auth, siswa_kelas_10, siswa_kelas_11, siswa_kelas_12 }) {
    
    // State untuk Tab Aktif
    const [activeTab, setActiveTab] = useState('10'); // Default buka tab kelas 10

    // Komponen Tabel Seleksi
    const StudentTable = ({ students, targetClass, targetLabel }) => {
        const { data, setData, post, processing } = useForm({
            user_ids: [],     // Array ID siswa yg dipilih
            target_kelas: targetClass // Tujuan (misal: '11')
        });

        // Toggle Checkbox Semua
        const toggleAll = (e) => {
            if (e.target.checked) {
                setData('user_ids', students.map(s => s.id));
            } else {
                setData('user_ids', []);
            }
        };

        // Toggle Checkbox Satu-satu
        const toggleOne = (id) => {
            if (data.user_ids.includes(id)) {
                setData('user_ids', data.user_ids.filter(itemId => itemId !== id));
            } else {
                setData('user_ids', [...data.user_ids, id]);
            }
        };

        const submitPromotion = (e) => {
            e.preventDefault();
            if(!confirm(`Yakin ingin mempromosikan ${data.user_ids.length} siswa terpilih ke ${targetLabel}?`)) return;
            
            post(route('admin.promotion.store'), {
                onSuccess: () => setData('user_ids', []), // Reset checkbox setelah sukses
            });
        };

        return (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-700">Daftar Siswa ({students.length})</h3>
                    <button
                        onClick={submitPromotion}
                        disabled={data.user_ids.length === 0 || processing}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 transition flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                        Promosikan ke {targetLabel}
                    </button>
                </div>

                {students.length === 0 ? (
                    <p className="text-gray-500 italic text-center py-10">Tidak ada data siswa di kelas ini.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left">
                                        <input 
                                            type="checkbox" 
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                            onChange={toggleAll}
                                            checked={data.user_ids.length === students.length && students.length > 0}
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Siswa</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NISN</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {students.map((student) => (
                                    <tr key={student.id} className={data.user_ids.includes(student.id) ? 'bg-indigo-50' : ''}>
                                        <td className="px-6 py-4">
                                            <input 
                                                type="checkbox" 
                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                                checked={data.user_ids.includes(student.id)}
                                                onChange={() => toggleOne(student.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{student.name}</td>
                                        <td className="px-6 py-4 text-gray-500">{student.username}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                Aktif
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800">Manajemen Kenaikan Kelas</h2>}>
            <Head title="Kenaikan Kelas" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* INFO BOX */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-blue-700">
                                    Silakan pilih siswa yang <strong>LULUS / NAIK KELAS</strong>. Siswa yang tidak dicentang akan tetap tinggal di kelas saat ini.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* TABS NAVIGATION */}
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {['10', '11', '12'].map((kelas) => (
                                <button
                                    key={kelas}
                                    onClick={() => setActiveTab(kelas)}
                                    className={`${
                                        activeTab === kelas
                                            ? 'border-indigo-500 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                >
                                    Siswa Kelas {kelas}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* CONTENT BERDASARKAN TAB */}
                    {activeTab === '10' && (
                        <StudentTable 
                            students={siswa_kelas_10} 
                            targetClass="11" 
                            targetLabel="Kelas 11" 
                        />
                    )}

                    {activeTab === '11' && (
                        <StudentTable 
                            students={siswa_kelas_11} 
                            targetClass="12" 
                            targetLabel="Kelas 12" 
                        />
                    )}

                    {activeTab === '12' && (
                        <StudentTable 
                            students={siswa_kelas_12} 
                            targetClass="alumni" 
                            targetLabel="Status Alumni" 
                        />
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}