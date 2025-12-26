import React, { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout'; // Kita tidak pakai ini, kita buat layout custom langsung disini
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        login_id: '', // Bisa email atau username/NISN
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gradient-to-br from-blue-500 to-indigo-700">
            <Head title="Log in" />

            <div className="w-full sm:max-w-md mt-6 px-8 py-10 bg-white shadow-2xl overflow-hidden sm:rounded-xl">
                
                {/* Header Login */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900">Selamat Datang</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Silakan masuk untuk melanjutkan ke SPK Karir
                    </p>
                </div>

                {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

                <form onSubmit={submit}>
                    <div>
                        <InputLabel htmlFor="login_id" value="Email atau Username/NISN" />
                        <TextInput
                            id="login_id"
                            type="text"
                            name="login_id"
                            value={data.login_id} // Pastikan di controller Login kamu support login via username/email
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('login_id', e.target.value)}
                        />
                        <InputError message={errors.email || errors.username} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="block mt-4 flex justify-between items-center">
                        <label className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <span className="ml-2 text-sm text-gray-600">Ingat Saya</span>
                        </label>
                    </div>

                    <div className="mt-6">
                        <PrimaryButton className="w-full justify-center py-3 text-lg" disabled={processing}>
                            {processing ? 'Sedang Masuk...' : 'Masuk Sekarang'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
            
            <div className="mt-8 text-white text-sm opacity-80">
                &copy; 2025 SMKN 1 Kota Gorontalo - Sistem Pendukung Keputusan
            </div>
        </div>
    );
}