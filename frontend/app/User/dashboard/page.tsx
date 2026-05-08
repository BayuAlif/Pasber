"use client";

import React, { useEffect, useState } from "react";

import {
  LayoutDashboard,
  Activity,
  CalendarPlus,
  History,
  Receipt,
  Bell,
  Plus,
  MoreHorizontal,
  Wrench,
  CheckSquare,
  Car,
  ChevronRight,
} from "lucide-react";

import Link from "next/link";

const navItems = [
  { label: "Dashboard Saya", icon: LayoutDashboard, href: "/User/dashboard", active: true },
  { label: "Pantau Service", icon: Activity, href: "/User/pantau" },
  { label: "Booking Service", icon: CalendarPlus, href: "/User/service" },
  { label: "Riwayat Service", icon: History, href: "/User/riwayat" },
  { label: "Tagihan & Pembayaran", icon: Receipt, href: "/User/tagihan" },
];

const stats = [
  { label: "Kendaraan Terdaftar", value: "2", color: "#3b82f6", borderColor: "#1d4ed8" },
  { label: "Servis Berlangsung", value: "1", color: "#f97316", borderColor: "#c2410c" },
  { label: "Menunggu Pembayaran", value: "0", color: "#eab308", borderColor: "#a16207" },
];

const vehicles = [
  { name: "LEGENDA ASTREA", plate: "D 1234 XYZ", active: true },
  { name: "Honda Brio Satya", plate: "D 8888 ABC", active: false },
];

type User = {
  name: string;
  fotoProfile?: string;
};

export default function DashboardPage() {

  const [user, setUser] = useState<User | null>(null);

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

        <div style={{ padding: "14px 20px", borderTop: "1px solid #1e2230", display: "flex", alignItems: "center", gap: 10 }}>
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
            <div style={{ fontSize: 11, fontWeight: 600, color: "#e2e8f0" }}>{user?.name || "Loading..."}</div>
            <div style={{ fontSize: 10, color: "#4b5563" }}>Pelanggan reseller</div>
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
            <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, color: "#fff" }}>
              Halo, <span style={{ color: "#f97316" }}>{user?.name || "User"}!</span>
            </h1>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0" }}>
              Selamat datang di portal pelanggan. Pantau status kendaraan dan jadwal servis Anda di sini.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/user/service" style={{ textDecoration: "none" }}>
              <button style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 18px", background: "#f97316", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer", letterSpacing: 1.5, textTransform: "uppercase" }}>
                <Plus size={15} /> Buat Reservasi
              </button>
            </Link>
            <div style={{ width: 36, height: 36, background: "#1e2230", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "1px solid #2a2f3e" }}>
              <Bell size={16} color="#9ca3af" />
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: "#13161e", border: "1px solid #1e2230", borderLeft: `3px solid ${s.borderColor}`, borderRadius: 10, padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: 10, color: "#4b5563", fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>{s.label}</p>
                <p style={{ fontSize: 36, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{s.value}</p>
              </div>
              <div style={{ padding: 12, background: "#1a1d28", borderRadius: 10 }}>
                {s.label.includes("Kendaraan") && <LayoutDashboard size={20} color={s.color} />}
                {s.label.includes("Berlangsung") && <Wrench size={20} color={s.color} />}
                {s.label.includes("Pembayaran") && <CheckSquare size={20} color={s.color} />}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom grid */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>

          {/* Service status card */}
          <div style={{ background: "#13161e", border: "1px solid #1e2230", borderRadius: 12, padding: 28, position: "relative", display: "flex", flexDirection: "column" }}>
            {/* Badge */}
            <div style={{ position: "absolute", top: 20, right: 20, display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: 20, fontSize: 10, fontWeight: 700, color: "#f97316", letterSpacing: 1 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f97316", animation: "pulse 1.5s infinite", display: "inline-block" }} />
              DALAM PENGERJAAN
            </div>

            <p style={{ fontSize: 10, color: "#4b5563", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 20 }}>STATUS SERVIS KENDARAAN ANDA</p>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "12px 0" }}>
              <h2 style={{ fontSize: 40, fontWeight: 800, color: "#fff", margin: "0 0 10px", letterSpacing: -1, textTransform: "uppercase" }}>Legenda Astrea</h2>
              <div style={{ padding: "5px 20px", background: "#0f1117", border: "1px solid #2a2f3e", borderRadius: 6, fontSize: 13, fontFamily: "monospace", letterSpacing: 3, color: "#9ca3af", marginBottom: 24, textTransform: "uppercase" }}>
                D 1234 XYZ
              </div>

              {/* Progress bar */}
              <div style={{ width: "100%", maxWidth: 400 }}>
                <div style={{ width: "100%", height: 6, background: "#1a1d28", borderRadius: 99, overflow: "hidden", marginBottom: 8 }}>
                  <div style={{ height: "100%", width: "40%", background: "linear-gradient(90deg,#f97316,#ea580c)", borderRadius: 99, boxShadow: "0 0 12px rgba(249,115,22,0.4)" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <p style={{ fontSize: 11, color: "#6b7280" }}>Penggantian Filter Udara & Oli</p>
                  <p style={{ fontSize: 11, color: "#f97316", fontWeight: 700 }}>40% Selesai</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <Link href="/user/pantau" style={{ textDecoration: "none" }}>
              <div style={{ marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", background: "#1a1d28", border: "1px solid #2a2f3e", borderRadius: 8, fontSize: 12, fontWeight: 600, color: "#9ca3af", cursor: "pointer" }}>
                Lihat Detail di Pantau Service <ChevronRight size={14} />
              </div>
            </Link>
          </div>

          {/* Garasi */}
          <div style={{ background: "#13161e", border: "1px solid #1e2230", borderRadius: 12, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#4b5563", letterSpacing: 1.5, textTransform: "uppercase" }}>GARASI SAYA</p>
              <Link href="/user/service" style={{ textDecoration: "none" }}>
                <button style={{ fontSize: 11, fontWeight: 700, color: "#f97316", background: "transparent", border: "none", cursor: "pointer" }}>+ Tambah</button>
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {vehicles.map(v => (
                <div key={v.plate} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: 10, background: v.active ? "#1a1d28" : "transparent", border: `1px solid ${v.active ? "#2a2f3e" : "transparent"}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ padding: 8, borderRadius: 8, background: v.active ? "rgba(249,115,22,0.15)" : "#1a1d28" }}>
                      <Car size={16} color={v.active ? "#f97316" : "#4b5563"} />
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 700, color: v.active ? "#fff" : "#6b7280", textTransform: "uppercase" }}>{v.name}</p>
                      <p style={{ fontSize: 10, color: "#4b5563", fontFamily: "monospace", letterSpacing: 1 }}>{v.plate}</p>
                    </div>
                  </div>
                  <MoreHorizontal size={15} color="#374151" />
                </div>
              ))}
            </div>

            {/* Quick links */}
            <div style={{ marginTop: 20, borderTop: "1px solid #1e2230", paddingTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              <p style={{ fontSize: 10, color: "#4b5563", letterSpacing: 1.2, fontWeight: 700, marginBottom: 4 }}>AKSI CEPAT</p>
              {[
                { label: "Pantau Service", href: "/User/pantau", icon: Activity },
                { label: "Booking Service", href: "/User/service", icon: CalendarPlus },
                { label: "Riwayat Service", href: "/User/riwayat", icon: History },
              ].map(link => (
                <Link key={link.href} href={link.href} style={{ textDecoration: "none" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", borderRadius: 8, background: "#0f1117", border: "1px solid #1e2230", cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#9ca3af" }}>
                      <link.icon size={13} color="#6b7280" /> {link.label}
                    </div>
                    <ChevronRight size={12} color="#374151" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(1.3)} }
        *{box-sizing:border-box;}
      `}</style>
    </div>
  );
}
