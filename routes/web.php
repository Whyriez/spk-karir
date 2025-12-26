<?php

use App\Http\Controllers\BwmController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MooraController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

     // --- Routes Khusus Pakar (BWM) ---
    // Tambahkan middleware check role jika sudah ada, sementara auth saja
    Route::get('/pakar/bwm', [BwmController::class, 'index'])->name('pakar.bwm');
    Route::post('/pakar/bwm', [BwmController::class, 'store'])->name('pakar.bwm.store');

    // --- Routes Khusus Siswa (MOORA) ---
    Route::get('/siswa/input', [MooraController::class, 'index'])->name('siswa.input');
    Route::post('/siswa/input', [MooraController::class, 'store'])->name('siswa.store');
    Route::get('/siswa/result', [MooraController::class, 'result'])->name('siswa.result');
});

require __DIR__.'/auth.php';
