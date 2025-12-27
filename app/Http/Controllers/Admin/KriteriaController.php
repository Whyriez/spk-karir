<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kriteria;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KriteriaController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Kriteria/Index', [
            'kriterias' => Kriteria::orderBy('kode', 'asc')->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'kode' => 'required|unique:kriteria,kode',
            'nama' => 'required|string',
            'tipe_input' => 'required|in:number,select',
            'penanggung_jawab' => 'required|in:gurubk,kaprodi,umum',
        ]);

        Kriteria::create($request->all());

        return back()->with('success', 'Kriteria berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $kriteria = Kriteria::findOrFail($id);

        $request->validate([
            'nama' => 'required|string',
            'tipe_input' => 'required|in:number,select',
            'penanggung_jawab' => 'required|in:gurubk,kaprodi,umum',
        ]);

        // Kode tidak boleh diedit sembarangan karena merusak relasi nilai
        $kriteria->update([
            'nama' => $request->nama,
            'tipe_input' => $request->tipe_input,
            'penanggung_jawab' => $request->penanggung_jawab,
        ]);

        return back()->with('success', 'Kriteria berhasil diperbarui.');
    }

    public function destroy($id)
    {
        // Hati-hati menghapus kriteria akan menghapus semua nilai siswa terkait
        $kriteria = Kriteria::findOrFail($id);
        $kriteria->delete();

        return back()->with('success', 'Kriteria berhasil dihapus.');
    }
}
