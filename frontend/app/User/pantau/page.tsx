"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Activity,
  CalendarPlus,
  History,
  Receipt,
  Bell,
  ChevronDown,
  Search,
  CheckCircle2,
  Circle,
  Clock,
  Wrench,
  Package,
  FileText,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { label: "Dashboard Saya", icon: LayoutDashboard, href: "/User/dashboard" },
  { label: "Pantau Service", icon: Activity, href: "/User/pantau", active: true },
  { label: "Booking Service", icon: CalendarPlus, href: "/User/service" },
  { label: "Riwayat Service", icon: History, href: "/User/riwayat" },
  { label: "Tagihan & Pembayaran", icon: Receipt, href: "/User/tagihan" },
];

const progressSteps = [
  { label: "BOOKING\nAPPROVED", done: true },
  { label: "WO\nDIBUAT", done: true },
  { label: "MEKANIK\nDITUGASKAN", done: true },
  { label: "SEDANG\nDIKERJAKAN", done: true, current: true },
  { label: "QC\nSELESAI", done: false },
  { label: "PEMBAYARAN\nNOTA", done: false },
];

const activityLog = [
  {
    icon: Wrench,
    color: "#f97316",
    title: "Mekanik mulai mengerjakan",
    time: "10:45 WIB",
    source: "Service Area B: Oil",
  },
  {
    icon: CheckCircle2,
    color: "#6b7280",
    title: "Mekanik ditugaskan",
    time: "10:15 WIB",
    source: "Admin Panel",
  },
  {
    icon: Package,
    color: "#6b7280",
    title: "Suku cadang diproses",
    time: "10:00 WIB",
    source: "Gudang",
  },
];

export default function PantauServicePage() {
  const [statusFilter, setStatusFilter] = useState("Semua Status");
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0f1117",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        color: "#e2e8f0",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: 200,
          background: "#13161e",
          borderRight: "1px solid #1e2230",
          display: "flex",
          flexDirection: "column",
          padding: "24px 0",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 10,
        }}
      >
        {/* Logo */}
        <div style={{ padding: "0 20px 28px" }}>
          <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: 2, color: "#fff" }}>
            PASBER
          </div>
          <div style={{ fontSize: 9, letterSpacing: 3, color: "#4b5563", marginTop: 2 }}>
            CUSTOMER PORTAL
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1 }}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 20px",
                fontSize: 13,
                fontWeight: item.active ? 600 : 400,
                color: item.active ? "#f97316" : "#9ca3af",
                background: item.active ? "rgba(249,115,22,0.08)" : "transparent",
                borderLeft: item.active ? "3px solid #f97316" : "3px solid transparent",
                textDecoration: "none",
                transition: "all 0.15s",
              }}
            >
              <item.icon size={15} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div
          style={{
            padding: "14px 20px",
            borderTop: "1px solid #1e2230",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            FS
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#e2e8f0" }}>
              FARHAN SELAT SUNDA
            </div>
            <div style={{ fontSize: 10, color: "#4b5563" }}>Pelanggan reseller</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "10px 20px 0", borderTop: "1px solid #1e2230" }}>
          <div style={{ fontSize: 9, color: "#374151", letterSpacing: 0.5 }}>
            © 2026 PASBER AUTOMOTIVE ENGINEERING | CUSTOMER PORTAL
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: 200, flex: 1, padding: "32px 36px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 28,
          }}
        >
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>
              Pantau{" "}
              <span style={{ color: "#f97316" }}>Service</span>
            </h1>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0" }}>
              Pantau progress pengerjaan kendaraan Anda secara real-time.
            </p>
          </div>
          <div
            style={{
              position: "relative",
              width: 36,
              height: 36,
              background: "#1e2230",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              border: "1px solid #2a2f3e",
            }}
          >
            <Bell size={16} color="#9ca3af" />
            <span
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                width: 8,
                height: 8,
                background: "#f97316",
                borderRadius: "50%",
                border: "2px solid #13161e",
              }}
            />
          </div>
        </div>

        {/* Search + Filter */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          <div
            style={{
              flex: 1,
              position: "relative",
              maxWidth: 380,
            }}
          >
            <Search
              size={14}
              color="#4b5563"
              style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
            />
            <input
              type="text"
              placeholder="Cari no Work order atau kendaraan"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                background: "#1a1d28",
                border: "1px solid #2a2f3e",
                borderRadius: 8,
                padding: "9px 12px 9px 34px",
                fontSize: 13,
                color: "#9ca3af",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#1a1d28",
                border: "1px solid #2a2f3e",
                borderRadius: 8,
                padding: "9px 14px",
                fontSize: 13,
                color: "#9ca3af",
                cursor: "pointer",
              }}
            >
              {statusFilter}
              <ChevronDown size={13} />
            </button>
            {dropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  left: 0,
                  background: "#1e2230",
                  border: "1px solid #2a2f3e",
                  borderRadius: 8,
                  minWidth: 150,
                  zIndex: 20,
                  overflow: "hidden",
                }}
              >
                {["Semua Status", "Running", "Selesai", "Pending"].map((s) => (
                  <button
                    key={s}
                    onClick={() => { setStatusFilter(s); setDropdownOpen(false); }}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "9px 14px",
                      textAlign: "left",
                      fontSize: 13,
                      color: statusFilter === s ? "#f97316" : "#9ca3af",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Work Order Card */}
        <div
          style={{
            background: "#13161e",
            border: "1px solid #1e2230",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {/* WO Header */}
          <div
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid #1e2230",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div style={{ fontSize: 10, color: "#4b5563", letterSpacing: 1.5, marginBottom: 4 }}>
                WORK ORDER
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", lineHeight: 1 }}>
                WO-2025-0042
              </div>
              <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>Legenda Astrea</div>
              <div style={{ fontSize: 12, color: "#4b5563", marginTop: 2 }}>D 4621 XY</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 12px",
                  background: "rgba(249,115,22,0.12)",
                  border: "1px solid rgba(249,115,22,0.3)",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#f97316",
                  letterSpacing: 1,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#f97316",
                    animation: "pulse 1.5s infinite",
                  }}
                />
                RUNNING
              </span>
              <ChevronDown size={16} color="#4b5563" />
            </div>
          </div>

          {/* Progress Tracker */}
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #1e2230" }}>
            <div style={{ fontSize: 10, color: "#4b5563", letterSpacing: 1.5, marginBottom: 16 }}>
              PROGRESS TRACKER
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
              {progressSteps.map((step, i) => (
                <div
                  key={i}
                  style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}
                >
                  {/* Connector line left */}
                  {i > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: 11,
                        left: 0,
                        width: "50%",
                        height: 2,
                        background: progressSteps[i - 1].done ? "#f97316" : "#2a2f3e",
                      }}
                    />
                  )}
                  {/* Connector line right */}
                  {i < progressSteps.length - 1 && (
                    <div
                      style={{
                        position: "absolute",
                        top: 11,
                        right: 0,
                        width: "50%",
                        height: 2,
                        background: step.done ? "#f97316" : "#2a2f3e",
                      }}
                    />
                  )}
                  {/* Node */}
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: step.current
                        ? "#f97316"
                        : step.done
                        ? "#f97316"
                        : "#2a2f3e",
                      border: step.current ? "3px solid rgba(249,115,22,0.3)" : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      zIndex: 1,
                      boxSizing: "border-box",
                    }}
                  >
                    {step.done && !step.current && (
                      <CheckCircle2 size={12} color="#fff" strokeWidth={2.5} />
                    )}
                    {step.current && (
                      <Activity size={11} color="#fff" strokeWidth={2.5} />
                    )}
                    {!step.done && (
                      <Circle size={8} color="#4b5563" strokeWidth={2} />
                    )}
                  </div>
                  {/* Label */}
                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 9,
                      fontWeight: step.current ? 700 : 500,
                      color: step.current ? "#f97316" : step.done ? "#9ca3af" : "#4b5563",
                      textAlign: "center",
                      whiteSpace: "pre-line",
                      letterSpacing: 0.5,
                      lineHeight: 1.4,
                    }}
                  >
                    {step.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1,
              background: "#1e2230",
              borderBottom: "1px solid #1e2230",
            }}
          >
            {[
              { label: "TANGGAL MASUK", value: "15 Mei 2025" },
              { label: "JENIS SERVICE", value: "Ganti Oli" },
              { label: "ESTIMASI", value: "120 Menit", highlight: true },
              { label: "MEKANIK", value: "Bpk. Ahmad S." },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: "#13161e",
                  padding: "16px 24px",
                }}
              >
                <div style={{ fontSize: 10, color: "#4b5563", letterSpacing: 1.2, marginBottom: 6 }}>
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: item.highlight ? "#f97316" : "#e2e8f0",
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* Activity Log */}
          <div style={{ padding: "20px 24px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
                fontSize: 11,
                fontWeight: 700,
                color: "#6b7280",
                letterSpacing: 1.2,
              }}
            >
              <Clock size={13} color="#f97316" />
              LOG AKTIVITAS
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {activityLog.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 12,
                    paddingBottom: i < activityLog.length - 1 ? 16 : 0,
                    position: "relative",
                  }}
                >
                  {/* Vertical line */}
                  {i < activityLog.length - 1 && (
                    <div
                      style={{
                        position: "absolute",
                        left: 13,
                        top: 26,
                        bottom: 0,
                        width: 1,
                        background: "#1e2230",
                      }}
                    />
                  )}
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: i === 0 ? "rgba(249,115,22,0.12)" : "#1a1d28",
                      border: `1px solid ${i === 0 ? "rgba(249,115,22,0.25)" : "#2a2f3e"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      zIndex: 1,
                    }}
                  >
                    <item.icon size={13} color={i === 0 ? "#f97316" : "#4b5563"} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: i === 0 ? "#e2e8f0" : "#6b7280",
                      }}
                    >
                      {item.title}
                    </div>
                    <div style={{ fontSize: 11, color: "#4b5563", marginTop: 2 }}>
                      {item.time} • {item.source}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
        a:hover > * { opacity: 0.85; }
        input::placeholder { color: #4b5563; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
