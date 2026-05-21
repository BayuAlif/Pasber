'use client';

import { useState, useRef } from 'react';
import {
  Search, Bell, Eye, CheckCircle, XCircle, X, Plus,
  CalendarDays, Car, User, Wrench, Clock, ChevronFirst,
  ChevronLast, ChevronLeft, ChevronRight, Upload, RefreshCw,
  AlertCircle, Info, ClipboardList, UserCheck, Camera,
} from 'lucide-react';
import SidebarAdmin from '../../components/sidebar-admin/page';

// ── Types ──────────────────────────────────────────────────────────────────
type WOStatus   = 'PENDING' | 'RUNNING' | 'FINISHED';
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

// ── Dummy Data ─────────────────────────────────────────────────────────────
const DUMMY_MECHANICS: Mekanik[] = [
  { id: 'M001', name: 'Eko Prasetyo',   specialization: 'ELECTRICAL', status: 'READY' },
  { id: 'M002', name: 'Eko Prasatwa',   specialization: 'ELECTRICAL', status: 'READY' },
  { id: 'M003', name: 'Eko Prasejarah', specialization: 'ELECTRICAL', status: 'READY' },
  { id: 'M004', name: 'Budi Santoso',   specialization: 'ENGINE',     status: 'BUSY'  },
  { id: 'M005', name: 'Reza Firmansyah',specialization: 'BODY & PAINT',status: 'READY'},
];

const DUMMY_WO: WorkOrder[] = [
  {
    id: '#WO-2024-001', bookingId: '#BK-2024-001',
    customer: 'Andi Wijaya', customerType: 'VIP CLIENT', phone: '+62 812-3456-7890',
    vehicle: 'Toyota Fortuner GR', plateNumber: 'B 1234 XYZ', year: '2022', color: 'Black Metallic',
    complaint: 'Engine misfiring at low RPM, especially when idling for more than 5 minutes. No Check Engine Light visible on dashboard yet.',
    entryDate: '24 Oct 2024', entryTime: '09:00 WIB', estCompletion: '24 Oct 2024, 11:00 WIB',
    status: 'PENDING', assignedMechanic: undefined, notes: '',
    progress: [],
  },
  {
    id: '#WO-2024-002', bookingId: '#BK-2024-002',
    customer: 'Jessica Wijaya', customerType: 'VIP CLIENT', phone: '+62 813-9988-7766',
    vehicle: 'BMW M3 Competition', plateNumber: 'D 4452 CC', year: '2023', color: 'Alpine White',
    complaint: 'Oil leak detected from bottom of engine. Smell of burning oil after long drives.',
    entryDate: '25 Oct 2024', entryTime: '14:30 WIB', estCompletion: '25 Oct 2024, 17:00 WIB',
    status: 'FINISHED', assignedMechanic: 'Eko Prasetyo', notes: 'Oil pan gasket replaced. Test drive completed.',
    progress: [
      { id: 'p1', title: 'Initial Diagnostics', description: 'Perform full OBD-II scan, checking error logs and fuel pressure values.', time: '09:15', active: false, done: true },
      { id: 'p2', title: 'Oil Pan Inspection',  description: 'Identified crack on oil pan gasket. Ordered replacement part.', time: '10:00', active: false, done: true },
    ],
  },
  {
    id: '#WO-2024-003', bookingId: '#BK-2024-003',
    customer: 'Budi Santoso', customerType: 'REGULAR CLIENT', phone: '+62 856-1122-3344',
    vehicle: 'Honda Civic Type R', plateNumber: 'L 9901 AB', year: '2021', color: 'Championship White',
    complaint: 'Suspension feels too stiff on bumps. Possible worn shock absorbers.',
    entryDate: '26 Oct 2024', entryTime: '10:00 WIB', estCompletion: '26 Oct 2024, 14:00 WIB',
    status: 'RUNNING', assignedMechanic: 'Eko Prasetyo', notes: '',
    progress: [
      { id: 'p1', title: 'Initial Diagnostics',          description: 'Perform full OBD-II scan, checking error logs and fuel pressure values.', time: '09:15', active: false, done: true },
      { id: 'p2', title: 'Spark Plug & Coil Replacement', description: 'Replacing faulty spark plugs on cylinders 2 & 4. Checking wiring harness integrity.', time: '10:45', active: true, done: false },
    ],
  },
];

const DUMMY_BOOKINGS = [
  { id: '#BK-2024-004', customer: 'Rina Melati',    vehicle: 'Porsche 911 Carrera', plate: 'B 911 RIN', phone: '+62 877-5544-3322', complaint: 'Brake pedal feels spongy and requires more force.', entry: '27 Oct 2024, 09:00 WIB', est: '27 Oct 2024, 12:00 WIB', year: '2022', color: 'GT Silver' },
  { id: '#BK-2024-005', customer: 'Doni Saputra',   vehicle: 'Toyota GR86',         plate: 'B 8600 GR',  phone: '+62 812-7788-9900', complaint: 'Check engine light on since last week.',           entry: '28 Oct 2024, 11:00 WIB', est: '28 Oct 2024, 14:00 WIB', year: '2023', color: 'Halo White'  },
];

const STATUS_STYLE: Record<WOStatus, string> = {
  PENDING:  'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  RUNNING:  'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  FINISHED: 'bg-green-500/10  text-green-400  border border-green-500/20',
};

const PAGE_SIZE = 5;

// ── Main Page ──────────────────────────────────────────────────────────────
export default function KelolaJadwalPage() {
  // view: 'list' | 'create' | 'detail'
  const [view, setView]           = useState<'list' | 'create' | 'detail'>('list');
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(DUMMY_WO);
  const [selectedWO, setSelectedWO] = useState<WorkOrder | null>(null);

  // list state
  const [search, setSearch]             = useState('');
  const [filterStatus, setFilterStatus] = useState<'All Status' | WOStatus>('All Status');
  const [page, setPage]                 = useState(1);

  // create state
  const [bookingSearch, setBookingSearch] = useState('');
  const [foundBooking, setFoundBooking]   = useState<typeof DUMMY_BOOKINGS[0] | null>(null);
  const [bookingNotFound, setBookingNotFound] = useState(false);
  const [selectedMechanic, setSelectedMechanic] = useState<string>('');
  const [mechSearch, setMechSearch]       = useState('');
  const [notes, setNotes]                 = useState('');

  // detail state
  const [newStepTitle, setNewStepTitle]   = useState('');
  const [newStepDesc, setNewStepDesc]     = useState('');
  const [detailMechSearch, setDetailMechSearch] = useState('');
  const [detailNotes, setDetailNotes]     = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Stats ─────────────────────────────────────────────────────────────
  const total    = workOrders.length;
  const pending  = workOrders.filter(w => w.status === 'PENDING').length;
  const approved = workOrders.filter(w => w.status === 'FINISHED').length;
  const running  = workOrders.filter(w => w.status === 'RUNNING').length;

  // ── Filter ─────────────────────────────────────────────────────────────
  const filtered = workOrders.filter(w => {
    const matchSearch = w.customer.toLowerCase().includes(search.toLowerCase()) ||
                        w.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
                        w.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All Status' || w.status === filterStatus;
    return matchSearch && matchStatus;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── Handlers ───────────────────────────────────────────────────────────
  const handleSearchBooking = () => {
    const found = DUMMY_BOOKINGS.find(b => b.id.toLowerCase() === bookingSearch.toLowerCase());
    if (found) { setFoundBooking(found); setBookingNotFound(false); }
    else        { setFoundBooking(null); setBookingNotFound(true);  }
  };

  const handleCreateWO = () => {
    if (!foundBooking) return;
    const newWO: WorkOrder = {
      id:             `#WO-2024-${String(workOrders.length + 1).padStart(3, '0')}`,
      bookingId:      foundBooking.id,
      customer:       foundBooking.customer,
      customerType:   'NEW CLIENT',
      phone:          foundBooking.phone,
      vehicle:        foundBooking.vehicle,
      plateNumber:    foundBooking.plate,
      year:           foundBooking.year,
      color:          foundBooking.color,
      complaint:      foundBooking.complaint,
      entryDate:      foundBooking.entry.split(',')[0],
      entryTime:      foundBooking.entry.split(',')[1]?.trim() || '',
      estCompletion:  foundBooking.est,
      status:         'PENDING',
      assignedMechanic: selectedMechanic || undefined,
      notes,
      progress:       [],
    };
    setWorkOrders(prev => [...prev, newWO]);
    setSelectedWO(newWO);
    setView('detail');
    setFoundBooking(null); setBookingSearch(''); setSelectedMechanic(''); setNotes('');
  };

  const openDetail = (wo: WorkOrder) => { setSelectedWO(wo); setDetailNotes(wo.notes); setView('detail'); };

  const addProgressStep = () => {
    if (!selectedWO || !newStepTitle) return;
    const step: ProgressStep = {
      id: Date.now().toString(), title: newStepTitle, description: newStepDesc,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      active: true, done: false,
    };
    const updated = { ...selectedWO, progress: [...selectedWO.progress, step], status: 'RUNNING' as WOStatus };
    setWorkOrders(prev => prev.map(w => w.id === selectedWO.id ? updated : w));
    setSelectedWO(updated); setNewStepTitle(''); setNewStepDesc('');
  };

  const assignMechanic = (mechName: string) => {
    if (!selectedWO) return;
    const updated = { ...selectedWO, assignedMechanic: mechName };
    setWorkOrders(prev => prev.map(w => w.id === selectedWO.id ? updated : w));
    setSelectedWO(updated);
  };

  const saveNotes = () => {
    if (!selectedWO) return;
    const updated = { ...selectedWO, notes: detailNotes };
    setWorkOrders(prev => prev.map(w => w.id === selectedWO.id ? updated : w));
    setSelectedWO(updated);
  };

  const inputCls = "w-full bg-[#0f1117] border border-[#2a2f3e] rounded-lg px-3.5 py-2.5 text-[12px] text-[#e2e8f0] placeholder:text-[#374151] outline-none focus:border-orange-500/50 transition-colors";

  const filteredMechanics = DUMMY_MECHANICS.filter(m =>
    m.name.toLowerCase().includes(mechSearch.toLowerCase())
  );
  const filteredDetailMechanics = DUMMY_MECHANICS.filter(m =>
    m.name.toLowerCase().includes(detailMechSearch.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f1117] text-[#e2e8f0]" style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

      <SidebarAdmin />

      <main className="flex-1 overflow-y-auto h-screen">

        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#0f1117]/95 backdrop-blur border-b border-[#1e2230] px-8 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-[18px] font-bold text-white leading-none">Kelola Jadwal & Work Order</h2>
            <p className="text-[11px] text-[#4b5563] mt-1">Kelola Jadwal Booking</p>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" size={13} />
              <input type="text" placeholder="ID Servis/Plat Nomor"
                className="bg-[#13161e] border border-[#1e2230] rounded-lg py-2 pl-9 pr-4 text-[12px] outline-none focus:border-orange-500/50 w-56 placeholder:text-[#374151] text-[#e2e8f0]" />
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
                { label: 'Total Work Order', value: total,    color: 'border-l-orange-500', icon: <ClipboardList size={20} className="text-orange-400 opacity-50" /> },
                { label: 'Pending',          value: pending,  color: 'border-l-yellow-500', icon: <Clock size={20} className="text-yellow-400 opacity-50" /> },
                { label: 'Approved',         value: approved, color: 'border-l-green-500',  icon: <CheckCircle size={20} className="text-green-400 opacity-50" /> },
                { label: 'Running',          value: running,  color: 'border-l-yellow-400', icon: <RefreshCw size={20} className="text-yellow-300 opacity-50" /> },
              ].map(({ label, value, color, icon }) => (
                <div key={label} className={`bg-[#13161e] border border-[#1e2230] border-l-2 ${color} rounded-xl px-5 py-4 flex items-center justify-between`}>
                  <div>
                    <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest mb-1">{label}</p>
                    <p className="text-[28px] font-black text-white leading-none">{value}</p>
                  </div>
                  {icon}
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="bg-[#13161e] border border-[#1e2230] rounded-xl p-4">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-widest mb-1.5">Search Records</p>
                  <div className="relative w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" size={13} />
                    <input type="text" placeholder="Customer name, plate number, or ID..."
                      value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                      className="w-full bg-[#0f1117] border border-[#2a2f3e] rounded-lg py-2.5 pl-9 pr-4 text-[12px] outline-none focus:border-orange-500/50 placeholder:text-[#374151] text-[#e2e8f0]"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-widest mb-1.5">Status Filter</p>
                  <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value as any); setPage(1); }}
                    className="bg-[#0f1117] border border-[#2a2f3e] rounded-lg px-3 py-2.5 text-[12px] text-[#e2e8f0] outline-none focus:border-orange-500/50 cursor-pointer w-36">
                    {['All Status', 'PENDING', 'RUNNING', 'FINISHED'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-widest mb-1.5">Date Range</p>
                  <input type="date"
                    className="bg-[#0f1117] border border-[#2a2f3e] rounded-lg px-3 py-2.5 text-[12px] text-[#e2e8f0] outline-none focus:border-orange-500/50 cursor-pointer" />
                </div>
                <div className="mt-5">
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all">
                    Apply Filters
                  </button>
                </div>
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
                  {paginated.map((w, i) => (
                    <tr key={w.id} className={`border-b border-[#1e2230] hover:bg-[#1a1d28] transition-colors ${i === paginated.length - 1 ? 'border-b-0' : ''}`}>
                      <td className="px-5 py-4"><span className="text-[11px] font-mono font-bold text-orange-400">{w.id}</span></td>
                      <td className="px-5 py-4">
                        <p className="text-[12px] font-bold text-white">{w.customer}</p>
                        <p className="text-[9px] text-[#4b5563] font-bold tracking-wider mt-0.5">{w.customerType}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[12px] font-semibold text-white">{w.vehicle}</p>
                        <p className="text-[10px] font-mono text-[#6b7280] mt-0.5">{w.plateNumber}</p>
                      </td>
                      <td className="px-5 py-4 max-w-[150px]">
                        <p className="text-[11px] text-[#9ca3af] truncate">{w.complaint}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[11px] font-semibold text-white">{w.entryDate}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Clock size={9} className="text-[#4b5563]" />
                          <p className="text-[10px] text-[#4b5563]">{w.entryTime}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLE[w.status]}`}>
                          {w.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          {w.status === 'RUNNING' && (
                            <button onClick={() => openDetail(w)} title="Progress"
                              className="w-7 h-7 rounded-lg bg-[#1a1d28] border border-[#2a2f3e] hover:border-orange-500/40 hover:text-orange-400 flex items-center justify-center text-[#6b7280] transition-all">
                              <RefreshCw size={13} />
                            </button>
                          )}
                          <button onClick={() => openDetail(w)} title="View Detail"
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
                      className={`w-8 h-8 rounded-lg text-[12px] font-bold border transition-all ${page === p ? 'bg-orange-500 border-orange-500 text-white' : 'bg-[#1a1d28] border-[#2a2f3e] text-[#6b7280] hover:text-white'}`}>
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

            {/* FAB */}
            <div className="flex justify-end">
              <button onClick={() => setView('create')}
                className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white text-[12px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-orange-500/20">
                <Plus size={15} /> Buat WO Baru
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════
            VIEW: CREATE WO
        ══════════════════════════════════════ */}
        {view === 'create' && (
          <div className="flex gap-0 h-[calc(100vh-73px)]">
            {/* Left */}
            <div className="flex-1 overflow-y-auto p-8 space-y-4">

              {/* Search Booking */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" size={13} />
                <input type="text" placeholder="Cari Booking ID..."
                  value={bookingSearch} onChange={e => setBookingSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearchBooking()}
                  className="w-full bg-[#13161e] border border-[#1e2230] rounded-lg py-3 pl-9 pr-4 text-[13px] outline-none focus:border-orange-500/50 placeholder:text-[#374151] text-[#e2e8f0]"
                />
              </div>

              {bookingNotFound && (
                <div className="flex items-center gap-2.5 p-3.5 bg-red-500/5 border border-red-500/20 rounded-xl">
                  <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                  <p className="text-[12px] text-red-400">Booking ID tidak ditemukan. Coba lagi.</p>
                </div>
              )}

              {/* WO Info */}
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
                        <p className="text-[12px] text-[#e2e8f0] italic">"{foundBooking.complaint}"</p>
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

                    {/* Booking card */}
                    <div className="flex items-center gap-3 p-3 bg-[#0f1117] border border-[#1e2230] rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-[#1a1d28] border border-[#2a2f3e] flex items-center justify-center flex-shrink-0">
                        <User size={14} className="text-[#6b7280]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-bold text-white">{foundBooking.customer}</p>
                        <p className="text-[10px] text-[#4b5563]">{foundBooking.id} · {foundBooking.vehicle}</p>
                      </div>
                      <span className="text-[10px] font-bold text-orange-400">{foundBooking.vehicle}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 text-[#4b5563]">
                    <Search size={28} className="mx-auto mb-3 opacity-30" />
                    <p className="text-[12px]">Cari Booking ID untuk memuat data WO</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => setView('list')} className="px-5 py-2.5 text-[12px] font-bold text-[#6b7280] hover:text-white transition-colors">Batal</button>
                <button onClick={handleSearchBooking}
                  className="px-5 py-2.5 bg-[#1a1d28] border border-[#2a2f3e] text-[12px] font-bold text-white rounded-lg hover:border-orange-500/40 transition-all">
                  Cari Booking
                </button>
                {foundBooking && (
                  <button onClick={handleCreateWO}
                    className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-[12px] font-bold uppercase tracking-widest rounded-lg transition-all">
                    <Plus size={14} /> Buat WO Baru
                  </button>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-[320px] flex-shrink-0 border-l border-[#1e2230] flex flex-col overflow-y-auto">
              {/* Assign Mekanik */}
              <div className="p-5 border-b border-[#1e2230]">
                <div className="flex items-center gap-2 mb-3">
                  <UserCheck size={13} className="text-orange-500" />
                  <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Assign Mekanik</p>
                </div>
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" size={12} />
                  <input type="text" placeholder="Cari mekanik..." value={mechSearch}
                    onChange={e => setMechSearch(e.target.value)}
                    className="w-full bg-[#0f1117] border border-[#2a2f3e] rounded-lg py-2 pl-8 pr-3 text-[12px] outline-none focus:border-orange-500/50 placeholder:text-[#374151] text-[#e2e8f0]" />
                </div>
                <div className="space-y-2">
                  {filteredMechanics.map(m => (
                    <div key={m.id} onClick={() => m.status === 'READY' && setSelectedMechanic(m.name)}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer
                        ${selectedMechanic === m.name ? 'border-orange-500/40 bg-orange-500/5' : 'border-[#1e2230] bg-[#0f1117] hover:border-[#2a2f3e]'}
                        ${m.status === 'BUSY' ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
                      <div className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 ${selectedMechanic === m.name ? 'border-orange-500 bg-orange-500' : 'border-[#4b5563]'}`} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Catatan */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <ClipboardList size={13} className="text-orange-500" />
                  <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Catatan Pengerjaan</p>
                </div>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={6}
                  placeholder="Tuliskan detail temuan teknis atau catatan khusus di sini..."
                  className="flex-1 bg-[#0f1117] border border-[#2a2f3e] rounded-lg px-3.5 py-2.5 text-[12px] text-[#e2e8f0] placeholder:text-[#374151] outline-none focus:border-orange-500/50 resize-none transition-colors" />
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════
            VIEW: DETAIL WO
        ══════════════════════════════════════ */}
        {view === 'detail' && selectedWO && (
          <div className="flex gap-0 h-[calc(100vh-73px)]">
            {/* Left */}
            <div className="flex-1 overflow-y-auto p-8 space-y-4">

              {/* Back */}
              <button onClick={() => setView('list')}
                className="flex items-center gap-1.5 text-[11px] text-[#4b5563] hover:text-white transition-colors mb-2">
                <ChevronLeft size={14} /> Kembali ke List
              </button>

              {/* WO Header */}
              <div className="bg-[#13161e] border border-[#1e2230] rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Info size={13} className="text-orange-500" />
                  <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest">Informasi Umum WO</p>
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
                    <p className="text-[12px] text-[#e2e8f0] italic">"{selectedWO.complaint}"</p>
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

                {/* Booking card */}
                <div className="flex items-center gap-3 p-3 bg-[#0f1117] border border-[#1e2230] rounded-xl mt-4">
                  <div className="w-8 h-8 rounded-full bg-[#1a1d28] border border-[#2a2f3e] flex items-center justify-center flex-shrink-0">
                    <User size={14} className="text-[#6b7280]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold text-white">{selectedWO.customer}</p>
                    <p className="text-[10px] text-[#4b5563]">{selectedWO.bookingId} · {selectedWO.vehicle}</p>
                  </div>
                  <span className="text-[10px] font-bold text-orange-400">{selectedWO.vehicle}</span>
                </div>
              </div>

              {/* Progress */}
              {(selectedWO.progress.length > 0 || selectedWO.status === 'RUNNING') && (
                <div className="bg-[#13161e] border border-[#1e2230] rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <RefreshCw size={13} className="text-orange-500" />
                      <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest">Progress Pengerjaan</p>
                    </div>
                    <button onClick={() => {}}
                      className="text-[10px] font-bold text-orange-400 hover:text-orange-300 transition-colors">
                      + Tambah Step Progress
                    </button>
                  </div>

                  <div className="space-y-4">
                    {selectedWO.progress.map((step, idx) => (
                      <div key={step.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? 'bg-green-500/20 border border-green-500/40' : 'bg-orange-500/20 border border-orange-500/40'}`}>
                            {step.done
                              ? <CheckCircle size={11} className="text-green-400" />
                              : <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                            }
                          </div>
                          {idx < selectedWO.progress.length - 1 && <div className="w-px flex-1 bg-[#1e2230] mt-1" />}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-[12px] font-bold text-white">{step.title}</p>
                            <span className="text-[10px] text-[#4b5563] font-mono">{step.time}{step.active ? ' (ACTIVE)' : ''}</span>
                          </div>
                          <p className="text-[11px] text-[#6b7280]">{step.description}</p>
                          {step.active && (
                            <div className="mt-3">
                              <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-widest mb-2">Foto Bukti Pengerjaan</p>
                              <div onClick={() => fileRef.current?.click()}
                                className="w-24 h-20 border-2 border-dashed border-[#2a2f3e] hover:border-orange-500/40 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all">
                                <Camera size={16} className="text-[#4b5563] mb-1" />
                                <span className="text-[8px] text-[#4b5563] uppercase tracking-widest">Upload Foto</span>
                              </div>
                              <input ref={fileRef} type="file" accept="image/*" className="hidden" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Step Form */}
                  <div className="mt-4 pt-4 border-t border-[#1e2230] space-y-2">
                    <input type="text" placeholder="Judul step baru..." value={newStepTitle}
                      onChange={e => setNewStepTitle(e.target.value)} className={inputCls} />
                    <input type="text" placeholder="Deskripsi langkah pengerjaan..." value={newStepDesc}
                      onChange={e => setNewStepDesc(e.target.value)} className={inputCls} />
                    <button onClick={addProgressStep}
                      className="w-full py-2.5 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-orange-400 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all">
                      + Tambah Step
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="w-[320px] flex-shrink-0 border-l border-[#1e2230] flex flex-col overflow-y-auto">
              {/* Assign Mekanik */}
              <div className="p-5 border-b border-[#1e2230]">
                <div className="flex items-center gap-2 mb-3">
                  <UserCheck size={13} className="text-orange-500" />
                  <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Assign Mekanik</p>
                </div>
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" size={12} />
                  <input type="text" placeholder="Cari mekanik..." value={detailMechSearch}
                    onChange={e => setDetailMechSearch(e.target.value)}
                    className="w-full bg-[#0f1117] border border-[#2a2f3e] rounded-lg py-2 pl-8 pr-3 text-[12px] outline-none focus:border-orange-500/50 placeholder:text-[#374151] text-[#e2e8f0]" />
                </div>
                <div className="space-y-2">
                  {filteredDetailMechanics.map(m => (
                    <div key={m.id} onClick={() => m.status === 'READY' && assignMechanic(m.name)}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer
                        ${selectedWO.assignedMechanic === m.name ? 'border-orange-500/40 bg-orange-500/5' : 'border-[#1e2230] bg-[#0f1117] hover:border-[#2a2f3e]'}
                        ${m.status === 'BUSY' ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
                      <div className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 ${selectedWO.assignedMechanic === m.name ? 'border-orange-500 bg-orange-500' : 'border-[#4b5563]'}`} />
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
                <textarea value={detailNotes} onChange={e => setDetailNotes(e.target.value)} rows={8}
                  placeholder="Tuliskan detail temuan teknis atau catatan khusus di sini..."
                  className="flex-1 bg-[#0f1117] border border-[#2a2f3e] rounded-lg px-3.5 py-2.5 text-[12px] text-[#e2e8f0] placeholder:text-[#374151] outline-none focus:border-orange-500/50 resize-none transition-colors" />
                <button onClick={saveNotes}
                  className="w-full py-2.5 bg-[#1a1d28] border border-[#2a2f3e] hover:border-orange-500/40 text-white text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all">
                  Simpan Catatan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FAB — Buat WO Baru (always visible except on create view) */}
        {view !== 'create' && (
          <div className="fixed bottom-8 right-8 z-20">
            <button onClick={() => setView('create')}
              className="flex items-center gap-2 px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white text-[12px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-orange-500/30">
              <Plus size={15} /> Buat WO Baru
            </button>
          </div>
        )}

      </main>
    </div>
  );
}