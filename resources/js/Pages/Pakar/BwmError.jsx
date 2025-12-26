import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function BwmError({ auth, msg }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800">Status Penilaian</h2>}
        >
            <Head title="Akses Belum Tersedia" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg text-center p-10 md:p-16">
                        
                        {/* Ilustrasi Icon (Jam/Menunggu) */}
                        <div className="flex justify-center mb-6">
                            <div className="bg-yellow-50 p-6 rounded-full">
                                <svg className="w-16 h-16 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                            Konfigurasi Belum Selesai
                        </h3>

                        {/* Pesan Error dari Controller */}
                        <p className="text-gray-600 max-w-lg mx-auto mb-8 leading-relaxed">
                            {msg || "Admin belum menginput hasil kesepakatan FGD (Best & Worst Criteria). Mohon tunggu hingga Admin menyelesaikan konfigurasi awal sebelum Anda dapat memberikan bobot penilaian."}
                        </p>

                        {/* Tombol Aksi */}
                        <div className="flex flex-col md:flex-row justify-center gap-4">
                            <Link
                                href={route('dashboard')}
                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
                            >
                                Kembali ke Dashboard
                            </Link>
                            
                            {/* Tombol Refresh (Opsional, siapa tau admin baru aja update) */}
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                            >
                                Cek Lagi
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}