<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Alumni;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Imports\AlumniImport;
use App\Exports\AlumniTemplateExport;
use Maatwebsite\Excel\Facades\Excel;

class AlumniController extends Controller
{
    public function index(Request $request)
    {
        // Mulai Query
        $query = Alumni::query();

        // Jika ada parameter 'search' di URL
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('major', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%")
                    ->orWhere('batch', 'like', "%{$search}%");
            });
        }

        // Paginate hasil & pertahankan query string (supaya search tidak hilang saat klik page 2)
        $alumnis = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Alumni/Index', [
            'alumnis' => $alumnis,
            // Kirim balik search term ke frontend agar input tidak kosong setelah reload
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'status' => 'required|string|max:255',
            'batch' => 'required|digits:4',
            'major' => 'required|string|max:255',
        ]);

        Alumni::create($request->all());

        return redirect()->back()->with('success', 'Data alumni berhasil ditambahkan.');
    }

    public function update(Request $request, Alumni $alumni)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'status' => 'required|string|max:255',
            'batch' => 'required|digits:4',
            'major' => 'required|string|max:255',
        ]);

        $alumni->update($request->all());

        return redirect()->back()->with('success', 'Data alumni berhasil diperbarui.');
    }

    public function destroy(Alumni $alumni)
    {
        $alumni->delete();
        return redirect()->back()->with('success', 'Data alumni berhasil dihapus.');
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:alumnis,id',
        ]);

        Alumni::whereIn('id', $request->ids)->delete();

        return redirect()->back()->with('success', count($request->ids) . ' data alumni berhasil dihapus.');
    }

    public function preview(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv',
        ]);
        $data = Excel::toArray(new AlumniImport, $request->file('file'));

        return response()->json($data[0] ?? []);
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv',
        ]);

        Excel::import(new AlumniImport, $request->file('file'));

        return redirect()->back()->with('success', 'Data alumni berhasil diimport.');
    }

    public function template()
    {
        return Excel::download(new AlumniTemplateExport, 'template_alumni.xlsx');
    }
}
