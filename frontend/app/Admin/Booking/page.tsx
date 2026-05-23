'use client';

import { useState, useEffect } from 'react';
import {
  Search, Bell, Eye, CheckCircle, XCircle, X,
  CalendarDays, Car, User, Wrench, Clock, ChevronFirst,
  ChevronLast, ChevronLeft, ChevronRight, Filter,
  RotateCcw, ClipboardList, Info,
} from 'lucide-react';
import SidebarAdmin from '../../components/sidebar-admin/page';

// ── Types ──────────────────────────────────────────────────────────────────
type StatusType = 'pending' | 'approved' | 'rejected';
type ViewType = 'booking' | 'workorder';

type Booking = {
  id: number;

  user: {
    name: string;
    noKontak?: string;
  };

  kendaraan: {
    merek: string;
    nomorPolisi: string;
  };

  Keluhan: string;

  jadwalService: string;

  status: StatusType;
};

// ── Styles ─────────────────────────────────────────────────────────────────
const STATUS_STYLE: Record<StatusType, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30',
  approved: 'bg-green-500/10 text-green-400 border border-green-500/30',
  rejected: 'bg-red-500/10 text-red-400 border border-red-500/30',
};

const STATUS_DOT: Record<StatusType, string> = {
  pending: 'bg-yellow-400',
  approved: 'bg-green-400',
  rejected: 'bg-red-500',
};

const PAGE_SIZE = 5;

// ── Stat Card Icon ─────────────────────────────────────────────────────────
function StatCardIcon({ type }: { type: 'total' | 'pending' | 'approved' | 'rejected' }) {
  const map = {
    total: { color: '#f97316', bg: 'bg-orange-500/10 border-orange-500/20' },
    pending: { color: '#eab308', bg: 'bg-yellow-500/10 border-yellow-500/20' },
    approved: { color: '#22c55e', bg: 'bg-green-500/10  border-green-500/20' },
    rejected: { color: '#ef4444', bg: 'bg-red-500/10    border-red-500/20' },
  };
  const { color, bg } = map[type];
  return (
    <div className={`w-10 h-10 rounded-xl border ${bg} flex items-center justify-center flex-shrink-0`}>
      {type === 'total' && <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="6" height="6" /><rect x="9" y="3" width="6" height="6" /><rect x="16" y="3" width="6" height="6" /><rect x="2" y="10" width="6" height="6" /><rect x="9" y="10" width="6" height="6" /><rect x="16" y="10" width="6" height="6" /></svg>}
      {type === 'pending' && <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
      {type === 'approved' && <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>}
      {type === 'rejected' && <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>}
    </div>
  );
}

// ── Detail Modal ───────────────────────────────────────────────────────────
function DetailModal({ booking, onClose, onApprove, onReject }: {
  booking: Booking;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#13161e] border border-[#1e2230] rounded-2xl w-full max-w-lg mx-4 p-7 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-[18px] font-bold text-white">Detail Booking</h3>
            <p className="text-[11px] text-[#4b5563] mt-0.5 font-mono">{booking.id}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-[#1a1d28] border border-[#2a2f3e] flex items-center justify-center text-[#6b7280] hover:text-white transition-all">
            <X size={14} />
          </button>
        </div>
        <div className="space-y-3 mb-6">
          {[
            { icon: User, label: 'Customer', value: booking.user.name },
            { icon: Car, label: 'Kendaraan', value: `${booking.kendaraan.merek} · ${booking.kendaraan.nomorPolisi}` },
            { icon: Wrench, label: 'Keluhan', value: booking.Keluhan },
            { icon: CalendarDays, label: 'Jadwal', value: booking.jadwalService },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3 p-3.5 bg-[#0f1117] border border-[#1e2230] rounded-xl">
              <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon size={13} color="#f97316" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-widest mb-0.5">{label}</p>
                <p className="text-[12px] text-white font-medium">{value}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLE[booking.status as StatusType]}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[booking.status as StatusType]}`} />
                <p>{booking.status}</p>
              </span>
          <div className="flex-1" />
          {booking.status === 'pending' && (
            <>
              <button onClick={onReject} className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-[11px] font-bold text-red-400 transition-all">
                <XCircle size={13} /> Reject
              </button>
              <button onClick={onApprove} className="flex items-center gap-1.5 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-lg text-[11px] font-bold text-green-400 transition-all">
                <CheckCircle size={13} /> Approve
              </button>
            </>
          )}
          {booking.status !== 'pending' && (
            <button onClick={onClose} className="px-5 py-2 bg-[#1a1d28] border border-[#2a2f3e] rounded-lg text-[11px] font-bold text-[#6b7280] hover:text-white transition-all">
              Tutup
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// VIEW 1 — Kelola Booking
// ══════════════════════════════════════════════════════════════════════════
function KelolaBookingView({
  bookings,
  setBookings,
  onViewWO,
  updateStatus,
}: {
  bookings: Booking[];

  setBookings: React.Dispatch<
    React.SetStateAction<Booking[]>
  >;

  onViewWO: (b: Booking) => void;

  updateStatus: (
    id: number,
    status: string
  ) => Promise<void>;
}) {

  const [search, setSearch] = useState('');

  const [filterStatus, setFilterStatus] =
    useState<'All Status' | StatusType>('All Status');

  const [filterDate, setFilterDate] = useState('');

  const [page, setPage] = useState(1);

  const [selected, setSelected] =
    useState<Booking | null>(null);

  // ================= COUNT =================
  const total = bookings.length;

  const pending = bookings.filter(
    b => b.status === 'pending'
  ).length;

  const approved = bookings.filter(
    b => b.status === 'approved'
  ).length;

  const rejected = bookings.filter(
    b => b.status === 'rejected'
  ).length;

  // ================= FILTER =================
  const filtered = bookings.filter(b => {

    const q = search.toLowerCase();

    const matchSearch =
      b.user.name.toLowerCase().includes(q) ||
      b.kendaraan.nomorPolisi.toLowerCase().includes(q) ||
      b.id.toString().includes(q);

    const matchStatus =
      filterStatus === 'All Status' ||
      b.status === filterStatus;

    return matchSearch && matchStatus;

  });

  // ================= PAGINATION =================
  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <>
      <div className="px-8 py-6 space-y-5">

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-4 gap-4">
          {([
            { label: 'TOTAL BOOKING', value: total, type: 'total' as const, border: 'border-l-orange-500' },
            { label: 'pending', value: pending, type: 'pending' as const, border: 'border-l-yellow-500' },
            { label: 'approved', value: approved, type: 'approved' as const, border: 'border-l-green-500' },
            { label: 'rejected', value: rejected, type: 'rejected' as const, border: 'border-l-red-500' },
          ]).map(({ label, value, type, border }) => (
            <div key={label} className={`bg-[#13161e] border border-[#1e2230] border-l-2 ${border} rounded-xl px-5 py-4 flex items-center justify-between`}>
              <div>
                <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest mb-2">{label}</p>
                <p className="text-[30px] font-black text-white leading-none">{value}</p>
              </div>
              <StatCardIcon type={type} />
            </div>
          ))}
        </div>

        {/* ── Filter Bar ── */}
        <div className="bg-[#13161e] border border-[#1e2230] rounded-xl p-5">
          <div className="flex items-end gap-4">
            {/* Search */}
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest">Search Records</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" size={13} />
                <input
                  type="text"
                  placeholder="Customer name, plate number, or ID..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  className="w-full bg-[#0f1117] border border-[#1e2230] rounded-lg py-2.5 pl-9 pr-4 text-[12px] outline-none focus:border-orange-500/50 placeholder:text-[#374151] text-[#e2e8f0]"
                />
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5 min-w-[160px]">
              <label className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest">Status Filter</label>
              <select
                value={filterStatus}
                onChange={e => {
                  setFilterStatus(
                    e.target.value as StatusType | 'All Status'
                  ); setPage(1);
                }}
                className="bg-[#0f1117] border border-[#1e2230] rounded-lg px-3 py-2.5 text-[12px] text-[#e2e8f0] outline-none focus:border-orange-500/50 cursor-pointer"
              >
                {['All Status', 'pending', 'approved', 'rejected'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest">Date Range</label>
              <input
                type="date"
                value={filterDate}
                onChange={e => setFilterDate(e.target.value)}
                className="bg-[#0f1117] border border-[#1e2230] rounded-lg px-3 py-2.5 text-[12px] text-[#e2e8f0] outline-none focus:border-orange-500/50 cursor-pointer"
              />
            </div>

            <button className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all whitespace-nowrap">
              <Filter size={13} /> Apply Filters
            </button>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="bg-[#13161e] border border-[#1e2230] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e2230]">
                {['Booking ID', 'Customer', 'Vehicle Details', 'Complaint', 'Schedule', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-[10px] font-bold text-[#4b5563] uppercase tracking-[1.5px] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-[#4b5563]">
                    <p className="text-[13px] font-medium">Tidak ada data booking</p>
                  </td>
                </tr>
              ) : paginated.map((b, i) => (
                <tr
                  key={b.id}
                  className={`border-b border-[#1e2230] hover:bg-[#1a1d28] transition-colors ${i === paginated.length - 1 ? 'border-b-0' : ''
                    }`}
                >
                  {/* Booking ID */}
                  <td className="px-5 py-4">
                    <span className="text-[11px] font-mono font-bold text-orange-400">
                      #{b.id}
                    </span>
                  </td>

                  {/* Customer */}
                  <td className="px-5 py-4">
                    <p className="text-[12px] font-bold text-white">
                      {b.user?.name}
                    </p>

                    <p className="text-[9px] text-[#4b5563] font-bold tracking-wider mt-0.5">
                      CUSTOMER
                    </p>
                  </td>

                  {/* Vehicle */}
                  <td className="px-5 py-4">
                    <p className="text-[12px] font-semibold text-white">
                      {b.kendaraan?.merek}
                    </p>

                    <span className="inline-block mt-1 px-1.5 py-0.5 bg-[#1a1d28] border border-[#2a2f3e] rounded text-[10px] font-mono text-[#9ca3af]">
                      {b.kendaraan?.nomorPolisi}
                    </span>
                  </td>

                  {/* Complaint */}
                  <td className="px-5 py-4 max-w-[200px]">
                    <p className="text-[11px] text-[#9ca3af] truncate">
                      {b.Keluhan}
                    </p>
                  </td>

                  {/* Schedule */}
                  <td className="px-5 py-4">
                    <p className="text-[11px] font-semibold text-white">
                      {new Date(b.jadwalService).toLocaleDateString()}
                    </p>

                    <div className="flex items-center gap-1 mt-0.5">
                      <Clock size={9} className="text-[#4b5563]" />

                      <p className="text-[10px] text-[#4b5563]">
                        {new Date(b.jadwalService).toLocaleTimeString()}
                      </p>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLE[b.status as StatusType]
                        }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[b.status as StatusType]
                          }`}
                      />

                      {b.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">

                      {b.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateStatus(b.id, 'approved')}
                            title="Approve"
                            className="w-7 h-7 rounded-lg bg-[#1a1d28] border border-[#2a2f3e] hover:border-green-500/40 hover:text-green-400 flex items-center justify-center text-[#6b7280] transition-all"
                          >
                            <CheckCircle size={13} />
                          </button>

                          <button
                            onClick={() => updateStatus(b.id, 'rejected')}
                            title="Reject"
                            className="w-7 h-7 rounded-lg bg-[#1a1d28] border border-[#2a2f3e] hover:border-red-500/40 hover:text-red-400 flex items-center justify-center text-[#6b7280] transition-all"
                          >
                            <XCircle size={13} />
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => onViewWO(b)}
                        title="View Work Order"
                        className="w-7 h-7 rounded-lg bg-[#1a1d28] border border-[#2a2f3e] hover:border-orange-500/40 hover:text-orange-400 flex items-center justify-center text-[#6b7280] transition-all"
                      >
                        <Eye size={13} />
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
              of <span className="text-white font-bold">{filtered.length}</span> bookings
            </p>
            <div className="flex items-center gap-1">
              {([
                { icon: ChevronFirst, action: () => setPage(1), disabled: page === 1 },
                { icon: ChevronLeft, action: () => setPage(p => Math.max(1, p - 1)), disabled: page === 1 },
              ] as const).map(({ icon: Icon, action, disabled }, i) => (
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
                { icon: ChevronRight, action: () => setPage(p => Math.min(totalPages, p + 1)), disabled: page === totalPages },
                { icon: ChevronLast, action: () => setPage(totalPages), disabled: page === totalPages },
              ] as const).map(({ icon: Icon, action, disabled }, i) => (
                <button key={i} onClick={action} disabled={disabled}
                  className="w-8 h-8 rounded-lg bg-[#1a1d28] border border-[#2a2f3e] flex items-center justify-center text-[#6b7280] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                  <Icon size={13} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <DetailModal
          booking={selected}
          onClose={() => setSelected(null)}
          onApprove={() => updateStatus(selected.id, 'approved')}
          onReject={() => updateStatus(selected.id, 'rejected')}
        />
      )}
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// VIEW 2 — Lihat Detail
// ══════════════════════════════════════════════════════════════════════════
function KelolaJadwalView({ booking, onBack }: { booking: Booking; onBack: () => void }) {
  const [catatan, setCatatan] = useState('');

  return (
    <div className="px-8 py-6 flex flex-col gap-5 h-full">

      {/* ── Breadcrumb / Back ── */}
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[11px] text-[#4b5563] hover:text-orange-400 transition-colors group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Kembali ke Kelola Booking
        </button>
        <span className="text-[#2a2f3e]">/</span>
        <span className="text-[11px] text-[#6b7280]">Jadwal & Work Order</span>
        <span className="text-[#2a2f3e]">/</span>
        <span className="text-[11px] font-mono text-orange-400">{booking.id}</span>
      </div>

      {/* ── Main Content ── */}
      <div className="flex gap-5 flex-1 min-h-0">

        {/* ── Left: WO Info Card ── */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">

          {/* Main Card */}
          <div className="bg-[#13161e] border border-[#1e2230] rounded-xl overflow-hidden">

            {/* Card Header */}
            <div className="px-6 py-4 border-b border-[#1e2230] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-orange-500/10 flex items-center justify-center">
                  <Info size={12} color="#f97316" />
                </div>
                <span className="text-[11px] font-bold text-[#6b7280] uppercase tracking-widest">Informasi Umum WO</span>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLE[booking.status as StatusType]}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[booking.status as StatusType]}`} />
                <p>{booking.status}</p>
              </span>
            </div>

            <div className="p-6 flex flex-col gap-4">

              {/* Customer + Vehicle — orange bordered */}
              <div className="border border-orange-500/40 rounded-xl overflow-hidden">
                <div className="grid grid-cols-2 divide-x divide-[#1e2230]">
                  {/* Customer */}
                  <div className="p-5 flex flex-col gap-1">
                    <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-[2px]">Customer Name</p>
                    <p className="text-[24px] font-black text-white leading-tight mt-1">{booking.user.name}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-4 h-4 rounded bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.83 12 19.79 19.79 0 0 1 1.85 3.58a2 2 0 0 1 1.99-2.18H6a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z" /></svg>
                      </div>
                      <p className="text-[12px] text-orange-400 font-semibold">{booking.user?.noKontak ?? '-'}</p>
                    </div>

                  </div>

                  {/* Vehicle */}
                  <div className="p-5 flex flex-col gap-1">
                    <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-[2px]">Vehicle Identity</p>
                    <p className="text-[24px] font-black text-white leading-tight mt-1">{booking.kendaraan.merek}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-1 bg-[#0f1117] border border-[#2a2f3e] rounded-md text-[11px] font-mono text-[#e2e8f0] font-bold tracking-wider">
                        {booking.kendaraan.nomorPolisi}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6b7280] mt-1">
                      -
                    </p>
                  </div>
                </div>
              </div>

              {/* Primary Complaint */}
              <div className="bg-[#0c0e14] border border-[#1e2230] rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Wrench size={11} className="text-[#4b5563]" />
                  <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-[2px]">Primary Complaint</p>
                </div>
                <p className="text-[13px] text-[#c9d1db] leading-relaxed italic">
                  &ldquo;{booking.Keluhan}&rdquo;
                </p>
              </div>

              {/* Entry Date */}
              <div className="border border-[#1e2230] rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarDays size={11} className="text-[#4b5563]" />
                  <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-[2px]">Entry Date</p>
                </div>
                <p className="text-[15px] font-bold text-white">
                  {booking.jadwalService}
                </p>
              </div>

            </div>
          </div>

          {/* Customer Reference Row */}
          <div className="bg-[#13161e] border border-[#1e2230] rounded-xl px-4 py-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1a1d28] border border-[#2a2f3e] flex items-center justify-center flex-shrink-0">
              <User size={14} className="text-[#4b5563]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-white">{booking.user.name}</p>
              <p className="text-[10px] text-[#4b5563] mt-0.5 flex items-center gap-1.5 flex-wrap">
                <span className="font-mono text-orange-400">{booking.id}</span>
                <span className="text-[#2a2f3e]">•</span>
                <span className="text-[#6b7280]">{booking.kendaraan.merek}</span>
                <span className="text-[#2a2f3e]">•</span>
              </p>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLE[booking.status as StatusType]}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[booking.status as StatusType]}`} />
              <p>{booking.status}</p>
            </span>
          </div>
        </div>

        {/* ── Right: Catatan Pengerjaan ── */}
        <div className="w-[340px] flex-shrink-0 flex flex-col gap-4">

          {/* Catatan Card */}
          <div className="bg-[#13161e] border border-[#1e2230] rounded-xl overflow-hidden flex flex-col flex-1">
            <div className="px-5 py-4 border-b border-[#1e2230] flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-orange-500/10 flex items-center justify-center">
                <ClipboardList size={12} color="#f97316" />
              </div>
              <span className="text-[11px] font-bold text-[#6b7280] uppercase tracking-widest">Catatan Pengerjaan</span>
            </div>
            <div className="p-5 flex flex-col flex-1 gap-3">
              <textarea
                value={catatan}
                onChange={e => setCatatan(e.target.value)}
                placeholder="Tuliskan detail temuan teknis atau catatan khusus di sini..."
                className="flex-1 min-h-[320px] bg-[#0c0e14] border border-[#1e2230] rounded-lg p-4 text-[12px] text-[#e2e8f0] placeholder:text-[#2d3340] outline-none focus:border-orange-500/40 resize-none leading-relaxed transition-colors"
              />
              <button
                onClick={() => { }}
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all"
              >
                Simpan Catatan
              </button>
            </div>
          </div>

          {/* Quick Info Card */}
          <div className="bg-[#13161e] border border-[#1e2230] rounded-xl p-5 flex flex-col gap-3">
            <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-[2px]">Ringkasan Booking</p>
            {[
              { label: 'Booking ID', value: booking.id, mono: true },
              { label: 'Schedule', value: booking.jadwalService, mono: false },
              { label: 'Plate No.', value: booking.kendaraan.nomorPolisi, mono: true },
              { label: 'Year', value: '-', mono: false },
            ].map(({ label, value, mono }) => (
              <div key={label} className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-[#4b5563]">{label}</span>
                <span className={`text-[11px] font-semibold text-right ${mono ? 'font-mono text-orange-400' : 'text-[#e2e8f0]'}`}>{value}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ROOT PAGE
// ══════════════════════════════════════════════════════════════════════════
export default function KelolaBookingPage() {

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState<ViewType>('booking');

  const [activeWO, setActiveWO] = useState<Booking | null>(null);

  // ================= FETCH BOOKINGS =================
  const fetchBookings = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://127.0.0.1:8000/api/kelola-booking",
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil data booking");
      }

      const result = await response.json();

      console.log("RESULT =", result);

      // INI PENTING
      setBookings(result.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  // ================= UPDATE STATUS =================
  const updateStatus = async (
    id: number,
    status: string
  ) => {

    try {

      const token = localStorage.getItem("token");

      console.log("STATUS =", status);
      console.log("ID =", id);

      const response = await fetch(
        `http://127.0.0.1:8000/api/kelola-booking/${id}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            _method: "PUT",
            status: status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal update status");
      }

      const result = await response.json();
      console.log(result);

      // refresh data
      await fetchBookings();

    } catch (error) {

      console.log(error);

    }
  };

  // ================= FIRST LOAD =================
  useEffect(() => {

    const loadData = async () => {
      await fetchBookings();
    };

    loadData();

  }, []);

  // ================= HANDLE VIEW WO =================
  const handleViewWO = (b: Booking) => {

    setActiveWO(b);

    setView('workorder');

  };

  const isBooking = view === 'booking';
  const isWorkorder = view === 'workorder';

  // ================= LOADING =================
  if (loading) {

    return (
      <div className="min-h-screen bg-[#0f1117] text-white flex items-center justify-center">
        Loading...
      </div>
    );

  }

  // ================= UI =================
  return (
    <div
      className="flex h-screen overflow-hidden bg-[#0f1117] text-[#e2e8f0]"
      style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}
    >

      <SidebarAdmin />

      <main className="flex-1 overflow-y-auto h-screen flex flex-col">

        <div className="sticky top-0 z-10 bg-[#0f1117]/95 backdrop-blur border-b border-[#1e2230] px-8 py-4 flex justify-between items-center">

          <div>
            <h2 className="text-[20px] font-bold text-white leading-none">
              {isBooking
                ? 'Kelola Booking'
                : 'Work Order'}
            </h2>

            <p className="text-[11px] text-[#4b5563] mt-1">
              {isBooking
                ? 'Kelola dan pantau semua booking servis kendaraan'
                : 'Kelola Jadwal Booking'}
            </p>
          </div>

          <button className="w-9 h-9 bg-[#13161e] border border-[#1e2230] rounded-lg flex items-center justify-center text-[#4b5563] hover:text-white transition-colors relative">
            <Bell size={15} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full" />
          </button>

        </div>

        <div className="flex-1">

          {isBooking && (

            <KelolaBookingView
              bookings={bookings}
              setBookings={setBookings}
              onViewWO={handleViewWO}
              updateStatus={updateStatus}
            />

          )}

          {isWorkorder && activeWO && (

            <KelolaJadwalView
              booking={activeWO}
              onBack={() => setView('booking')}
            />

          )}

        </div>

      </main>

    </div>
  );
}


