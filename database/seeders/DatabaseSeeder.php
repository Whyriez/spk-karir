<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            JurusanSeeder::class,
            KriteriaSeeder::class,
            UserSeeder::class,
            HistorySeeder::class,
        ]);

        \App\Models\Setting::updateOrCreate(
            ['key' => 'nama_sekolah'],
            ['value' => 'SMKN 1 Gorontalo'] // Default
        );
    }
}
