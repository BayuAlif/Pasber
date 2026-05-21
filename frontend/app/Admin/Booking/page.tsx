'use client';

import { useState } from 'react';
import {
  Search, Bell, Eye, CheckCircle, XCircle, X,
  CalendarDays, Car, User, Wrench, Clock, ChevronFirst,
  ChevronLast, ChevronLeft, ChevronRight, Filter,
  RotateCcw, ClipboardList, Info,
} from 'lucide-react';
import SidebarAdmin from '../../components/sidebar-admin/page';

// ── Types ──────────────────────────────────────────────────────────────────
type StatusType = 'PENDING' | 'APPROVED' | 'REJECTED';
type ViewType   = 'booking' | 'workorder';

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
  // extra WO fields
  phone?: string;
  vehicleYear?: string;
  vehicleColor?: string;
};

// ── Dummy Data ─────────────────────────────────────────────────────────────
const DUMMY_BOOKINGS: Booking[] = [
  {
    id: '#BK-2024-001', customer: 'Andi Wijaya',     customerType: 'VIP CLIENT',
    vehicle: 'Toyota Fortuner GR',   plateNumber: 'B 1234 XYZ',
    complaint: 'Engine misfiring at low RPM, especially when idling for more than 5 minutes. No Check Engine Light visible on dashboard yet.',
    scheduleDate: '24 Oct 2024', scheduleTime: '09:00 WIB', status: 'PENDING',
    phone: '+62 812-3456-7890', vehicleYear: '2022', vehicleColor: 'Black Metallic',
  },
  {
    id: '#BK-2024-002', customer: 'Jessica Wijaya',  customerType: 'VIP CLIENT',
    vehicle: 'BMW M3 Competition',   plateNumber: 'D 4452 CC',
    complaint: 'Oil Baby',
    scheduleDate: '25 Oct 2024', scheduleTime: '14:30 WIB', status: 'APPROVED',
    phone: '+62 811-2345-6789', vehicleYear: '2023', vehicleColor: 'Alpine White',
  },
  {
    id: '#BK-2024-003', customer: 'Budi Santoso',    customerType: 'REGULAR CLIENT',
    vehicle: 'Honda Civic Type R',   plateNumber: 'L 9901 AB',
    complaint: 'Suspension feels too stiff on bumps',
    scheduleDate: '26 Oct 2024', scheduleTime: '10:00 WIB', status: 'REJECTED',
    phone: '+62 813-9876-5432', vehicleYear: '2022', vehicleColor: 'Championship White',
  },
  {
    id: '#BK-2024-004', customer: 'Rina Melati',     customerType: 'NEW CLIENT',
    vehicle: 'Porsche 911 Carrera',  plateNumber: 'B 911 RIN',
    complaint: 'Brake pedal feels spongy',
    scheduleDate: '27 Oct 2024', scheduleTime: '08:00 WIB', status: 'PENDING',
    phone: '+62 821-5555-7777', vehicleYear: '2021', vehicleColor: 'Guards Red',
  },
  {
    id: '#BK-2024-005', customer: 'Doni Saputra',    customerType: 'REGULAR CLIENT',
    vehicle: 'Toyota GR86',          plateNumber: 'B 8600 GR',
    complaint: 'Check engine light on',
    scheduleDate: '28 Oct 2024', scheduleTime: '11:00 WIB', status: 'APPROVED',
    phone: '+62 819-1234-5678', vehicleYear: '2023', vehicleColor: 'Firestorm',
  },
  {
    id: '#BK-2024-006', customer: 'Sarah Amelia',    customerType: 'VIP CLIENT',
    vehicle: 'Lamborghini Huracan',  plateNumber: 'B 0001 LP',
    complaint: 'Transmission hesitation during shift',
    scheduleDate: '29 Oct 2024', scheduleTime: '13:00 WIB', status: 'PENDING',
    phone: '+62 817-8888-9999', vehicleYear: '2022', vehicleColor: 'Arancio Borealis',
  },
  {
    id: '#BK-2024-007', customer: 'Reza Firmansyah', customerType: 'NEW CLIENT',
    vehicle: 'Honda Jazz RS',        plateNumber: 'F 1234 RZ',
    complaint: 'AC not cooling properly',
    scheduleDate: '30 Oct 2024', scheduleTime: '15:00 WIB', status: 'APPROVED',
    phone: '+62 815-3333-4444', vehicleYear: '2021', vehicleColor: 'Platinum White',
  },
  {
    id: '#BK-2024-008', customer: 'Maya Sari',        customerType: 'REGULAR CLIENT',
    vehicle: 'Mazda CX-5',           plateNumber: 'D 5678 MY',
    complaint: 'Vibration at high speed',
    scheduleDate: '31 Oct 2024', scheduleTime: '09:30 WIB', status: 'REJECTED',
    phone: '+62 812-7777-2222', vehicleYear: '2022', vehicleColor: 'Polymetal Grey',
  },
];

// ── Styles ─────────────────────────────────────────────────────────────────
const STATUS_STYLE: Record<StatusType, string> = {
  PENDING:  'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30',
  APPROVED: 'bg-green-500/10  text-green-400  border border-green-500/30',
  REJECTED: 'bg-red-500/10   text-red-400    border border-red-500/30',
};

const STATUS_DOT: Record<StatusType, string> = {
  PENDING:  'bg-yellow-400',
  APPROVED: 'bg-green-400',
  REJECTED: 'bg-red-500',
};

const PAGE_SIZE = 5;

// ── Stat Card Icon ─────────────────────────────────────────────────────────
function StatCardIcon({ type }: { type: 'total' | 'pending' | 'approved' | 'rejected' }) {
  const map = {
    total:    { color: '#f97316', bg: 'bg-orange-500/10 border-orange-500/20' },
    pending:  { color: '#eab308', bg: 'bg-yellow-500/10 border-yellow-500/20' },
    approved: { color: '#22c55e', bg: 'bg-green-500/10  border-green-500/20'  },
    rejected: { color: '#ef4444', bg: 'bg-red-500/10    border-red-500/20'    },
  };
  const { color, bg } = map[type];
  return (
    <div className={`w-10 h-10 rounded-xl border ${bg} flex items-center justify-center flex-shrink-0`}>
      {type === 'total'    && <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="6" height="6"/><rect x="9" y="3" width="6" height="6"/><rect x="16" y="3" width="6" height="6"/><rect x="2" y="10" width="6" height="6"/><rect x="9" y="10" width="6" height="6"/><rect x="16" y="10" width="6" height="6"/></svg>}
      {type === 'pending'  && <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
      {type === 'approved' && <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
      {type === 'rejected' && <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>}
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
            { icon: User,         label: 'Customer',  value: `${booking.customer} · ${booking.customerType}` },
            { icon: Car,          label: 'Kendaraan', value: `${booking.vehicle} · ${booking.plateNumber}`   },
            { icon: Wrench,       label: 'Keluhan',   value: booking.complaint                                },
            { icon: CalendarDays, label: 'Jadwal',    value: `${booking.scheduleDate} · ${booking.scheduleTime}` },
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
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLE[booking.status]}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[booking.status]}`} />
            {booking.status}
          </span>
          <div className="flex-1" />
          {booking.status === 'PENDING' && (
            <>
              <button onClick={onReject} className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-[11px] font-bold text-red-400 transition-all">
                <XCircle size={13} /> Reject
              </button>
              <button onClick={onApprove} className="flex items-center gap-1.5 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-lg text-[11px] font-bold text-green-400 transition-all">
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

// ══════════════════════════════════════════════════════════════════════════
// VIEW 1 — Kelola Booking
// ══════════════════════════════════════════════════════════════════════════
function KelolaBookingView({
  bookings, setBookings, onViewWO,
}: {
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  onViewWO: (b: Booking) => void;
}) {
  const [search, setSearch]             = useState('');
  const [filterStatus, setFilterStatus] = useState<'All Status' | StatusType>('All Status');
  const [filterDate, setFilterDate]     = useState('');
  const [page, setPage]                 = useState(1);
  const [selected, setSelected]         = useState<Booking | null>(null);

  const total    = bookings.length;
  const pending  = bookings.filter(b => b.status === 'PENDING').length;
  const approved = bookings.filter(b => b.status === 'APPROVED').length;
  const rejected = bookings.filter(b => b.status === 'REJECTED').length;

  const filtered = bookings.filter(b => {
    const q = search.toLowerCase();
    const matchSearch = b.customer.toLowerCase().includes(q) ||
                        b.plateNumber.toLowerCase().includes(q) ||
                        b.id.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'All Status' || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateStatus = (id: string, status: StatusType) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    setSelected(null);
  };

  return (
    <>
      <div className="px-8 py-6 space-y-5">

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-4 gap-4">
          {([
            { label: 'TOTAL BOOKING', value: total,    type: 'total'    as const, border: 'border-l-orange-500' },
            { label: 'PENDING',       value: pending,  type: 'pending'  as const, border: 'border-l-yellow-500' },
            { label: 'APPROVED',      value: approved, type: 'approved' as const, border: 'border-l-green-500'  },
            { label: 'REJECTED',      value: rejected, type: 'rejected' as const, border: 'border-l-red-500'    },
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
                onChange={e => { setFilterStatus(e.target.value as any); setPage(1); }}
                className="bg-[#0f1117] border border-[#1e2230] rounded-lg px-3 py-2.5 text-[12px] text-[#e2e8f0] outline-none focus:border-orange-500/50 cursor-pointer"
              >
                {['All Status', 'PENDING', 'APPROVED', 'REJECTED'].map(s => <option key={s}>{s}</option>)}
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
                <tr key={b.id} className={`border-b border-[#1e2230] hover:bg-[#1a1d28] transition-colors ${i === paginated.length - 1 ? 'border-b-0' : ''}`}>
                  <td className="px-5 py-4">
                    <span className="text-[11px] font-mono font-bold text-orange-400">{b.id}</span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-[12px] font-bold text-white">{b.customer}</p>
                    <p className="text-[9px] text-[#4b5563] font-bold tracking-wider mt-0.5">{b.customerType}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-[12px] font-semibold text-white">{b.vehicle}</p>
                    <span className="inline-block mt-1 px-1.5 py-0.5 bg-[#1a1d28] border border-[#2a2f3e] rounded text-[10px] font-mono text-[#9ca3af]">{b.plateNumber}</span>
                  </td>
                  <td className="px-5 py-4 max-w-[160px]">
                    <p className="text-[11px] text-[#9ca3af] truncate">{b.complaint}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-[11px] font-semibold text-white">{b.scheduleDate}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Clock size={9} className="text-[#4b5563]" />
                      <p className="text-[10px] text-[#4b5563]">{b.scheduleTime}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLE[b.status]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[b.status]}`} />
                      {b.status}
                    </span>
                  </td>
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
                      {b.status === 'REJECTED' && (
                        <button onClick={() => updateStatus(b.id, 'PENDING')} title="Reset ke Pending"
                          className="w-7 h-7 rounded-lg bg-[#1a1d28] border border-[#2a2f3e] hover:border-yellow-500/40 hover:text-yellow-400 flex items-center justify-center text-[#6b7280] transition-all">
                          <RotateCcw size={13} />
                        </button>
                      )}
                      <button onClick={() => onViewWO(b)} title="View Work Order"
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
              Showing{' '}
              <span className="text-white font-bold">
                {filtered.length === 0 ? '0' : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)}`}
              </span>{' '}
              of <span className="text-white font-bold">{filtered.length}</span> bookings
            </p>
            <div className="flex items-center gap-1">
              {([
                { icon: ChevronFirst, action: () => setPage(1),                                disabled: page === 1          },
                { icon: ChevronLeft,  action: () => setPage(p => Math.max(1, p - 1)),          disabled: page === 1          },
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
                { icon: ChevronLast,  action: () => setPage(totalPages),                        disabled: page === totalPages },
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
          onApprove={() => updateStatus(selected.id, 'APPROVED')}
          onReject={() => updateStatus(selected.id, 'REJECTED')}
        />
      )}
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// VIEW 2 — Kelola Jadwal & Work Order (Detail)
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
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLE[booking.status]}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[booking.status]}`} />
                {booking.status}
              </span>
            </div>

            <div className="p-6 flex flex-col gap-4">

              {/* Customer + Vehicle — orange bordered */}
              <div className="border border-orange-500/40 rounded-xl overflow-hidden">
                <div className="grid grid-cols-2 divide-x divide-[#1e2230]">
                  {/* Customer */}
                  <div className="p-5 flex flex-col gap-1">
                    <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-[2px]">Customer Name</p>
                    <p className="text-[24px] font-black text-white leading-tight mt-1">{booking.customer}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-4 h-4 rounded bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.83 12 19.79 19.79 0 0 1 1.85 3.58a2 2 0 0 1 1.99-2.18H6a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z"/></svg>
                      </div>
                      <p className="text-[12px] text-orange-400 font-semibold">{booking.phone ?? '-'}</p>
                    </div>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider
                        ${booking.customerType === 'VIP CLIENT' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                          booking.customerType === 'REGULAR CLIENT' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          'bg-[#1a1d28] text-[#6b7280] border border-[#2a2f3e]'}`}>
                        {booking.customerType}
                      </span>
                    </div>
                  </div>

                  {/* Vehicle */}
                  <div className="p-5 flex flex-col gap-1">
                    <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-[2px]">Vehicle Identity</p>
                    <p className="text-[24px] font-black text-white leading-tight mt-1">{booking.vehicle}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-1 bg-[#0f1117] border border-[#2a2f3e] rounded-md text-[11px] font-mono text-[#e2e8f0] font-bold tracking-wider">
                        {booking.plateNumber}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6b7280] mt-1">
                      {booking.vehicleYear} · {booking.vehicleColor}
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
                  &ldquo;{booking.complaint}&rdquo;
                </p>
              </div>

              {/* Entry Date */}
              <div className="border border-[#1e2230] rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarDays size={11} className="text-[#4b5563]" />
                  <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-[2px]">Entry Date</p>
                </div>
                <p className="text-[15px] font-bold text-white">
                  {booking.scheduleDate}, {booking.scheduleTime}
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
              <p className="text-[12px] font-bold text-white">{booking.customer}</p>
              <p className="text-[10px] text-[#4b5563] mt-0.5 flex items-center gap-1.5 flex-wrap">
                <span className="font-mono text-orange-400">{booking.id}</span>
                <span className="text-[#2a2f3e]">•</span>
                <span className="text-[#6b7280]">{booking.vehicle}</span>
                <span className="text-[#2a2f3e]">•</span>
                <span className={`font-bold ${booking.customerType === 'VIP CLIENT' ? 'text-orange-400' : booking.customerType === 'REGULAR CLIENT' ? 'text-blue-400' : 'text-[#6b7280]'}`}>
                  {booking.customerType}
                </span>
              </p>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLE[booking.status]}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[booking.status]}`} />
              {booking.status}
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
                onClick={() => {}}
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
              { label: 'Booking ID',  value: booking.id,           mono: true  },
              { label: 'Schedule',    value: `${booking.scheduleDate} · ${booking.scheduleTime}`, mono: false },
              { label: 'Plate No.',   value: booking.plateNumber,  mono: true  },
              { label: 'Year',        value: booking.vehicleYear ?? '-', mono: false },
              { label: 'Color',       value: booking.vehicleColor ?? '-', mono: false },
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
  const [bookings, setBookings] = useState<Booking[]>(DUMMY_BOOKINGS);
  const [view, setView]         = useState<ViewType>('booking');
  const [activeWO, setActiveWO] = useState<Booking>(DUMMY_BOOKINGS[0]);

  const handleViewWO = (b: Booking) => {
    setActiveWO(b);
    setView('workorder');
  };

  const isBooking   = view === 'booking';
  const isWorkorder = view === 'workorder';

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f1117] text-[#e2e8f0]" style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

      {/* ── SIDEBAR ── */}
      <SidebarAdmin />

      {/* ── MAIN ── */}
      <main className="flex-1 overflow-y-auto h-screen flex flex-col">

        {/* ── Sticky Header ── */}
        <div className="sticky top-0 z-10 bg-[#0f1117]/95 backdrop-blur border-b border-[#1e2230] px-8 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-[20px] font-bold text-white leading-none">
              {isBooking ? 'Kelola Booking' : 'Kelola Jadwal & Work Order'}
            </h2>
            <p className="text-[11px] text-[#4b5563] mt-1">
              {isBooking ? 'Kelola dan pantau semua booking servis kendaraan' : 'Kelola Jadwal Booking'}
            </p>
          </div>
          <button className="w-9 h-9 bg-[#13161e] border border-[#1e2230] rounded-lg flex items-center justify-center text-[#4b5563] hover:text-white transition-colors relative">
            <Bell size={15} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full" />
          </button>
        </div>

        {/* ── Content ── */}
        <div className="flex-1">
          {isBooking && (
            <KelolaBookingView
              bookings={bookings}
              setBookings={setBookings}
              onViewWO={handleViewWO}
            />
          )}
          {isWorkorder && (
            <KelolaJadwalView booking={activeWO} onBack={() => setView('booking')} />
          )}
        </div>

      </main>
    </div>
  );
}
