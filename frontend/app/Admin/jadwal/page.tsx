'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Search, Eye, CheckCircle, XCircle, X, Plus,
  CalendarDays, Car, User, Wrench, Clock, ChevronFirst,
  ChevronLast, ChevronLeft, ChevronRight, Upload, RefreshCw,
  AlertCircle, Info, ClipboardList, UserCheck, Camera, BadgeCheck
} from 'lucide-react';
import SidebarAdmin from '../../components/sidebar-admin/page';
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

/// ── Types ──────────────────────────────────────────────────────────────────

type WOStatus =
  | 'approved'
  | 'assigned'
  | 'running'
  | 'qc'
  | 'done'
  | 'paid'
  | 'rejected';

type MechStatus =
  | 'available'
  | 'unavailable';

type Mekanik = {
  id: number;
  nama: string;
  spesialisasi: string;
  status: MechStatus;
};

type WorkOrderLog = {
  id: number;
  status: WOStatus;
  created_at: string;
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
  id: number;
  kodeWO: string;

  booking?: {
    id: number;

    Keluhan?: string;

    tanggalBooking?: string;

    jadwalService?: string;

    status?: string;

    user?: {
      id: number;
      name: string;
      email?: string;
      noKontak?: string;
    };

    kendaraan?: {
      id: number;
      merek: string;
      model: string;
      nomorPolisi: string;
      tahun?: string;
      jenisKendaraan?: string;
    };

    bengkel?: {
      id: number;
      nama: string;
    };
  };

  mekanik?: {
    id: number;
    nama: string;
    spesialisasi?: string;
    status?: string;
  };

  logs?: WorkOrderLog[];

  statusWO?: WOStatus;

  estimasiWaktu?: number;

  created_at?: string;
  updated_at?: string;
};

const STATUS_STYLE: Record<WOStatus, string> = {

  approved:
    'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',

  assigned:
    'bg-blue-500/10 text-blue-400 border border-blue-500/20',

  running:
    'bg-orange-500/10 text-orange-400 border border-orange-500/20',

  qc:
    'bg-purple-500/10 text-purple-400 border border-purple-500/20',

  done:
    'bg-green-500/10 text-green-400 border border-green-500/20',

  paid:
    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',

  rejected:
    'bg-red-500/10 text-red-400 border border-red-500/20',
};

const PAGE_SIZE = 5;

// ── Main Page ──────────────────────────────────────────────────────────────
export default function KelolaJadwalPage() {
  // ── VIEW ───────────────────────────────────────────────────
  const [view, setView] = useState<'list' | 'detail' | 'assign'>('list');
  const [selectedWO, setSelectedWO] =
    useState<WorkOrder | null>(null);

  // ── LIST STATE ─────────────────────────────────────────────
  const [search, setSearch] = useState('');



  const [filterStatus, setFilterStatus] =
    useState<'All Status' | WOStatus>(
      'All Status'
    );

  const [page, setPage] = useState(1);

  // ── ASSIGN STATE ───────────────────────────────────────────
  const [selectedMechanic, setSelectedMechanic] =
    useState<number | null>(null);

  const [estimasi, setEstimasi] =
    useState('');

  const [mechSearch, setMechSearch] =
    useState('');

  // ── DETAIL STATE ───────────────────────────────────────────
  const [detailMechSearch, setDetailMechSearch] =
    useState('');

  const [detailNotes, setDetailNotes] =
    useState('');

  const fileRef =
    useRef<HTMLInputElement>(null);

  const [workOrders, setWorkOrders] =
    useState<WorkOrder[]>([]);

  const [mekaniks, setMekaniks] =
    useState<Mekanik[]>([]);

  const [showAssignPanel, setShowAssignPanel] =
    useState(false);

  const [notes, setNotes] = useState('');

  const [foundBooking, setFoundBooking] =
    useState(false);

  const [estimasiWaktu, setEstimasiWaktu] = useState("");




  const fetchMekaniks = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE}/mekanik`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      console.log("MEKANIK RESULT:", result);

      setMekaniks(
        Array.isArray(result.data)
          ? result.data
          : []
      );

    } catch (error) {

      console.log(error);

      setMekaniks([]);

    }
  };

  const handleUpdateStatus = async (
    workOrderId: number,
    status: WOStatus
  ) => {

    try {

      const token =
        localStorage.getItem("token");

      await axios.put(

        `${API_BASE}/kelola-work-order/${workOrderId}`,

        {
          statusWO: status,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

      );

      // refresh data
      fetchWorkOrders();

    } catch (error) {

      console.error(error);

    }
  };

  const fetchWorkOrders = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE}/kelola-work-order`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      // console.log(
      //   JSON.stringify(result, null, 2)
      // );

      setWorkOrders(
        Array.isArray(result.data)
          ? result.data
          : []
      );

    } catch (error) {

      console.log(error);

      // fallback
      setWorkOrders([]);

    }
  };

  useEffect(() => {

    const loadData = async () => {

      await fetchWorkOrders();

      await fetchMekaniks();

    };

    loadData();

  }, []);

  // ── STATS ──────────────────────────────────────────────────
  const total = workOrders.length;

  const approved = workOrders.filter(
    w => w.statusWO === 'approved'
  ).length;

  const running = workOrders.filter(
    w => w.statusWO === 'running'
  ).length;

  const done = workOrders.filter(
    w => w.statusWO === 'done'
  ).length;

  // ── FILTER ─────────────────────────────────────────────────
  const filtered = workOrders.filter(w => {

    const q = search.toLowerCase();

    const matchSearch =

      w.booking?.user?.name
        ?.toLowerCase()
        ?.includes(q)

      ||

      w.booking?.kendaraan?.nomorPolisi
        ?.toLowerCase()
        ?.includes(q)

      ||

      w.booking?.kendaraan?.merek
        ?.toLowerCase()
        ?.includes(q)

      ||

      w.booking?.kendaraan?.model
        ?.toLowerCase()
        ?.includes(q)

      ||

      String(w.id)
        .toLowerCase()
        .includes(q)

      ||

      q === '';

    const matchStatus =
      filterStatus === 'All Status'
        ? true
        : w.statusWO === filterStatus;

    return Boolean(matchSearch) && matchStatus;

  });

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const getNextStatuses = (status: WOStatus) => {
    switch (status) {

      case "approved":
        return ["running"];

      case "running":
        return ["done"];

      case "done":
        return ["paid"];

      case "paid":
        return [];

      case "rejected":
        return [];

      default:
        return [];
    }
  };

  // ── HANDLERS ───────────────────────────────────────────────
  const openDetail = (wo: WorkOrder) => {

    setSelectedWO(wo);

    setDetailNotes('');

    setView('detail');
  };

  const inputCls =
    "w-full bg-[#0f1117] border border-[#2a2f3e] rounded-lg px-3.5 py-2.5 text-[12px] text-[#e2e8f0] placeholder:text-[#374151] outline-none focus:border-orange-500/50 transition-colors";

  const filteredMechanics =
    mekaniks.filter(m =>

      m.nama
        .toLowerCase()
        .includes(
          mechSearch.toLowerCase()
        )
    );

  // const filteredDetailMechanics =
  //   mekaniks.filter(m =>

  //     m.nama
  //       .toLowerCase()
  //       .includes(
  //         detailMechSearch.toLowerCase()
  //       )
  //   );

  const handleCreateWO = async () => {

    const token = localStorage.getItem("token");

    if (!selectedWO) return;

    try {

      // update
      await axios.put(
        `${API_BASE}/kelola-work-order/${selectedWO.id}`,
        {
          mekanik_id: selectedMechanic,
          estimasiWaktu,
          statusWO: "running",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchWorkOrders();

      setView("list");

    } catch (err) {

      console.log(err);

    }
  };

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
          </div>
        </div>

        {/* ══════════════════════════════════════
            VIEW: CREATE WO
        ══════════════════════════════════════ */}
        {/* LIST VIEW */}
        {view === 'list' && (
          <div className="space-y-4">

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3.5">

              {[
                {
                  label: 'Total Work Order',
                  value: total,
                  color: 'border-l-orange-500',
                  icon: <ClipboardList size={20} className="text-orange-400 opacity-50" />
                },

                {
                  label: 'Approved',
                  value: approved,
                  color: 'border-l-yellow-500',
                  icon: <CheckCircle size={20} className="text-yellow-400 opacity-50" />
                },

                {
                  label: 'Running',
                  value: running,
                  color: 'border-l-blue-500',
                  icon: <RefreshCw size={20} className="text-blue-400 opacity-50" />
                },

                {
                  label: 'Done',
                  value: done,
                  color: 'border-l-green-500',
                  icon: <BadgeCheck size={20} className="text-green-400 opacity-50" />
                },

              ].map(({ label, value, color, icon }) => (

                <div
                  key={label}
                  className={`bg-[#13161e] border border-[#1e2230] border-l-2 ${color} rounded-xl px-5 py-4 flex items-center justify-between`}
                >

                  <div>

                    <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest mb-1">
                      {label}
                    </p>

                    <p className="text-[28px] font-black text-white leading-none">
                      {value}
                    </p>

                  </div>

                  {icon}

                </div>

              ))}

            </div>

            {/* Filters */}
            <div className="bg-[#13161e] border border-[#1e2230] rounded-xl p-4">

              <div className="flex items-center gap-4">

                {/* Search */}
                <div>

                  <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-widest mb-1.5">
                    Search Records
                  </p>

                  <div className="relative w-96">

                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]"
                      size={13}
                    />

                    <input
                      type="text"
                      placeholder="Customer name, plate number, or ID..."

                      value={search}

                      onChange={e => {
                        setSearch(e.target.value);
                        setPage(1);
                      }}

                      className="w-full bg-[#0f1117] border border-[#2a2f3e] rounded-lg py-2.5 pl-9 pr-4 text-[12px] outline-none focus:border-orange-500/50 placeholder:text-[#374151] text-[#e2e8f0]"
                    />

                  </div>

                </div>

                {/* Status */}
                <div>

                  <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-widest mb-1.5">
                    Status Filter
                  </p>

                  <select

                    value={filterStatus}

                    onChange={e => {

                      setFilterStatus(
                        e.target.value as
                        | 'All Status'
                        | WOStatus
                      );

                      setPage(1);

                    }}

                    className="bg-[#0f1117] border border-[#2a2f3e] rounded-lg px-3 py-2.5 text-[12px] text-[#e2e8f0] outline-none focus:border-orange-500/50 cursor-pointer w-40"
                  >

                    {[
                      'All Status',
                      'approved',
                      'assigned',
                      'running',
                      'qc',
                      'done',
                      'paid',
                      'rejected'
                    ].map(s => (

                      <option key={s}>
                        {s}
                      </option>

                    ))}

                  </select>

                </div>

                {/* Date */}
                <div>

                  <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-widest mb-1.5">
                    Date Range
                  </p>

                  <input
                    type="date"
                    className="bg-[#0f1117] border border-[#2a2f3e] rounded-lg px-3 py-2.5 text-[12px] text-[#e2e8f0] outline-none focus:border-orange-500/50 cursor-pointer"
                  />

                </div>

                {/* Button */}
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

                    {[
                      'Booking ID',
                      'WO ID (Kode WO)',
                      'Customer',
                      'Vehicle Details',
                      'Complaint',
                      'Schedule',
                      'Status',
                      'Actions'
                    ].map(h => (

                      <th
                        key={h}
                        className="px-5 py-3.5 text-left text-[10px] font-bold text-[#4b5563] uppercase tracking-[1.5px] whitespace-nowrap"
                      >
                        {h}
                      </th>

                    ))}

                  </tr>

                </thead>

                <tbody>
                  {paginated.length === 0 ? (

                    <tr>
                      <td
                        colSpan={7}
                        className="py-10 text-center text-sm text-[#6b7280]"
                      >
                        Belum ada data work order
                      </td>

                    </tr>

                  ) :

                    paginated.map((w, i) => (

                      <tr
                        key={w.id}
                        className={`border-b border-[#1e2230] hover:bg-[#1a1d28] transition-colors ${i === paginated.length - 1
                          ? 'border-b-0'
                          : ''
                          }`}
                      >

                        {/* Booking ID */}
                        <td className="px-5 py-4">

                          <span className="text-[11px] font-mono font-bold text-orange-400">

                            BOOK-
                            {String(w.booking?.id || 0).padStart(3, '0')}

                          </span>

                        </td>

                        {/* Work Order ID */}
                        <td className="px-5 py-4">

                          <span className="text-[11px] font-mono font-bold text-orange-400">

                            {w.kodeWO}

                          </span>

                        </td>

                        {/* Customer */}
                        <td className="px-5 py-4">

                          <p className="text-[12px] font-bold text-white">
                            {w.booking?.user?.name || '-'}
                          </p>

                          <p className="text-[9px] text-[#4b5563] font-bold tracking-wider mt-0.5">
                            {w.booking?.user?.name || '-'}
                          </p>

                        </td>

                        {/* Vehicle */}
                        {/* Vehicle */}
                        <td className="px-5 py-4">

                          <p className="text-[12px] font-semibold text-white">
                            {w.booking?.kendaraan?.merek} - {w.booking?.kendaraan?.model}
                          </p>

                          <p className="text-[10px] font-mono text-[#6b7280] mt-0.5">
                            {w.booking?.kendaraan?.nomorPolisi}
                          </p>

                        </td>

                        {/* Complaint */}
                        <td className="px-5 py-4 max-w-[150px]">

                          <p className="text-[11px] text-[#9ca3af] truncate">
                            {w.booking?.Keluhan}
                          </p>

                        </td>

                        {/* Schedule */}
                        <td className="px-5 py-4">

                          <p className="text-[11px] font-semibold text-white">
                            {w.booking?.jadwalService}
                          </p>

                          <div className="flex items-center gap-1 mt-0.5">

                            <Clock
                              size={9}
                              className="text-[#4b5563]"
                            />

                            <p className="text-[10px] text-[#4b5563]">
                              Service Booking
                            </p>

                          </div>

                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">

                          <span
                            className={`
                    px-2.5 py-1
                    rounded-md
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wider
                    booking?.${STATUS_STYLE[w.statusWO as WOStatus]}
                  `}
                          >
                            {w.statusWO}
                          </span>

                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">

                          <div className="flex items-center gap-1.5">

                            {w.statusWO === 'rejected' ? (
                              /* Only show detail button for rejected */
                              <button
                                onClick={() => openDetail(w)}
                                title="View Detail"
                                className="w-7 h-7 rounded-lg bg-[#1a1d28] border border-[#2a2f3e] hover:border-orange-500/40 hover:text-orange-400 flex items-center justify-center text-[#6b7280] transition-all"
                              >
                                <Eye size={13} />
                              </button>
                            ) : (
                              <>
                                {/* APPROVED */}
                                {w.statusWO === 'approved' && (

                                  <button
                                    onClick={() => {
                                      setSelectedWO(w);
                                      setView('assign');
                                    }}
                                    className="px-4 py-2 bg-orange-500 rounded-md text-white text-[11px] font-bold"
                                  >
                                    ASSIGN
                                  </button>

                                )}

                                {w.statusWO !== 'approved' &&
                                  w.statusWO !== 'paid' && (

                                    <select
                                      defaultValue=""
                                      onChange={(e) =>
                                        handleUpdateStatus(
                                          w.id,
                                          e.target.value as WOStatus
                                        )
                                      }
                                      className="bg-[#1a1d28] border border-[#2a2f3e] rounded-lg px-2 py-1.5 text-[10px] text-white outline-none"
                                    >

                                      <option value="">
                                        Update
                                      </option>

                                      {getNextStatuses(
                                        w.statusWO as WOStatus
                                      ).map(status => (

                                        <option
                                          key={status}
                                          value={status}
                                        >
                                          {status.toUpperCase()}
                                        </option>

                                      ))}

                                    </select>

                                  )}

                                {/* DETAIL */}
                                <button
                                  onClick={() => openDetail(w)}
                                  title="View Detail"

                                  className="w-7 h-7 rounded-lg bg-[#1a1d28] border border-[#2a2f3e] hover:border-orange-500/40 hover:text-orange-400 flex items-center justify-center text-[#6b7280] transition-all"
                                >

                                  <Eye size={13} />

                                </button>
                              </>
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

                  Showing

                  <span className="text-white font-bold">

                    {filtered.length === 0
                      ? '0'
                      : `${(page - 1) * PAGE_SIZE + 1}-${Math.min(
                        page * PAGE_SIZE,
                        filtered.length
                      )}`}

                  </span>

                  {" "}of{" "}

                  <span className="text-white font-bold">
                    {filtered.length}
                  </span>

                  {" "}work order

                </p>

              </div>

            </div>

          </div>
        )}

        {view === 'assign' && (
          <div className="flex gap-0 h-[calc(100vh-73px)]">

            {/* Left — form */}
            <div className="flex-1 overflow-y-auto p-8 space-y-4">

              {/* Back */}
              <button onClick={() => setView('list')}
                className="flex items-center gap-1.5 text-[11px] text-[#4b5563] hover:text-white transition-colors mb-2">
                <ChevronLeft size={14} /> Kembali ke List
              </button>

              <h3 className="text-[15px] font-bold text-white mb-2">
                Assign Mekanik
              </h3>



              {/* WO Info Preview */}
              <div className="bg-[#13161e] border border-[#1e2230] rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Info size={13} className="text-orange-500" />
                  <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest">Informasi Umum WO</p>
                </div>

                {selectedWO ? (
                  <div className="space-y-4">
                    <div className="border border-orange-500/30 rounded-xl p-4 bg-orange-500/5">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-widest mb-1">Customer Name</p>
                          <p className="text-[18px] font-bold text-white">{selectedWO?.booking?.user?.name}</p>
                          <p className="text-[12px] text-orange-400 font-medium">{selectedWO?.booking?.user?.noKontak}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-widest mb-1">Vehicle Identity</p>
                          <p className="text-[18px] font-bold text-white">{selectedWO?.booking?.kendaraan?.merek}
                            {" "}
                            {selectedWO?.booking?.kendaraan?.model}</p>
                          <div className="flex gap-2 mt-1">
                            <span className="px-2 py-0.5 bg-[#1a1d28] border border-[#2a2f3e] rounded text-[10px] font-mono text-[#9ca3af]">{selectedWO?.booking?.kendaraan?.nomorPolisi}</span>
                            <span className="px-2 py-0.5 bg-[#1a1d28] border border-[#2a2f3e] rounded text-[10px] text-[#9ca3af]">{selectedWO?.booking?.kendaraan?.tahun}</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-[#0f1117] border border-[#1e2230] rounded-lg p-3.5 mb-4">
                        <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-widest mb-1.5">Primary Complaint</p>
                        <p className="text-[12px] text-[#e2e8f0] italic">{selectedWO?.booking?.Keluhan}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-widest mb-1">Entry Date</p>
                          <p className="text-[13px] font-semibold text-white">{selectedWO?.booking?.tanggalBooking}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-widest mb-1">Est. Completion</p>
                          <p className="text-[13px] font-semibold text-orange-400">{estimasiWaktu
                            ? `${estimasiWaktu} Menit`
                            : "-"
                          }</p>
                        </div>
                      </div>
                    </div>

                    {/* Customer card */}
                    <div className="flex items-center gap-3 p-3 bg-[#0f1117] border border-[#1e2230] rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-[#1a1d28] border border-[#2a2f3e] flex items-center justify-center flex-shrink-0">
                        <User size={14} className="text-[#6b7280]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-bold text-white">{selectedWO?.booking?.user?.name}</p>
                        <p className="text-[10px] text-[#4b5563]">{selectedWO?.booking?.kendaraan?.merek}
                          {" "}
                          {selectedWO?.booking?.kendaraan?.model}</p>
                      </div>
                      <span className="text-[10px] font-bold text-orange-400">{selectedWO?.booking?.kendaraan?.nomorPolisi}</span>
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

                  {filteredMechanics.map((m) => (

                    <div
                      key={m.id}

                      onClick={() =>
                        m.status === 'available' &&
                        setSelectedMechanic(
                          m.id === selectedMechanic
                            ? null
                            : m.id
                        )
                      }

                      className={`
        flex items-center gap-3 p-3 rounded-lg border transition-all

        ${m.status === 'unavailable'
                          ? 'opacity-40 cursor-not-allowed'
                          : 'cursor-pointer'
                        }

        ${selectedMechanic === m.id
                          ? 'border-orange-500/40 bg-orange-500/5'
                          : 'border-[#1e2230] bg-[#0f1117] hover:border-[#2a2f3e]'
                        }
      `}
                    >

                      {/* Avatar */}
                      <div className="w-7 h-7 rounded-full bg-[#1a1d28] border border-[#2a2f3e] flex items-center justify-center flex-shrink-0">

                        <User
                          size={12}
                          className="text-[#6b7280]"
                        />

                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">

                        <p className="text-[12px] font-bold text-white truncate">
                          {m.nama}
                        </p>

                        <p className="text-[9px] font-bold">

                          <span className="text-[#4b5563]">
                            {m.spesialisasi} ·{" "}
                          </span>

                          <span
                            className={
                              m.status === 'available'
                                ? 'text-green-400'
                                : 'text-red-400'
                            }
                          >

                            {
                              m.status === 'available'
                                ? 'AVAILABLE'
                                : 'UNAVAILABLE'
                            }

                          </span>

                        </p>

                      </div>

                      {/* Indicator */}
                      <div
                        className={`
          w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 transition-all

          ${selectedMechanic === m.id
                            ? 'border-orange-500 bg-orange-500'
                            : 'border-[#4b5563]'
                          }
        `}
                      />

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

              {/* Estimasi Pengerjaan */}
              <div className="p-5 border border-[#1e2230] bg-[#0f1117] rounded-xl mb-4">

                <p className="text-[10px] font-bold text-[#f4b5563] uppercase tracking-widest mb-3">
                  Estimasi Pengerjaan
                </p>

                <input
                  type="number"
                  value={estimasiWaktu}
                  onChange={(e) => setEstimasiWaktu(e.target.value)}
                  placeholder="Contoh: 60 menit"
                  className="w-full bg-[#13161e] border border-[#2a2f3e] rounded-lg px-4 py-3 text-[13px] text-white outline-none focus:border-orange-500/50"
                />

              </div>

              {/* Tombol Buat WO */}
              <div className="p-4 border-t border-[#1e2230] bg-[#0f1117]">
                <button
                  onClick={handleCreateWO}
                  disabled={!selectedWO}
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

            {/* Left */}
            <div className="flex-1 overflow-y-auto p-8 space-y-4">

              {/* Back */}
              <button
                onClick={() => setView('list')}
                className="flex items-center gap-1.5 text-[11px] text-[#4b5563] hover:text-white transition-colors mb-2"
              >
                <ChevronLeft size={14} />
                Kembali ke List
              </button>

              {/* Header */}
              <div className="bg-[#13161e] border border-[#1e2230] rounded-xl p-5">

                <div className="flex items-center gap-2 mb-4">

                  <Info
                    size={13}
                    className="text-orange-500"
                  />

                  <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest">
                    Informasi Umum WO
                  </p>

                </div>

                <div className="border border-orange-500/30 rounded-xl p-5 bg-orange-500/5">

                  {/* KodeWO */}
                  <p className="text-[22px] font-black text-orange-400 mb-4">
                    {selectedWO.kodeWO}
                  </p>

                  {/* Customer + Vehicle */}
                  <div className="grid grid-cols-2 gap-4 mb-4">

                    {/* Customer */}
                    <div>

                      <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-widest mb-1">
                        Customer Name
                      </p>

                      <p className="text-[18px] font-bold text-white">
                        {selectedWO.booking?.user?.name}
                      </p>

                    </div>

                    {/* Vehicle */}
                    <div>

                      <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-widest mb-1">
                        Vehicle Identity
                      </p>

                      <p className="text-[18px] font-bold text-white">

                        {selectedWO.booking?.kendaraan?.merek}{" "}
                        {selectedWO.booking?.kendaraan?.model}

                      </p>

                      <div className="flex gap-2 mt-1">

                        <span className="px-2 py-0.5 bg-[#1a1d28] border border-[#2a2f3e] rounded text-[10px] font-mono text-[#9ca3af]">

                          {selectedWO.booking?.kendaraan?.nomorPolisi}

                        </span>

                      </div>

                    </div>

                  </div>

                  {/* Complaint */}
                  <div className="bg-[#0f1117] border border-[#1e2230] rounded-lg p-3.5 mb-4">

                    <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-widest mb-1.5">
                      Primary Complaint
                    </p>

                    <p className="text-[12px] text-[#e2e8f0] italic">

                      {selectedWO.booking?.Keluhan}

                    </p>

                  </div>

                  {/* Date */}
                  <div className="grid grid-cols-2 gap-4">

                    <div>

                      <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-widest mb-1">
                        Entry Date
                      </p>

                      <p className="text-[13px] font-semibold text-white">

                        {selectedWO.booking?.tanggalBooking}

                      </p>

                    </div>

                    <div>

                      <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-widest mb-1">
                        Estimasi
                      </p>

                      <p className="text-[13px] font-semibold text-orange-400">
                        {selectedWO.estimasiWaktu
                          ? `${selectedWO.estimasiWaktu} Menit`
                          : "-"
                        }
                      </p>

                    </div>
                    <p className="text-[28px] text-[#9ca3af] mt-2">
                      <span className="font-semibold text-[#d1d5db]">Mekanik:</span> {selectedWO?.mekanik?.nama ?? '-'}
                    </p>

                  </div>

                </div>

                {/* Booking Card */}
                <div className="flex items-center gap-3 p-3 bg-[#0f1117] border border-[#1e2230] rounded-xl mt-4">

                  <div className="w-8 h-8 rounded-full bg-[#1a1d28] border border-[#2a2f3e] flex items-center justify-center flex-shrink-0">

                    <User
                      size={14}
                      className="text-[#6b7280]"
                    />

                  </div>

                  <div className="flex-1 min-w-0">

                    <p className="text-[12px] font-bold text-white">

                      {selectedWO.booking?.user?.name}

                    </p>

                    <p className="text-[10px] text-[#4b5563]">

                      #{selectedWO.id}
                      {" • "}

                      {selectedWO.booking?.kendaraan?.merek}
                      {" "}

                      {selectedWO.booking?.kendaraan?.model}

                    </p>

                  </div>

                  <span className="text-[10px] font-bold text-orange-400">
                    {selectedWO.statusWO}
                  </span>

                </div>

              </div>

            </div>

          </div>

        )}
      </main>
    </div>
  );
}