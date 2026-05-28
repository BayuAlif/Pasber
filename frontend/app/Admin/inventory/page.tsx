'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Bell, Search, Filter, Settings, BarChart2,
  Plus, AlertTriangle, ChevronFirst, ChevronLast,
  ChevronLeft, ChevronRight, X, Zap, Minus,
  Package, Wrench, ChevronDown, ShieldCheck,
} from 'lucide-react';
import SidebarAdmin from '../../components/sidebar-admin/page';
import axios from "axios";

// ── Types ──────────────────────────────────────────────────────────────────

type UpdateMode = 'tambah' | 'gunakan';
type KategoriItem = 'MATERIAL';
type Satuan =
  | 'pcs'
  | 'box'
  | 'liter'
  | 'set'
  | 'roll'
  | 'unit';

type InventoryItem = {
  id: number;
  kodeMaterial: string;
  namaMaterial: string;
  merekMaterial: string;
  satuan: Satuan;
  harga: number;
  stok: number;
};

// ── Constants ──────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;
const REORDER_POINT = 2;


const KATEGORI_ICON: Record<KategoriItem, React.ReactNode> = {
  MATERIAL: <Wrench size={18} />,
};

const formatRupiah = (val: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);


// ── Update Stock Modal ─────────────────────────────────────────────────────

function UpdateStockModal({
  item,
  onClose,
  onConfirm,
}: {
  item: InventoryItem;
  onClose: () => void;
  onConfirm: (id: number, mode: UpdateMode, jumlah: number) => void;
}) {
  const [mode, setMode] = useState<UpdateMode>('tambah');
  const [jumlah, setJumlah] = useState<number | ''>(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const jumlahNumber = Number(jumlah || 0);

  const stokSetelah = mode === 'tambah'
    ? item.stok + jumlahNumber
    : Math.max(0, item.stok - jumlahNumber);

  const maxDeduct = item.stok;
  const isDeductInvalid =
  mode === 'gunakan' &&
  Number(jumlah || 0) > maxDeduct;

  const handleConfirm = () => {
    if (isDeductInvalid) return;
    onConfirm(item.id, mode, Number(jumlah));
    onClose();
  };

  return (



    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      style={{ animation: 'fadeIn 0.15s ease' }}
    >
      <div
        className="w-full max-w-[620px] mx-4 bg-[#13161e] border border-[#1e2230] rounded-2xl overflow-hidden shadow-2xl shadow-black/60"
        style={{ animation: 'slideUp 0.2s ease' }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-5 border-b border-[#1e2230]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-orange-500 tracking-[2px] uppercase mb-1">Inventory Management</p>
              <h2 className="text-[22px] font-black text-white uppercase leading-tight tracking-tight">
                Update Stok: {item.namaMaterial}
              </h2>
              <div className="flex items-center gap-3 mt-2">
                <span className="px-2 py-0.5 bg-orange-500/10 border border-orange-500/30 rounded text-[10px] font-black text-orange-400 tracking-widest">
                  PART ID: {item.kodeMaterial}
                </span>
                <span className="flex items-center gap-1.5 text-[10px] text-[#4b5563]">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" />
                  ACTIVE DATABASE LOCK
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#1a1d28] border border-[#2a2f3e] flex items-center justify-center text-[#6b7280] hover:text-white hover:border-[#4b5563] transition-all"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-2 gap-4">

          {/* Stok Saat Ini */}
          <div className="bg-[#0f1117] border border-[#1e2230] rounded-xl p-5 col-span-1">
            <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest mb-3">Stok Saat Ini</p>
            <div className="flex items-end gap-3">
              <span className="text-[52px] font-black text-white leading-none tabular-nums">{item.stok}</span>
              <span className="text-[14px] font-bold text-[#4b5563] mb-2 uppercase">{item.satuan}</span>
            </div>
          </div>

          {/* Mode Selector */}
          <div className="grid grid-rows-2 gap-3">
            {/* Tambah Stok */}
            <button
              onClick={() => setMode('tambah')}
              className={`rounded-xl p-4 text-left transition-all border-2 ${mode === 'tambah'
                ? 'bg-orange-500 border-orange-500'
                : 'bg-[#0f1117] border-[#1e2230] hover:border-[#2a2f3e]'
                }`}
            >
              <p className={`text-[13px] font-black uppercase tracking-widest ${mode === 'tambah' ? 'text-white' : 'text-[#e2e8f0]'}`}>
                Tambah Stok
              </p>
              <p className={`text-[10px] mt-0.5 uppercase tracking-wider ${mode === 'tambah' ? 'text-white/70' : 'text-[#4b5563]'}`}>
                Restock into Inventory
              </p>
            </button>

            {/* Gunakan Stok */}
            <button
              onClick={() => setMode('gunakan')}
              className={`rounded-xl p-4 text-left transition-all border-2 ${mode === 'gunakan'
                ? 'bg-[#1a1d28] border-orange-500'
                : 'bg-[#0f1117] border-[#1e2230] hover:border-[#2a2f3e]'
                }`}
            >
              <p className={`text-[13px] font-black uppercase tracking-widest ${mode === 'gunakan' ? 'text-white' : 'text-[#e2e8f0]'}`}>
                Gunakan Stok
              </p>
              <p className={`text-[10px] mt-0.5 uppercase tracking-wider ${mode === 'gunakan' ? 'text-orange-400' : 'text-[#4b5563]'}`}>
                Deduct for Service/WO
              </p>
            </button>
          </div>

          {/* Input Jumlah — full width */}
          <div className="col-span-2 bg-[#0f1117] border border-[#1e2230] rounded-xl p-5">
            <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-[2px] text-center mb-4">Input Penambahan</p>
            <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest text-center mb-3">Jumlah Unit</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setJumlah(j => Math.max(1, Number(j || 0) - 1))}
                className="w-12 h-14 bg-[#13161e] border border-[#2a2f3e] hover:border-orange-500/40 hover:text-orange-400 text-[#6b7280] rounded-xl flex items-center justify-center transition-all"
              >
                <Minus size={16} />
              </button>
              <input
                type="text"
                inputMode="numeric"
                value={jumlah}
                onChange={(e) => {
                  const val = e.target.value;

                  if (val === '') {
                    setJumlah('' as unknown as number);
                    return;
                  }

                  const num = Number(val);

                  if (!isNaN(num) && num >= 1) {
                    setJumlah(num);
                  }
                }}
                className="w-28 h-14 bg-[#13161e] border border-[#2a2f3e] rounded-xl text-center text-[28px] font-black text-white tabular-nums outline-none focus:border-orange-500/40"
              />
              <button
                onClick={() => setJumlah(j => Number(j || 0) + 1)}
                className="w-12 h-14 bg-[#13161e] border border-[#2a2f3e] hover:border-orange-500/40 hover:text-orange-400 text-[#6b7280] rounded-xl flex items-center justify-center transition-all"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Stok preview */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="text-[11px] text-[#4b5563]">Stok setelah update:</span>
              <span className={`text-[13px] font-black tabular-nums ${isDeductInvalid ? 'text-red-400' : 'text-orange-400'}`}>
                {isDeductInvalid ? '— Stok tidak cukup' : `${stokSetelah} ${item.satuan}`}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              disabled={isDeductInvalid}
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[13px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <Zap size={15} />
              Konfirmasi Update
            </button>
          ) : (
            <div className="bg-[#0f1117] border border-orange-500/30 rounded-xl p-4">
              <p className="text-[11px] text-center text-[#e2e8f0] mb-4">
                Yakin ingin{' '}
                <span className="font-black text-orange-400">{mode === 'tambah' ? `menambah ${jumlah}` : `menggunakan ${jumlah}`} {item.satuan}</span>{' '}
                {mode === 'tambah' ? 'ke' : 'dari'}{' '}
                <span className="font-black text-white">{item.namaMaterial}</span>?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 bg-[#1a1d28] border border-[#2a2f3e] hover:border-[#4b5563] text-[#9ca3af] hover:text-white text-[12px] font-bold uppercase tracking-widest rounded-xl transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white text-[12px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-[0.99]"
                >
                  Ya, Update Sekarang
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Tambah Item Modal ──────────────────────────────────────────────────────

function TambahItemModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (
    item: Omit<InventoryItem, 'id' | 'kodeMaterial'>
  ) => void;
}) {
  const [kategori, setKategori] = useState<KategoriItem>('MATERIAL');
  const [namaItem, setNamaItem] = useState('');
  const [merek, setMerek] = useState('');
  const [satuan, setSatuan] = useState<Satuan>('pcs');
  const [harga, setHarga] = useState('');
  const [stok, setStok] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const validate = () => {
    const e: Record<string, string> = {};

    if (!namaItem.trim()) e.namaItem = 'Nama item wajib diisi';

    if (!merek.trim()) e.merek = 'Merek wajib diisi';

    if (!harga || Number(harga) < 0)
      e.harga = 'Harga tidak valid';

    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    onSave({
      namaMaterial: namaItem.trim(),
      merekMaterial: merek.trim(),
      harga: Number(harga),
      stok,
      satuan
    });
    onClose();
  };

  const inputCls = (field: string) =>
    `w-full bg-[#13161e] border ${errors[field] ? 'border-red-500/50' : 'border-[#2a2f3e]'} rounded-xl px-4 py-3 text-[13px] text-[#e2e8f0] placeholder:text-[#374151] outline-none focus:border-orange-500/50 transition-colors`;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      style={{ animation: 'fadeIn 0.15s ease' }}
    >
      <div
        className="w-full max-w-[580px] mx-4 bg-[#13161e] border border-[#1e2230] rounded-2xl overflow-hidden shadow-2xl shadow-black/60"
        style={{ animation: 'slideUp 0.2s ease' }}
      >
        {/* Header */}
        <div className="px-7 pt-7 pb-5 border-b border-[#1e2230] flex items-start justify-between">
          <div>
            <h2 className="text-[26px] font-black text-orange-500 uppercase tracking-tight leading-none">Tambah Item Baru</h2>
            <p className="text-[10px] text-[#4b5563] font-bold tracking-widest uppercase mt-1">Sistem Manajemen Inventori</p>
            <p className="text-[10px] text-[#4b5563] font-bold tracking-widest uppercase">PASBER v2.4</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#1a1d28] border border-[#2a2f3e] flex items-center justify-center text-[#6b7280] hover:text-white hover:border-[#4b5563] transition-all"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="px-7 py-6 space-y-6">

          {/* Informasi Dasar */}
          <div>
            <p className="flex items-center gap-2 text-[12px] font-black text-white uppercase tracking-widest mb-4 pb-3 border-b border-[#1e2230]">
              <span className="w-4 h-4 rounded-full border border-orange-500 text-orange-500 flex items-center justify-center text-[8px]">i</span>
              Informasi Dasar
            </p>

            {/* Kategori */}
            <div className="mb-4">
              <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest mb-2">Kategori Item</p>
              <div className="grid grid-cols-1 gap-2">
                {(['MATERIAL'] as KategoriItem[]).map(k => (
                  <button
                    key={k}
                    onClick={() => setKategori(k)}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-[12px] font-black uppercase tracking-widest transition-all ${kategori === k
                      ? 'bg-[#1a1d28] border-orange-500 text-orange-400'
                      : 'bg-[#0f1117] border-[#1e2230] text-[#4b5563] hover:border-[#2a2f3e] hover:text-[#6b7280]'
                      }`}
                  >
                    {KATEGORI_ICON[k]}
                    {k}
                  </button>
                ))}
              </div>
            </div>

            {/* Nama & Merek */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest mb-2">Nama Item</p>
                <input
                  type="text"
                  value={namaItem}
                  onChange={e => { setNamaItem(e.target.value); setErrors(er => ({ ...er, namaItem: '' })); }}
                  placeholder="Contoh: Oli Mesin 10W-40"
                  className={inputCls('namaItem')}
                />
                {errors.namaItem && <p className="text-[10px] text-red-400 mt-1">{errors.namaItem}</p>}
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest mb-2">Merek</p>
                <input
                  type="text"
                  value={merek}
                  onChange={e => { setMerek(e.target.value); setErrors(er => ({ ...er, merek: '' })); }}
                  placeholder="Shell / Motul"
                  className={inputCls('merek')}
                />
                {errors.merek && <p className="text-[10px] text-red-400 mt-1">{errors.merek}</p>}
              </div>
            </div>

            {/* Satuan, Harga, Stok */}
            <div className="grid grid-cols-3 gap-4">
              {/* Satuan */}
              <div>
                <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest mb-2">Satuan</p>
                <div className="relative">
                  <select
                    value={satuan}
                    onChange={e => setSatuan(e.target.value as Satuan)}
                    className="w-full appearance-none bg-[#13161e] border border-[#2a2f3e] rounded-xl px-4 py-3 text-[13px] text-[#e2e8f0] outline-none focus:border-orange-500/50 cursor-pointer transition-colors pr-8"
                  >
                    {(['pcs', 'box', 'liter', 'set', 'roll', 'unit'] as Satuan[]).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4b5563] pointer-events-none" />
                </div>
              </div>

              {/* Harga */}
              <div>
                <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest mb-2">Harga Jual</p>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-orange-500">Rp</span>
                  <input
                    type="number"
                    min={0}
                    value={harga}
                    onChange={e => {
                      setHarga(e.target.value);
                      setErrors(er => ({ ...er, harga: '' }));
                    }}
                    className={`${inputCls('harga')} pl-9`}
                  />
                </div>
                {errors.harga && <p className="text-[10px] text-red-400 mt-1">{errors.harga}</p>}
              </div>

              {/* Stok Awal */}
              <div>
                <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest mb-2">Stok Awal</p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setStok(s => Math.max(0, s - 1))}
                    className="w-10 h-[46px] bg-[#13161e] border border-[#2a2f3e] hover:border-orange-500/40 text-[#6b7280] hover:text-orange-400 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
                  >
                    <Minus size={12} />
                  </button>
                  <input
                    type="number"
                    min={0}
                    value={stok}
                    onChange={e => { setStok(Number(e.target.value)); setErrors(er => ({ ...er, stok: '' })); }}
                    className={`${inputCls('stok')} text-center px-2`}
                  />
                  <button
                    onClick={() => setStok(s => s + 1)}
                    className="w-10 h-[46px] bg-[#13161e] border border-[#2a2f3e] hover:border-orange-500/40 text-[#6b7280] hover:text-orange-400 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
                  >
                    <Plus size={12} />
                  </button>
                </div>
                {errors.stok && <p className="text-[10px] text-red-400 mt-1">{errors.stok}</p>}
              </div>
            </div>
          </div>

          {/* Industrial Validation */}
          <div className="flex gap-3 p-4 bg-[#0f1117] border-l-2 border-orange-500 rounded-r-xl">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={16} className="text-orange-500" />
            </div>
            <div>
              <p className="text-[11px] font-black text-orange-500 uppercase tracking-widest mb-1">Industrial Validation</p>
              <p className="text-[11px] text-[#6b7280] leading-relaxed">
                Pastikan semua data teknis seperti grade oli atau kompatibilitas sparepart telah diverifikasi sesuai standar OEM sebelum item diaktifkan di sistem.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 pb-7 pt-2 flex items-center justify-between border-t border-[#1e2230]">
          <div>
            <p className="text-[9px] font-black text-[#374151] uppercase tracking-widest">Operator: Technician_04</p>
            <p className="text-[9px] font-black text-[#374151] uppercase tracking-widest">Auth Token: B29-PX-001</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-[#1a1d28] border border-[#2a2f3e] hover:border-[#4b5563] text-[#9ca3af] hover:text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-[0.99]"
            >
              Simpan Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Toast Notification ─────────────────────────────────────────────────────

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-5 py-3 bg-[#13161e] border border-orange-500/30 rounded-xl shadow-xl shadow-black/40"
      style={{ animation: 'slideUp 0.2s ease' }}
    >
      <span className="w-2 h-2 bg-orange-500 rounded-full" />
      <span className="text-[12px] font-bold text-[#e2e8f0]">{message}</span>
    </div>
  );
}

// ── Main Inventory View ────────────────────────────────────────────────────

function InventoryView({
  items,
  onUpdateStock,
  onTambahItem,
  onDelete

}: {
  items: InventoryItem[];
  onUpdateStock: (id: number) => void;
  onTambahItem: () => void;
  onDelete: (id: number) => void;
}) {
  const [search, setSearch] = useState('');

  const [page, setPage] = useState(1);

  const totalMaterial = items.length;
  const stokMenipis = items.filter(
    item => item.stok <= REORDER_POINT
  ).length;

  const filtered = items.filter(i => {
    const q = search.toLowerCase();
    const matchSearch = i.kodeMaterial.toLowerCase().includes(q) || i.namaMaterial.toLowerCase().includes(q);
    return matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="px-8 py-6 space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#13161e] border border-[#1e2230] rounded-xl px-6 py-5 flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest mb-2">Total Material</p>
            <p className="text-[36px] font-black text-white leading-none tabular-nums">{totalMaterial.toLocaleString('id-ID')}</p>
          </div>
          <Settings size={15} className="text-[#2a2f3e] mt-1" />
        </div>
        <div className="bg-[#13161e] border border-[#1e2230] rounded-xl px-6 py-5 flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest mb-2">Stok Menipis / Habis</p>
            <p className={`text-[36px] font-black leading-none tabular-nums ${stokMenipis > 0 ? 'text-orange-400' : 'text-white'}`}>{stokMenipis}</p>
          </div>
          <BarChart2 size={30} className="text-[#1e2230] mt-1" />
        </div>
      </div>

      <div className="bg-[#13161e] border border-[#1e2230] rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#1e2230]">
          <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-black tracking-widest uppercase rounded-lg transition-colors">
            MATERIAL
          </button>
          <div className="flex-1" />
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" size={13} />
            <input
              type="text"
              placeholder="Cari Kode Part atau Nama..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full bg-[#0f1117] border border-[#1e2230] rounded-lg py-2 pl-9 pr-4 text-[12px] outline-none focus:border-orange-500/40 placeholder:text-[#374151] text-[#e2e8f0] transition-colors"
            />
          </div>

          <button className="flex items-center gap-1.5 px-3 py-2 border border-[#1e2230] bg-[#0f1117] hover:border-[#2a2f3e] text-[#6b7280] hover:text-white rounded-lg text-[11px] font-bold tracking-wider transition-all">
            <Filter size={12} />
            FILTER
          </button>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1e2230]">
              {['KODE MATERIAL', 'NAMA MATERIAL', 'MEREK', 'HARGA', 'STOK', 'SATUAN', 'ACTIONS'].map(h => (
                <th key={h} className="px-5 py-3.5 text-left text-[10px] font-bold text-[#4b5563] uppercase tracking-[1.5px] whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-20 text-center">
                  <Package size={32} className="mx-auto mb-3 text-[#2a2f3e]" />
                  <p className="text-[13px] font-medium text-[#4b5563]">
                    {search
                      ? 'Tidak ada item yang cocok.'
                      : 'Belum ada data inventory.'
                    }
                  </p>
                  {!search && (
                    <p className="text-[11px] text-[#374151] mt-1">Klik tombol + Tambah Item untuk mulai menambahkan.</p>
                  )}
                </td>
              </tr>
            ) : paginated.map((item, i) => (
              <tr
                key={item.id}
                className={`border-b border-[#1e2230] hover:bg-[#1a1d28] transition-colors ${i === paginated.length - 1 ? 'border-b-0' : ''}`}
              >
                <td className="px-5 py-4"><span className="text-[11px] font-mono font-bold text-[#6b7280]">{item.kodeMaterial}</span></td>
                <td className="px-5 py-4"><p className="text-[12px] font-bold text-white">{item.namaMaterial}</p></td>
                <td className="px-5 py-4"><p className="text-[12px] text-[#9ca3af]">{item.merekMaterial}</p></td>
                <td className="px-5 py-4"><p className="text-[11px] text-[#e2e8f0] font-medium tabular-nums whitespace-nowrap">{formatRupiah(item.harga)}</p></td>
                <td className="px-5 py-4">
                  <p className="text-[12px] font-bold text-white">
                    {item.stok}
                  </p>
                </td>
                <td className="px-5 py-4"><span className="text-[11px] text-[#6b7280]">{item.satuan}</span></td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateStock(item.id)}
                      className="px-3 py-1.5 bg-[#1a1d28] border border-[#2a2f3e] hover:border-orange-500/40 hover:text-orange-400 text-[#6b7280] text-[11px] font-bold rounded-lg transition-all whitespace-nowrap"
                    >
                      Update Stock
                    </button>

                    <button
                      onClick={() => onDelete(item.id)}
                      className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white text-red-400 text-[11px] font-bold rounded-lg transition-all whitespace-nowrap"
                    >
                      Hapus
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
              {filtered.length === 0 ? '0' : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)}`}
            </span>{' '}
            of <span className="text-white font-bold">{filtered.length}</span> entries
          </p>
          <div className="flex items-center gap-1">
            {([
              { Icon: ChevronFirst, action: () => setPage(1), disabled: page === 1 },
              { Icon: ChevronLeft, action: () => setPage(p => Math.max(1, p - 1)), disabled: page === 1 },
            ] as const).map(({ Icon, action, disabled }, i) => (
              <button key={i} onClick={action} disabled={disabled}
                className="w-8 h-8 rounded-lg bg-[#1a1d28] border border-[#2a2f3e] flex items-center justify-center text-[#6b7280] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                <Icon size={13} />
              </button>
            ))}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-[12px] font-bold border transition-all ${page === p ? 'bg-orange-500 border-orange-500 text-white' : 'bg-[#1a1d28] border-[#2a2f3e] text-[#6b7280] hover:text-white'}`}>
                {p}
              </button>
            ))}
            {([
              { Icon: ChevronRight, action: () => setPage(p => Math.min(totalPages, p + 1)), disabled: page === totalPages },
              { Icon: ChevronLast, action: () => setPage(totalPages), disabled: page === totalPages },
            ] as const).map(({ Icon, action, disabled }, i) => (
              <button key={i} onClick={action} disabled={disabled}
                className="w-8 h-8 rounded-lg bg-[#1a1d28] border border-[#2a2f3e] flex items-center justify-center text-[#6b7280] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                <Icon size={13} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 pb-1">
        <p className="text-[10px] text-[#2a2f3e] tracking-wider uppercase">
          © 2024 Precision Automotive Engineering | Technical Mastery
        </p>
        <div className="flex items-center gap-5">
          {['System Status', 'API Documentation', 'Compliance'].map(item => (
            <button key={item} className="text-[10px] text-[#2a2f3e] hover:text-[#6b7280] tracking-wider uppercase transition-colors">
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Root Page ──────────────────────────────────────────────────────────────

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [updateTarget, setUpdateTarget] = useState<InventoryItem | null>(null);
  const [showTambah, setShowTambah] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleUpdateStock = (id: number) => {
    const item = items.find(i => i.id === id);
    if (item) setUpdateTarget(item);
  };

  const handleConfirmUpdate = async (
    id: number,
    mode: UpdateMode,
    jumlah: number
  ) => {
    try {
      const item = items.find(i => i.id === id);

      if (!item) return;

      const newStok =
        mode === 'tambah'
          ? item.stok + jumlah
          : Math.max(0, item.stok - jumlah);

      const response = await axios.put(
        `http://127.0.0.1:8000/api/material/${id}`,
        {
          namaMaterial: item.namaMaterial,
          merekMaterial: item.merekMaterial,
          satuan: item.satuan,
          harga: item.harga,
          stok: newStok,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setItems(prev =>
        prev.map(i =>
          i.id === id
            ? response.data.data
            : i
        )
      );

      setToast(
        `Stok berhasil ${mode === 'tambah'
          ? 'ditambahkan'
          : 'dikurangi'
        } sebanyak ${jumlah} unit`
      );
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMaterial = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get(
        'http://127.0.0.1:8000/api/material',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      setItems(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchMaterial();
    };

    loadData();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/material/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setItems(prev => prev.filter(i => i.id !== id));

      setToast('Material berhasil dihapus');
    } catch (error) {
      console.error(error);
    }
  };
  const handleSaveItem = async (
    newItem: Omit<InventoryItem, 'id' | 'kodeMaterial'>
  ) => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        'http://127.0.0.1:8000/api/material',
        newItem,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      setItems(prev => [...prev, response.data.data]);

      setToast(
        `Item "${response.data.data.namaMaterial}" berhasil ditambahkan`
      );
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <>
      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>

      <div
        className="flex h-screen overflow-hidden bg-[#0f1117] text-[#e2e8f0]"
        style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
      >
        <SidebarAdmin />

        {/* Main */}
        <main className="flex-1 overflow-y-auto h-screen flex flex-col">
          {/* Top bar */}
          <div className="sticky top-0 z-10 bg-[#0f1117]/95 backdrop-blur border-b border-[#1e2230] px-8 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-[20px] font-bold text-white leading-none">Inventory</h2>
              <p className="text-[11px] text-[#4b5563] mt-1">Kelola Inventory</p>
            </div>
            <button className="w-9 h-9 bg-[#13161e] border border-[#1e2230] rounded-lg flex items-center justify-center text-[#4b5563] hover:text-white transition-colors relative">
              <Bell size={15} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1">
            <InventoryView
              items={items}
              onUpdateStock={handleUpdateStock}
              onTambahItem={() => setShowTambah(true)}
              onDelete={handleDelete}
            />
          </div>
        </main>

        {/* FAB */}
        <button
          onClick={() => setShowTambah(true)}
          className="fixed bottom-8 right-8 flex items-center gap-2 px-5 py-3 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-[11px] font-black tracking-widest uppercase rounded-xl shadow-lg shadow-orange-500/20 transition-all duration-150 z-40"
        >
          <Plus size={14} />
          TAMBAH ITEM
        </button>
      </div>

      {/* Modals */}
      {updateTarget && (
        <UpdateStockModal
          item={updateTarget}
          onClose={() => setUpdateTarget(null)}
          onConfirm={handleConfirmUpdate}
        />
      )}
      {showTambah && (
        <TambahItemModal
          onClose={() => setShowTambah(false)}
          onSave={handleSaveItem}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </>
  );
}