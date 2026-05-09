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
} from "lucide-react";
import Sidebar from "@/app/components/sidebar/page";

// ─── Data ───────────────────────────────────────────────────────────────────

const unpaidBills = [
  {
    id: "WO-2025-0042",
    vehicle: "HONDA VARIO 150",
    plate: "D 4821 XY",
    wo: "WO-2025-0042",
    selesai: "SELESAI 7 MEI 2025",
    services: "Tune Up Berkala • Busi • Filter • Oli",
    jasa: 110000,
    sparepart: 63000,
    material: 42000,
    total: 215000,
    nota: {
      jasa: [
        { name: "Tune Up Berkala", price: 75000 },
        { name: "Setel Karburator", price: 35000 },
      ],
      sparepart: [
        { name: "Busi NGK CR7HSA", qty: 1, price: 18000 },
        { name: "Filter Udara Honda", qty: 1, price: 45000 },
      ],
      material: [{ name: "Oli Mesin Shell 0.8L", qty: 1, price: 42000 }],
    },
  },
  {
    id: "WO-2025-0043",
    vehicle: "HONDA BEAT STREET",
    plate: "D 1234 AB",
    wo: "WO-2025-0043",
    selesai: "SELESAI 7 MEI 2025",
    services: "Ganti Oli • Filter Udara",
    jasa: 35000,
    sparepart: 28000,
    material: 22000,
    total: 85000,
    nota: {
      jasa: [{ name: "Ganti Oli", price: 35000 }],
      sparepart: [{ name: "Filter Udara", qty: 1, price: 28000 }],
      material: [{ name: "Oli Mesin Pertamina 0.8L", qty: 1, price: 22000 }],
    },
  },
  {
    id: "WO-2025-0044",
    vehicle: "YAMAHA NMAX 155",
    plate: "D 0198 ZZ",
    wo: "WO-2025-0044",
    selesai: "SELESAI 7 MEI 2025",
    services: "Ganti Ban Belakang • Rem",
    jasa: 60000,
    sparepart: 195000,
    material: 15000,
    total: 270000,
    nota: {
      jasa: [
        { name: "Ganti Ban Belakang", price: 45000 },
        { name: "Setel Rem", price: 15000 },
      ],
      sparepart: [{ name: "Ban IRC NR79", qty: 1, price: 195000 }],
      material: [{ name: "Cairan Rem", qty: 1, price: 15000 }],
    },
  },
];

const paidBills = [
  {
    nota: "NTA-2025-035",
    wo: "U O-2025-0035",
    vehicle: "Honda Beat Street",
    plate: "D 1234 AB",
    date: "12 Apr 2025",
    method: "tunai",
    total: 85000,
  },
  {
    nota: "NTA-2025-028",
    wo: "U O-2025-0028",
    vehicle: "Honda Vario 150",
    plate: "D 4821 XY",
    date: "20 Mar 2025",
    method: "qris",
    total: 175000,
  },
  {
    nota: "NTA-2025-021",
    wo: "U O-2025-0021",
    vehicle: "Honda Beat Street",
    plate: "D 1234 AB",
    date: "5 Feb 2025",
    method: "transfer",
    total: 220000,
  },
];

const methodLabel: Record<string, { label: string; color: string; bg: string }> = {
  tunai: { label: "Tunai", color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  qris: { label: "QRIS", color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
  transfer: { label: "Transfer", color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
};

function fmt(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

// ─── Payment Detail Sub-component ────────────────────────────────────────────

function PaymentDetail({
  bill,
  onBack,
}: {
  bill: (typeof unpaidBills)[0];
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<"tunai" | "transfer" | "qris">("tunai");

  const methods = [
    { id: "tunai" as const, icon: Banknote, label: "Tunai (Cash)", sub: "BAYAR DI KASIR BENGKEL" },
    { id: "transfer" as const, icon: Building2, label: "Transfer Bank", sub: "BCA / MANDIRI / BNI" },
    { id: "qris" as const, icon: QrCode, label: "QRIS", sub: "GOPAY / OVO / KASIR BENGKEL" },
  ];

  const subtotalJasa = bill.nota.jasa.reduce((a, b) => a + b.price, 0);
  const subtotalSparepart = bill.nota.sparepart.reduce((a, b) => a + b.price, 0);
  const subtotalMaterial = bill.nota.material.reduce((a, b) => a + b.price, 0);

  return (
    <div className="grid gap-5 items-start" style={{ gridTemplateColumns: "1fr 280px" }}>
      {/* Nota */}
      <div className="bg-[#13161e] border border-[#1e2230] rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-[#1e2230] flex justify-between items-start">
          <div>
            <div className="text-orange-500 text-xs font-bold tracking-widest mb-1">
              🧾 NOTA TAGIHAN
            </div>
            <div className="text-xs text-gray-500">
              {bill.wo} • {bill.vehicle}
            </div>
          </div>
          <span className="px-2.5 py-0.5 bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-bold rounded tracking-widest">
            UNPAID
          </span>
        </div>

        {/* Jasa */}
        <div className="px-6 py-5 border-b border-[#1e2230]">
          <div className="text-orange-500 text-[10px] font-bold tracking-widest mb-3">NOTA JASA</div>
          {bill.nota.jasa.map((j) => (
            <div key={j.name} className="flex justify-between text-sm text-gray-300 mb-2">
              <span>{j.name}</span>
              <span>{fmt(j.price)}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm font-bold text-slate-200 mt-3 pt-3 border-t border-[#1e2230]">
            <span>Subtotal Jasa</span>
            <span>{fmt(subtotalJasa)}</span>
          </div>
        </div>

        {/* Sparepart */}
        <div className="px-6 py-5 border-b border-[#1e2230]">
          <div className="text-orange-500 text-[10px] font-bold tracking-widest mb-3">NOTA SPAREPART</div>
          {bill.nota.sparepart.map((s) => (
            <div key={s.name} className="flex justify-between text-sm text-gray-300 mb-2">
              <span>{s.name}</span>
              <div className="flex items-center gap-6">
                <span className="text-gray-600">{s.qty}</span>
                <span>{fmt(s.price)}</span>
              </div>
            </div>
          ))}
          <div className="flex justify-between text-sm font-bold text-slate-200 mt-3 pt-3 border-t border-[#1e2230]">
            <span>Subtotal Sparepart</span>
            <span>{fmt(subtotalSparepart)}</span>
          </div>
        </div>

        {/* Material */}
        <div className="px-6 py-5 border-b border-[#1e2230]">
          <div className="text-orange-500 text-[10px] font-bold tracking-widest mb-3">NOTA MATERIAL</div>
          {bill.nota.material.map((m) => (
            <div key={m.name} className="flex justify-between text-sm text-gray-300 mb-2">
              <span>{m.name}</span>
              <div className="flex items-center gap-6">
                <span className="text-gray-600">{m.qty}</span>
                <span>{fmt(m.price)}</span>
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
            <span className="text-xl font-bold text-orange-500">{fmt(bill.total)}</span>
          </div>
        </div>
      </div>

      {/* Metode + Konfirmasi */}
      <div className="flex flex-col gap-4">
        <div className="bg-[#13161e] border border-[#1e2230] rounded-xl p-5">
          <div className="text-[10px] text-gray-500 tracking-widest mb-3 font-bold">
            PILIH METODE BAYAR
          </div>
          <div className="flex flex-col gap-2">
            {methods.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelected(m.id)}
                className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                  selected === m.id
                    ? "border-orange-500/50 bg-[rgba(249,115,22,0.08)]"
                    : "border-[#2a2f3e] bg-[#1a1d28] hover:border-[#3a3f50]"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    selected === m.id ? "bg-orange-500/15" : "bg-[#252836]"
                  }`}
                >
                  <m.icon
                    size={15}
                    color={selected === m.id ? "#f97316" : "#6b7280"}
                  />
                </div>
                <div>
                  <div className={`text-xs font-semibold ${selected === m.id ? "text-slate-200" : "text-gray-400"}`}>
                    {m.label}
                  </div>
                  <div className="text-[10px] text-gray-600 tracking-wide">{m.sub}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#13161e] border border-[#1e2230] rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="text-[10px] text-gray-500 tracking-widest font-bold">TOTAL TAGIHAN</div>
            <span className="text-lg font-bold text-orange-500">{fmt(bill.total)}</span>
          </div>
          <button className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 transition-colors text-white font-bold text-sm py-3 rounded-lg">
            <ShieldCheck size={15} />
            KONFIRMASI PEMBAYARAN
          </button>
          <div className="flex items-center gap-1.5 mt-3 justify-center">
            <Info size={11} color="#4b5563" />
            <span className="text-[10px] text-gray-600">PEMBAYARAN AKAN DIKONFIRMASI OLEH SA</span>
          </div>
        </div>

        <button
          onClick={onBack}
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors text-center"
        >
          ← Kembali ke daftar tagihan
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TagihanPage() {
  const [tab, setTab] = useState<"belum" | "sudah">("belum");
  const [selectedBill, setSelectedBill] = useState<(typeof unpaidBills)[0] | null>(null);
  const [user, setUser] = useState<{ name: string; fotoProfile?: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:8000/api/user", {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div
      className="flex min-h-screen bg-[#0f1117] text-slate-200"
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
    >
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
            onClick={() => { setTab("belum"); setSelectedBill(null); }}
            className={`px-5 py-2 rounded-md text-sm font-semibold transition-all ${
              tab === "belum" ? "bg-orange-500 text-white" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            Belum dibayar
          </button>
          <button
            onClick={() => { setTab("sudah"); setSelectedBill(null); }}
            className={`px-5 py-2 rounded-md text-sm font-semibold transition-all ${
              tab === "sudah" ? "bg-[#1e2230] text-slate-200" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            Sudah dibayar
          </button>
        </div>

        {/* ── Belum dibayar: list ── */}
        {tab === "belum" && !selectedBill && (
          <div className="flex flex-col gap-3">
            {/* Banner */}
            <div className="flex items-center gap-3 px-4 py-3 bg-[rgba(249,115,22,0.08)] border border-[rgba(249,115,22,0.25)] rounded-lg mb-1">
              <Info size={14} color="#f97316" className="flex-shrink-0" />
              <p className="text-sm text-gray-300 m-0">
                Kamu memiliki{" "}
                <span className="text-orange-500 font-bold">{unpaidBills.length} tagihan aktif</span>{" "}
                yang belum dibayar. Klik{" "}
                <span className="text-orange-500 font-semibold">Bayar Sekarang</span>{" "}
                untuk memproses masing-masing tagihan.
              </p>
            </div>

            {unpaidBills.map((bill) => (
              <div
                key={bill.id}
                className="bg-[#13161e] border border-[#1e2230] rounded-xl flex items-center gap-5 px-6 py-5"
              >
                <div className="w-11 h-11 rounded-lg bg-[rgba(249,115,22,0.1)] border border-[rgba(249,115,22,0.2)] flex items-center justify-center flex-shrink-0">
                  <Bike size={20} color="#f97316" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white">{bill.vehicle}</div>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-xs text-orange-500 font-medium">{bill.plate}</span>
                    <span className="text-gray-600 text-xs">•</span>
                    <span className="text-xs text-gray-600">{bill.wo}</span>
                    <span className="text-gray-600 text-xs">•</span>
                    <span className="text-xs text-gray-600">{bill.selesai}</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{bill.services}</div>
                </div>

                <div className="flex items-center gap-6 flex-shrink-0">
                  {[
                    { label: "JASA", value: bill.jasa },
                    { label: "SPAREPART", value: bill.sparepart },
                    { label: "MATERIAL", value: bill.material },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <div className="text-[10px] text-gray-600 tracking-wide mb-1">{item.label}</div>
                      <div className="text-xs font-semibold text-gray-400">{fmt(item.value)}</div>
                    </div>
                  ))}
                  <div className="text-center">
                    <div className="text-[10px] text-gray-600 tracking-wide mb-1">TOTAL</div>
                    <div className="text-base font-bold text-orange-500">{fmt(bill.total)}</div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedBill(bill)}
                  className="flex-shrink-0 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 transition-colors text-white text-sm font-bold rounded-lg"
                >
                  BAYAR
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── Belum dibayar: detail nota ── */}
        {tab === "belum" && selectedBill && (
          <PaymentDetail bill={selectedBill} onBack={() => setSelectedBill(null)} />
        )}

        {/* ── Sudah dibayar: tabel ── */}
        {tab === "sudah" && (
          <div className="bg-[#13161e] border border-[#1e2230] rounded-xl overflow-hidden">
            {/* Header row */}
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

            {paidBills.map((bill, i) => {
              const m = methodLabel[bill.method];
              return (
                <div
                  key={bill.nota}
                  className={`grid px-6 py-4 items-center ${
                    i < paidBills.length - 1 ? "border-b border-[#1e2230]" : ""
                  }`}
                  style={{ gridTemplateColumns: "1fr 1fr 1.4fr 1fr 1fr 1fr 0.8fr" }}
                >
                  <div className="text-sm font-semibold text-slate-200">{bill.nota}</div>
                  <div className="text-xs text-gray-500">{bill.wo}</div>
                  <div>
                    <div className="text-sm font-medium text-slate-200">{bill.vehicle}</div>
                    <div className="text-xs text-gray-600">{bill.plate}</div>
                  </div>
                  <div className="text-xs text-gray-400">{bill.date}</div>
                  <div>
                    <span
                      className="px-2.5 py-1 rounded text-[10px] font-bold tracking-wide"
                      style={{ color: m.color, background: m.bg }}
                    >
                      {m.label}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-200">{fmt(bill.total)}</div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-green-500/10 border border-green-500/25 text-green-400 text-[10px] font-bold rounded tracking-wide">
                      Lunas
                    </span>
                    <button className="flex items-center gap-0.5 text-[11px] text-gray-500 hover:text-gray-300 transition-colors">
                      <ExternalLink size={12} />
                      Detail
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-5 border-t border-[#1e2230] flex justify-between items-center">
          <div className="text-[10px] text-gray-700 tracking-wide">
            © 2024 PASBER AUTOMOTIVE ENGINEERING | CUSTOMER PORTAL
          </div>
          <div className="flex gap-6">
            {["PANDUAN BANTUAN", "KEBIJAKAN PRIVASI", "SYARAT & KETENTUAN"].map((f) => (
              <span
                key={f}
                className="text-[10px] text-gray-700 hover:text-gray-500 cursor-pointer tracking-wide"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </main>

      <style>{`
        * { box-sizing: border-box; }
        input::placeholder { color: #4b5563; }
      `}</style>
    </div>
  );
}