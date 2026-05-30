"use client";

import React, { useState, useEffect } from "react";
import {
  Bell, Search, ChevronDown, FileText, ChevronLeft, ChevronRight,
  Car, Bike, Wrench, CheckCircle2, Clock, AlertCircle, X,
  Activity, Receipt, History,
} from "lucide-react";
import Link from "next/link";
import Sidebar from "@/app/components/sidebar/page";

type ServiceRecordStatus =
  | "pending"
  | "approved"
  | "assigned"
  | "running"
  | "qc"
  | "done"
  | "paid";

type ServiceRecord = {
  wo: string;
  vehicle: string;
  plate: string;
  vehicleType: "motor" | "mobil";
  service: string;
  date: string;
  mechanic: string;
  total: string | null;
  status: ServiceRecordStatus;
};

type WorkOrderApiItem = {
  id: number;
  kodeWO?: string;
  statusWO?: string;
  booking?: {
    tanggalBooking?: string;
    Keluhan?: string;
    kendaraan?: {
      merek?: string;
      model?: string;
      nomorPolisi?: string;
      jenisKendaraan?: string;
    };
  };
  mekanik?: {
    nama?: string;
  };
  nota?: {
    totalHarga?: string | number;
  };
};

const STATUS_CONFIG: Record<ServiceRecordStatus, { label: string; bg: string; border: string; color: string; icon: any }> = {
  pending: { label: "PENDING", bg: "rgba(234,179,8,0.12)", border: "rgba(234,179,8,0.3)", color: "#f59e0b", icon: Clock },
  approved: { label: "APPROVED", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.25)", color: "#22c55e", icon: CheckCircle2 },
  assigned: { label: "ASSIGNED", bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.3)", color: "#f97316", icon: Activity },
  running: { label: "RUNNING", bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.3)", color: "#f97316", icon: Activity },
  qc: { label: "QC", bg: "rgba(168,85,247,0.12)", border: "rgba(168,85,247,0.3)", color: "#a855f7", icon: Activity },
  done: { label: "DONE", bg: "rgba(34,197,94,0.10)", border: "rgba(34,197,94,0.3)", color: "#22c55e", icon: CheckCircle2 },
  paid: { label: "PAID", bg: "rgba(34,197,94,0.10)", border: "rgba(34,197,94,0.3)", color: "#22c55e", icon: Receipt },
};

const normalizeWorkOrderStatus = (status?: string): ServiceRecordStatus => {
  const normalized = (status ?? "").toLowerCase();
  const allowed: ServiceRecordStatus[] = ["pending", "approved", "assigned", "running", "qc", "done", "paid"];
  return allowed.includes(normalized as ServiceRecordStatus)
    ? (normalized as ServiceRecordStatus)
    : "pending";
};

const normalizeVehicleType = (jenis?: string): "motor" | "mobil" => {
  const lower = (jenis ?? "").toLowerCase();
  return lower.includes("mobil") ? "mobil" : "motor";
};

const formatTotal = (value?: string | number | null) => {
  if (value == null || value === "") return null;
  const numeric = typeof value === "number" ? value : parseFloat(value);
  if (isNaN(numeric)) return String(value);
  return `Rp ${numeric.toLocaleString("id-ID")}`;
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function RiwayatServicePage() {
  const [search, setSearch] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("Semua Kendaraan");
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [detailRow, setDetailRow] = useState<ServiceRecord | null>(null);
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const PER_PAGE = 5;

  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:8000/api/work-order", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Gagal fetch work order");
        }

        const result = await response.json();
        const workOrders: WorkOrderApiItem[] = result.data ?? [];

        const normalized = workOrders.map((wo) => ({
          wo: wo.kodeWO || `WO-${String(wo.id).padStart(4, "0")}`,
          vehicle: `${wo.booking?.kendaraan?.merek ?? ""} ${wo.booking?.kendaraan?.model ?? ""}`.trim() || "-",
          plate: wo.booking?.kendaraan?.nomorPolisi ?? "-",
          vehicleType: normalizeVehicleType(wo.booking?.kendaraan?.jenisKendaraan),
          service: wo.booking?.Keluhan ?? "-",
          date: wo.booking?.tanggalBooking
            ? new Date(wo.booking.tanggalBooking).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })
            : "-",
          mechanic: wo.mekanik?.nama ?? "-",
          total: formatTotal(wo.nota?.totalHarga),
          status: normalizeWorkOrderStatus(wo.statusWO),
        }));

        setRecords(normalized);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkOrders();
  }, []);

  const uniqueVehicles = Array.from(new Set(records.map((r) => r.vehicle)));
  const filtered = records.filter(r => {
    const matchSearch = r.wo.toLowerCase().includes(search.toLowerCase()) ||
      r.vehicle.toLowerCase().includes(search.toLowerCase());
    const matchVehicle = vehicleFilter === "Semua Kendaraan" || r.vehicle === vehicleFilter;
    return matchSearch && matchVehicle;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="flex min-h-screen bg-[#0f1117] text-[#e2e8f0]" style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

      {/* ── SIDEBAR ── */}
      <Sidebar activeHref="/User/riwayat" />

      {/* ── MAIN ── */}
      <main className="ml-[200px] flex-1 px-9 py-8">

        {/* Header */}
        <div className="flex justify-between items-start mb-7">
          <div>
            <h1 className="text-[26px] font-bold m-0">
              Riwayat <span className="text-[#f97316]">Service</span>
            </h1>
            <p className="text-[13px] text-[#6b7280] mt-1 mb-0">
              Semua riwayat servis kendaraan Anda tersimpan di sini.
            </p>
          </div>
          <div className="w-9 h-9 bg-[#1e2230] rounded-lg flex items-center justify-center cursor-pointer border border-[#2a2f3e]">
            <Bell size={16} color="#9ca3af" />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2.5 mb-5">
          {/* Search */}
          <div className="relative flex-1 max-w-[340px]">
            <Search size={14} color="#4b5563" className="absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Cari riwayat..."
              className="w-full bg-[#1a1d28] border border-[#2a2f3e] rounded-lg py-2.5 pl-[34px] pr-3 text-[13px] text-[#9ca3af] outline-none placeholder:text-[#374151]"
            />
          </div>

          {/* Vehicle Filter */}
          <div className="relative">
            <button
              onClick={() => setVehicleOpen(prev => !prev)}
              className="flex items-center gap-2 bg-[#1a1d28] border border-[#2a2f3e] rounded-lg px-3.5 py-2.5 text-[13px] text-[#9ca3af] cursor-pointer"
            >
              {vehicleFilter} <ChevronDown size={13} />
            </button>
            {vehicleOpen && (
              <div className="absolute top-[calc(100%+6px)] left-0 bg-[#1e2230] border border-[#2a2f3e] rounded-lg min-w-[200px] z-20 overflow-hidden">
                {["Semua Kendaraan", ...uniqueVehicles].map(v => (
                  <button
                    key={v}
                    onClick={() => { setVehicleFilter(v); setVehicleOpen(false); setPage(1); }}
                    className={`block w-full px-3.5 py-2.5 text-left text-[13px] bg-transparent border-none cursor-pointer
              ${vehicleFilter === v ? "text-[#f97316]" : "text-[#9ca3af]"}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#13161e] border border-[#1e2230] rounded-xl overflow-hidden mb-4">
          {/* Table head */}
          <div className="grid px-5 py-3 border-b border-[#1e2230] bg-[#0f1117]"
            style={{ gridTemplateColumns: "140px 1fr 1fr 110px 1fr 110px 110px 48px" }}>
            {["NO. WO", "KENDARAAN", "JENIS SERVICE", "TANGGAL", "MEKANIK", "TOTAL", "STATUS", "AKSI"].map(h => (
              <div key={h} className="text-[10px] font-bold text-[#4b5563] tracking-[1.2px]">{h}</div>
            ))}
          </div>

          {/* Rows */}
          {paginated.length === 0 ? (
            <div className="py-12 px-5 text-center text-[#4b5563]">
              <History size={32} className="mx-auto mb-2.5 opacity-40" />
              <p className="text-[13px]">Tidak ada riwayat ditemukan.</p>
            </div>
          ) : paginated.map((row, i) => {
            const sc = STATUS_CONFIG[row.status];
            return (
              <div
                key={row.wo}
                className={`grid px-5 py-3.5 items-center ${i < paginated.length - 1 ? "border-b border-[#1a1d28]" : ""}`}
                style={{ gridTemplateColumns: "140px 1fr 1fr 110px 1fr 110px 110px 48px" }}
              >
                {/* WO */}
                <div className="text-[12px] font-bold text-[#9ca3af] font-mono tracking-[0.5px]">{row.wo}</div>

                {/* Kendaraan */}
                <div className="flex items-center gap-2.5">
                  <div className="w-[30px] h-[30px] rounded-[7px] bg-[#1a1d28] border border-[#2a2f3e] flex items-center justify-center shrink-0">
                    {row.vehicleType === "motor" ? <Bike size={14} color="#6b7280" /> : <Car size={14} color="#6b7280" />}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-[#e2e8f0] m-0">{row.vehicle}</p>
                    <p className="text-[10px] text-[#4b5563] font-mono tracking-[1px] m-0">{row.plate}</p>
                  </div>
                </div>

                {/* Service */}
                <div className="flex items-center gap-2">
                  <Wrench size={13} color="#4b5563" />
                  <span className="text-[13px] text-[#9ca3af]">{row.service}</span>
                </div>

                {/* Tanggal */}
                <div className="text-[12px] text-[#6b7280]">{row.date}</div>

                {/* Mekanik */}
                <div className="text-[13px] text-[#9ca3af]">{row.mechanic}</div>

                {/* Total */}
                <div className={`text-[13px] font-semibold ${row.total ? "text-[#e2e8f0]" : "text-[#374151]"}`}>
                  {row.total ?? "—"}
                </div>

                {/* Status badge */}
                <div>
                  <span
                    className="inline-flex items-center gap-[5px] px-2.5 py-1 rounded-full text-[10px] font-bold tracking-[0.8px] border"
                    style={{ background: sc.bg, borderColor: sc.border, color: sc.color }}
                  >
                    {row.status === "running" && (
                      <span className="w-[5px] h-[5px] rounded-full bg-[#f97316] inline-block animate-pulse" />
                    )}
                    {sc.label}
                  </span>
                </div>

                {/* Aksi */}
                <div>
                  <button
                    onClick={() => setDetailRow(row)}
                    className="w-[30px] h-[30px] rounded-[7px] bg-[#1a1d28] border border-[#2a2f3e] flex items-center justify-center cursor-pointer"
                  >
                    <FileText size={13} color="#6b7280" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center">
          <p className="text-[12px] text-[#4b5563]">
            Showing {filtered.length === 0 ? 0 : (page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} records
          </p>
          <div className="flex gap-1.5">
            {[
              { icon: <ChevronLeft size={13} />, action: () => setPage(p => Math.max(1, p - 1)), disabled: page === 1 },
              { icon: <ChevronRight size={13} />, action: () => setPage(p => Math.min(totalPages, p + 1)), disabled: page === totalPages },
            ].map((btn, i) => (
              <button
                key={i}
                onClick={btn.action}
                disabled={btn.disabled}
                className={`w-[30px] h-[30px] rounded-[7px] bg-[#1a1d28] border border-[#2a2f3e] flex items-center justify-center
                  ${btn.disabled ? "cursor-not-allowed text-[#2a2f3e]" : "cursor-pointer text-[#9ca3af]"}`}
              >
                {btn.icon}
              </button>
            ))}
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-[30px] h-[30px] rounded-[7px] border text-[12px] font-bold cursor-pointer
                  ${page === i + 1 ? "bg-[#f97316] border-[#f97316] text-white" : "bg-[#1a1d28] border-[#2a2f3e] text-[#6b7280]"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* ── DETAIL MODAL ── */}
      {detailRow && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setDetailRow(null)}
        >
          <div
            className="bg-[#13161e] border border-[#1e2230] rounded-[14px] p-7 w-full max-w-[440px]"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex justify-between items-start mb-[22px]">
              <div>
                <p className="text-[10px] text-[#4b5563] tracking-[1.5px] font-bold m-0 mb-1">DETAIL WORK ORDER</p>
                <p className="text-[18px] font-bold text-white m-0 font-mono">{detailRow.wo}</p>
              </div>
              <button onClick={() => setDetailRow(null)} className="bg-transparent border-none cursor-pointer text-[#6b7280] p-1">
                <X size={18} />
              </button>
            </div>

            {/* Status */}
            {(() => {
              const sc = STATUS_CONFIG[detailRow.status];
              return (
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-[5px] rounded-full text-[10px] font-bold tracking-[0.8px] border mb-5"
                  style={{ background: sc.bg, borderColor: sc.border, color: sc.color }}
                >
                  {detailRow.status === "running" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] inline-block animate-pulse" />
                  )}
                  {sc.label}
                </div>
              );
            })()}

            {/* Kendaraan */}
            <div className="bg-[#0f1117] border border-[#1e2230] rounded-[10px] px-[18px] py-4 mb-3 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-[9px] bg-[#1a1d28] border border-[#2a2f3e] flex items-center justify-center shrink-0">
                {detailRow.vehicleType === "motor" ? <Bike size={18} color="#f97316" /> : <Car size={18} color="#f97316" />}
              </div>
              <div>
                <p className="text-[15px] font-bold text-white m-0 mb-[3px] uppercase">{detailRow.vehicle}</p>
                <p className="text-[11px] text-[#4b5563] font-mono tracking-[2px] m-0">{detailRow.plate}</p>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-2.5 mb-5">
              {[
                { label: "Jenis Service", value: detailRow.service, icon: <Wrench size={13} color="#f97316" /> },
                { label: "Tanggal", value: detailRow.date, icon: <Clock size={13} color="#f97316" /> },
                { label: "Mekanik", value: detailRow.mechanic, icon: <Activity size={13} color="#f97316" /> },
                { label: "Total Biaya", value: detailRow.total ?? "—", icon: <Receipt size={13} color="#f97316" /> },
              ].map(item => (
                <div key={item.label} className="bg-[#0f1117] border border-[#1e2230] rounded-lg px-3.5 py-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    {item.icon}
                    <p className="text-[9px] text-[#4b5563] tracking-[1.2px] font-bold uppercase m-0">{item.label}</p>
                  </div>
                  <p className="text-[13px] font-semibold text-[#e2e8f0] m-0">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2.5">
              {detailRow.status === "running" && (
                <Link href="/User/pantau" className="flex-1 no-underline">
                  <button className="w-full py-[11px] bg-[rgba(249,115,22,0.1)] border border-[rgba(249,115,22,0.3)] rounded-lg text-[12px] font-bold text-[#f97316] cursor-pointer tracking-[1px]">
                    Pantau Service →
                  </button>
                </Link>
              )}
              <button
                onClick={() => setDetailRow(null)}
                className="flex-1 py-[11px] bg-[#1a1d28] border border-[#2a2f3e] rounded-lg text-[12px] font-bold text-[#6b7280] cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(1.3)} }
        input::placeholder { color:#374151; }
        * { box-sizing:border-box; }
      `}</style>
    </div>
  );
}