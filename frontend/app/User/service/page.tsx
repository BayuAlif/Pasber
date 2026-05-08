"use client";

import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Activity,
  CalendarPlus,
  History,
  Receipt,
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

// ─── Nav items ─────────────────────────────────────────────────────────────
const navItems = [
  { label: "Dashboard Saya", icon: LayoutDashboard, href: "/User/dashboard" },
  { label: "Pantau Service", icon: Activity, href: "/User/pantau" },
  {
    label: "Booking Service",
    icon: CalendarPlus,
    href: "/User/service",
    active: true,
  },
  { label: "Riwayat Service", icon: History, href: "/User/riwayat" },
  {
    label: "Tagihan & Pembayaran",
    icon: Receipt,
    href: "/User/tagihan",
  },
];

// ─── Service options ───────────────────────────────────────────────────────
const serviceOptions = [
  {
    id: "oli",
    label: "Ganti Oli",
    desc: "Penggantian oli mesin standar",
  },
  {
    id: "tuneup",
    label: "Tune Up",
    desc: "Perawatan mesin menyeluruh",
  },
  {
    id: "ban",
    label: "Ganti Ban",
    desc: "Penggantian ban baru",
  },
  {
    id: "umum",
    label: "Perbaikan Umum",
    desc: "Perbaikan komponen umum",
  },
];

const months = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const sessions = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];

const YEAR = 2026;

type User = {
  name: string;
  fotoProfile?: string;
};

// ─── Main Component ────────────────────────────────────────────────────────
export default function BookingServicePage() {

  const [user, setUser] = useState<User | null>(null);

  const [step, setStep] = useState(1);

  // vehicles
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [selectedVehicleId, setSelectedVehicleId] =
    useState<string | null>(null);

  const [selectedService, setSelectedService] =
    useState("oli");

  // modal
  const [showModal, setShowModal] = useState(false);

  const [vehicleType, setVehicleType] =
    useState<"motor" | "mobil">("motor");

  const [vBrand, setVBrand] = useState("");
  const [vModel, setVModel] = useState("");
  const [vPlate, setVPlate] = useState("");
  const [vYear, setVYear] = useState("");

  const [formError, setFormError] = useState("");

  // schedule
  const today = new Date();

  const [selectedMonth, setSelectedMonth] =
    useState(today.getMonth());

  const [selectedDate, setSelectedDate] =
    useState(today.getDate());

  const [selectedTime, setSelectedTime] =
    useState("09:00");



  const fetchVehicles = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/kendaraan`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const result = await response.json();
      console.log(result);

      const formattedVehicles: Vehicle[] =
        (result.data || []).map((v: {
          kendaraanID: number;
          merek: string;
          model: string;
          nomorPolisi: string;
          tahun: string;
          jenisKendaraan: "motor" | "mobil";
        }) => ({

          id: v.kendaraanID.toString(),

          type: v.jenisKendaraan,

          brand: v.merek,

          model: v.model,

          plate: v.nomorPolisi,

          year: v.tahun,
        }));

      setVehicles(formattedVehicles);

    } catch (error) {
      console.error(error);
    }
  };

  // ─── Fetch Vehicles ─────────────────────────────────────────────────────

  useEffect(() => {

    const loadVehicles = async () => {
      await fetchVehicles();
    };

    loadVehicles();

  }, []);

  // ─── Helpers ────────────────────────────────────────────────────────────

  const getDays = (m: number) =>
    new Date(YEAR, m + 1, 0).getDate();

  const getFirstDay = (m: number) => {
    const d = new Date(YEAR, m, 1).getDay();
    return d === 0 ? 6 : d - 1;
  };

  // ─── Modal ──────────────────────────────────────────────────────────────

  const openModal = () => {

    setVehicleType("motor");

    setVBrand("");
    setVModel("");
    setVPlate("");
    setVYear("");

    setFormError("");

    setShowModal(true);
  };

  // ─── Save Vehicle ───────────────────────────────────────────────────────

  const saveVehicle = async () => {

    if (
      !vBrand.trim() ||
      !vModel.trim() ||
      !vPlate.trim()
    ) {
      setFormError(
        "Merek, model, dan nomor polisi wajib diisi."
      );

      return;
    }

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/kendaraan`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },

          body: JSON.stringify({
            nomorPolisi: vPlate,
            merek: vBrand,
            model: vModel,
            jenisKendaraan: vehicleType,
            tahun: vYear,
          })
        }
      );

      const result = await response.json();

      console.log(result);

      if (!response.ok) {

        setFormError(
          result.message || "Gagal menyimpan kendaraan"
        );

        return;
      }

      const newVehicle: Vehicle = {

        id:
          result.data.kendaraanID.toString(),

        type: vehicleType,

        brand: result.data.merek,

        model: result.data.model,

        plate: result.data.nomorPolisi,

        year: result.data.tahun,
      };

      setVehicles((prev) => [...prev, newVehicle]);

      setSelectedVehicleId(newVehicle.id);

      setShowModal(false);

    } catch (error) {

      console.error(error);
    }
  };

  // ─── Delete Vehicle ─────────────────────────────────────────────────────

  const deleteVehicle = async (id: string) => {

    try {

      const token = localStorage.getItem("token");

      await fetch(`${API_URL}/kendaraan/${id}`, {

        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setVehicles((prev) =>
        prev.filter((v) => v.id !== id)
      );

      if (selectedVehicleId === id) {
        setSelectedVehicleId(null);
      }

    } catch (error) {

      console.error(error);
    }
  };

  const selectedVehicle = vehicles.find(
    (v) => v.id === selectedVehicleId
  );

  const handleBooking = async () => {

    try {

      const token = localStorage.getItem("token");

      const bookingDate = new Date(
        YEAR,
        selectedMonth,
        selectedDate
      );

      const formattedDate =
        `${bookingDate.getFullYear()}-` +
        `${String(bookingDate.getMonth() + 1).padStart(2, "0")}-` +
        `${String(bookingDate.getDate()).padStart(2, "0")} ` +
        `${selectedTime}:00`;

      const response = await fetch(
        `${API_URL}/booking`,
        {

          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },

          body: JSON.stringify({

            kendaraanID: selectedVehicleId,

            bengkel_id: 1,

            Keluhan:
              serviceOptions.find(
                (s) => s.id === selectedService
              )?.label || "",

            jadwalService: formattedDate,
          }),
        }
      );

      const result = await response.json();

      console.log(result);

      alert("Booking berhasil dibuat!");

    } catch (error) {

      console.error(error);

      alert("Booking gagal");
    }
  };

  useEffect(() => {

    const fetchUser = async () => {

      try {

        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://127.0.0.1:8000/api/user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const data = await response.json();

        setUser(data);

      } catch (error) {

        console.error(error);
      }
    };

    fetchUser();

  }, []);

  // ─── render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f1117", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: "#e2e8f0" }}>

      {/* ── SIDEBAR ── */}
      <aside style={{ width: 200, background: "#13161e", borderRight: "1px solid #1e2230", display: "flex", flexDirection: "column", padding: "24px 0", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 10 }}>
        <div style={{ padding: "0 20px 28px" }}>
          <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: 2, color: "#fff" }}>PASBER</div>
          <div style={{ fontSize: 9, letterSpacing: 3, color: "#4b5563", marginTop: 2 }}>CUSTOMER PORTAL</div>
        </div>

        <nav style={{ flex: 1 }}>
          {navItems.map(item => (
            <Link key={item.href} href={item.href} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", fontSize: 13, fontWeight: item.active ? 600 : 400, color: item.active ? "#f97316" : "#9ca3af", background: item.active ? "rgba(249,115,22,0.08)" : "transparent", borderLeft: item.active ? "3px solid #f97316" : "3px solid transparent", textDecoration: "none" }}>
              <item.icon size={15} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div
          style={{
            padding: "14px 20px",
            borderTop: "1px solid #1e2230",
            display: "flex",
            alignItems: "center",
            gap: 10
          }}
        >

          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              overflow: "hidden",
              flexShrink: 0,
              background: "#1e2230",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >

            {user?.fotoProfile ? (

              <img
                src={`http://127.0.0.1:8000/storage/${user.fotoProfile}`}
                alt="Profile"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

            ) : (

              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </span>

            )}

          </div>

          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#e2e8f0"
              }}
            >
              {user?.name || "User"}
            </div>

            <div
              style={{
                fontSize: 10,
                color: "#4b5563"
              }}
            >
              Pelanggan reseller
            </div>
          </div>
        </div>

        <div style={{ padding: "10px 20px 0", borderTop: "1px solid #1e2230" }}>
          <div style={{ fontSize: 9, color: "#374151", letterSpacing: 0.5 }}>© 2026 PASBER AUTOMOTIVE ENGINEERING | CUSTOMER PORTAL</div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ marginLeft: 200, flex: 1, padding: "32px 36px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Booking <span style={{ color: "#f97316" }}>Service</span></h1>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0" }}>Selesaikan reservasi servis kendaraan Anda dengan mudah.</p>
          </div>
          <div style={{ width: 36, height: 36, background: "#1e2230", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "1px solid #2a2f3e", position: "relative" }}>
            <Bell size={16} color="#9ca3af" />
          </div>
        </div>

        {/* Stepper */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 32, maxWidth: 520 }}>
          {[{ n: "1", l: "Diagnosa" }, { n: "2", l: "Pilih Jadwal" }, { n: "3", l: "Konfirmasi" }].map((s, i) => (
            <React.Fragment key={s.n}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, background: step > i + 1 ? "#f97316" : step === i + 1 ? "#f97316" : "#1a1d28", color: step >= i + 1 ? "#fff" : "#4b5563", border: step >= i + 1 ? "none" : "1px solid #2a2f3e" }}>
                  {step > i + 1 ? <CheckCircle2 size={16} /> : s.n}
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: step === i + 1 ? "#fff" : "#4b5563", textTransform: "uppercase" }}>{s.l}</span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: 1, background: step > i + 1 ? "#f97316" : "#1e2230", margin: "0 10px", marginBottom: 18 }} />}
            </React.Fragment>
          ))}
        </div>

        {/* ── STEP 1: DIAGNOSA ── */}
        {step === 1 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

            {/* Pilih Kendaraan */}
            <div style={{ background: "#13161e", border: "1px solid #1e2230", borderRadius: 12, padding: 24, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 10, color: "#4b5563", letterSpacing: 1.5, fontWeight: 700 }}>PILIH KENDARAAN</div>
                <button onClick={openModal} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.25)", borderRadius: 6, fontSize: 11, fontWeight: 700, color: "#f97316", cursor: "pointer" }}>
                  <Plus size={12} /> Tambah
                </button>
              </div>

              {vehicles.length === 0 ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: "32px 0", textAlign: "center" }}>
                  <div style={{ padding: 16, background: "#1a1d28", borderRadius: 12 }}><Car size={28} color="#374151" /></div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#4b5563", letterSpacing: 1, textTransform: "uppercase" }}>Belum ada kendaraan</p>
                  <p style={{ fontSize: 11, color: "#374151" }}>Tambahkan kendaraan untuk melanjutkan</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {vehicles.map(v => (
                    <div key={v.id} onClick={() => setSelectedVehicleId(v.id)} style={{ padding: "14px 16px", borderRadius: 10, border: `2px solid ${selectedVehicleId === v.id ? "#f97316" : "#1e2230"}`, background: selectedVehicleId === v.id ? "rgba(249,115,22,0.05)" : "#0f1117", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ padding: 8, borderRadius: 8, background: selectedVehicleId === v.id ? "#f97316" : "#1a1d28", color: selectedVehicleId === v.id ? "#fff" : "#4b5563" }}>
                          {v.type === "motor" ? <Bike size={16} /> : <Car size={16} />}
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", textTransform: "uppercase" }}>{v.brand} {v.model}{v.year ? ` (${v.year})` : ""}</p>
                          <p style={{ fontSize: 10, color: "#4b5563", fontFamily: "monospace", letterSpacing: 1 }}>{v.plate}</p>
                        </div>
                      </div>
                      <button onClick={e => { e.stopPropagation(); deleteVehicle(v.id) }} style={{ padding: 6, background: "transparent", border: "none", cursor: "pointer", color: "#374151" }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pilih Layanan */}
            <div style={{ background: "#13161e", border: "1px solid #1e2230", borderRadius: 12, padding: 24, display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 10, color: "#4b5563", letterSpacing: 1.5, fontWeight: 700, marginBottom: 20 }}>PILIH LAYANAN</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                {serviceOptions.map(s => (
                  <div key={s.id} onClick={() => setSelectedService(s.id)} style={{ padding: "14px 16px", borderRadius: 10, border: `2px solid ${selectedService === s.id ? "#f97316" : "#1e2230"}`, background: selectedService === s.id ? "rgba(249,115,22,0.05)" : "#0f1117", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ padding: 8, borderRadius: 8, background: selectedService === s.id ? "#f97316" : "#1a1d28" }}>
                        <Wrench size={15} color={selectedService === s.id ? "#fff" : "#4b5563"} />
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{s.label}</p>
                        <p style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{s.desc}</p>
                      </div>
                    </div>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: selectedService === s.id ? "#f97316" : "transparent", border: `2px solid ${selectedService === s.id ? "#f97316" : "#2a2f3e"}` }} />
                  </div>
                ))}
              </div>

              <button
                onClick={() => { if (!selectedVehicleId) { alert("Pilih kendaraan terlebih dahulu"); return; } setStep(2); }}
                style={{ marginTop: 20, width: "100%", padding: "12px", background: "#f97316", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer", letterSpacing: 1.5, textTransform: "uppercase" }}
              >
                Lanjut: Pilih Jadwal →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: JADWAL ── */}
        {step === 2 && (
          <div style={{ background: "#13161e", border: "1px solid #1e2230", borderRadius: 12, padding: 28 }}>
            {/* Month nav */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 10, color: "#4b5563", letterSpacing: 1.5, fontWeight: 700 }}>PILIH TANGGAL</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={() => setSelectedMonth(m => Math.max(0, m - 1))} style={{ width: 28, height: 28, background: "#1a1d28", border: "1px solid #2a2f3e", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#9ca3af" }}><ChevronLeft size={14} /></button>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", minWidth: 120, textAlign: "center" }}>{months[selectedMonth]} {YEAR}</span>
                <button onClick={() => setSelectedMonth(m => Math.min(11, m + 1))} style={{ width: 28, height: 28, background: "#1a1d28", border: "1px solid #2a2f3e", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#9ca3af" }}><ChevronRight size={14} /></button>
              </div>
            </div>

            {/* Day headers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6, marginBottom: 6 }}>
              {["SN", "SL", "RB", "KM", "JM", "SB", "MN"].map(d => (
                <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: "#4b5563", letterSpacing: 1, padding: "4px 0" }}>{d}</div>
              ))}
            </div>

            {/* Calendar */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6, marginBottom: 28 }}>
              {Array.from({ length: getFirstDay(selectedMonth) }).map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: getDays(selectedMonth) }).map((_, i) => {
                const d = i + 1;
                const isSelected = selectedDate === d;
                return (
                  <button key={d} onClick={() => setSelectedDate(d)} style={{ padding: "10px 0", borderRadius: 8, border: `1px solid ${isSelected ? "#f97316" : "#1e2230"}`, background: isSelected ? "#f97316" : "#0f1117", fontSize: 13, fontWeight: 600, color: isSelected ? "#fff" : "#6b7280", cursor: "pointer" }}>
                    {d}
                  </button>
                );
              })}
            </div>

            {/* Time slots */}
            <div style={{ fontSize: 10, color: "#4b5563", letterSpacing: 1.5, fontWeight: 700, marginBottom: 14 }}>PILIH SESI</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 28 }}>
              {sessions.map(t => {
                const isSel = selectedTime === t;
                return (
                  <button key={t} onClick={() => setSelectedTime(t)} style={{ padding: "10px 0", borderRadius: 8, border: `1px solid ${isSel ? "#f97316" : "#1e2230"}`, background: isSel ? "rgba(249,115,22,0.1)" : "#0f1117", fontSize: 12, fontWeight: 600, color: isSel ? "#f97316" : "#6b7280", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <Clock size={12} /> {t}
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, padding: "12px", background: "#1a1d28", border: "1px solid #2a2f3e", borderRadius: 8, fontSize: 12, fontWeight: 700, color: "#6b7280", cursor: "pointer", letterSpacing: 1, textTransform: "uppercase" }}>← Kembali</button>
              <button onClick={() => setStep(3)} style={{ flex: 2, padding: "12px", background: "#f97316", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer", letterSpacing: 1.5, textTransform: "uppercase" }}>Lanjut: Konfirmasi →</button>
            </div>
          </div>
        )}

        {/* ── STEP 3: KONFIRMASI ── */}
        {step === 3 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16, alignItems: "start" }}>

            {/* Left — detail ringkasan */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Header card */}
              <div style={{ background: "#13161e", border: "1px solid #1e2230", borderRadius: 12, padding: "24px 28px" }}>
                <p style={{ fontSize: 10, color: "#4b5563", letterSpacing: 1.5, fontWeight: 700, textTransform: "uppercase", marginBottom: 16 }}>RINGKASAN BOOKING</p>

                {/* Kendaraan row */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 18, borderBottom: "1px solid #1e2230", marginBottom: 18 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 10, background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {selectedVehicle?.type === "motor" ? <Bike size={22} color="#f97316" /> : <Car size={22} color="#f97316" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 9, color: "#4b5563", letterSpacing: 1.2, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Kendaraan</p>
                    <p style={{ fontSize: 16, fontWeight: 700, color: "#fff", textTransform: "uppercase", margin: 0 }}>{selectedVehicle?.brand} {selectedVehicle?.model}{selectedVehicle?.year ? ` (${selectedVehicle.year})` : ""}</p>
                    <p style={{ fontSize: 11, color: "#4b5563", fontFamily: "monospace", letterSpacing: 2, marginTop: 3 }}>{selectedVehicle?.plate}</p>
                  </div>
                </div>

                {/* Info grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0 }}>
                  {[
                    { label: "Jenis Layanan", value: serviceOptions.find(s => s.id === selectedService)?.label ?? "-", accent: true },
                    { label: "Tanggal", value: `${selectedDate} ${months[selectedMonth]} ${YEAR}` },
                    { label: "Sesi Waktu", value: `${selectedTime} WIB` },
                  ].map((item, i) => (
                    <div key={item.label} style={{ padding: "14px 0", paddingLeft: i > 0 ? 20 : 0, borderLeft: i > 0 ? "1px solid #1e2230" : "none" }}>
                      <p style={{ fontSize: 9, color: "#4b5563", letterSpacing: 1.2, fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>{item.label}</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: item.accent ? "#f97316" : "#e2e8f0", margin: 0 }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>


            </div>

            {/* Right — action panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Checklist */}
              <div style={{ background: "#13161e", border: "1px solid #1e2230", borderRadius: 12, padding: "22px 24px" }}>
                <p style={{ fontSize: 10, color: "#4b5563", letterSpacing: 1.5, fontWeight: 700, textTransform: "uppercase", marginBottom: 16 }}>KONFIRMASI DATA</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    "Kendaraan sudah sesuai",
                    "Jenis servis sudah benar",
                    "Tanggal & waktu sudah tepat",
                    "Siap hadir sesuai jadwal",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 18, height: 18, borderRadius: 5, background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <CheckCircle2 size={11} color="#f97316" />
                      </div>
                      <span style={{ fontSize: 12, color: "#9ca3af" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div style={{ background: "#13161e", border: "1px solid #1e2230", borderRadius: 12, padding: "22px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
                <button onClick={handleBooking}
                  style={{ width: "100%", padding: "13px", background: "#f97316", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer", letterSpacing: 1.5, textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                >
                  <CheckCircle2 size={15} /> Konfirmasi Sekarang
                </button>
                <button
                  onClick={() => setStep(2)}
                  style={{ width: "100%", padding: "11px", background: "transparent", border: "1px solid #2a2f3e", borderRadius: 8, fontSize: 12, fontWeight: 600, color: "#6b7280", cursor: "pointer", letterSpacing: 1, textTransform: "uppercase" }}
                >
                  ← Ganti Jadwal
                </button>
                <p style={{ fontSize: 10, color: "#374151", textAlign: "center", margin: 0, lineHeight: 1.5 }}>
                  Dengan mengkonfirmasi, Anda menyetujui syarat & ketentuan servis PASBER.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── MODAL TAMBAH KENDARAAN ── */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: "#13161e", border: "1px solid #1e2230", borderRadius: 14, padding: 28, width: "100%", maxWidth: 420 }}>
            {/* Modal header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: 1, textTransform: "uppercase" }}>Tambah Kendaraan</span>
              <button onClick={() => setShowModal(false)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#6b7280" }}><X size={18} /></button>
            </div>

            {/* Type toggle */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
              {(["motor", "mobil"] as const).map(t => (
                <button key={t} onClick={() => setVehicleType(t)} style={{ padding: "10px", borderRadius: 8, border: `1px solid ${vehicleType === t ? "#f97316" : "#2a2f3e"}`, background: vehicleType === t ? "rgba(249,115,22,0.08)" : "#0f1117", fontSize: 12, fontWeight: 700, color: vehicleType === t ? "#f97316" : "#6b7280", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, textTransform: "capitalize" }}>
                  {t === "motor" ? <Bike size={15} /> : <Car size={15} />} {t}
                </button>
              ))}
            </div>

            {/* Fields */}
            {[
              { label: "Merek *", val: vBrand, set: setVBrand, ph: "Honda, Yamaha, Toyota..." },
              { label: "Model *", val: vModel, set: setVModel, ph: "Beat, Vario, Avanza..." },
              { label: "No. Polisi *", val: vPlate, set: setVPlate, ph: "D 4621 XY" },
              { label: "Tahun", val: vYear, set: setVYear, ph: "2022" },
            ].map(f => (
              <div key={f.label} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 10, color: "#4b5563", letterSpacing: 1, fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 6 }}>{f.label}</label>
                <input
                  value={f.val}
                  onChange={e => f.set(e.target.value)}
                  placeholder={f.ph}
                  style={{ width: "100%", background: "#0f1117", border: "1px solid #2a2f3e", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#e2e8f0", outline: "none", boxSizing: "border-box" }}
                />
              </div>
            ))}

            {formError && <p style={{ fontSize: 11, color: "#f87171", marginBottom: 12 }}>{formError}</p>}

            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: "11px", background: "transparent", border: "1px solid #2a2f3e", borderRadius: 8, fontSize: 12, fontWeight: 700, color: "#6b7280", cursor: "pointer" }}>Batal</button>
              <button onClick={saveVehicle} style={{ flex: 2, padding: "11px", background: "#f97316", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer" }}>Simpan Kendaraan</button>
            </div>
          </div>
        </div>
      )}

      <style>{`input::placeholder{color:#374151;} *{box-sizing:border-box;}`}</style>
    </div>
  );
}
