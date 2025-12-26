<?php

use App\Http\Controllers\BwmController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MooraController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SettingController;
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

Route::middleware('auth', 'verified')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // --- ROUTE ADMIN ---
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        // Manajemen Periode
        Route::get('/periode', [App\Http\Controllers\Admin\PeriodeController::class, 'index'])->name('periode.index');
        Route::post('/periode', [App\Http\Controllers\Admin\PeriodeController::class, 'store'])->name('periode.store');
        Route::post('/periode/{id}/activate', [App\Http\Controllers\Admin\PeriodeController::class, 'activate'])->name('periode.activate');
        Route::put('/periode/{id}', [App\Http\Controllers\Admin\PeriodeController::class, 'update'])->name('periode.update');
        Route::delete('/periode/{id}', [App\Http\Controllers\Admin\PeriodeController::class, 'destroy'])->name('periode.destroy');
        Route::post('/periode/auto-toggle', [App\Http\Controllers\Admin\PeriodeController::class, 'toggleAuto'])->name('periode.toggle');

        // Manajemen Kenaikan Kelas (Promosi)
        Route::get('/promotion', [App\Http\Controllers\Admin\PromotionController::class, 'index'])->name('promotion.index');
        Route::post('/promotion', [App\Http\Controllers\Admin\PromotionController::class, 'promote'])->name('promotion.store');

        // Settings Sekolah (Yang tadi)
        Route::get('/settings', [App\Http\Controllers\SettingController::class, 'index'])->name('settings');
        Route::post('/settings', [App\Http\Controllers\SettingController::class, 'update'])->name('settings.update');

        // --- MONITORING & CATATAN GURU BK ---
        Route::get('/monitoring', [App\Http\Controllers\Admin\MonitoringController::class, 'index'])->name('monitoring.index');
        Route::post('/monitoring/{id}/catatan', [App\Http\Controllers\Admin\MonitoringController::class, 'updateCatatan'])->name('monitoring.update');

        Route::resource('kriteria', App\Http\Controllers\Admin\KriteriaController::class);

        Route::get('/bwm-setting', [App\Http\Controllers\Admin\BwmSettingController::class, 'index'])->name('bwm.setting');
        Route::post('/bwm-setting', [App\Http\Controllers\Admin\BwmSettingController::class, 'store'])->name('bwm.setting.store');
    });

    Route::middleware('role:pakar')->prefix('pakar')->name('pakar.')->group(function () {
        Route::get('/bwm', [BwmController::class, 'index'])->name('bwm');
        Route::post('/bwm', [BwmController::class, 'store'])->name('bwm.store');
    });

    Route::middleware('role:siswa')->prefix('siswa')->name('siswa.')->group(function () {
        Route::get('/input', [MooraController::class, 'index'])->name('input');
        Route::post('/input', [MooraController::class, 'store'])->name('store');
        Route::get('/result', [MooraController::class, 'result'])->name('result');
    });
});

require __DIR__ . '/auth.php';
