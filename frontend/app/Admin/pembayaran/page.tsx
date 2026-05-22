'use client';

import { useState } from 'react';
import {
  Receipt,
  AlertCircle,
  BarChart3,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Bell,
  Car,
} from 'lucide-react';
import SidebarAdmin from '../../components/sidebar-admin/page';

// ─── Types ──────────────────────────────────────────────────────────────────
type InvoiceStatus = 'LUNAS' | 'BELUM LUNAS';

type Invoice = {
  id: number;
  noNota: string;
  customerName: string;
  kendaraan: string;
  tanggal: string;
  jam: string;
  total: number;
  status: InvoiceStatus;
};

// ─── Main Component ──────────────────────────────────────────────────────────
export default function InvoicePembayaran() {
  const [invoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ─── Derived data ────────────────────────────────────────────────────────
  const totalNota = invoices.length;
  const menungguPembayaran = invoices.filter((i) => i.status === 'BELUM LUNAS').length;
  const totalPemasukan = invoices.filter((i) => i.status === 'LUNAS').reduce((acc, i) => acc + i.total, 0);
  const belumLunas = invoices.filter((i) => i.status === 'BELUM LUNAS').reduce((acc, i) => acc + i.total, 0);

  const filtered = invoices.filter((i) => {
    const matchSearch =
      i.noNota.toLowerCase().includes(search.toLowerCase()) ||
      i.customerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All Status' || i.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatRp = (val: number) => {
    if (val >= 1_000_000) return `Rp ${(val / 1_000_000).toFixed(2).replace('.', ',')} Jt`;
    return `Rp ${val.toLocaleString('id-ID')}`;
  };

  const formatRpFull = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;


  return (
    <div className="flex h-screen overflow-hidden bg-[#0f1117] text-[#e2e8f0]" style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

      <SidebarAdmin />

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto h-screen">

      {/* ── Header ── */}
      <div className="flex items-start justify-between px-8 pt-8 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Invoice &amp; Pembayaran</h1>
          <p className="text-gray-500 text-xs mt-0.5">Kelola Jadwal Booking</p>
        </div>
        <button className="w-9 h-9 rounded-lg bg-[#161b22] border border-white/8 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
          <Bell size={16} />
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-8 pb-5">

        {/* Total Nota */}
        <div className="bg-[#161b22] border border-white/8 rounded-xl px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Total Nota</p>
            <p className="text-3xl font-black text-white">{totalNota}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Receipt size={18} className="text-orange-500" />
          </div>
        </div>

        {/* Menunggu Pembayaran */}
        <div className="bg-[#161b22] border border-white/8 rounded-xl px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Menunggu Pembayaran</p>
            <p className="text-3xl font-black text-white">{menungguPembayaran}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
            <AlertCircle size={18} className="text-yellow-500" />
          </div>
        </div>

        {/* Pemasukan & Piutang */}
        <div className="bg-[#161b22] border border-white/8 rounded-xl px-6 py-5 flex items-center justify-between">
          <div className="flex gap-8">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Total Pemasukan</p>
              <p className="text-xl font-black text-orange-500">{formatRp(totalPemasukan)}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Belum Lunas</p>
              <p className="text-xl font-black text-orange-400">{formatRp(belumLunas)}</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <BarChart3 size={18} className="text-blue-400" />
          </div>
        </div>
      </div>

      {/* ── Table Container ── */}
      <div className="mx-8 mb-8 bg-[#161b22] border border-white/8 rounded-xl flex flex-col flex-1">

        {/* Search & Filter */}
        <div className="px-6 py-5 border-b border-white/5">
          {/* Labels row */}
          <div className="flex items-center gap-3 mb-2">
            <p className="flex-1 text-[9px] font-bold text-gray-500 uppercase tracking-widest">Search Records</p>
            <p className="shrink-0 w-44 text-[9px] font-bold text-gray-500 uppercase tracking-widest">Status Filter</p>
            <div className="shrink-0 w-[130px]" />
          </div>
          {/* Inputs row */}
          <div className="flex items-center gap-3">

            {/* Search */}
            <div className="flex-1 min-w-0 relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Cari nota atau nama"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="w-full bg-[#0d1117] border border-white/8 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-gray-600 outline-none focus:border-orange-500/40 transition-colors"
              />
            </div>

            {/* Status Filter */}
            <div className="shrink-0 w-44 relative">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="w-full appearance-none bg-[#0d1117] border border-white/8 rounded-lg px-3 py-2.5 pr-8 text-sm font-semibold text-white outline-none focus:border-orange-500/50 hover:border-white/20 transition-colors cursor-pointer"
              >
                <option value="All Status">All Status</option>
                <option value="LUNAS">Lunas</option>
                <option value="BELUM LUNAS">Belum Lunas</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              {statusFilter !== 'All Status' && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-orange-500 border-2 border-[#161b22]" />
              )}
            </div>

            {/* Apply Button */}
            <div className="shrink-0 w-[130px]">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 active:scale-95 rounded-lg text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-orange-900/20 whitespace-nowrap">
                <Filter size={12} />
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[1.2fr_2fr_1.2fr_1.2fr_1fr_0.8fr] gap-4 px-6 py-3 border-b border-white/5">
          {['No. Nota', 'Customer & Kendaraan', 'Tanggal', 'Total', 'Status', 'Aksi'].map((h) => (
            <p key={h} className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{h}</p>
          ))}
        </div>

        {/* Table Body */}
        <div className="flex-1">
          {paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center">
                <Receipt size={24} className="text-gray-600" />
              </div>
              <p className="text-gray-600 text-sm font-medium">Belum ada data invoice</p>
              <p className="text-gray-700 text-xs">Data akan muncul setelah ada booking yang selesai</p>
            </div>
          ) : (
            paginated.map((inv, idx) => (
              <div
                key={inv.id}
                className={`grid grid-cols-[1.2fr_2fr_1.2fr_1.2fr_1fr_0.8fr] gap-4 px-6 py-4 items-center border-b border-white/5 hover:bg-white/2 transition-colors ${idx === 0 ? 'border-l-2 border-l-orange-500' : ''}`}
              >
                {/* No Nota */}
                <p className="text-sm font-semibold text-white">{inv.noNota}</p>

                {/* Customer & Kendaraan */}
                <div>
                  <p className="text-sm font-bold text-white">{inv.customerName}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Car size={10} className="text-gray-600" />
                    <p className="text-[11px] text-gray-500">{inv.kendaraan}</p>
                  </div>
                </div>

                {/* Tanggal */}
                <div>
                  <p className="text-sm text-white">{inv.tanggal}</p>
                  <p className="text-[11px] text-gray-500">{inv.jam}</p>
                </div>

                {/* Total */}
                <p className={`text-sm font-bold ${inv.status === 'BELUM LUNAS' ? 'text-orange-400' : 'text-white'}`}>
                  {formatRpFull(inv.total)}
                </p>

                {/* Status */}
                <div>
                  <span className={`inline-flex px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest leading-tight text-center
                    ${inv.status === 'LUNAS'
                      ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                      : 'bg-orange-500/15 text-orange-400 border border-orange-500/20'
                    }`}>
                    {inv.status === 'LUNAS' ? 'LUNAS' : 'BELUM\nLUNAS'}
                  </span>
                </div>

                {/* Aksi */}
                <button className="text-xs font-black uppercase tracking-widest text-white hover:text-orange-400 transition-colors">
                  Detail
                </button>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
          <p className="text-[11px] text-gray-500">
            Showing <span className="text-white font-semibold">{filtered.length}</span> of{' '}
            <span className="text-white font-semibold">{invoices.length}</span> bookings
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-lg bg-[#0d1117] border border-white/8 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === p
                  ? 'bg-orange-600 text-white'
                  : 'bg-[#0d1117] border border-white/8 text-gray-400 hover:text-white'
                  }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-lg bg-[#0d1117] border border-white/8 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
      </main>
    </div>
  );
}
