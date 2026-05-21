'use client';

import { useState } from 'react';
import {
  Search, Bell, Eye, CheckCircle, XCircle, X,
  CalendarDays, Car, User, Wrench, Clock, ChevronFirst,
  ChevronLast, ChevronLeft, ChevronRight, Filter,
} from 'lucide-react';
import SidebarAdmin from '../../components/sidebar-admin/page';

// ── Types ──────────────────────────────────────────────────────────────────
type StatusType = 'PENDING' | 'APPROVED' | 'REJECTED';

type Booking = {
  id: string;
  customer: string;
  customerType: 'VIP CLIENT' | 'REGULAR CLIENT' | 'NEW CLIENT';
  vehicle: string;
  plateNumber: string;
  complaint: string;
  scheduleDate: string;
  scheduleTime: string;
  status: StatusType;
};

// ── Dummy Data ─────────────────────────────────────────────────────────────
const DUMMY_BOOKINGS: Booking[] = [
  { id: '#BK-2024-001', customer: 'Andi Wijaya',   customerType: 'VIP CLIENT',     vehicle: 'Toyota Fortuner GR',  plateNumber: 'B 1234 XYZ', complaint: 'Engine noise when accelerating',       scheduleDate: '24 Oct 2024', scheduleTime: '08:00 WIB', status: 'PENDING'  },
  { id: '#BK-2024-002', customer: 'Jessica Wijaya', customerType: 'VIP CLIENT',    vehicle: 'BMW M3 Competition',  plateNumber: 'D 4652 CC',  complaint: 'Oil leak from bottom of engine',        scheduleDate: '25 Oct 2024', scheduleTime: '14:30 WIB', status: 'APPROVED' },
  { id: '#BK-2024-003', customer: 'Budi Santoso',   customerType: 'REGULAR CLIENT', vehicle: 'Honda Civic Type R', plateNumber: 'L 9901 AB',  complaint: 'Suspension feels too stiff on bumps',   scheduleDate: '26 Oct 2024', scheduleTime: '10:00 WIB', status: 'REJECTED' },
  { id: '#BK-2024-004', customer: 'Rina Melati',    customerType: 'NEW CLIENT',     vehicle: 'Porsche 911 Carrera', plateNumber: 'B 911 RIN', complaint: 'Brake pedal feels spongy',              scheduleDate: '27 Oct 2024', scheduleTime: '09:00 WIB', status: 'PENDING'  },
  { id: '#BK-2024-005', customer: 'Doni Saputra',   customerType: 'REGULAR CLIENT', vehicle: 'Toyota GR86',        plateNumber: 'B 8600 GR',  complaint: 'Check engine light on',                 scheduleDate: '28 Oct 2024', scheduleTime: '11:00 WIB', status: 'APPROVED' },
  { id: '#BK-2024-006', customer: 'Sarah Amelia',   customerType: 'VIP CLIENT',     vehicle: 'Lamborghini Huracan', plateNumber: 'B 0001 LP', complaint: 'Transmission hesitation during shift',   scheduleDate: '29 Oct 2024', scheduleTime: '13:00 WIB', status: 'PENDING'  },
  { id: '#BK-2024-007', customer: 'Reza Firmansyah', customerType: 'NEW CLIENT',    vehicle: 'Honda Jazz RS',      plateNumber: 'F 1234 RZ',  complaint: 'AC not cooling properly',               scheduleDate: '30 Oct 2024', scheduleTime: '15:00 WIB', status: 'APPROVED' },
  { id: '#BK-2024-008', customer: 'Maya Sari',       customerType: 'REGULAR CLIENT', vehicle: 'Mazda CX-5',        plateNumber: 'D 5678 MY',  complaint: 'Vibration at high speed',               scheduleDate: '31 Oct 2024', scheduleTime: '09:30 WIB', status: 'REJECTED' },
];

const STATUS_STYLE: Record<StatusType, string> = {
  PENDING:  'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  APPROVED: 'bg-green-500/10  text-green-400  border border-green-500/20',
  REJECTED: 'bg-red-500/10   text-red-400    border border-red-500/20',
};

const PAGE_SIZE = 5;

// ── Modal Detail ───────────────────────────────────────────────────────────
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
            { icon: User,        label: 'Customer',    value: `${booking.customer} · ${booking.customerType}` },
            { icon: Car,         label: 'Kendaraan',   value: `${booking.vehicle} · ${booking.plateNumber}`   },
            { icon: Wrench,      label: 'Keluhan',     value: booking.complaint                                },
            { icon: CalendarDays,label: 'Jadwal',      value: `${booking.scheduleDate} · ${booking.scheduleTime}` },
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
          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLE[booking.status]}`}>
            {booking.status}
          </span>
          <div className="flex-1" />
          {booking.status === 'PENDING' && (
            <>
              <button onClick={onReject}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-[11px] font-bold text-red-400 transition-all">
                <XCircle size={13} /> Reject
              </button>
              <button onClick={onApprove}
                className="flex items-center gap-1.5 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-lg text-[11px] font-bold text-green-400 transition-all">
                <CheckCircle size={13} /> Approve
              </button>
            </>
          )}
          {booking.status !== 'PENDING' && (
            <button onClick={onClose} className="px-5 py-2 bg-[#1a1d28] border border-[#2a2f3e] rounded-lg text-[11px] font-bold text-[#6b7280] hover:text-white transition-all">
              Tutup
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function KelolaBookingPage() {
  const [bookings, setBookings]         = useState<Booking[]>(DUMMY_BOOKINGS);
  const [search, setSearch]             = useState('');
  const [filterStatus, setFilterStatus] = useState<'All Status' | StatusType>('All Status');
  const [filterDate, setFilterDate]     = useState('');
  const [page, setPage]                 = useState(1);
  const [selected, setSelected]         = useState<Booking | null>(null);

  // ── Stats ────────────────────────────────────────────────────────────────
  const total    = bookings.length;
  const pending  = bookings.filter(b => b.status === 'PENDING').length;
  const approved = bookings.filter(b => b.status === 'APPROVED').length;
  const rejected = bookings.filter(b => b.status === 'REJECTED').length;

  // ── Filter ───────────────────────────────────────────────────────────────
  const filtered = bookings.filter(b => {
    const matchSearch = b.customer.toLowerCase().includes(search.toLowerCase()) ||
                        b.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
                        b.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All Status' || b.status === filterStatus;
    return matchSearch && matchStatus;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── Actions ──────────────────────────────────────────────────────────────
  const updateStatus = (id: string, status: StatusType) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    setSelected(null);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f1117] text-[#e2e8f0]" style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

      {/* ── SIDEBAR ── */}
      <SidebarAdmin />

      {/* ── MAIN ── */}
      <main className="flex-1 overflow-y-auto h-screen">

        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#0f1117]/95 backdrop-blur border-b border-[#1e2230] px-8 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-[18px] font-bold text-white leading-none">Kelola Booking</h2>
            <p className="text-[11px] text-[#4b5563] mt-1">Kelola dan pantau semua booking servis kendaraan</p>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" size={13} />
              <input type="text" placeholder="ID Servis / Plat Nomor"
                className="bg-[#13161e] border border-[#1e2230] rounded-lg py-2 pl-9 pr-4 text-[12px] outline-none focus:border-orange-500/50 w-56 placeholder:text-[#374151] text-[#e2e8f0]" />
            </div>
            <button className="w-9 h-9 bg-[#13161e] border border-[#1e2230] rounded-lg flex items-center justify-center text-[#4b5563] hover:text-white transition-colors relative">
              <Bell size={15} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full" />
            </button>
          </div>
        </div>

        <div className="px-8 py-6 space-y-4">

          {/* Stat Cards */}
          <div className="grid grid-cols-4 gap-3.5">
            {[
              { label: 'Total Booking', value: total,    color: 'border-l-orange-500', icon: '📋' },
              { label: 'Pending',       value: pending,  color: 'border-l-yellow-500', icon: '⏳' },
              { label: 'Approved',      value: approved, color: 'border-l-green-500',  icon: '✅' },
              { label: 'Rejected',      value: rejected, color: 'border-l-red-500',    icon: '❌' },
            ].map(({ label, value, color, icon }) => (
              <div key={label} className={`bg-[#13161e] border border-[#1e2230] border-l-2 ${color} rounded-xl px-5 py-4 flex items-center justify-between`}>
                <div>
                  <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest mb-1">{label}</p>
                  <p className="text-[28px] font-black text-white leading-none">{value}</p>
                </div>
                <span className="text-2xl opacity-40">{icon}</span>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" size={13} />
              <input type="text" placeholder="Customer name, plate number, or ID..."
                value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="w-full bg-[#13161e] border border-[#1e2230] rounded-lg py-2.5 pl-9 pr-4 text-[12px] outline-none focus:border-orange-500/50 placeholder:text-[#374151] text-[#e2e8f0]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#4b5563] font-bold uppercase tracking-widest">Status</span>
              <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value as any); setPage(1); }}
                className="bg-[#13161e] border border-[#1e2230] rounded-lg px-3 py-2.5 text-[12px] text-[#e2e8f0] outline-none focus:border-orange-500/50 cursor-pointer">
                {['All Status', 'PENDING', 'APPROVED', 'REJECTED'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#4b5563] font-bold uppercase tracking-widest">Date</span>
              <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
                className="bg-[#13161e] border border-[#1e2230] rounded-lg px-3 py-2.5 text-[12px] text-[#e2e8f0] outline-none focus:border-orange-500/50 cursor-pointer" />
            </div>

            <button className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all">
              <Filter size={13} /> Apply Filters
            </button>
          </div>

          {/* Table */}
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
                  <tr key={b.id} className={`border-b border-[#1e2230] hover:bg-[#1a1d28] transition-colors ${i === paginated.length - 1 ? 'border-b-0' : ''}`}>
                    {/* ID */}
                    <td className="px-5 py-4">
                      <span className="text-[11px] font-mono font-bold text-orange-400">{b.id}</span>
                    </td>
                    {/* Customer */}
                    <td className="px-5 py-4">
                      <p className="text-[12px] font-bold text-white">{b.customer}</p>
                      <p className="text-[9px] text-[#4b5563] font-bold tracking-wider mt-0.5">{b.customerType}</p>
                    </td>
                    {/* Vehicle */}
                    <td className="px-5 py-4">
                      <p className="text-[12px] font-semibold text-white">{b.vehicle}</p>
                      <p className="text-[10px] font-mono text-[#6b7280] mt-0.5">{b.plateNumber}</p>
                    </td>
                    {/* Complaint */}
                    <td className="px-5 py-4 max-w-[160px]">
                      <p className="text-[11px] text-[#9ca3af] truncate">{b.complaint}</p>
                    </td>
                    {/* Schedule */}
                    <td className="px-5 py-4">
                      <p className="text-[11px] font-semibold text-white">{b.scheduleDate}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Clock size={9} className="text-[#4b5563]" />
                        <p className="text-[10px] text-[#4b5563]">{b.scheduleTime}</p>
                      </div>
                    </td>
                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLE[b.status]}`}>
                        {b.status}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        {b.status === 'PENDING' && (
                          <>
                            <button onClick={() => updateStatus(b.id, 'APPROVED')} title="Approve"
                              className="w-7 h-7 rounded-lg bg-[#1a1d28] border border-[#2a2f3e] hover:border-green-500/40 hover:text-green-400 flex items-center justify-center text-[#6b7280] transition-all">
                              <CheckCircle size={13} />
                            </button>
                            <button onClick={() => updateStatus(b.id, 'REJECTED')} title="Reject"
                              className="w-7 h-7 rounded-lg bg-[#1a1d28] border border-[#2a2f3e] hover:border-red-500/40 hover:text-red-400 flex items-center justify-center text-[#6b7280] transition-all">
                              <XCircle size={13} />
                            </button>
                          </>
                        )}
                        <button onClick={() => setSelected(b)} title="View Detail"
                          className="w-7 h-7 rounded-lg bg-[#1a1d28] border border-[#2a2f3e] hover:border-orange-500/40 hover:text-orange-400 flex items-center justify-center text-[#6b7280] transition-all">
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
                Showing <span className="text-white font-bold">
                  {filtered.length === 0 ? '0' : `${(page - 1) * PAGE_SIZE + 1}-${Math.min(page * PAGE_SIZE, filtered.length)}`}
                </span> of <span className="text-white font-bold">{filtered.length}</span> bookings
              </p>
              <div className="flex items-center gap-1">
                {[
                  { icon: ChevronFirst, action: () => setPage(1),                            disabled: page === 1          },
                  { icon: ChevronLeft,  action: () => setPage(p => Math.max(1, p - 1)),      disabled: page === 1          },
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
                  { icon: ChevronLast,  action: () => setPage(totalPages),                        disabled: page === totalPages },
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

      {/* ── MODAL DETAIL ── */}
      {selected && (
        <DetailModal
          booking={selected}
          onClose={() => setSelected(null)}
          onApprove={() => updateStatus(selected.id, 'APPROVED')}
          onReject={() => updateStatus(selected.id, 'REJECTED')}
        />
      )}
    </div>
  );
}
