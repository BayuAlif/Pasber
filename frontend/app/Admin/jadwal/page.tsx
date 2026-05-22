'use client';

import { useState, useRef } from 'react';
import {
  Search, Bell, Eye, CheckCircle, XCircle, X, Plus,
  CalendarDays, Car, User, Wrench, Clock, ChevronFirst,
  ChevronLast, ChevronLeft, ChevronRight, Upload, RefreshCw,
  AlertCircle, Info, ClipboardList, UserCheck, Camera,
  Filter,
} from 'lucide-react';
import SidebarAdmin from '../../components/sidebar-admin/page';

// ── Types ──────────────────────────────────────────────────────────────────
type WOStatus = 'PENDING' | 'RUNNING' | 'FINISHED';
type MechStatus = 'READY' | 'BUSY';

type Mekanik = {
  id: string;
  name: string;
  specialization: string;
  status: MechStatus;
};

type ProgressStep = {
  id: string;
  title: string;
  description: string;
  time: string;
  active: boolean;
  done: boolean;
  foto?: string;
};

type WorkOrder = {
  id: string;
  bookingId: string;
  customer: string;
  customerType: string;
  phone: string;
  vehicle: string;
  plateNumber: string;
  year: string;
  color: string;
  complaint: string;
  entryDate: string;
  entryTime: string;
  estCompletion: string;
  status: WOStatus;
  assignedMechanic?: string;
  notes: string;
  progress: ProgressStep[];
};

// ── Booking type (sesuaikan dengan struktur data dari API/backend kamu) ───────
type Booking = {
  id: string;
  customer: string;
  phone: string;
  vehicle: string;
  plate: string;
  year: string;
  color: string;
  complaint: string;
  entry: string; // format: "DD MMM YYYY, HH:mm"
  est: string;
};

// ── Initial data (kosong — isi dari API/props sesuai kebutuhan) ───────────────
const INITIAL_MECHANICS: Mekanik[] = [];
const INITIAL_WO: WorkOrder[] = [];
const INITIAL_BOOKINGS: Booking[] = [];

const STATUS_STYLE: Record<WOStatus, string> = {
  PENDING: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  RUNNING: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  FINISHED: 'bg-green-500/10  text-green-400  border border-green-500/20',
};

// Status label untuk action dropdown
const NEXT_STATUS: Record<WOStatus, WOStatus | null> = {
  PENDING:  'RUNNING',
  RUNNING:  'FINISHED',
  FINISHED: null,
};

const PAGE_SIZE = 5;

// ── Input class helper ─────────────────────────────────────────────────────
const inputCls = "w-full bg-[#0f1117] border border-[#2a2f3e] rounded-lg px-3.5 py-2.5 text-[12px] text-[#e2e8f0] placeholder:text-[#374151] outline-none focus:border-orange-500/50 transition-colors";

// ── Main Page ──────────────────────────────────────────────────────────────
export default function KelolaJadwalPage() {
  // view: 'list' | 'create' | 'detail'
  const [view, setView]             = useState<'list' | 'create' | 'detail'>('list');
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(INITIAL_WO);
  const [selectedWO, setSelectedWO] = useState<WorkOrder | null>(null);

  // list state
  const [search, setSearch]               = useState('');
  const [filterStatus, setFilterStatus]   = useState<'All Status' | WOStatus>('All Status');
  const [filterDate, setFilterDate]       = useState('');
  const [page, setPage]                   = useState(1);
  const [statusDropdownId, setStatusDropdownId] = useState<string | null>(null);

  // create state
  const [bookingSearch, setBookingSearch]     = useState('');
  const [foundBooking, setFoundBooking]       = useState<Booking | null>(null);
  const [bookingNotFound, setBookingNotFound] = useState(false);
  const [selectedMechanic, setSelectedMechanic] = useState<string>('');
  const [mechSearch, setMechSearch]           = useState('');
  const [notes, setNotes]                     = useState('');

  // detail state
  const [newStepTitle, setNewStepTitle]         = useState('');
  const [newStepDesc, setNewStepDesc]           = useState('');
  const [detailMechSearch, setDetailMechSearch] = useState('');
  const [detailNotes, setDetailNotes]           = useState('');
  const [photoMap, setPhotoMap]                 = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeStepId, setActiveStepId]         = useState<string | null>(null);

  // ── Stats ─────────────────────────────────────────────────────────────
  const total    = workOrders.length;
  const pending  = workOrders.filter(w => w.status === 'PENDING').length;
  const finished = workOrders.filter(w => w.status === 'FINISHED').length;
  const running  = workOrders.filter(w => w.status === 'RUNNING').length;

  // ── Filter ─────────────────────────────────────────────────────────────
  const filtered = workOrders.filter(w => {
    const matchSearch = w.customer.toLowerCase().includes(search.toLowerCase()) ||
                        w.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
                        w.id.toLowerCase().includes(search.toLowerCase()) ||
                        w.bookingId.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All Status' || w.status === filterStatus;
    const matchDate   = !filterDate || w.entryDate.includes(filterDate);
    return matchSearch && matchStatus && matchDate;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── Handlers ───────────────────────────────────────────────────────────

  /** Cari booking berdasarkan ID */
  const handleSearchBooking = () => {
    const q = bookingSearch.trim().toUpperCase();
    const found = INITIAL_BOOKINGS.find(b => b.id.toUpperCase() === q);
    if (found) { setFoundBooking(found); setBookingNotFound(false); }
    else { setFoundBooking(null); setBookingNotFound(true); }
  };

  /** Buat WO baru dari booking yang ditemukan */
  const handleCreateWO = () => {
    if (!foundBooking) return;
    const newWO: WorkOrder = {
      id:               `#WO-2024-${String(workOrders.length + 1).padStart(3, '0')}`,
      bookingId:        foundBooking.id,
      customer:         foundBooking.customer,
      customerType:     'NEW CLIENT',
      phone:            foundBooking.phone,
      vehicle:          foundBooking.vehicle,
      plateNumber:      foundBooking.plate,
      year:             foundBooking.year,
      color:            foundBooking.color,
      complaint:        foundBooking.complaint,
      entryDate:        foundBooking.entry.split(',')[0],
      entryTime:        foundBooking.entry.split(',')[1]?.trim() || '',
      estCompletion:    foundBooking.est,
      status:           'PENDING',
      assignedMechanic: selectedMechanic || undefined,
      notes,
      progress:         [],
    };
    setWorkOrders(prev => [...prev, newWO]);
    // Reset create state
    setFoundBooking(null); setBookingSearch(''); setSelectedMechanic(''); setNotes('');
    setBookingNotFound(false);
    // Buka detail WO yang baru dibuat
    setSelectedWO(newWO);
    setDetailNotes(newWO.notes);
    setView('detail');
  };

  /** Buka detail WO */
  const openDetail = (wo: WorkOrder) => {
    setSelectedWO(wo);
    setDetailNotes(wo.notes);
    setDetailMechSearch('');
    setNewStepTitle('');
    setNewStepDesc('');
    setView('detail');
  };

  /** Update status WO langsung dari tabel */
  const updateStatus = (woId: string, newStatus: WOStatus) => {
    setWorkOrders(prev => prev.map(w => w.id === woId ? { ...w, status: newStatus } : w));
    setStatusDropdownId(null);
    // Kalau WO yang sedang dibuka di-update, sync selectedWO juga
    if (selectedWO?.id === woId) {
      setSelectedWO(prev => prev ? { ...prev, status: newStatus } : prev);
    }
  };

  /** Tambah step progress */
  const addProgressStep = () => {
    if (!selectedWO || !newStepTitle.trim()) return;
    // Tandai semua step sebelumnya sebagai done (tidak active lagi)
    const prevProgress = selectedWO.progress.map(s => ({ ...s, active: false, done: true }));
    const step: ProgressStep = {
      id:          Date.now().toString(),
      title:       newStepTitle.trim(),
      description: newStepDesc.trim(),
      time:        new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      active:      true,
      done:        false,
    };
    const updated: WorkOrder = { ...selectedWO, progress: [...prevProgress, step], status: 'RUNNING' };
    setWorkOrders(prev => prev.map(w => w.id === selectedWO.id ? updated : w));
    setSelectedWO(updated);
    setNewStepTitle('');
    setNewStepDesc('');
  };

  /** Tandai step sebagai selesai */
  const markStepDone = (stepId: string) => {
    if (!selectedWO) return;
    const newProgress = selectedWO.progress.map(s =>
      s.id === stepId ? { ...s, active: false, done: true } : s
    );
    const allDone = newProgress.every(s => s.done);
    const updated: WorkOrder = {
      ...selectedWO,
      progress: newProgress,
      status:   allDone ? 'FINISHED' : 'RUNNING',
    };
    setWorkOrders(prev => prev.map(w => w.id === selectedWO.id ? updated : w));
    setSelectedWO(updated);
  };

  /** Assign mekanik ke WO yang sedang dibuka */
  const assignMechanic = (mechName: string) => {
    if (!selectedWO) return;
    const updated = { ...selectedWO, assignedMechanic: mechName };
    setWorkOrders(prev => prev.map(w => w.id === selectedWO.id ? updated : w));
    setSelectedWO(updated);
  };

  /** Simpan catatan ke WO yang sedang dibuka */
  const saveNotes = () => {
    if (!selectedWO) return;
    const updated = { ...selectedWO, notes: detailNotes };
    setWorkOrders(prev => prev.map(w => w.id === selectedWO.id ? updated : w));
    setSelectedWO(updated);
  };

  /** Upload foto bukti untuk sebuah step */
  const handlePhotoUpload = (stepId: string, file: File) => {
    const url = URL.createObjectURL(file);
    setPhotoMap(prev => ({ ...prev, [stepId]: url }));
    // Simpan ke selectedWO progress juga
    if (!selectedWO) return;
    const newProgress = selectedWO.progress.map(s =>
      s.id === stepId ? { ...s, foto: url } : s
    );
    const updated = { ...selectedWO, progress: newProgress };
    setWorkOrders(prev => prev.map(w => w.id === selectedWO.id ? updated : w));
    setSelectedWO(updated);
  };

  /** Tugaskan mekanik & ubah status ke RUNNING dari detail */
  const handleTugaskan = () => {
    if (!selectedWO) return;
    const mech = selectedWO.assignedMechanic;
    if (!mech) { alert('Pilih mekanik terlebih dahulu!'); return; }
    const updated: WorkOrder = { ...selectedWO, status: 'RUNNING' };
    setWorkOrders(prev => prev.map(w => w.id === selectedWO.id ? updated : w));
    setSelectedWO(updated);
  };

  // ── Derived ────────────────────────────────────────────────────────────
  const filteredMechanics       = INITIAL_MECHANICS.filter(m => m.name.toLowerCase().includes(mechSearch.toLowerCase()));
  const filteredDetailMechanics = INITIAL_MECHANICS.filter(m => m.name.toLowerCase().includes(detailMechSearch.toLowerCase()));

  // ── Reset filter & page on search change ───────────────────────────────
  const handleSearchChange = (val: string) => { setSearch(val); setPage(1); };
  const handleStatusChange = (val: string)  => { setFilterStatus(val as any); setPage(1); };

  // ═══════════════════════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════════════════════
  return (
    <div
      className="flex h-screen overflow-hidden bg-[#0f1117] text-[#e2e8f0]"
      style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}
      // Tutup status dropdown kalau klik di luar
      onClick={() => setStatusDropdownId(null)}
    >
      <SidebarAdmin />

      <main className="flex-1 overflow-y-auto h-screen">

        {/* ── Header ── */}
        <div className="sticky top-0 z-10 bg-[#0f1117]/95 backdrop-blur border-b border-[#1e2230] px-8 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-[18px] font-bold text-white leading-none">Kelola Jadwal & Work Order</h2>
            <p className="text-[11px] text-[#4b5563] mt-1">Kelola Jadwal Booking</p>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" size={13} />
              <input
                type="text"
                placeholder="ID Servis / Plat Nomor"
                className="bg-[#13161e] border border-[#1e2230] rounded-lg py-2 pl-9 pr-4 text-[12px] outline-none focus:border-orange-500/50 w-56 placeholder:text-[#374151] text-[#e2e8f0]"
              />
            </div>
            <button className="w-9 h-9 bg-[#13161e] border border-[#1e2230] rounded-lg flex items-center justify-center text-[#4b5563] hover:text-white transition-colors relative">
              <Bell size={15} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full" />
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════
            VIEW: LIST
        ══════════════════════════════════════ */}
        {view === 'list' && (
          <div className="px-8 py-6 space-y-4">

            {/* Stat Cards */}
            <div className="grid grid-cols-4 gap-3.5">
              {[
                { label: 'Total Work Order', value: total,    colorBorder: 'border-l-orange-500', iconColor: 'text-orange-400', icon: <ClipboardList size={22} /> },
                { label: 'Pending',          value: pending,  colorBorder: 'border-l-yellow-500', iconColor: 'text-yellow-400', icon: <Clock size={22} />         },
                { label: 'Finished',         value: finished, colorBorder: 'border-l-green-500',  iconColor: 'text-green-400',  icon: <CheckCircle size={22} />   },
                { label: 'Running',          value: running,  colorBorder: 'border-l-orange-400', iconColor: 'text-orange-300', icon: <RefreshCw size={22} />     },
              ].map(({ label, value, colorBorder, iconColor, icon }) => (
                <div key={label} className={`bg-[#13161e] border border-[#1e2230] border-l-2 ${colorBorder} rounded-xl px-5 py-4 flex items-center justify-between`}>
                  <div>
                    <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest mb-1">{label}</p>
                    <p className="text-[28px] font-black text-white leading-none">{value}</p>
                  </div>
                  <span className={`${iconColor} opacity-40`}>{icon}</span>
                </div>
              ))}
            </div>

            {/* Filters + Buat WO button */}
            <div className="bg-[#13161e] border border-[#1e2230] rounded-xl p-4">
              <div className="flex items-end gap-4 flex-wrap">
                {/* Search */}
                <div className="flex-1 min-w-[200px]">
                  <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-widest mb-1.5">Search Records</p>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" size={13} />
                    <input
                      type="text"
                      placeholder="Customer name, plate number, or ID..."
                      value={search}
                      onChange={e => handleSearchChange(e.target.value)}
                      className="w-full bg-[#0f1117] border border-[#2a2f3e] rounded-lg py-2.5 pl-9 pr-4 text-[12px] outline-none focus:border-orange-500/50 placeholder:text-[#374151] text-[#e2e8f0]"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-widest mb-1.5">Status Filter</p>
                  <select
                    value={filterStatus}
                    onChange={e => handleStatusChange(e.target.value)}
                    className="bg-[#0f1117] border border-[#2a2f3e] rounded-lg px-3 py-2.5 text-[12px] text-[#e2e8f0] outline-none focus:border-orange-500/50 cursor-pointer w-36"
                  >
                    {['All Status', 'PENDING', 'RUNNING', 'FINISHED'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>

                {/* Date Range */}
                <div>
                  <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-widest mb-1.5">Date Range</p>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={e => { setFilterDate(e.target.value); setPage(1); }}
                    className="bg-[#0f1117] border border-[#2a2f3e] rounded-lg px-3 py-2.5 text-[12px] text-[#e2e8f0] outline-none focus:border-orange-500/50 cursor-pointer"
                  />
                </div>

                {/* Apply Filters */}
                <button
                  onClick={() => setPage(1)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all"
                >
                  <Filter size={13} /> Apply Filters
                </button>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Buat WO Baru */}
                <button
                  onClick={() => { setView('create'); setFoundBooking(null); setBookingSearch(''); setBookingNotFound(false); }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all"
                >
                  <Plus size={14} /> Buat WO Baru
                </button>
              </div>
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
                      <td colSpan={7} className="text-center py-14 text-[#4b5563]">
                        <Search size={28} className="mx-auto mb-3 opacity-20" />
                        <p className="text-[12px]">Tidak ada data yang cocok</p>
                      </td>
                    </tr>
                  ) : paginated.map((w, i) => (
                    <tr key={w.id} className={`border-b border-[#1e2230] hover:bg-[#1a1d28] transition-colors ${i === paginated.length - 1 ? 'border-b-0' : ''}`}>
                      {/* Booking ID */}
                      <td className="px-5 py-4">
                        <p className="text-[11px] font-mono font-bold text-orange-400">{w.bookingId}</p>
                        <p className="text-[9px] text-[#4b5563] mt-0.5 font-mono">{w.id}</p>
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-4">
                        <p className="text-[12px] font-bold text-white">{w.customer}</p>
                        <p className="text-[9px] text-[#4b5563] font-bold tracking-wider mt-0.5">{w.customerType}</p>
                      </td>

                      {/* Vehicle */}
                      <td className="px-5 py-4">
                        <p className="text-[12px] font-semibold text-white">{w.vehicle}</p>
                        <p className="text-[10px] font-mono text-[#6b7280] mt-0.5">{w.plateNumber}</p>
                      </td>

                      {/* Complaint */}
                      <td className="px-5 py-4 max-w-[160px]">
                        <p className="text-[11px] text-[#9ca3af] truncate">{w.complaint}</p>
                      </td>

                      {/* Schedule */}
                      <td className="px-5 py-4">
                        <p className="text-[11px] font-semibold text-white">{w.entryDate}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Clock size={9} className="text-[#4b5563]" />
                          <p className="text-[10px] text-[#4b5563]">{w.entryTime}</p>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLE[w.status]}`}>
                          {w.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5">
                          {/* View Detail */}
                          <button
                            onClick={() => openDetail(w)}
                            title="Lihat Detail"
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1a1d28] border border-[#2a2f3e] hover:border-orange-500/40 hover:text-orange-400 text-[#6b7280] text-[10px] font-bold transition-all"
                          >
                            <Eye size={12} /> Detail
                          </button>

                          {/* Update Status — hanya jika bukan FINISHED */}
                          {w.status !== 'FINISHED' && (
                            <div className="relative">
                              <button
                                onClick={() => setStatusDropdownId(prev => prev === w.id ? null : w.id)}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1a1d28] border border-[#2a2f3e] hover:border-orange-500/40 hover:text-orange-400 text-[#6b7280] text-[10px] font-bold transition-all"
                              >
                                <RefreshCw size={12} /> Update Status
                                <ChevronRight size={10} className="rotate-90" />
                              </button>
                              {statusDropdownId === w.id && (
                                <div className="absolute right-0 top-full mt-1.5 bg-[#1a1d28] border border-[#2a2f3e] rounded-lg overflow-hidden shadow-xl z-20 min-w-[140px]">
                                  {(w.status === 'PENDING' ? ['RUNNING'] : ['FINISHED']).map(s => (
                                    <button
                                      key={s}
                                      onClick={() => updateStatus(w.id, s as WOStatus)}
                                      className="w-full text-left px-4 py-2.5 text-[11px] font-bold hover:bg-[#2a2f3e] transition-colors"
                                    >
                                      <span className={s === 'RUNNING' ? 'text-orange-400' : 'text-green-400'}>
                                        → {s}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Buat WO — khusus PENDING yang belum punya WO */}
                          {w.status === 'PENDING' && !w.id.startsWith('#WO') && (
                            <button
                              onClick={() => openDetail(w)}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 text-orange-400 text-[10px] font-bold transition-all"
                            >
                              <Plus size={12} /> Buat WO
                            </button>
                          )}
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
                  of <span className="text-white font-bold">{filtered.length}</span> work orders
                </p>
                <div className="flex items-center gap-1">
                  {[
                    { icon: ChevronFirst, action: () => setPage(1),                             disabled: page === 1 },
                    { icon: ChevronLeft,  action: () => setPage(p => Math.max(1, p - 1)),       disabled: page === 1 },
                  ].map(({ icon: Icon, action, disabled }, i) => (
                    <button key={i} onClick={action} disabled={disabled}
                      className="w-8 h-8 rounded-lg bg-[#1a1d28] border border-[#2a2f3e] flex items-center justify-center text-[#6b7280] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                      <Icon size={13} />
                    </button>
                  ))}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
                    <button key={pg} onClick={() => setPage(pg)}
                      className={`w-8 h-8 rounded-lg text-[12px] font-bold border transition-all ${page === pg ? 'bg-orange-500 border-orange-500 text-white' : 'bg-[#1a1d28] border-[#2a2f3e] text-[#6b7280] hover:text-white'}`}>
                      {pg}
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
        )}

        {/* ══════════════════════════════════════
            VIEW: CREATE WO
        ══════════════════════════════════════ */}
        {view === 'create' && (
          <div className="flex gap-0 h-[calc(100vh-73px)]">

            {/* Left — form */}
            <div className="flex-1 overflow-y-auto p-8 space-y-4">

              {/* Back */}
              <button onClick={() => setView('list')}
                className="flex items-center gap-1.5 text-[11px] text-[#4b5563] hover:text-white transition-colors mb-2">
                <ChevronLeft size={14} /> Kembali ke List
              </button>

              <h3 className="text-[15px] font-bold text-white mb-2">Buat Work Order Baru</h3>

              {/* Search Booking */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" size={13} />
                  <input
                    type="text"
                    placeholder="Masukkan Booking ID (contoh: #BK-2024-004)..."
                    value={bookingSearch}
                    onChange={e => setBookingSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearchBooking()}
                    className="w-full bg-[#13161e] border border-[#1e2230] rounded-lg py-3 pl-9 pr-4 text-[13px] outline-none focus:border-orange-500/50 placeholder:text-[#374151] text-[#e2e8f0]"
                  />
                </div>
                <button
                  onClick={handleSearchBooking}
                  className="px-5 py-3 bg-[#1a1d28] border border-[#2a2f3e] text-[12px] font-bold text-white rounded-lg hover:border-orange-500/40 transition-all whitespace-nowrap"
                >
                  Cari Booking
                </button>
              </div>

              {/* Error not found */}
              {bookingNotFound && (
                <div className="flex items-center gap-2.5 p-3.5 bg-red-500/5 border border-red-500/20 rounded-xl">
                  <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                  <p className="text-[12px] text-red-400">Booking ID tidak ditemukan. Pastikan format ID benar (contoh: #BK-2024-004).</p>
                </div>
              )}

              {/* WO Info Preview */}
              <div className="bg-[#13161e] border border-[#1e2230] rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Info size={13} className="text-orange-500" />
                  <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest">Informasi Umum WO</p>
                </div>

                {foundBooking ? (
                  <div className="space-y-4">
                    <div className="border border-orange-500/30 rounded-xl p-4 bg-orange-500/5">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-widest mb-1">Customer Name</p>
                          <p className="text-[18px] font-bold text-white">{foundBooking.customer}</p>
                          <p className="text-[12px] text-orange-400 font-medium">{foundBooking.phone}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-widest mb-1">Vehicle Identity</p>
                          <p className="text-[18px] font-bold text-white">{foundBooking.vehicle}</p>
                          <div className="flex gap-2 mt-1">
                            <span className="px-2 py-0.5 bg-[#1a1d28] border border-[#2a2f3e] rounded text-[10px] font-mono text-[#9ca3af]">{foundBooking.plate}</span>
                            <span className="px-2 py-0.5 bg-[#1a1d28] border border-[#2a2f3e] rounded text-[10px] text-[#9ca3af]">{foundBooking.year} · {foundBooking.color}</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-[#0f1117] border border-[#1e2230] rounded-lg p-3.5 mb-4">
                        <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-widest mb-1.5">Primary Complaint</p>
                        <p className="text-[12px] text-[#e2e8f0] italic">{foundBooking.complaint}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-widest mb-1">Entry Date</p>
                          <p className="text-[13px] font-semibold text-white">{foundBooking.entry}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-widest mb-1">Est. Completion</p>
                          <p className="text-[13px] font-semibold text-orange-400">{foundBooking.est}</p>
                        </div>
                      </div>
                    </div>

                    {/* Customer card */}
                    <div className="flex items-center gap-3 p-3 bg-[#0f1117] border border-[#1e2230] rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-[#1a1d28] border border-[#2a2f3e] flex items-center justify-center flex-shrink-0">
                        <User size={14} className="text-[#6b7280]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-bold text-white">{foundBooking.customer}</p>
                        <p className="text-[10px] text-[#4b5563]">{foundBooking.id} · {foundBooking.vehicle}</p>
                      </div>
                      <span className="text-[10px] font-bold text-orange-400">{foundBooking.plate}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 text-[#4b5563]">
                    <Search size={28} className="mx-auto mb-3 opacity-30" />
                    <p className="text-[12px]">Cari Booking ID untuk memuat data WO</p>
                    <p className="text-[11px] mt-1 opacity-60">Contoh: #BK-2024-004 atau #BK-2024-005</p>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setView('list')} className="px-5 py-2.5 text-[12px] font-bold text-[#6b7280] hover:text-white transition-colors">
                  Batal
                </button>
                {foundBooking && (
                  <button
                    onClick={handleCreateWO}
                    className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-[12px] font-bold uppercase tracking-widest rounded-lg transition-all"
                  >
                    <Plus size={14} /> Buat WO Baru
                  </button>
                )}
              </div>
            </div>

            {/* Right Sidebar — Assign Mekanik + Catatan */}
            <div className="w-[320px] flex-shrink-0 border-l border-[#1e2230] flex flex-col overflow-y-auto">
              {/* Assign Mekanik */}
              <div className="p-5 border-b border-[#1e2230]">
                <div className="flex items-center gap-2 mb-3">
                  <UserCheck size={13} className="text-orange-500" />
                  <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Assign Mekanik</p>
                </div>
                {selectedMechanic && (
                  <div className="mb-3 flex items-center gap-2 text-[11px] text-green-400 bg-green-500/5 border border-green-500/20 rounded-lg px-3 py-2">
                    <CheckCircle size={12} /> Dipilih: <span className="font-bold">{selectedMechanic}</span>
                  </div>
                )}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" size={12} />
                  <input
                    type="text"
                    placeholder="Cari mekanik..."
                    value={mechSearch}
                    onChange={e => setMechSearch(e.target.value)}
                    className="w-full bg-[#0f1117] border border-[#2a2f3e] rounded-lg py-2 pl-8 pr-3 text-[12px] outline-none focus:border-orange-500/50 placeholder:text-[#374151] text-[#e2e8f0]"
                  />
                </div>
                <div className="space-y-2">
                  {filteredMechanics.map(m => (
                    <div
                      key={m.id}
                      onClick={() => m.status === 'READY' && setSelectedMechanic(m.name === selectedMechanic ? '' : m.name)}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all
                        ${m.status === 'BUSY' ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                        ${selectedMechanic === m.name ? 'border-orange-500/40 bg-orange-500/5' : 'border-[#1e2230] bg-[#0f1117] hover:border-[#2a2f3e]'}`}
                    >
                      <div className="w-7 h-7 rounded-full bg-[#1a1d28] border border-[#2a2f3e] flex items-center justify-center flex-shrink-0">
                        <User size={12} className="text-[#6b7280]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-bold text-white truncate">{m.name}</p>
                        <p className="text-[9px] font-bold">
                          <span className="text-[#4b5563]">{m.specialization} · </span>
                          <span className={m.status === 'READY' ? 'text-green-400' : 'text-red-400'}>{m.status}</span>
                        </p>
                      </div>
                      <div className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 transition-all ${selectedMechanic === m.name ? 'border-orange-500 bg-orange-500' : 'border-[#4b5563]'}`} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Catatan */}
              <div className="p-5 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <ClipboardList size={13} className="text-orange-500" />
                  <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Catatan Pengerjaan</p>
                </div>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={6}
                  placeholder="Tuliskan detail temuan teknis atau catatan khusus di sini..."
                  className="h-[170px] min-h-[170px] bg-[#0f1117] border border-[#2a2f3e] rounded-lg px-3.5 py-2.5 text-[12px] text-[#e2e8f0] placeholder:text-[#374151] outline-none focus:border-orange-500/50 resize-none transition-colors"
                />
                <p className="text-[10px] text-[#4b5563]">Catatan ini akan tersimpan saat WO dibuat.</p>
              </div>

              {/* Tombol Buat WO */}
              <div className="p-4 border-t border-[#1e2230] bg-[#0f1117]">
                <button
                  onClick={handleCreateWO}
                  disabled={!foundBooking}
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white text-[12px] font-bold uppercase tracking-widest rounded-xl transition-all disabled:cursor-not-allowed disabled:bg-orange-500/30"
                >
                  Buat WO Baru
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════
            VIEW: DETAIL WO
        ══════════════════════════════════════ */}
        {view === 'detail' && selectedWO && (
          <div className="flex gap-0 h-[calc(100vh-73px)]">

            {/* Left — info + progress */}
            <div className="flex-1 overflow-y-auto p-8 space-y-4">

              {/* Back */}
              <button
                onClick={() => setView('list')}
                className="flex items-center gap-1.5 text-[11px] text-[#4b5563] hover:text-white transition-colors mb-2"
              >
                <ChevronLeft size={14} /> Kembali ke List
              </button>

              {/* WO Header Info */}
              <div className="bg-[#13161e] border border-[#1e2230] rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Info size={13} className="text-orange-500" />
                    <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest">Informasi Umum WO</p>
                  </div>
                  {/* Status badge */}
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLE[selectedWO.status]}`}>
                    {selectedWO.status}
                  </span>
                </div>

                <div className="border border-orange-500/30 rounded-xl p-5 bg-orange-500/5">
                  <p className="text-[22px] font-black text-orange-400 mb-4">{selectedWO.id}</p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-widest mb-1">Customer Name</p>
                      <p className="text-[18px] font-bold text-white">{selectedWO.customer}</p>
                      <p className="text-[12px] text-orange-400">{selectedWO.phone}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-widest mb-1">Vehicle Identity</p>
                      <p className="text-[18px] font-bold text-white">{selectedWO.vehicle}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-[#1a1d28] border border-[#2a2f3e] rounded text-[10px] font-mono text-[#9ca3af]">{selectedWO.plateNumber}</span>
                        <span className="px-2 py-0.5 bg-[#1a1d28] border border-[#2a2f3e] rounded text-[10px] text-[#9ca3af]">{selectedWO.year} · {selectedWO.color}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#0f1117] border border-[#1e2230] rounded-lg p-3.5 mb-4">
                    <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-widest mb-1.5">Primary Complaint</p>
                    <p className="text-[12px] text-[#e2e8f0] italic">{selectedWO.complaint}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-widest mb-1">Entry Date</p>
                      <p className="text-[13px] font-semibold text-white">{selectedWO.entryDate}, {selectedWO.entryTime}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-widest mb-1">Est. Completion</p>
                      <p className="text-[13px] font-semibold text-orange-400">{selectedWO.estCompletion}</p>
                    </div>
                  </div>
                </div>

                {/* Customer card bawah */}
                <div className="flex items-center gap-3 p-3 bg-[#0f1117] border border-[#1e2230] rounded-xl mt-4">
                  <div className="w-8 h-8 rounded-full bg-[#1a1d28] border border-[#2a2f3e] flex items-center justify-center flex-shrink-0">
                    <User size={14} className="text-[#6b7280]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold text-white">{selectedWO.customer}</p>
                    <p className="text-[10px] text-[#4b5563]">{selectedWO.bookingId} · {selectedWO.vehicle}</p>
                  </div>
                  <span className="text-[10px] font-bold text-orange-400">{selectedWO.plateNumber}</span>
                </div>
              </div>

              {/* Progress Section */}
              <div className="bg-[#13161e] border border-[#1e2230] rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <RefreshCw size={13} className="text-orange-500" />
                    <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest">Progress Pengerjaan</p>
                  </div>
                  {selectedWO.status === 'FINISHED' && (
                    <span className="text-[10px] font-bold text-green-400 flex items-center gap-1">
                      <CheckCircle size={11} /> Selesai
                    </span>
                  )}
                </div>

                {/* Timeline */}
                {selectedWO.progress.length === 0 ? (
                  <div className="text-center py-8 text-[#4b5563]">
                    <Wrench size={24} className="mx-auto mb-2 opacity-20" />
                    <p className="text-[12px]">Belum ada progress. Tambahkan step pengerjaan di bawah.</p>
                  </div>
                ) : (
                  <div className="space-y-4 mb-4">
                    {selectedWO.progress.map((step, idx) => (
                      <div key={step.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? 'bg-green-500/20 border border-green-500/40' : 'bg-orange-500/20 border border-orange-500/40'}`}>
                            {step.done
                              ? <CheckCircle size={11} className="text-green-400" />
                              : <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                            }
                          </div>
                          {idx < selectedWO.progress.length - 1 && (
                            <div className="w-px flex-1 bg-[#1e2230] mt-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-[12px] font-bold text-white">{step.title}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-[#4b5563] font-mono">
                                {step.time}{step.active ? ' · ACTIVE' : ''}
                              </span>
                              {/* Tombol tandai selesai (hanya step active) */}
                              {step.active && selectedWO.status !== 'FINISHED' && (
                                <button
                                  onClick={() => markStepDone(step.id)}
                                  title="Tandai selesai"
                                  className="px-2 py-0.5 text-[9px] font-bold text-green-400 border border-green-500/30 bg-green-500/5 hover:bg-green-500/10 rounded transition-all"
                                >
                                  Selesai ✓
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="text-[11px] text-[#6b7280]">{step.description}</p>

                          {/* Upload foto bukti */}
                          {step.active && (
                            <div className="mt-3">
                              <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-widest mb-2">Foto Bukti Pengerjaan</p>
                              {step.foto ? (
                                <div className="relative w-24 h-20">
                                  <img src={step.foto} alt="Bukti" className="w-24 h-20 object-cover rounded-lg border border-[#2a2f3e]" />
                                  <button
                                    onClick={() => {
                                      setActiveStepId(step.id);
                                      fileInputRef.current?.click();
                                    }}
                                    className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-[9px] text-white font-bold"
                                  >
                                    Ganti
                                  </button>
                                </div>
                              ) : (
                                <div
                                  onClick={() => {
                                    setActiveStepId(step.id);
                                    fileInputRef.current?.click();
                                  }}
                                  className="w-24 h-20 border-2 border-dashed border-[#2a2f3e] hover:border-orange-500/40 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all"
                                >
                                  <Camera size={16} className="text-[#4b5563] mb-1" />
                                  <span className="text-[8px] text-[#4b5563] uppercase tracking-widest">Upload Foto</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Foto yang sudah diupload untuk step done */}
                          {step.done && step.foto && (
                            <div className="mt-2">
                              <img src={step.foto} alt="Bukti" className="w-20 h-16 object-cover rounded-lg border border-green-500/20" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Input file tersembunyi */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file && activeStepId) {
                      handlePhotoUpload(activeStepId, file);
                      setActiveStepId(null);
                    }
                    e.target.value = '';
                  }}
                />

                {/* Tambah Step — hanya jika WO belum FINISHED */}
                {selectedWO.status !== 'FINISHED' && (
                  <div className="mt-4 pt-4 border-t border-[#1e2230] space-y-2">
                    <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest mb-2">+ Tambah Step Progress</p>
                    <input
                      type="text"
                      placeholder="Judul step baru..."
                      value={newStepTitle}
                      onChange={e => setNewStepTitle(e.target.value)}
                      className={inputCls}
                    />
                    <input
                      type="text"
                      placeholder="Deskripsi langkah pengerjaan..."
                      value={newStepDesc}
                      onChange={e => setNewStepDesc(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addProgressStep()}
                      className={inputCls}
                    />
                    <button
                      onClick={addProgressStep}
                      disabled={!newStepTitle.trim()}
                      className="w-full py-2.5 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-orange-400 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      + Tambah Step
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-[320px] flex-shrink-0 border-l border-[#1e2230] flex flex-col">

              {/* Scrollable content area */}
              <div className="flex-1 overflow-y-auto flex flex-col">

                {/* Assign Mekanik */}
                <div className="p-5 border-b border-[#1e2230]">
                  <div className="flex items-center gap-2 mb-3">
                    <UserCheck size={13} className="text-orange-500" />
                    <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Assign Mekanik</p>
                  </div>

                  {/* Mekanik terpilih saat ini */}
                  {selectedWO.assignedMechanic && (
                    <div className="mb-3 flex items-center gap-2 text-[11px] text-green-400 bg-green-500/5 border border-green-500/20 rounded-lg px-3 py-2">
                      <CheckCircle size={12} /> Ditugaskan: <span className="font-bold">{selectedWO.assignedMechanic}</span>
                    </div>
                  )}

                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" size={12} />
                    <input
                      type="text"
                      placeholder="Cari mekanik..."
                      value={detailMechSearch}
                      onChange={e => setDetailMechSearch(e.target.value)}
                      className="w-full bg-[#0f1117] border border-[#2a2f3e] rounded-lg py-2 pl-8 pr-3 text-[12px] outline-none focus:border-orange-500/50 placeholder:text-[#374151] text-[#e2e8f0]"
                    />
                  </div>

                  <div className="space-y-2">
                    {filteredDetailMechanics.map(m => (
                      <div
                        key={m.id}
                        onClick={() => m.status === 'READY' && assignMechanic(m.name)}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all
                          ${m.status === 'BUSY' ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                          ${selectedWO.assignedMechanic === m.name ? 'border-orange-500/40 bg-orange-500/5' : 'border-[#1e2230] bg-[#0f1117] hover:border-[#2a2f3e]'}`}
                      >
                        <div className="w-7 h-7 rounded-full bg-[#1a1d28] border border-[#2a2f3e] flex items-center justify-center flex-shrink-0">
                          <User size={12} className="text-[#6b7280]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-bold text-white truncate">{m.name}</p>
                          <p className="text-[9px] font-bold">
                            <span className="text-[#4b5563]">{m.specialization} · </span>
                            <span className={m.status === 'READY' ? 'text-green-400' : 'text-red-400'}>{m.status}</span>
                          </p>
                        </div>
                        <div className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 transition-all ${selectedWO.assignedMechanic === m.name ? 'border-orange-500 bg-orange-500' : 'border-[#4b5563]'}`} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Catatan */}
                <div className="p-5 flex-1 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <ClipboardList size={13} className="text-orange-500" />
                    <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Catatan Pengerjaan</p>
                  </div>
                  <textarea
                    value={detailNotes}
                    onChange={e => setDetailNotes(e.target.value)}
                    rows={6}
                    placeholder="Tuliskan detail temuan teknis atau catatan khusus di sini..."
                    className="flex-1 bg-[#0f1117] border border-[#2a2f3e] rounded-lg px-3.5 py-2.5 text-[12px] text-[#e2e8f0] placeholder:text-[#374151] outline-none focus:border-orange-500/50 resize-none transition-colors"
                  />
                  <button
                    onClick={saveNotes}
                    className="w-full py-2.5 bg-[#1a1d28] border border-[#2a2f3e] hover:border-orange-500/40 text-white text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all"
                  >
                    Simpan Catatan
                  </button>
                </div>

              </div>{/* end scrollable */}

              {/* Tombol Tugaskan — pinned di bawah, selalu kelihatan */}
              <div className="p-4 border-t border-[#1e2230] bg-[#0f1117]">
                {selectedWO.status === 'PENDING' && selectedWO.assignedMechanic && (
                  <button
                    onClick={handleTugaskan}
                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white text-[12px] font-bold uppercase tracking-widest rounded-xl transition-all"
                  >
                    Tugaskan
                  </button>
                )}

                {/* Info kalau sudah FINISHED */}
                {selectedWO.status === 'FINISHED' && (
                  <div className="flex items-center gap-2 text-[11px] text-green-400 bg-green-500/5 border border-green-500/20 rounded-lg px-3 py-2.5">
                    <CheckCircle size={13} /> Work Order telah selesai
                  </div>
                )}
              </div>{/* end pinned bottom */}
            </div>{/* end right sidebar */}
          </div>
        )}

      </main>
    </div>
  );
}