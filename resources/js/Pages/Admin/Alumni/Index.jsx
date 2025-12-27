import React, {useState} from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Head, useForm, router, Link} from "@inertiajs/react";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton"; // Pastikan import ini benar

// --- KOMPONEN PAGINATION ---
const Pagination = ({links}) => {
    return (
        <div className="flex flex-wrap justify-center gap-1 mt-6">
            {links.map((link, key) => (
                <div key={key}>
                    {link.url === null ? (
                        <div className="mr-1 mb-1 px-4 py-3 text-sm leading-4 text-gray-400 border rounded">
                            <span dangerouslySetInnerHTML={{__html: link.label}}></span>
                        </div>
                    ) : (
                        <Link
                            className={`mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-white focus:border-indigo-500 focus:text-indigo-500 ${
                                link.active ? "bg-indigo-600 text-white" : "bg-white text-gray-700"
                            }`}
                            href={link.url}
                        >
                            <span dangerouslySetInnerHTML={{__html: link.label}}></span>
                        </Link>
                    )}
                </div>
            ))}
        </div>
    );
};

export default function AlumniIndex({auth, alumnis, filters}) {
    // State Modal CRUD
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editAlumniId, setEditAlumniId] = useState(null);

    // State Modal Import
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    // State Preview Import
    const [previewData, setPreviewData] = useState([]);
    const [isLoadingPreview, setIsLoadingPreview] = useState(false);

    // State Multiple Select
    const [selectedIds, setSelectedIds] = useState([]);

    const [searchTerm, setSearchTerm] = useState(filters.search || "");

    // Form CRUD
    const {data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors} = useForm({
        name: "", status: "", batch: "", major: "",
    });

    // Form Import
    const {
        data: dataImport, setData: setDataImport, post: postImport,
        processing: processingImport, errors: errorsImport, reset: resetImport, clearErrors: clearErrorsImport
    } = useForm({file: null});

    // --- LOGIC CHECKBOX ---
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allIdsOnPage = alumnis.data.map((item) => item.id);
            setSelectedIds(allIdsOnPage);
        } else {
            setSelectedIds([]);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Hapus timeout sebelumnya (jika user masih mengetik)
        clearTimeout(window.searchTimeout);

        // Set timeout baru
        window.searchTimeout = setTimeout(() => {
            router.get(route('admin.alumni.index'), {search: value}, {
                preserveState: true, // Jangan refresh state komponen (modal dll)
                preserveScroll: true, // Jangan scroll ke atas
                replace: true, // Ganti history URL (agar tombol back tidak kebanyakan)
            });
        }, 500); // Request dikirim 500ms setelah user berhenti mengetik
    };

    const handleSelectOne = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    // Helper Inertia untuk Bulk Delete
    const executeBulkDelete = () => {
        if (confirm(`Yakin ingin menghapus ${selectedIds.length} data terpilih?`)) {
            router.post(route('admin.alumni.bulk_destroy'), {ids: selectedIds}, {
                onSuccess: () => setSelectedIds([])
            });
        }
    };

    // --- CRUD HANDLERS ---
    const openModal = (alumni = null) => {
        clearErrors();
        if (alumni) {
            setIsEditMode(true);
            setEditAlumniId(alumni.id);
            setData({
                name: alumni.name,
                status: alumni.status,
                batch: alumni.batch,
                major: alumni.major,
            });
        } else {
            setIsEditMode(false);
            setEditAlumniId(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditMode) {
            put(route("admin.alumni.update", editAlumniId), {onSuccess: () => closeModal()});
        } else {
            post(route("admin.alumni.store"), {onSuccess: () => closeModal()});
        }
    };

    const handleDelete = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus data alumni ini?")) {
            router.delete(route("admin.alumni.destroy", id), {
                onSuccess: () => setSelectedIds([]),
                onError: () => alert("Gagal menghapus data.")
            });
        }
    };

    // --- IMPORT HANDLERS ---
    const openImportModal = () => {
        clearErrorsImport();
        resetImport();
        setPreviewData([]);
        setIsImportModalOpen(true);
    };
    const closeImportModal = () => {
        setIsImportModalOpen(false);
        resetImport();
        setPreviewData([]);
    };

    const handlePreview = async () => {
        if (!dataImport.file) return alert("Pilih file dulu");
        setIsLoadingPreview(true);
        const formData = new FormData();
        formData.append('file', dataImport.file);
        try {
            const res = await axios.post(route('admin.alumni.preview'), formData, {headers: {'Content-Type': 'multipart/form-data'}});
            setPreviewData(res.data);
        } catch (e) {
            alert("Gagal preview");
        } finally {
            setIsLoadingPreview(false);
        }
    };

    const handleImportSubmit = (e) => {
        e.preventDefault();
        postImport(route("admin.alumni.import"), {onSuccess: () => closeImportModal(), forceFormData: true});
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Data Alumni</h2>}
        >
            <Head title="Data Alumni"/>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">

                        {/* HEADER & ACTION BUTTONS */}
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">

                            {/* KIRI: Judul & Search */}
                            <div
                                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
                                <div className="text-gray-900 font-bold text-lg whitespace-nowrap">Daftar Alumni</div>

                                {/* INPUT SEARCH DISINI */}
                                <TextInput
                                    type="text"
                                    placeholder="Cari nama, jurusan..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="w-full sm:w-64 text-sm" // Responsive width
                                />

                                {/* Tombol Bulk Delete (Muncul jika ada yang dipilih) */}
                                {selectedIds.length > 0 && (
                                    <DangerButton onClick={executeBulkDelete} className="text-xs whitespace-nowrap">
                                        Hapus ({selectedIds.length}) Data
                                    </DangerButton>
                                )}
                            </div>

                            {/* KANAN: Tombol Aksi */}
                            <div className="flex gap-2 w-full md:w-auto justify-end">
                                <SecondaryButton onClick={openImportModal}>Import Excel</SecondaryButton>
                                <PrimaryButton onClick={() => openModal()}>+ Tambah</PrimaryButton>
                            </div>
                        </div>

                        {/* TABLE */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                            onChange={handleSelectAll}
                                            checked={alumnis.data.length > 0 && selectedIds.length === alumnis.data.length}
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Angkatan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jurusan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {alumnis.data.length > 0 ? (
                                    alumnis.data.map((alumni, index) => (
                                        <tr key={alumni.id}
                                            className={selectedIds.includes(alumni.id) ? "bg-indigo-50" : ""}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                                    checked={selectedIds.includes(alumni.id)}
                                                    onChange={() => handleSelectOne(alumni.id)}
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {(alumnis.current_page - 1) * alumnis.per_page + index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{alumni.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{alumni.batch}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{alumni.major}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{alumni.status}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                <button onClick={() => openModal(alumni)}
                                                        className="text-indigo-600 hover:text-indigo-900">Edit
                                                </button>
                                                <button onClick={() => handleDelete(alumni.id)}
                                                        className="text-red-600 hover:text-red-900">Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">Belum ada data
                                            alumni.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        {/* PAGINATION */}
                        <Pagination links={alumnis.links}/>
                    </div>
                </div>
            </div>

            {/* MODAL FORM CRUD */}
            <Modal show={isModalOpen} onClose={closeModal}>
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">{isEditMode ? "Edit Data" : "Tambah Data"}</h2>
                    <div className="mb-4">
                        <InputLabel htmlFor="name" value="Nama Lengkap"/>
                        <TextInput id="name" type="text" className="mt-1 block w-full" value={data.name}
                                   onChange={(e) => setData("name", e.target.value)} required/>
                        <InputError message={errors.name} className="mt-2"/>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <InputLabel htmlFor="batch" value="Angkatan"/>
                            <TextInput id="batch" type="number" className="mt-1 block w-full" value={data.batch}
                                       onChange={(e) => setData("batch", e.target.value)} required/>
                            <InputError message={errors.batch} className="mt-2"/>
                        </div>
                        <div>
                            <InputLabel htmlFor="major" value="Jurusan"/>
                            <TextInput id="major" type="text" className="mt-1 block w-full" value={data.major}
                                       onChange={(e) => setData("major", e.target.value)} required/>
                            <InputError message={errors.major} className="mt-2"/>
                        </div>
                    </div>
                    <div className="mb-6">
                        <InputLabel htmlFor="status" value="Status"/>
                        <TextInput id="status" type="text" className="mt-1 block w-full" value={data.status}
                                   onChange={(e) => setData("status", e.target.value)} required/>
                        <InputError message={errors.status} className="mt-2"/>
                    </div>
                    <div className="flex justify-end gap-2">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <PrimaryButton disabled={processing}>Simpan</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* MODAL IMPORT EXCEL */}
            <Modal show={isImportModalOpen} onClose={closeImportModal} maxWidth="2xl">
                <form onSubmit={handleImportSubmit} className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium text-gray-900">Import Data Alumni</h2>
                    </div>

                    {/* INSTRUKSI + TOMBOL DOWNLOAD TEMPLATE */}
                    <div
                        className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <span>Gunakan format Excel yang sesuai.</span>
                        <a
                            href={route('admin.alumni.template')}
                            className="flex items-center gap-1 font-bold hover:underline text-blue-700 whitespace-nowrap"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                            </svg>
                            Download Template
                        </a>
                    </div>

                    <div className="mb-4 text-sm text-gray-600">
                        Klik "Lihat Preview" untuk mengecek data sebelum disimpan.
                    </div>

                    <div className="mb-4 flex gap-2 items-end">
                        <div className="w-full">
                            <InputLabel htmlFor="file" value="Pilih File Excel"/>
                            <input
                                type="file"
                                id="file"
                                className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-2"
                                onChange={(e) => {
                                    setDataImport("file", e.target.files[0]);
                                    setPreviewData([]);
                                }}
                                accept=".xlsx, .xls, .csv"
                            />
                            <InputError message={errorsImport.file} className="mt-2"/>
                        </div>
                        <SecondaryButton type="button" onClick={handlePreview}
                                         disabled={isLoadingPreview || !dataImport.file} className="mb-0.5 h-10">
                            {isLoadingPreview ? "Loading..." : "Lihat Preview"}
                        </SecondaryButton>
                    </div>

                    {previewData.length > 0 && (
                        <div className="mb-6 border rounded-lg overflow-hidden">
                            <div className="bg-gray-100 px-4 py-2 border-b font-bold text-sm text-gray-700">Preview Data
                                ({previewData.length} Baris)
                            </div>
                            <div className="max-h-60 overflow-y-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Angkatan</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Jurusan</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {previewData.map((row, idx) => (
                                        <tr key={idx}>
                                            <td className="px-4 py-2 text-sm text-gray-900">{row.nama_lengkap || row.nama}</td>
                                            <td className="px-4 py-2 text-sm text-gray-900">{row.angkatan_tahun || row.angkatan}</td>
                                            <td className="px-4 py-2 text-sm text-gray-900">{row.jurusan_sekolah || row.jurusan}</td>
                                            <td className="px-4 py-2 text-sm text-gray-900">{row.status_kuliahkerjawirausaha || row.status}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-2">
                        <SecondaryButton onClick={closeImportModal}>Batal</SecondaryButton>
                        <PrimaryButton disabled={processingImport || previewData.length === 0}
                                       className={previewData.length === 0 ? "opacity-50 cursor-not-allowed" : ""}>
                            {processingImport ? "Mengupload..." : "Import Sekarang"}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
