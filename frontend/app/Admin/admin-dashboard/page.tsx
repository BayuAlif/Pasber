'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Search, Car, Wrench, Box, CheckCircle2,
  AlertTriangle, ThumbsUp, ThumbsDown,
} from 'lucide-react';
import AuthPopup from '../../components/auth_popup/Auth_popup';
import SidebarAdmin from '../../components/sidebar-admin/page';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
 
type BookingApiItem = {
  id: number;
  status: string;
  Keluhan?: string;
  jadwalService?: string;
  user?: { name?: string };
  kendaraan?: { merek?: string; model?: string; nomorPolisi?: string };
  bengkel?: { nama?: string };
};

type WorkOrderApiItem = {
  id: number;
  kodeWO?: string;
  statusWO?: string;
  estimasiWaktu?: number | string | null;
  booking?: {
    id?: number;
    Keluhan?: string;
    jadwalService?: string;
    user?: { name?: string };
    kendaraan?: { merek?: string; model?: string; nomorPolisi?: string };
    bengkel?: { nama?: string };
  };
  mekanik?: { nama?: string };
};

type MaterialApiItem = {
  id: number;
  kodeMaterial?: string;
  namaMaterial?: string;
  merekMaterial?: string;
  harga?: number | string;
  stok?: number | string;
  satuan?: string;
};

function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  return {
    Authorization: token ? `Bearer ${token}` : '',
    Accept: 'application/json',
  } as HeadersInit;
}

function normalizeStatus(status?: string) {
  return (status || 'pending').toLowerCase();
}

function getProgressPercent(status?: string) {
  switch (normalizeStatus(status)) {
    case 'approved':
      return 35;
    case 'running':
      return 65;
    case 'qc':
      return 80;
    case 'done':
      return 100;
    case 'paid':
      return 100;
    default:
      return 18;
  }
}

function getStockLabel(stok: number) {
  if (stok <= 0) return { label: 'HABIS', color: 'text-red-500 bg-red-500/10', dot: 'bg-red-500' };
  if (stok < 5) return { label: `MENIPIS (${stok} Unit)`, color: 'text-yellow-500 bg-yellow-500/10', dot: 'bg-yellow-500' };
  return { label: `AMAN (${stok} Unit)`, color: 'text-green-500 bg-green-500/10', dot: 'bg-green-500' };
}

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<BookingApiItem[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrderApiItem[]>([]);
  const [materials, setMaterials] = useState<MaterialApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [popup, setPopup] = useState({ open: false, type: 'success' as 'success' | 'error', title: '', message: '' });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const [bookingResponse, workOrderResponse, materialResponse] = await Promise.all([
        fetch(`${API_BASE}/kelola-booking`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE}/work-order-adm`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE}/material`, { headers: getAuthHeaders() }),
      ]);

      if (!bookingResponse.ok || !workOrderResponse.ok || !materialResponse.ok) {
        throw new Error('Gagal mengambil data dashboard dari API');
      }

      const bookingData = await bookingResponse.json();
      const workOrderData = await workOrderResponse.json();
      const materialData = await materialResponse.json();

      setBookings(Array.isArray(bookingData.data) ? bookingData.data : []);
      setWorkOrders(Array.isArray(workOrderData.data) ? workOrderData.data : []);
      setMaterials(Array.isArray(materialData) ? materialData : []);
    } catch (err) {
      // console.error(err);
      setError('Gagal memuat data dari server. Pastikan Anda login sebagai admin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleBookingStatus = async (bookingId: number, status: 'approved' | 'rejected') => {
    try {
      setError('');
      const response = await fetch(`${API_BASE}/kelola-booking/${bookingId}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Gagal memperbarui status booking');
      }

      await fetchDashboardData();
      setPopup({
        open: true,
        type: 'success',
        title: status === 'approved' ? 'Booking Disetujui' : 'Booking Ditolak',
        message: status === 'approved'
          ? 'Booking berhasil disetujui dan siap dilanjutkan ke proses berikutnya.'
          : 'Booking berhasil ditolak. Status pelanggan telah diperbarui.',
      });
    } catch (err) {
      // console.error(err);
      setError('Gagal memperbarui status booking. Silakan coba lagi.');
      setPopup({
        open: true,
        type: 'error',
        title: 'Gagal Memproses Booking',
        message: 'Status booking tidak bisa diperbarui. Silakan cek koneksi atau token admin Anda.',
      });
    }
  };

  const stats = useMemo(() => {
    const unitMasuk = bookings.length;
    const prosesPengerjaan = workOrders.filter((wo) => ['approved', 'running', 'qc', 'done'].includes(normalizeStatus(wo.statusWO))).length;
    const menungguKomponen = materials.filter((item) => Number(item.stok || 0) < 5).length;
    const selesaiSiapAmbil = workOrders.filter((wo) => ['done', 'paid'].includes(normalizeStatus(wo.statusWO))).length;

    return [
      { label: 'Unit Masuk', value: String(unitMasuk), icon: Car, color: 'text-blue-400', border: 'border-l-blue-500' },
      { label: 'Proses Pengerjaan', value: String(prosesPengerjaan), icon: Wrench, color: 'text-orange-400', border: 'border-l-orange-500' },
      { label: 'Menunggu Komponen', value: String(menungguKomponen), icon: Box, color: 'text-yellow-400', border: 'border-l-yellow-500' },
      { label: 'Selesai & Siap Ambil', value: String(selesaiSiapAmbil), icon: CheckCircle2, color: 'text-green-400', border: 'border-l-green-500' },
    ];
  }, [bookings, workOrders, materials]);

  const activeWorkOrder = useMemo(() => {
    return workOrders.find((wo) => !['paid'].includes(normalizeStatus(wo.statusWO))) || workOrders[0] || null;
  }, [workOrders]);

  const pendingBookings = useMemo(() => bookings.filter((item) => normalizeStatus(item.status) === 'pending'), [bookings]);
  const queueItems = useMemo(() => bookings.slice(0, 3), [bookings]);
  const lowStockMaterials = useMemo(() => [...materials].sort((a, b) => Number(a.stok || 0) - Number(b.stok || 0)).slice(0, 3), [materials]);

  const liveProgress = getProgressPercent(activeWorkOrder?.statusWO);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f1117] text-[#e2e8f0]" style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

      {/* ── SIDEBAR ── */}
      <SidebarAdmin />

      {/* ── MAIN ── */}
      <main className="flex-1 overflow-y-auto h-screen">

        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#0f1117]/95 backdrop-blur border-b border-[#1e2230] px-8 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-[18px] font-bold text-white leading-none">Sistem Kontrol Bengkel</h2>
            <p className="text-[11px] text-[#4b5563] mt-1">Ringkasan operasional dan telemetri kendaraan untuk hari ini</p>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" size={13} />
              <input
                type="text" placeholder="ID Servis / Plat Nomor"
                className="bg-[#13161e] border border-[#1e2230] rounded-lg py-2 pl-9 pr-4 text-[12px] outline-none focus:border-orange-500/50 w-56 placeholder:text-[#374151] text-[#e2e8f0]"
              />
            </div>
          </div>
        </div>

        <div className="px-8 py-6 space-y-3.5">

          {/* Stat cards */}
          {error ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[12px] text-red-200">{error}</div>
          ) : null}
          <div className="grid grid-cols-4 gap-3.5">
            {stats.map(({ label, value, icon: Icon, color, border }) => (
              <div key={label} className={`bg-[#13161e] border border-[#1e2230] border-l-2 ${border} rounded-xl px-5 py-4 flex items-center justify-between`}>
                <div>
                  <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest mb-1">{label}</p>
                  <p className="text-[28px] font-black text-white leading-none">{value}</p>
                </div>
                <Icon size={22} className={`${color} opacity-60`} />
              </div>
            ))}
          </div>

          {/* Middle row: Live Telemetry + Antrean */}
          <div className="grid gap-3.5" style={{ gridTemplateColumns: '3fr' }}>


            {/* Antrean Servis */}
            <div className="bg-[#13161e] border border-[#1e2230] rounded-xl flex flex-col">
              <div className="px-5 py-4 border-b border-[#1e2230] flex justify-between items-center">
                <h3 className="text-[13px] font-bold text-white">Antrean Servis</h3>
                <span className="text-[10px] text-[#4b5563] font-bold">UNIT: {queueItems.length}</span>
              </div>
              <div className="flex-1 p-2 space-y-0.5">
                {queueItems.length ? queueItems.map((booking) => {
                  const status = normalizeStatus(booking.status);
                  const done = ['done', 'paid'].includes(status);
                  const title = `${booking.kendaraan?.merek || ''} ${booking.kendaraan?.model || ''}`.trim() || `Booking #${booking.id}`;
                  return (
                    <div key={booking.id} className="p-3.5 hover:bg-[#1a1d28] rounded-lg transition-all cursor-pointer group">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-[12px] font-bold text-white group-hover:text-orange-400 transition-colors">{title}</p>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold ${done ? 'bg-green-500/10 text-green-500' : 'bg-[#1a1d28] text-[#4b5563]'}`}>
                          {done ? 'SIAP AMBIL' : status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#4b5563] font-mono tracking-wide">{booking.kendaraan?.nomorPolisi || '-'}</p>
                      {booking.jadwalService && <p className="text-[9px] text-[#374151] mt-1">Estimasi mulai: {new Date(booking.jadwalService).toLocaleDateString('id-ID')} WIB</p>}
                      {done && <p className="text-[9px] text-green-500 font-bold mt-1 flex items-center gap-1"><CheckCircle2 size={9} /> Pengecekan Akhir Selesai</p>}
                    </div>
                  );
                }) : <p className="px-3 py-4 text-[11px] text-[#9ca3af]">Belum ada data antrian.</p>}
              </div>
              <button className="px-5 py-3.5 text-[10px] font-bold text-[#4b5563] hover:text-white transition-all text-center border-t border-[#1e2230] uppercase tracking-widest">
                Lihat Semua Antrean
              </button>
            </div>
          </div>

          {/* Bottom row: Alert Stok + Booking Approval */}
          <div className="grid gap-3.5" style={{ gridTemplateColumns: '2fr 1fr' }}>

            {/* Alert Stok Komponen */}
            <div className="bg-[#13161e] border border-[#1e2230] rounded-xl">
              <div className="px-5 py-4 border-b border-[#1e2230] flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} color="#f97316" />
                  <h3 className="text-[13px] font-bold text-white">Alert Stok Komponen</h3>
                </div>
                <button className="text-[10px] text-[#4b5563] hover:text-white transition-colors">Lihat Semua</button>
              </div>
              <div className="divide-y divide-[#1e2230]">
                {lowStockMaterials.length ? lowStockMaterials.map((item) => {
                  const stock = getStockLabel(Number(item.stok || 0));
                  return (
                    <div key={item.id} className="flex items-center justify-between px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${stock.dot}`} />
                        <div>
                          <p className="text-[12px] font-semibold text-white">{item.namaMaterial || 'Material'}</p>
                          <p className="text-[10px] text-[#4b5563] font-mono">KODE: {item.kodeMaterial || '-'}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${stock.color}`}>{stock.label}</span>
                    </div>
                  );
                }) : <p className="px-5 py-4 text-[11px] text-[#9ca3af]">Stok komponen aman.</p>}
              </div>
            </div>

            {/* Booking Perlu Approval */}
            <div className="bg-[#13161e] border border-[#1e2230] rounded-xl flex flex-col">
              <div className="px-5 py-4 border-b border-[#1e2230]">
                <h3 className="text-[13px] font-bold text-white">Booking Perlu Approval</h3>
              </div>
              <div className="flex-1 divide-y divide-[#1e2230]">
                {pendingBookings.length ? pendingBookings.slice(0, 2).map((booking) => (
                  <div key={booking.id} className="px-5 py-4">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-[12px] font-bold text-white">{booking.user?.name || 'Customer'}</p>
                      <p className="text-[9px] text-[#4b5563]">{booking.jadwalService ? new Date(booking.jadwalService).toLocaleDateString('id-ID') : '-'}</p>
                    </div>
                    <p className="text-[10px] text-orange-500 font-semibold mb-3">{booking.Keluhan || 'Keluhan belum tercatat'}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleBookingStatus(booking.id, 'approved')}
                        className="flex items-center justify-center gap-1.5 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-lg text-[11px] font-bold text-green-500 transition-all"
                      >
                        <ThumbsUp size={11} /> Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBookingStatus(booking.id, 'rejected')}
                        className="flex items-center justify-center gap-1.5 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-[11px] font-bold text-red-500 transition-all"
                      >
                        <ThumbsDown size={11} /> Reject
                      </button>
                    </div>
                  </div>
                )) : <p className="px-5 py-4 text-[11px] text-[#9ca3af]">Tidak ada booking yang menunggu approval.</p>}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-2 pb-4 text-[9px] font-bold text-[#374151] uppercase tracking-[0.2em]">
            <p>© 2024 Pasber Automotive Engineering | Technical Mastery</p>
            <div className="flex gap-5">
              <span>System Status</span>
              <span>API Documentation</span>
              <span>Compliance</span>
            </div>
          </div>

        </div>
      </main>

      <AuthPopup
        open={popup.open}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        onClose={() => setPopup((prev) => ({ ...prev, open: false }))}
        onContinue={() => setPopup((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}
