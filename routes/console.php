<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\Schema;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');


if (Schema::hasTable('settings')) {
// 1. Ambil Setting Timezone (Default Jakarta)
    $timezone = DB::table('settings')->where('key', 'timezone')->value('value') ?? 'Asia/Jakarta';

// 2. Ambil Setting Bulan (Default Juli / 7)
    $bulan = (int)(DB::table('settings')->where('key', 'periode_bulan')->value('value') ?? 7);

// 3. Ambil Setting Tanggal (Default Tanggal 1)
    $tanggal = (int)(DB::table('settings')->where('key', 'periode_tanggal')->value('value') ?? 1);

    Schedule::command('periode:auto-generate')
        ->yearlyOn($bulan, $tanggal, '00:00') // <--- DINAMIS DISINI
        ->timezone($timezone);
}
