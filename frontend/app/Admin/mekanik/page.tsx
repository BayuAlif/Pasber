'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Users,
  Search, Plus, Pencil, Trash2, RefreshCw, X, Upload,
  AlertTriangle, Info, ChevronFirst, ChevronLast, ChevronLeft, ChevronRight,
} from 'lucide-react';
import SidebarAdmin from '../../components/sidebar-admin/page';
import axios from "axios";
import AuthPopup from '../../components/auth_popup/Auth_popup';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const API_BE = process.env.NEXT_PUBLIC_BACKEND_URL;

// ── Types ──────────────────────────────────────────────────────────────────
type StatusType = 'available' | 'unavailable';
type Mekanik = {
  id: number;
  foto: string | null;
  kodeMekanik: string;
  nama: string;
  email: string;
  telepon: string;
  bengkel_id: number;
  spesialisasi: string;
  status: StatusType;
};

type Bengkel = {
  id: number;
  nama: string;
};



const STATUS_STYLE: Record<StatusType, string> = {
  available: 'bg-green-500/10 text-green-400 border border-green-500/20',
  unavailable: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
};

const SPESIALISASI_OPTIONS = [
  'Engine Specialist', 'Electrical', 'General', 'Transmission',
  'Body & Paint', 'AC Specialist', 'Tire & Wheel',
];

const PAGE_SIZE = 5;

// ── Main Page ──────────────────────────────────────────────────────────────
export default function KelolaMekanikPage() {
  // data
  const [mekaniks, setMekaniks] = useState<Mekanik[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'Semua' | StatusType>('Semua');
  const [page, setPage] = useState(1);
  // State untuk popup
  const [popup, setPopup] = useState<{
    open: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  } | null>(null);
  const [onSuccessCallback, setOnSuccessCallback] = useState<(() => void) | null>(null);

  // modals
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState<Mekanik | null>(null);
  const [showStatus, setShowStatus] = useState<Mekanik | null>(null);
  const [showDelete, setShowDelete] = useState<Mekanik | null>(null);

  // form state
  const emptyForm = {
    foto: '',
    nama: '',
    email: '',
    telepon: '',
    spesialisasi: ''
  };

  const showError = (message: string) => {
    setPopup({
      open: true,
      type: 'error',
      title: 'Validasi Gagal',
      message,
    });
  };

  const showSuccess = (message: string, onContinue?: () => void) => {
    setPopup({
      open: true,
      type: 'success',
      title: 'Berhasil!',
      message,
    });
    if (onContinue) setOnSuccessCallback(() => onContinue);
  };

  const handlePopupClose = () => {
    setPopup(null);
    setOnSuccessCallback(null);
  };

  const handlePopupContinue = () => {
    if (onSuccessCallback) onSuccessCallback();
    setPopup(null);
    setOnSuccessCallback(null);
  };
  const closePopup = () => setPopup(null);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [newStatus, setNewStatus] = useState<StatusType>('available');
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Filter & Pagination ────────────────────────────────────────────────
  const filtered = mekaniks.filter(m => {
    const matchSearch = m.nama.toLowerCase().includes(search.toLowerCase()) ||
      m.kodeMekanik.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'Semua' || m.status === filterStatus;
    return matchSearch && matchStatus;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);



  const fetchMekanik = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API_BASE}/mekanik`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json"
          }
        }
      );

      setMekaniks(res.data.data);

    } catch (error) {
      console.error(error);
    }
  };



  useEffect(() => {
    const loadData = async () => {
      await fetchMekanik();
    };

    loadData();
  }, []);
  // ── CRUD handlers ──────────────────────────────────────────────────────
  const handleAddSubmit = async () => {
    if (!form.nama.trim() || form.nama.trim().length < 3) {
      showError("Nama lengkap minimal 3 karakter");
      return;
    }
    if (!form.email.trim()) {
      showError("Email harus diisi");
      return;
    }
    if (!emailRegex.test(form.email)) {
      showError("Format email tidak valid");
      return;
    }
    if (form.telepon && !phoneRegex.test(form.telepon)) {
      showError("Nomor telepon tidak valid (contoh: 081234567890)");
      return;
    }
    if (!form.spesialisasi) {
      showError("Pilih spesialisasi mekanik");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("nama", form.nama);
      formData.append("email", form.email);
      formData.append("telepon", form.telepon || "");
      formData.append("spesialisasi", form.spesialisasi);
      if (selectedFile) formData.append("foto", selectedFile);

      await axios.post(`${API_BASE}/mekanik`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
          Accept: "application/json"
        }
      });

      showSuccess("Mekanik berhasil ditambahkan!", () => {
        setShowAdd(false);
        setForm({ ...emptyForm });
        setSelectedFile(null);
        fetchMekanik();
      });
    } catch (error: any) {
      const message = error.response?.data?.message || "Gagal menambahkan mekanik";
      showError(message);
    }
  };

  const handleEditSubmit = async () => {
    if (!showEdit) return;

    if (!form.nama.trim() || form.nama.trim().length < 3) {
      showError("Nama lengkap minimal 3 karakter");
      return;
    }
    if (!form.email.trim()) {
      showError("Email harus diisi");
      return;
    }
    if (!emailRegex.test(form.email)) {
      showError("Format email tidak valid");
      return;
    }
    if (form.telepon && !phoneRegex.test(form.telepon)) {
      showError("Nomor telepon tidak valid");
      return;
    }
    if (!form.spesialisasi) {
      showError("Pilih spesialisasi mekanik");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("nama", form.nama);
      formData.append("email", form.email);
      formData.append("telepon", form.telepon || "");
      formData.append("spesialisasi", form.spesialisasi);
      formData.append("status", showEdit.status);
      if (selectedFile) formData.append("foto", selectedFile);

      await axios.post(`${API_BASE}/mekanik/${showEdit.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      showSuccess("Data mekanik berhasil diperbarui!", () => {
        setShowEdit(null);
        setSelectedFile(null);
        fetchMekanik();
      });
    } catch (error: any) {
      const message = error.response?.data?.message || "Gagal mengupdate mekanik";
      showError(message);
    }
  };

  const handleStatusUpdate = async () => {
    if (!showStatus) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE}/mekanik/${showStatus.id}`,
        {
          nama: showStatus.nama,
          email: showStatus.email,
          telepon: showStatus.telepon,
          spesialisasi: showStatus.spesialisasi,
          status: newStatus
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSuccess("Status mekanik berhasil diubah!", () => {
        setShowStatus(null);
        fetchMekanik();
      });
    } catch (error: any) {
      showError(error.response?.data?.message || "Gagal mengubah status");
    }
  };

  const handleDelete = async () => {
    if (!showDelete) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/mekanik/${showDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showSuccess("Mekanik berhasil dihapus!", () => {
        setShowDelete(null);
        fetchMekanik();
      });
    } catch (error: any) {
      showError(error.response?.data?.message || "Gagal menghapus mekanik");
    }
  };

  const openEdit = (m: Mekanik) => {
    setForm({
      foto: m.foto ?? '',
      nama: m.nama,
      email: m.email,
      telepon: m.telepon ?? '',
      spesialisasi: m.spesialisasi
    });
    setShowEdit(m);
  };

  const openStatus = (m: Mekanik) => { setNewStatus(m.status); setShowStatus(m); };

  const handleFotoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
    console.log(selectedFile);

    const reader = new FileReader();

    reader.onload = (ev) => {
      setForm(f => ({
        ...f,
        foto: ev.target?.result as string
      }));
    };

    reader.readAsDataURL(file);
  };

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex =
    /^(\+62|62|08)[0-9]{8,13}$/;



  // ── Shared input style ─────────────────────────────────────────────────
  const inputCls = "w-full bg-[#0f1117] border border-[#2a2f3e] rounded-lg px-3.5 py-2.5 text-[13px] text-[#e2e8f0] placeholder:text-[#374151] outline-none focus:border-orange-500/50 transition-colors";
  const selectCls = inputCls + " appearance-none cursor-pointer";

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f1117] text-[#e2e8f0]" style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

      {/* ── SIDEBAR ── */}
      <SidebarAdmin />

      {/* ── MAIN ── */}
      <main className="flex-1 overflow-y-auto h-screen">

        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#0f1117]/95 backdrop-blur border-b border-[#1e2230] px-8 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-[18px] font-bold text-white leading-none">Kelola Mekanik</h2>
            <p className="text-[11px] text-[#4b5563] mt-1">Manajemen data dan status mekanik bengkel</p>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" size={13} />
              <input type="text" placeholder="ID Servis/Plat Nomor"
                className="bg-[#13161e] border border-[#1e2230] rounded-lg py-2 pl-9 pr-4 text-[12px] outline-none focus:border-orange-500/50 w-56 placeholder:text-[#374151] text-[#e2e8f0]" />
            </div>
          </div>
        </div>

        <div className="px-8 py-6">

          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" size={13} />
              <input type="text" placeholder="Cari nama mekanik..."
                value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="w-full bg-[#13161e] border border-[#1e2230] rounded-lg py-2.5 pl-9 pr-4 text-[13px] outline-none focus:border-orange-500/50 placeholder:text-[#374151] text-[#e2e8f0]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[12px] text-[#4b5563] font-medium">Filter Status:</span>
              <select value={filterStatus} onChange={e => {
                setFilterStatus(e.target.value as StatusType | 'Semua');
                setPage(1);
              }}
                className="bg-[#13161e] border border-[#1e2230] rounded-lg px-3 py-2.5 text-[13px] text-[#e2e8f0] outline-none focus:border-orange-500/50 cursor-pointer">
                {['Semua', 'available', 'unavailable'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <button onClick={() => { setForm({ ...emptyForm }); setShowAdd(true); }}
              className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-[12px] font-bold uppercase tracking-widest rounded-lg transition-all">
              <Plus size={15} /> Tambah Mekanik
            </button>
          </div>

          {/* Table */}
          <div className="bg-[#13161e] border border-[#1e2230] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1e2230]">
                  {['ID Mekanik', 'Nama', 'Spesialisasi', 'No. Telp', 'Status', 'Aksi'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-[10px] font-bold text-[#4b5563] uppercase tracking-[1.5px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-16 text-center text-[#4b5563]">
                      <Users size={32} className="mx-auto mb-3 opacity-30" />
                      <p className="text-[13px] font-medium">Belum ada data mekanik</p>
                      <p className="text-[11px] mt-1">Klik Tambah Mekanik untuk menambahkan mekanik baru</p>
                    </td>
                  </tr>
                ) : paginated.map((m, i) => (
                  <tr key={m.id} className={`border-b border-[#1e2230] hover:bg-[#1a1d28] transition-colors ${i === paginated.length - 1 ? 'border-b-0' : ''}`}>
                    {/* ID */}
                    <td className="px-5 py-3.5">
                      <span className="text-[12px] font-mono text-[#9ca3af]">{m.kodeMekanik ?? m.id}</span>
                    </td>
                    {/* Nama */}
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] font-medium text-white">{m.nama}</span>
                    </td>
                    {/* Spesialisasi */}
                    <td className="px-5 py-3.5">
                      <span className="text-[12px] text-[#9ca3af]">{m.spesialisasi}</span>
                    </td>
                    {/* No. Telp */}
                    <td className="px-5 py-3.5">
                      <span className="text-[12px] text-[#9ca3af]">{m.telepon}</span>
                    </td>
                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${STATUS_STYLE[m.status]}`}>
                        {m.status}
                      </span>
                    </td>
                    {/* Aksi */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => openEdit(m)} title="Edit"
                          className="w-7 h-7 rounded-lg bg-[#1a1d28] border border-[#2a2f3e] hover:border-orange-500/40 hover:text-orange-400 flex items-center justify-center text-[#6b7280] transition-all">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => setShowDelete(m)} title="Hapus"
                          className="w-7 h-7 rounded-lg bg-[#1a1d28] border border-[#2a2f3e] hover:border-red-500/40 hover:text-red-400 flex items-center justify-center text-[#6b7280] transition-all">
                          <Trash2 size={13} />
                        </button>
                        <button onClick={() => openStatus(m)} title="Ubah Status"
                          className="w-7 h-7 rounded-lg bg-[#1a1d28] border border-[#2a2f3e] hover:border-green-500/40 hover:text-green-400 flex items-center justify-center text-[#6b7280] transition-all">
                          <RefreshCw size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="px-5 py-3.5 border-t border-[#1e2230] flex items-center justify-between">
              <p className="text-[11px] text-[#4b5563]">
                Showing{' '}
                <span className="text-white font-bold">
                  {filtered.length === 0 ? '0' : `${(page - 1) * PAGE_SIZE + 1}-${Math.min(page * PAGE_SIZE, filtered.length)}`}
                </span>{' '}
                of <span className="text-white font-bold">{filtered.length}</span> Mekanik
              </p>
              <div className="flex items-center gap-1">
                {[
                  { icon: ChevronFirst, action: () => setPage(1), disabled: page === 1 },
                  { icon: ChevronLeft, action: () => setPage(p => Math.max(1, p - 1)), disabled: page === 1 },
                ].map(({ icon: Icon, action, disabled }, i) => (
                  <button key={i} onClick={action} disabled={disabled}
                    className="w-8 h-8 rounded-lg bg-[#1a1d28] border border-[#2a2f3e] flex items-center justify-center text-[#6b7280] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                    <Icon size={13} />
                  </button>
                ))}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-[12px] font-bold border transition-all
                      ${page === p ? 'bg-orange-500 border-orange-500 text-white' : 'bg-[#1a1d28] border-[#2a2f3e] text-[#6b7280] hover:text-white'}`}>
                    {p}
                  </button>
                ))}
                {[
                  { icon: ChevronRight, action: () => setPage(p => Math.min(totalPages, p + 1)), disabled: page === totalPages },
                  { icon: ChevronLast, action: () => setPage(totalPages), disabled: page === totalPages },
                ].map(({ icon: Icon, action, disabled }, i) => (
                  <button key={i} onClick={action} disabled={disabled}
                    className="w-8 h-8 rounded-lg bg-[#1a1d28] border border-[#2a2f3e] flex items-center justify-center text-[#6b7280] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                    <Icon size={13} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ══════════════════════════════════════════════════════════════
          MODAL: TAMBAH MEKANIK
      ══════════════════════════════════════════════════════════════ */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#13161e] border border-[#1e2230] rounded-2xl w-full max-w-lg mx-4 p-7 shadow-2xl">
            <h3 className="text-[20px] font-bold text-white mb-1">Tambah Mekanik Baru</h3>
            <p className="text-[12px] text-[#4b5563] mb-6">Daftarkan personel teknis ke dalam sistem operasional PASBER</p>

            <div className="flex gap-5 mb-5">
              <div>
                <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest mb-2">Foto Profil</p>
                <div onClick={() => fileRef.current?.click()}
                  className="w-24 h-28 rounded-xl border-2 border-dashed border-[#2a2f3e] hover:border-orange-500/50 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden bg-[#0f1117]">
                  {form.foto
                    ? <img src={form.foto} alt="foto" className="w-full h-full object-cover" />
                    : <><Upload size={20} className="text-[#4b5563] mb-1.5" /><span className="text-[9px] text-[#4b5563] uppercase tracking-widest">Upload</span></>
                  }
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFotoChange} />
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest mb-1.5">Nama Lengkap</p>
                  <input className={inputCls} placeholder="Contoh: Budi Santoso"
                    value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest mb-1.5">
                    Email
                  </p>

                  <input
                    type="email"
                    className={inputCls}
                    placeholder="mekanik@email.com"
                    value={form.email}
                    onChange={e =>
                      setForm(f => ({
                        ...f,
                        email: e.target.value
                      }))
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest mb-1.5">No. Telepon</p>
                    <input
                      className={inputCls}
                      placeholder="+62 8..."
                      value={form.telepon ?? ''}
                      onChange={e => setForm(f => ({ ...f, telepon: e.target.value }))}
                    />


                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest mb-1.5">Spesialisasi</p>
                    <select
                      className={selectCls}
                      value={form.spesialisasi}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          spesialisasi: e.target.value,
                        })
                      }
                    >
                      <option value="">Pilih Spesialisasi</option>

                      {SPESIALISASI_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>


            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setShowAdd(false)} className="px-5 py-2.5 text-[12px] font-bold text-[#6b7280] hover:text-white transition-colors">Batal</button>
              <button onClick={handleAddSubmit}
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-[12px] font-bold uppercase tracking-widest rounded-lg transition-all">
                Simpan Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODAL: EDIT MEKANIK
      ══════════════════════════════════════════════════════════════ */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#13161e] border border-[#1e2230] rounded-2xl w-full max-w-lg mx-4 p-7 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-[20px] font-bold text-white">Edit Data Mekanik</h3>
                <p className="text-[12px] text-[#4b5563] mt-0.5">Perbarui informasi mekanik</p>
              </div>
              <button onClick={() => setShowEdit(null)} className="w-8 h-8 rounded-lg bg-[#1a1d28] border border-[#2a2f3e] flex items-center justify-center text-[#6b7280] hover:text-white transition-all">
                <X size={14} />
              </button>
            </div>

            <div className="flex gap-5 mb-5">
              <div>
                <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest mb-2">Foto Profil</p>
                <div onClick={() => fileRef.current?.click()}
                  className="relative w-24 h-28 rounded-xl border-2 border-dashed border-[#2a2f3e] hover:border-orange-500/50 flex items-center justify-center cursor-pointer transition-all overflow-hidden bg-[#0f1117]">
                  {form.foto
                    ? <Image
                        src={`${API_BE}/storage/${form.foto}`}
                        alt="foto"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    : <><Upload size={20} className="text-[#4b5563] mb-1.5" /><span className="text-[9px] text-[#4b5563] uppercase tracking-widest">Upload</span></>
                  }
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFotoChange} />
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest mb-1.5">Nama Lengkap</p>
                  <input className={inputCls} value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest mb-1.5">
                    Email
                  </p>

                  <input
                    type="email"
                    className={inputCls}
                    placeholder="mekanik@email.com"
                    value={form.email}
                    onChange={e =>
                      setForm(f => ({
                        ...f,
                        email: e.target.value
                      }))
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest mb-1.5">No. Telepon</p>
                    <input className={inputCls} value={form.telepon} onChange={e => setForm(f => ({ ...f, telepon: e.target.value }))} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest mb-1.5">Spesialisasi</p>
                    <select
                      className={selectCls}
                      value={form.spesialisasi}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          spesialisasi: e.target.value,
                        })
                      }
                    >
                      <option value="">Pilih Spesialisasi</option>

                      {SPESIALISASI_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setShowEdit(null)} className="px-5 py-2.5 text-[12px] font-bold text-[#6b7280] hover:text-white transition-colors">Batal</button>
              <button onClick={handleEditSubmit}
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-[12px] font-bold uppercase tracking-widest rounded-lg transition-all">
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODAL: UBAH STATUS
      ══════════════════════════════════════════════════════════════ */}
      {showStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#13161e] border border-[#1e2230] rounded-2xl w-full max-w-sm mx-4 p-7 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[18px] font-bold text-white">Ubah Status</h3>
              <button onClick={() => setShowStatus(null)} className="w-8 h-8 rounded-lg bg-[#1a1d28] border border-[#2a2f3e] flex items-center justify-center text-[#6b7280] hover:text-white transition-all">
                <X size={14} />
              </button>
            </div>

            <div className="flex items-center gap-3 p-3.5 bg-[#1a1d28] border border-[#2a2f3e] rounded-xl mb-5">
              <div>
                <p className="text-[13px] font-bold text-white">{showStatus.nama}</p>
                <p className="text-[11px] text-[#4b5563]">{showStatus.spesialisasi}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest mb-2">Status Kerja Sekarang</p>
              <select className={selectCls} value={newStatus} onChange={e => setNewStatus(e.target.value as StatusType)}>
                {(['available', 'unavailable',] as StatusType[]).map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="flex items-start gap-2.5 p-3.5 bg-[rgba(249,115,22,0.05)] border border-orange-500/15 rounded-xl mb-6">
              <Info size={13} color="#f97316" className="flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#9ca3af] leading-relaxed">
                Status <strong className="text-white">unavailable</strong>  akan mencegah sistem otomatis mengalokasikan antrean servis baru ke teknisi ini hingga status diubah kembali menjadi available.
              </p>
            </div>

            <button onClick={handleStatusUpdate}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white text-[12px] font-bold uppercase tracking-widest rounded-xl transition-all mb-2.5">
              Update Status
            </button>
            <button onClick={() => setShowStatus(null)} className="w-full py-2 text-[11px] font-bold text-[#4b5563] hover:text-white transition-colors uppercase tracking-widest">
              Batal
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODAL: KONFIRMASI HAPUS
      ══════════════════════════════════════════════════════════════ */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#13161e] border border-red-500/20 rounded-2xl w-full max-w-sm mx-4 p-7 shadow-2xl text-center relative">
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 bg-[#13161e] border-2 border-red-500/30 rounded-xl flex items-center justify-center">
              <AlertTriangle size={26} color="#ef4444" />
            </div>

            <div className="mt-5 mb-5">
              <h3 className="text-[20px] font-bold text-white mb-2">Konfirmasi Hapus</h3>
              <div className="w-10 h-0.5 bg-red-500/50 mx-auto rounded-full mb-4" />
              <p className="text-[13px] text-[#9ca3af] leading-relaxed">
                Apakah Anda yakin ingin menghapus data <strong className="text-white">{showDelete.nama}</strong>? Tindakan ini tidak dapat dibatalkan dan akan menghapus semua riwayat penugasan terkait.
              </p>
            </div>

            <button onClick={handleDelete}
              className="w-full py-3 bg-red-500 hover:bg-red-600 text-white text-[12px] font-bold uppercase tracking-widest rounded-xl transition-all mb-2.5 flex items-center justify-center gap-2">
              <Trash2 size={14} /> Ya, Hapus Data
            </button>
            <button onClick={() => setShowDelete(null)}
              className="w-full py-2.5 bg-[#1a1d28] border border-[#2a2f3e] text-[12px] font-bold text-[#6b7280] hover:text-white uppercase tracking-widest rounded-xl transition-all">
              Batal
            </button>
          </div>
        </div>
      )}

      {popup && (
        <AuthPopup
          open={popup.open}
          type={popup.type}
          title={popup.title}
          message={popup.message}
          onClose={handlePopupClose}
          onContinue={handlePopupContinue}
        />
      )}
    </div>
  );
}
