"use client";

import React, { useEffect, useState } from "react";
import {
  Activity,
  CalendarPlus,
  Bell,
  Clock,
  CheckCircle2,
  Car,
  Bike,
  Plus,
  Trash2,
  X,
  Wrench,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Link from "next/link";
import Sidebar from "@/app/components/sidebar/page";

// ─── API URL ────────────────────────────────────────────────────────────────
const API_URL = "http://127.0.0.1:8000/api";

// ─── Types ─────────────────────────────────────────────────────────────────
type Vehicle = {
  id: string;
  type: "motor" | "mobil";
  brand: string;
  model: string;
  plate: string;
  year: string;
};

// ─── Service options ───────────────────────────────────────────────────────
const serviceOptions = [
  { id: "oli",    label: "Ganti Oli",      desc: "Penggantian oli mesin standar" },
  { id: "tuneup", label: "Tune Up",        desc: "Perawatan mesin menyeluruh" },
  { id: "ban",    label: "Ganti Ban",      desc: "Penggantian ban baru" },
  { id: "umum",   label: "Perbaikan Umum", desc: "Perbaikan komponen umum" },
];

const months = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember",
];

const sessions = [
  "08:00","09:00","10:00","11:00",
  "13:00","14:00","15:00","16:00",
];

const YEAR = 2026;

// ─── Main Component ────────────────────────────────────────────────────────
export default function BookingServicePage() {

  const [step, setStep] = useState(1);

  // vehicles
  const [vehicles, setVehicles]               = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState("oli");

  // modal
  const [showModal, setShowModal]   = useState(false);
  const [vehicleType, setVehicleType] = useState<"motor" | "mobil">("motor");
  const [vBrand, setVBrand]         = useState("");
  const [vModel, setVModel]         = useState("");
  const [vPlate, setVPlate]         = useState("");
  const [vYear,  setVYear]          = useState("");
  const [formError, setFormError]   = useState("");

  // schedule
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedDate,  setSelectedDate]  = useState(today.getDate());
  const [selectedTime,  setSelectedTime]  = useState("09:00");

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/kendaraan`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      const result = await response.json();
      console.log(result);
      const formattedVehicles: Vehicle[] = (result.data || []).map((v: {
        kendaraanID: number; merek: string; model: string;
        nomorPolisi: string; tahun: string; jenisKendaraan: "motor" | "mobil";
      }) => ({
        id:    v.kendaraanID.toString(),
        type:  v.jenisKendaraan,
        brand: v.merek,
        model: v.model,
        plate: v.nomorPolisi,
        year:  v.tahun,
      }));
      setVehicles(formattedVehicles);
    } catch (error) { console.error(error); }
  };

  // ─── Fetch Vehicles ─────────────────────────────────────────────────────
  useEffect(() => { fetchVehicles(); }, []);

  // ─── Helpers ────────────────────────────────────────────────────────────
  const getDays     = (m: number) => new Date(YEAR, m + 1, 0).getDate();
  const getFirstDay = (m: number) => { const d = new Date(YEAR, m, 1).getDay(); return d === 0 ? 6 : d - 1; };

  // ─── Modal ──────────────────────────────────────────────────────────────
  const openModal = () => {
    setVehicleType("motor");
    setVBrand(""); setVModel(""); setVPlate(""); setVYear("");
    setFormError("");
    setShowModal(true);
  };

  // ─── Save Vehicle ───────────────────────────────────────────────────────
  const saveVehicle = async () => {
    if (!vBrand.trim() || !vModel.trim() || !vPlate.trim()) {
      setFormError("Merek, model, dan nomor polisi wajib diisi.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/kendaraan`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, Accept: "application/json" },
        body: JSON.stringify({ nomorPolisi: vPlate, merek: vBrand, model: vModel, jenisKendaraan: vehicleType, tahun: vYear }),
      });
      const result = await response.json();
      console.log(result);
      if (!response.ok) { setFormError(result.message || "Gagal menyimpan kendaraan"); return; }
      const newVehicle: Vehicle = {
        id:    result.data.kendaraanID.toString(),
        type:  vehicleType,
        brand: result.data.merek,
        model: result.data.model,
        plate: result.data.nomorPolisi,
        year:  result.data.tahun,
      };
      setVehicles((prev) => [...prev, newVehicle]);
      setSelectedVehicleId(newVehicle.id);
      setShowModal(false);
    } catch (error) { console.error(error); }
  };

  // ─── Delete Vehicle ─────────────────────────────────────────────────────
  const deleteVehicle = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/kendaraan/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      if (selectedVehicleId === id) setSelectedVehicleId(null);
    } catch (error) { console.error(error); }
  };

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

  const handleBooking = async () => {
    try {
      const token = localStorage.getItem("token");
      const bookingDate  = new Date(YEAR, selectedMonth, selectedDate);
      const formattedDate =
        `${bookingDate.getFullYear()}-` +
        `${String(bookingDate.getMonth() + 1).padStart(2, "0")}-` +
        `${String(bookingDate.getDate()).padStart(2, "0")} ` +
        `${selectedTime}:00`;
      const response = await fetch(`${API_URL}/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, Accept: "application/json" },
        body: JSON.stringify({
          kendaraanID: selectedVehicleId,
          bengkel_id:  1,
          Keluhan:     serviceOptions.find((s) => s.id === selectedService)?.label || "",
          jadwalService: formattedDate,
        }),
      });
      const result = await response.json();
      console.log(result);
      alert("Booking berhasil dibuat!");
    } catch (error) { console.error(error); alert("Booking gagal"); }
  };

  // ─── render ─────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-[#0f1117] font-sans text-[#e2e8f0]" style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

      {/* ── SIDEBAR ── */}
      <Sidebar activeHref="/User/service" />

      {/* ── MAIN ── */}
      <main className="ml-[200px] flex-1 px-9 py-8">

        {/* Header */}
        <div className="flex justify-between items-start mb-7">
          <div>
            <h1 className="text-[26px] font-bold m-0">
              Booking <span className="text-[#f97316]">Service</span>
            </h1>
            <p className="text-[13px] text-[#6b7280] mt-1 mb-0">
              Selesaikan reservasi servis kendaraan Anda dengan mudah.
            </p>
          </div>
          <div className="w-9 h-9 bg-[#1e2230] rounded-lg flex items-center justify-center cursor-pointer border border-[#2a2f3e] relative">
            <Bell size={16} color="#9ca3af" />
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center mb-8 max-w-[520px]">
          {[{ n: "1", l: "Diagnosa" }, { n: "2", l: "Pilih Jadwal" }, { n: "3", l: "Konfirmasi" }].map((s, i) => (
            <React.Fragment key={s.n}>
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[13px] font-bold
                  ${step >= i + 1 ? "bg-[#f97316] text-white" : "bg-[#1a1d28] text-[#4b5563] border border-[#2a2f3e]"}`}>
                  {step > i + 1 ? <CheckCircle2 size={16} /> : s.n}
                </div>
                <span className={`text-[10px] font-bold tracking-[1px] uppercase
                  ${step === i + 1 ? "text-white" : "text-[#4b5563]"}`}>
                  {s.l}
                </span>
              </div>
              {i < 2 && (
                <div className={`flex-1 h-px mx-2.5 mb-[18px] ${step > i + 1 ? "bg-[#f97316]" : "bg-[#1e2230]"}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ── STEP 1: DIAGNOSA ── */}
        {step === 1 && (
          <div className="grid grid-cols-2 gap-4">

            {/* Pilih Kendaraan */}
            <div className="bg-[#13161e] border border-[#1e2230] rounded-xl p-6 flex flex-col">
              <div className="flex justify-between items-center mb-5">
                <div className="text-[10px] text-[#4b5563] tracking-[1.5px] font-bold">PILIH KENDARAAN</div>
                <button onClick={openModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[rgba(249,115,22,0.1)] border border-[rgba(249,115,22,0.25)] rounded-md text-[11px] font-bold text-[#f97316] cursor-pointer">
                  <Plus size={12} /> Tambah
                </button>
              </div>

              {vehicles.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-2.5 py-8 text-center">
                  <div className="p-4 bg-[#1a1d28] rounded-xl"><Car size={28} color="#374151" /></div>
                  <p className="text-[12px] font-bold text-[#4b5563] tracking-[1px] uppercase">Belum ada kendaraan</p>
                  <p className="text-[11px] text-[#374151]">Tambahkan kendaraan untuk melanjutkan</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {vehicles.map((v) => (
                    <div key={v.id} onClick={() => setSelectedVehicleId(v.id)}
                      className={`px-4 py-3.5 rounded-[10px] border-2 cursor-pointer flex justify-between items-center
                        ${selectedVehicleId === v.id ? "border-[#f97316] bg-[rgba(249,115,22,0.05)]" : "border-[#1e2230] bg-[#0f1117]"}`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${selectedVehicleId === v.id ? "bg-[#f97316] text-white" : "bg-[#1a1d28] text-[#4b5563]"}`}>
                          {v.type === "motor" ? <Bike size={16} /> : <Car size={16} />}
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-white uppercase m-0">
                            {v.brand} {v.model}{v.year ? ` (${v.year})` : ""}
                          </p>
                          <p className="text-[10px] text-[#4b5563] font-mono tracking-[1px] m-0">{v.plate}</p>
                        </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); deleteVehicle(v.id); }}
                        className="p-1.5 bg-transparent border-none cursor-pointer text-[#374151]">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pilih Layanan */}
            <div className="bg-[#13161e] border border-[#1e2230] rounded-xl p-6 flex flex-col">
              <div className="text-[10px] text-[#4b5563] tracking-[1.5px] font-bold mb-5">PILIH LAYANAN</div>
              <div className="flex flex-col gap-2.5 flex-1">
                {serviceOptions.map((s) => (
                  <div key={s.id} onClick={() => setSelectedService(s.id)}
                    className={`px-4 py-3.5 rounded-[10px] border-2 cursor-pointer flex items-center justify-between
                      ${selectedService === s.id ? "border-[#f97316] bg-[rgba(249,115,22,0.05)]" : "border-[#1e2230] bg-[#0f1117]"}`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${selectedService === s.id ? "bg-[#f97316]" : "bg-[#1a1d28]"}`}>
                        <Wrench size={15} color={selectedService === s.id ? "#fff" : "#4b5563"} />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-white m-0">{s.label}</p>
                        <p className="text-[11px] text-[#6b7280] mt-0.5 m-0">{s.desc}</p>
                      </div>
                    </div>
                    <div className={`w-2.5 h-2.5 rounded-full border-2
                      ${selectedService === s.id ? "bg-[#f97316] border-[#f97316]" : "bg-transparent border-[#2a2f3e]"}`} />
                  </div>
                ))}
              </div>

              <button
                onClick={() => { if (!selectedVehicleId) { alert("Pilih kendaraan terlebih dahulu"); return; } setStep(2); }}
                className="mt-5 w-full py-3 bg-[#f97316] border-none rounded-lg text-[12px] font-bold text-white cursor-pointer tracking-[1.5px] uppercase">
                Lanjut: Pilih Jadwal →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: JADWAL ── */}
        {step === 2 && (
          <div className="bg-[#13161e] border border-[#1e2230] rounded-xl p-7">
            {/* Month nav */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-[10px] text-[#4b5563] tracking-[1.5px] font-bold">PILIH TANGGAL</div>
              <div className="flex items-center gap-2">
                <button onClick={() => setSelectedMonth((m) => Math.max(0, m - 1))}
                  className="w-7 h-7 bg-[#1a1d28] border border-[#2a2f3e] rounded-md flex items-center justify-center cursor-pointer text-[#9ca3af]">
                  <ChevronLeft size={14} />
                </button>
                <span className="text-[13px] font-semibold text-[#e2e8f0] min-w-[120px] text-center">
                  {months[selectedMonth]} {YEAR}
                </span>
                <button onClick={() => setSelectedMonth((m) => Math.min(11, m + 1))}
                  className="w-7 h-7 bg-[#1a1d28] border border-[#2a2f3e] rounded-md flex items-center justify-center cursor-pointer text-[#9ca3af]">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1.5 mb-1.5">
              {["SN","SL","RB","KM","JM","SB","MN"].map((d) => (
                <div key={d} className="text-center text-[10px] font-bold text-[#4b5563] tracking-[1px] py-1">{d}</div>
              ))}
            </div>

            {/* Calendar */}
            <div className="grid grid-cols-7 gap-1.5 mb-7">
              {Array.from({ length: getFirstDay(selectedMonth) }).map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: getDays(selectedMonth) }).map((_, i) => {
                const d = i + 1;
                const isSel = selectedDate === d;
                return (
                  <button key={d} onClick={() => setSelectedDate(d)}
                    className={`py-2.5 rounded-lg border text-[13px] font-semibold cursor-pointer
                      ${isSel ? "border-[#f97316] bg-[#f97316] text-white" : "border-[#1e2230] bg-[#0f1117] text-[#6b7280]"}`}>
                    {d}
                  </button>
                );
              })}
            </div>

            {/* Time slots */}
            <div className="text-[10px] text-[#4b5563] tracking-[1.5px] font-bold mb-3.5">PILIH SESI</div>
            <div className="grid grid-cols-4 gap-2 mb-7">
              {sessions.map((t) => {
                const isSel = selectedTime === t;
                return (
                  <button key={t} onClick={() => setSelectedTime(t)}
                    className={`py-2.5 rounded-lg border text-[12px] font-semibold cursor-pointer flex items-center justify-center gap-1.5
                      ${isSel ? "border-[#f97316] bg-[rgba(249,115,22,0.1)] text-[#f97316]" : "border-[#1e2230] bg-[#0f1117] text-[#6b7280]"}`}>
                    <Clock size={12} /> {t}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)}
                className="flex-1 py-3 bg-[#1a1d28] border border-[#2a2f3e] rounded-lg text-[12px] font-bold text-[#6b7280] cursor-pointer tracking-[1px] uppercase">
                ← Kembali
              </button>
              <button onClick={() => setStep(3)}
                className="flex-[2] py-3 bg-[#f97316] border-none rounded-lg text-[12px] font-bold text-white cursor-pointer tracking-[1.5px] uppercase">
                Lanjut: Konfirmasi →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: KONFIRMASI ── */}
        {step === 3 && (
          <div className="grid gap-4 items-start" style={{ gridTemplateColumns: "1fr 360px" }}>

            {/* Left */}
            <div className="flex flex-col gap-3.5">
              <div className="bg-[#13161e] border border-[#1e2230] rounded-xl px-7 py-6">
                <p className="text-[10px] text-[#4b5563] tracking-[1.5px] font-bold uppercase mb-4">RINGKASAN BOOKING</p>

                {/* Kendaraan row */}
                <div className="flex items-center gap-4 pb-[18px] border-b border-[#1e2230] mb-[18px]">
                  <div className="w-12 h-12 rounded-[10px] bg-[rgba(249,115,22,0.1)] border border-[rgba(249,115,22,0.2)] flex items-center justify-center shrink-0">
                    {selectedVehicle?.type === "motor" ? <Bike size={22} color="#f97316" /> : <Car size={22} color="#f97316" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-[9px] text-[#4b5563] tracking-[1.2px] font-bold uppercase mb-1">Kendaraan</p>
                    <p className="text-[16px] font-bold text-white uppercase m-0">
                      {selectedVehicle?.brand} {selectedVehicle?.model}{selectedVehicle?.year ? ` (${selectedVehicle.year})` : ""}
                    </p>
                    <p className="text-[11px] text-[#4b5563] font-mono tracking-[2px] mt-0.5 m-0">{selectedVehicle?.plate}</p>
                  </div>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-3 gap-0">
                  {[
                    { label: "Jenis Layanan", value: serviceOptions.find((s) => s.id === selectedService)?.label ?? "-", accent: true },
                    { label: "Tanggal",       value: `${selectedDate} ${months[selectedMonth]} ${YEAR}` },
                    { label: "Sesi Waktu",    value: `${selectedTime} WIB` },
                  ].map((item, i) => (
                    <div key={item.label}
                      className={`py-3.5 ${i > 0 ? "pl-5 border-l border-[#1e2230]" : ""}`}>
                      <p className="text-[9px] text-[#4b5563] tracking-[1.2px] font-bold uppercase mb-1.5">{item.label}</p>
                      <p className={`text-[14px] font-bold m-0 ${item.accent ? "text-[#f97316]" : "text-[#e2e8f0]"}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="flex flex-col gap-3.5">
              {/* Checklist */}
              <div className="bg-[#13161e] border border-[#1e2230] rounded-xl px-6 py-[22px]">
                <p className="text-[10px] text-[#4b5563] tracking-[1.5px] font-bold uppercase mb-4">KONFIRMASI DATA</p>
                <div className="flex flex-col gap-3">
                  {["Kendaraan sudah sesuai","Jenis servis sudah benar","Tanggal & waktu sudah tepat","Siap hadir sesuai jadwal"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div className="w-[18px] h-[18px] rounded-[5px] bg-[rgba(249,115,22,0.12)] border border-[rgba(249,115,22,0.3)] flex items-center justify-center shrink-0">
                        <CheckCircle2 size={11} color="#f97316" />
                      </div>
                      <span className="text-[12px] text-[#9ca3af]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-[#13161e] border border-[#1e2230] rounded-xl px-6 py-[22px] flex flex-col gap-2.5">
                <button onClick={handleBooking}
                  className="w-full py-3.5 bg-[#f97316] border-none rounded-lg text-[12px] font-bold text-white cursor-pointer tracking-[1.5px] uppercase flex items-center justify-center gap-2">
                  <CheckCircle2 size={15} /> Konfirmasi Sekarang
                </button>
                <button onClick={() => setStep(2)}
                  className="w-full py-3 bg-transparent border border-[#2a2f3e] rounded-lg text-[12px] font-semibold text-[#6b7280] cursor-pointer tracking-[1px] uppercase">
                  ← Ganti Jadwal
                </button>
                <p className="text-[10px] text-[#374151] text-center m-0 leading-relaxed">
                  Dengan mengkonfirmasi, Anda menyetujui syarat & ketentuan servis PASBER.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── MODAL TAMBAH KENDARAAN ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#13161e] border border-[#1e2230] rounded-[14px] p-7 w-full max-w-[420px]">
            {/* Modal header */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-[13px] font-bold text-white tracking-[1px] uppercase">Tambah Kendaraan</span>
              <button onClick={() => setShowModal(false)} className="bg-transparent border-none cursor-pointer text-[#6b7280]">
                <X size={18} />
              </button>
            </div>

            {/* Type toggle */}
            <div className="grid grid-cols-2 gap-2 mb-5">
              {(["motor", "mobil"] as const).map((t) => (
                <button key={t} onClick={() => setVehicleType(t)}
                  className={`py-2.5 rounded-lg border text-[12px] font-bold cursor-pointer flex items-center justify-center gap-2 capitalize
                    ${vehicleType === t ? "border-[#f97316] bg-[rgba(249,115,22,0.08)] text-[#f97316]" : "border-[#2a2f3e] bg-[#0f1117] text-[#6b7280]"}`}>
                  {t === "motor" ? <Bike size={15} /> : <Car size={15} />} {t}
                </button>
              ))}
            </div>

            {/* Fields */}
            {[
              { label: "Merek *",      val: vBrand, set: setVBrand, ph: "Honda, Yamaha, Toyota..." },
              { label: "Model *",      val: vModel, set: setVModel, ph: "Beat, Vario, Avanza..." },
              { label: "No. Polisi *", val: vPlate, set: setVPlate, ph: "D 4621 XY" },
              { label: "Tahun",        val: vYear,  set: setVYear,  ph: "2022" },
            ].map((f) => (
              <div key={f.label} className="mb-3.5">
                <label className="text-[10px] text-[#4b5563] tracking-[1px] font-bold uppercase block mb-1.5">{f.label}</label>
                <input
                  value={f.val}
                  onChange={(e) => f.set(e.target.value)}
                  placeholder={f.ph}
                  className="w-full bg-[#0f1117] border border-[#2a2f3e] rounded-lg px-3 py-2.5 text-[13px] text-[#e2e8f0] outline-none placeholder:text-[#374151]"
                />
              </div>
            ))}

            {formError && <p className="text-[11px] text-[#f87171] mb-3">{formError}</p>}

            <div className="flex gap-2.5 mt-2">
              <button onClick={() => setShowModal(false)}
                className="flex-1 py-3 bg-transparent border border-[#2a2f3e] rounded-lg text-[12px] font-bold text-[#6b7280] cursor-pointer">
                Batal
              </button>
              <button onClick={saveVehicle}
                className="flex-[2] py-3 bg-[#f97316] border-none rounded-lg text-[12px] font-bold text-white cursor-pointer">
                Simpan Kendaraan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}