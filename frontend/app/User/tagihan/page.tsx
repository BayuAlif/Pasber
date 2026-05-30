"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Bike,
  Banknote,
  Building2,
  QrCode,
  ShieldCheck,
  Info,
  ExternalLink,
  X,
} from "lucide-react";
import Sidebar from "@/app/components/sidebar/page";
import Script from "next/script";

declare global {
  interface Window {
    snap: {
      pay: (token: string) => void;
    };
  }
}

// ─── Helper ─────────────────────────────────────────────────────────────────
function fmt(n?: number) {
  return "Rp " + (n ?? 0).toLocaleString("id-ID");
}

// ─── Tipe Data ─────────────────────────────────────────────────────────────
interface Kendaraan {
  id: number;
  merek: string;
  model: string;
  nomorPolisi: string;
}

interface Booking {
  user: { name: string };
  kendaraan: Kendaraan;
}

interface WorkOrder {
  id: number;
  booking: Booking;
  tanggal_selesai?: string;
  created_at?: string;
  updated_at?: string;
}

interface NotaSummary {
  id: number;
  noNota: string;
  work_order_id: number;
  tanggal: string;
  totalHarga: number;
  status: "LUNAS" | "BELUM LUNAS";
  work_order: WorkOrder;
}

// Detail Nota (dari endpoint /api/nota/{id})
interface NotaDetail {
  nota: {
    id: number;
    totalHarga: number;
    status: string;
  };

  jasa: Array<{
    id: number;
    namaJasa: string;
    hargaJasa: number | string;
  }>;

  material: Array<{
    id: number;
    qty: number;

    material: {
      id: number;
      namaMaterial: string;
      harga: number | string;
    };
  }>;
}

// ─── Komponen Detail Pembayaran (Modal) ─────────────────────────────────────
function PaymentDetail({
  notaId,
  onBack,
  handlePayment,
}: {
  notaId: number;
  onBack: () => void;
  handlePayment: (notaId: number) => void;
}) {
  const [detail, setDetail] = useState<NotaDetail>({
    nota: {
      id: 0,
      totalHarga: 0,
      status: "",
    },
    jasa: [],
    material: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<"tunai" | "transfer" | "qris">("tunai");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8000/api/nota/${notaId}`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        const data = await res.json();

        console.log("DETAIL API", data);

        setDetail(data);
        console.log("DETAIL API", data);
        console.log("JASA", data.jasa);
        console.log("MATERIAL", data.material);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [notaId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-gray-400">Memuat detail nota...</div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-red-400">Gagal memuat detail nota.</div>
      </div>
    );
  }

  // Ambil array jasa dan material (sesuaikan dengan struktur backend)
  const jasaList = detail?.jasa || [];
  const materialList = detail?.material || [];

  const subtotalJasa = jasaList.reduce(
    (sum, j) => sum + Number(j.hargaJasa),
    0
  );

  const subtotalMaterial = materialList.reduce(
    (sum, m) => sum + Number(m.material?.harga || 0) * Number(m.qty),
    0
  );
  const total = Number(
    detail.nota?.totalHarga || 0
  );

  const methods = [
    { id: "tunai" as const, icon: Banknote, label: "Tunai (Cash)", sub: "BAYAR DI KASIR BENGKEL" },
    { id: "transfer" as const, icon: Building2, label: "Transfer Bank", sub: "BCA / MANDIRI / BNI" },
    { id: "qris" as const, icon: QrCode, label: "QRIS", sub: "GOPAY / OVO / KASIR BENGKEL" },
  ];


  return (
    <div className="grid gap-5 items-start" style={{ gridTemplateColumns: "1fr 280px" }}>
      {/* Nota Detail Card */}
      <div className="bg-[#13161e] border border-[#1e2230] rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-[#1e2230] flex justify-between items-start">
          <div>
            <div className="text-orange-500 text-xs font-bold tracking-widest mb-1">
              🧾 NOTA TAGIHAN
            </div>
            <div className="text-xs text-gray-500">
              ID Nota: {detail.nota?.id} • {detail.nota?.status}
            </div>
          </div>
          <span className="px-2.5 py-0.5 bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-bold rounded tracking-widest">
            {detail.nota?.status === "pending"
              ? "UNPAID"
              : "PAID"}
          </span>
        </div>

        {/* Jasa */}
        <div className="px-6 py-5 border-b border-[#1e2230]">
          <div className="text-orange-500 text-[10px] font-bold tracking-widest mb-3">NOTA JASA</div>
          {jasaList.map((j, idx) => (
            <div key={idx}>
              <div className="flex justify-between">
                <span>{j.namaJasa}</span>
                <span>{fmt(Number(j.hargaJasa))}</span>
              </div>
            </div>
          ))}
          <div className="flex justify-between text-sm font-bold text-slate-200 mt-3 pt-3 border-t border-[#1e2230]">
            <span>Subtotal Jasa</span>
            <span>{fmt(subtotalJasa)}</span>
          </div>
        </div>

        {/* Material */}
        <div className="px-6 py-5 border-b border-[#1e2230]">
          <div className="text-orange-500 text-[10px] font-bold tracking-widest mb-3">NOTA MATERIAL</div>
          {materialList.map((m, idx) => (
            <div key={idx}>
              <div className="flex justify-between">
                <span>
                  {m.material?.namaMaterial} ({m.qty}x)
                </span>
                <span>
                  {fmt(m.qty * Number(m.material?.harga || 0))}
                </span>
              </div>
            </div>
          ))}
          <div className="flex justify-between text-sm font-bold text-slate-200 mt-3 pt-3 border-t border-[#1e2230]">
            <span>Subtotal Material</span>
            <span>{fmt(subtotalMaterial)}</span>
          </div>
        </div>

        {/* Total */}
        <div className="px-6 py-5 bg-[#1a1d28]">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-slate-300">TOTAL</span>
            <span className="text-xl font-bold text-orange-500">{fmt(total)}</span>
          </div>
        </div>
      </div>

      {/* Metode Pembayaran */}
      <div className="flex flex-col gap-4">
        <div className="bg-[#13161e] border border-[#1e2230] rounded-xl p-5">
          <div className="text-[10px] text-gray-500 tracking-widest mb-3 font-bold">PILIH METODE BAYAR</div>
          <div className="flex flex-col gap-2">
            {methods.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMethod(m.id)}
                className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${selectedMethod === m.id
                  ? "border-orange-500/50 bg-[rgba(249,115,22,0.08)]"
                  : "border-[#2a2f3e] bg-[#1a1d28] hover:border-[#3a3f50]"
                  }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedMethod === m.id ? "bg-orange-500/15" : "bg-[#252836]"}`}>
                  <m.icon size={15} color={selectedMethod === m.id ? "#f97316" : "#6b7280"} />
                </div>
                <div>
                  <div className={`text-xs font-semibold ${selectedMethod === m.id ? "text-slate-200" : "text-gray-400"}`}>{m.label}</div>
                  <div className="text-[10px] text-gray-600 tracking-wide">{m.sub}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#13161e] border border-[#1e2230] rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="text-[10px] text-gray-500 tracking-widest font-bold">TOTAL TAGIHAN</div>
            <span className="text-lg font-bold text-orange-500">{fmt(total)}</span>
          </div>
          <button onClick={() => handlePayment(notaId)} className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 transition-colors text-white font-bold text-sm py-3 rounded-lg">
            <ShieldCheck size={15} />
            KONFIRMASI PEMBAYARAN
          </button>
          <div className="flex items-center gap-1.5 mt-3 justify-center">
            <Info size={11} color="#4b5563" />
            <span className="text-[10px] text-gray-600">PEMBAYARAN AKAN DIKONFIRMASI OLEH SA</span>
          </div>
        </div>

        <button onClick={onBack} className="text-xs text-gray-600 hover:text-gray-400 transition-colors text-center">
          ← Kembali ke daftar tagihan
        </button>
      </div>
    </div>
  );

  console.log("NOTA ID", notaId);
}

// ─── Halaman Utama ──────────────────────────────────────────────────────────
export default function TagihanPage() {
  const [tab, setTab] = useState<"belum" | "sudah">("belum");
  const [selectedNotaId, setSelectedNotaId] = useState<number | null>(null);
  const [unpaidList, setUnpaidList] = useState<NotaSummary[]>([]);
  const [paidList, setPaidList] = useState<NotaSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ name: string; fotoProfile?: string } | null>(null);

  // Bulk payment state
  const [checkedIds, setCheckedIds] = useState<number[]>([]);
  const [bulkMethod, setBulkMethod] = useState<"tunai" | "transfer" | "qris">("tunai");
  const [showBulkPanel, setShowBulkPanel] = useState(false);

  // Ambil data user & daftar nota
  useEffect(() => {
    const fetchUserAndNotas = async () => {
      try {
        const token = localStorage.getItem("token");
        const [userRes, workOrderRes] = await Promise.all([
          fetch("http://localhost:8000/api/user", {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }),

          fetch("http://localhost:8000/api/active-work-order", {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }),
        ]);

        const userData = await userRes.json();
        setUser(userData);

        const workOrderData = await workOrderRes.json();
        console.log(workOrderData);
        // Asumsikan response berbentuk { data: [...] }
        const invoices: NotaSummary[] = workOrderData
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((wo: any) => wo.nota)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((wo: any) => ({
            id: wo.nota.id,

            noNota: `NTA-${wo.nota.id
              .toString()
              .padStart(5, "0")}`,

            work_order_id: wo.id,

            tanggal: wo.nota.tanggal,

            totalHarga: Number(wo.nota.totalHarga),

            status:
              wo.nota.status === "paid"
                ? "LUNAS"
                : "BELUM LUNAS",

            work_order: wo,
          }));

        console.log("INVOICES", invoices);

        setUnpaidList(
          invoices.filter(
            (inv) => inv.status === "BELUM LUNAS"
          )
        );

        setPaidList(
          invoices.filter(
            (inv) => inv.status === "LUNAS"
          )

        );

        setUnpaidList(invoices.filter((inv) => inv.status === "BELUM LUNAS"));
        console.log(
          "UNPAID",
          invoices.filter(
            (inv) => inv.status === "BELUM LUNAS"
          )
        );
        setPaidList(invoices.filter((inv) => inv.status === "LUNAS"));
        console.log(
          "PAID",
          invoices.filter(
            (inv) => inv.status === "LUNAS"
          )
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndNotas();
  }, []);

  const handlePayment = async (notaId: number) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:8000/api/payment/create/${notaId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    const data = await res.json();

    console.log(data);

    window.snap.pay(data.snap_token);
  };

  // Bulk selection helpers
  const allChecked = checkedIds.length === unpaidList.length && unpaidList.length > 0;
  const toggleAll = () => {
    if (allChecked) setCheckedIds([]);
    else setCheckedIds(unpaidList.map((b) => b.id));
  };
  const toggleOne = (id: number) => {
    setCheckedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };
  const totalChecked = unpaidList
    .filter((b) => checkedIds.includes(b.id))
    .reduce((sum, b) => sum + b.totalHarga, 0);
  const checkedCount = checkedIds.length;

  const bulkMethods = [
    { id: "tunai" as const, icon: Banknote, label: "Tunai (Cash)", sub: "BAYAR DI KASIR BENGKEL" },
    { id: "transfer" as const, icon: Building2, label: "Transfer Bank", sub: "BCA / MANDIRI / BNI" },
    { id: "qris" as const, icon: QrCode, label: "QRIS", sub: "GOPAY / OVO / KASIR BENGKEL" },
  ];

  const handleBulkPay = () => {
    if (!showBulkPanel) {
      setShowBulkPanel(true);
    } else {
      alert(`Pembayaran ${checkedCount} tagihan via ${bulkMethods.find((m) => m.id === bulkMethod)?.label} berhasil dikonfirmasi!`);
      // Di sini nanti bisa panggil API untuk bulk payment
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#0f1117] text-slate-200">
        <Sidebar activeHref="/User/tagihan" user={user} />
        <main className="ml-[200px] flex-1 p-8 flex items-center justify-center">
          <div className="text-gray-400">Memuat data tagihan...</div>
        </main>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />
      <div className="flex min-h-screen bg-[#0f1117] text-slate-200">
        <Sidebar activeHref="/User/tagihan" user={user} />

        <main className="ml-[200px] flex-1 p-8 px-9">
          {/* Header */}
          <div className="flex justify-between items-start mb-7">
            <div>
              <h1 className="text-2xl font-bold m-0">
                Tagihan &amp; <span className="text-orange-500">Pembayaran</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1 mb-0">
                Lihat tagihan dan lakukan pembayaran service kendaraan Anda dengan transparansi teknis penuh.
              </p>
            </div>
            <div className="relative w-9 h-9 bg-[#1e2230] rounded-lg flex items-center justify-center cursor-pointer border border-[#2a2f3e]">
              <Bell size={16} color="#9ca3af" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-[#0f1117]" />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-[#13161e] border border-[#1e2230] rounded-lg p-1 w-fit">
            <button
              onClick={() => {
                setTab("belum");
                setSelectedNotaId(null);
              }}
              className={`px-5 py-2 rounded-md text-sm font-semibold transition-all ${tab === "belum" ? "bg-orange-500 text-white" : "text-gray-500 hover:text-gray-300"
                }`}
            >
              Belum dibayar
            </button>
            <button
              onClick={() => {
                setTab("sudah");
                setSelectedNotaId(null);
              }}
              className={`px-5 py-2 rounded-md text-sm font-semibold transition-all ${tab === "sudah" ? "bg-[#1e2230] text-slate-200" : "text-gray-500 hover:text-gray-300"
                }`}
            >
              Sudah dibayar
            </button>
          </div>

          {/* ── Tab Belum Dibayar ── */}
          {tab === "belum" && !selectedNotaId && (
            <div className="flex flex-col gap-3">
              {/* Banner */}
              <div className="flex items-center gap-3 px-4 py-3 bg-[rgba(249,115,22,0.08)] border border-[rgba(249,115,22,0.25)] rounded-lg mb-1">
                <Info size={14} color="#f97316" className="flex-shrink-0" />
                <p className="text-sm text-gray-300 m-0">
                  Kamu memiliki{" "}
                  <span className="text-orange-500 font-bold">{unpaidList.length} tagihan aktif</span>{" "}
                  yang belum dibayar. Pilih satu atau beberapa tagihan untuk dibayar sekaligus.
                </p>
              </div>

              {/* Select all bar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#13161e] border border-[#1e2230] rounded-lg">
                <button onClick={toggleAll} className="flex items-center gap-2.5 cursor-pointer bg-transparent border-none p-0">
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${allChecked
                      ? "bg-orange-500 border-orange-500"
                      : checkedIds.length > 0
                        ? "border-orange-500 bg-transparent"
                        : "border-[#3a3f50] bg-transparent"
                      }`}
                  >
                    {allChecked && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    {!allChecked && checkedIds.length > 0 && <div className="w-2.5 h-0.5 bg-orange-500 rounded" />}
                  </div>
                  <span className="text-xs font-semibold text-gray-400">Pilih Semua</span>
                </button>
                {checkedCount > 0 && <span className="text-xs text-orange-500 font-semibold">{checkedCount} dipilih</span>}
              </div>

              {/* Daftar Tagihan */}
              {unpaidList.length === 0 ? (
                <div className="bg-[#13161e] border border-[#1e2230] rounded-xl py-12 text-center text-gray-500">
                  Tidak ada tagihan yang belum dibayar.
                </div>
              ) : (
                unpaidList.map((bill) => {
                  const isChecked = checkedIds.includes(bill.id);
                  const kendaraan = bill.work_order?.booking?.kendaraan;
                  const plat = kendaraan?.nomorPolisi || "-";
                  const namaKendaraan = kendaraan ? `${kendaraan.merek} ${kendaraan.model}` : "Kendaraan";
                  const woId = bill.work_order_id;
                  const tglSelesai =
                    bill.work_order?.updated_at
                      ? new Date(
                        bill.work_order.updated_at
                      ).toLocaleDateString("id-ID")
                      : bill.tanggal;
                  console.log("BILL", bill);
                  return (
                    <div
                      key={bill.id}
                      onClick={() => toggleOne(bill.id)}
                      className={`bg-[#13161e] border rounded-xl flex items-center gap-5 px-6 py-5 cursor-pointer transition-all ${isChecked ? "border-orange-500/50 bg-[rgba(249,115,22,0.04)]" : "border-[#1e2230] hover:border-[#2a2f3e]"
                        }`}
                    >
                      {/* Checkbox */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleOne(bill.id);
                        }}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${isChecked ? "bg-orange-500 border-orange-500" : "border-[#3a3f50] bg-transparent"
                          }`}
                      >
                        {isChecked && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>

                      <div
                        className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${isChecked
                          ? "bg-[rgba(249,115,22,0.2)] border border-orange-500/40"
                          : "bg-[rgba(249,115,22,0.1)] border border-[rgba(249,115,22,0.2)]"
                          }`}
                      >
                        <Bike size={20} color="#f97316" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white">{namaKendaraan}</div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-xs text-orange-500 font-medium">{plat}</span>
                          <span className="text-gray-600 text-xs">•</span>
                          <span className="text-xs text-gray-600">WO-{woId}</span>
                          <span className="text-gray-600 text-xs">•</span>
                          <span className="text-xs text-gray-600">SELESAI {tglSelesai}</span>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="text-[10px] text-gray-600 tracking-wide mb-1">TOTAL</div>
                        <div className={`text-base font-bold transition-colors ${isChecked ? "text-orange-400" : "text-orange-500"}`}>
                          {fmt(bill.totalHarga)}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNotaId(bill.id);
                        }}
                        className="flex-shrink-0 px-4 py-2 bg-transparent border border-[#2a2f3e] hover:border-[#3a3f50] text-gray-400 hover:text-gray-200 text-xs font-semibold rounded-lg transition-all"
                      >
                        DETAIL
                      </button>
                    </div>
                  );
                })
              )}

              {/* Bulk Payment Bar */}
              {checkedCount > 0 && (
                <div className="sticky bottom-0 mt-2 bg-[#13161e] border border-orange-500/30 rounded-xl overflow-hidden shadow-2xl shadow-black/40">
                  <div className="px-6 py-4 border-b border-[#1e2230]">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-[10px] text-gray-500 tracking-widest font-bold mb-0.5">BAYAR SEKALIGUS</div>
                        <div className="text-xs text-gray-400">
                          {checkedCount} tagihan dipilih •{" "}
                          <span className="text-orange-500 font-bold">{fmt(totalChecked)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowBulkPanel((v) => !v)}
                        className="text-[11px] text-gray-500 hover:text-gray-300 transition-colors underline underline-offset-2"
                      >
                        {showBulkPanel ? "Sembunyikan" : "Pilih Metode Bayar"}
                      </button>
                    </div>

                    {showBulkPanel && (
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {bulkMethods.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => setBulkMethod(m.id)}
                            className={`flex items-center gap-2.5 p-3 rounded-lg border text-left transition-all ${bulkMethod === m.id
                              ? "border-orange-500/50 bg-[rgba(249,115,22,0.08)]"
                              : "border-[#2a2f3e] bg-[#0f1117] hover:border-[#3a3f50]"
                              }`}
                          >
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${bulkMethod === m.id ? "bg-orange-500/15" : "bg-[#1a1d28]"
                                }`}
                            >
                              <m.icon size={14} color={bulkMethod === m.id ? "#f97316" : "#6b7280"} />
                            </div>
                            <div>
                              <div className={`text-[11px] font-semibold ${bulkMethod === m.id ? "text-slate-200" : "text-gray-400"}`}>
                                {m.label}
                              </div>
                              <div className="text-[9px] text-gray-600 tracking-wide leading-tight">{m.sub}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="px-6 py-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[10px] text-gray-600 tracking-widest">TOTAL PEMBAYARAN</div>
                      <div className="text-xl font-bold text-orange-500">{fmt(totalChecked)}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck size={12} color="#6b7280" />
                        <span className="text-[10px] text-gray-600">Transaksi aman &amp; terenkripsi</span>
                      </div>
                      <button
                        onClick={handleBulkPay}
                        className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 transition-colors text-white font-bold text-sm rounded-lg flex-shrink-0"
                      >
                        <ShieldCheck size={15} />
                        BAYAR SEKARANG →
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Tab Belum Dibayar: Detail Nota ── */}
          {tab === "belum" && selectedNotaId && (
            <PaymentDetail
              notaId={selectedNotaId}
              onBack={() => setSelectedNotaId(null)}
              handlePayment={handlePayment}
            />

          )}

          {/* ── Tab Sudah Dibayar ── */}
          {tab === "sudah" && (
            <div className="bg-[#13161e] border border-[#1e2230] rounded-xl overflow-hidden">
              <div
                className="grid px-6 py-3 border-b border-[#1e2230]"
                style={{ gridTemplateColumns: "1fr 1fr 1.4fr 1fr 1fr 1fr 0.8fr" }}
              >
                {["NO. NOTA", "WORK ORDER", "KENDARAAN", "TANGGAL", "METODE", "TOTAL", "AKSI"].map((h) => (
                  <div key={h} className="text-[10px] text-gray-600 font-bold tracking-widest">
                    {h}
                  </div>
                ))}
              </div>

              {paidList.length === 0 ? (
                <div className="py-12 text-center text-gray-500">Belum ada riwayat pembayaran.</div>
              ) : (
                paidList.map((bill, idx) => {
                  const kendaraan = bill.work_order?.booking?.kendaraan;
                  const namaKendaraan = kendaraan ? `${kendaraan.merek} ${kendaraan.model}` : "Kendaraan";
                  const plat =
                    kendaraan?.nomorPolisi || "-";
                  return (
                    <div
                      key={bill.id}
                      className={`grid px-6 py-4 items-center ${idx < paidList.length - 1 ? "border-b border-[#1e2230]" : ""}`}
                      style={{ gridTemplateColumns: "1fr 1fr 1.4fr 1fr 1fr 1fr 0.8fr" }}
                    >
                      <div className="text-sm font-semibold text-slate-200">{bill.noNota}</div>
                      <div className="text-xs text-gray-500">WO-{bill.work_order_id}</div>
                      <div>
                        <div className="text-sm font-medium text-slate-200">{namaKendaraan}</div>
                        <div className="text-xs text-gray-600">{plat}</div>
                      </div>
                      <div className="text-xs text-gray-400">{bill.tanggal}</div>
                      <div>
                        <span className="px-2.5 py-1 rounded text-[10px] font-bold tracking-wide bg-green-500/10 text-green-400 border border-green-500/20">
                          Lunas
                        </span>
                      </div>
                      <div className="text-sm font-bold text-slate-200">{fmt(bill.totalHarga)}</div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedNotaId(bill.id)}
                          className="flex items-center gap-0.5 text-[11px] text-gray-500 hover:text-gray-300 transition-colors"
                        >
                          <ExternalLink size={12} />
                          Detail
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 pt-5 border-t border-[#1e2230] flex justify-between items-center">
            <div className="text-[10px] text-gray-700 tracking-wide">
              © 2024 PASBER AUTOMOTIVE ENGINEERING | CUSTOMER PORTAL
            </div>
            <div className="flex gap-6">
              {["PANDUAN BANTUAN", "KEBIJAKAN PRIVASI", "SYARAT & KETENTUAN"].map((f) => (
                <span key={f} className="text-[10px] text-gray-700 hover:text-gray-500 cursor-pointer tracking-wide">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}