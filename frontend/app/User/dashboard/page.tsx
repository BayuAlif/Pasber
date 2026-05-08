"use client";

import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Activity,
  CalendarPlus,
  History,
  Bell,
  Plus,
  MoreHorizontal,
  Wrench,
  CheckSquare,
  Car,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Sidebar from "@/app/components/sidebar/page";

const stats = [
  { label: "Kendaraan Terdaftar", value: "2", color: "#3b82f6", borderClass: "border-l-blue-700" },
  { label: "Servis Berlangsung",   value: "1", color: "#f97316", borderClass: "border-l-orange-600" },
  { label: "Menunggu Pembayaran",  value: "0", color: "#eab308", borderClass: "border-l-yellow-600" },
];

const vehicles = [
  { name: "LEGENDA ASTREA",  plate: "D 1234 XYZ", active: true  },
  { name: "Honda Brio Satya", plate: "D 8888 ABC", active: false },
];

type User = { name: string; fotoProfile?: string };

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);

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
    <div className="flex min-h-screen bg-[#0f1117] text-[#e2e8f0]" style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

      <Sidebar activeHref="/User/dashboard" user={user} />

      {/* ── MAIN ── */}
      <main className="ml-[200px] flex-1 p-8 pr-9">

        {/* Header */}
        <div className="flex justify-between items-start mb-7">
          <div>
            <h1 className="text-[26px] font-bold m-0 text-white">
              Halo, <span className="text-orange-500">{user?.name || "User"}!</span>
            </h1>
            <p className="text-[13px] text-gray-500 mt-1">
              Selamat datang di portal pelanggan. Pantau status kendaraan dan jadwal servis Anda di sini.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <Link href="/User/service">
              <button className="flex items-center gap-2 px-[18px] py-[9px] bg-orange-500 border-none rounded-lg text-[12px] font-bold text-white cursor-pointer tracking-[1.5px] uppercase">
                <Plus size={15} /> Buat Reservasi
              </button>
            </Link>
            <div className="w-9 h-9 bg-[#1e2230] rounded-lg flex items-center justify-center cursor-pointer border border-[#2a2f3e]">
              <Bell size={16} color="#9ca3af" />
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-3.5 mb-5">
          {stats.map(s => (
            <div key={s.label} className={`bg-[#13161e] border border-[#1e2230] border-l-[3px] ${s.borderClass} rounded-xl px-5 py-[18px] flex justify-between items-center`}>
              <div>
                <p className="text-[10px] text-gray-600 font-bold tracking-[1.2px] uppercase mb-2">{s.label}</p>
                <p className="text-[36px] font-extrabold text-white leading-none">{s.value}</p>
              </div>
              <div className="p-3 bg-[#1a1d28] rounded-xl">
                {s.label.includes("Kendaraan") && <LayoutDashboard size={20} color={s.color} />}
                {s.label.includes("Berlangsung") && <Wrench size={20} color={s.color} />}
                {s.label.includes("Pembayaran") && <CheckSquare size={20} color={s.color} />}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom grid */}
        <div className="grid gap-3.5" style={{ gridTemplateColumns: "2fr 1fr" }}>

          {/* Service status card */}
          <div className="bg-[#13161e] border border-[#1e2230] rounded-xl p-7 relative flex flex-col">
            <div className="absolute top-5 right-5 flex items-center gap-1.5 px-3 py-[5px] bg-orange-500/10 border border-orange-500/30 rounded-full text-[10px] font-bold text-orange-500 tracking-[1px]">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse inline-block" />
              DALAM PENGERJAAN
            </div>

            <p className="text-[10px] text-gray-600 font-bold tracking-[1.5px] uppercase mb-5">STATUS SERVIS KENDARAAN ANDA</p>

            <div className="flex-1 flex flex-col items-center justify-center text-center py-3">
              <h2 className="text-[40px] font-extrabold text-white mb-2.5 tracking-tight uppercase">Legenda Astrea</h2>
              <div className="px-5 py-[5px] bg-[#0f1117] border border-[#2a2f3e] rounded-md text-[13px] font-mono tracking-[3px] text-gray-400 mb-6 uppercase">
                D 1234 XYZ
              </div>
              <div className="w-full max-w-[400px]">
                <div className="w-full h-1.5 bg-[#1a1d28] rounded-full overflow-hidden mb-2">
                  <div className="h-full w-[40%] bg-gradient-to-r from-orange-500 to-orange-600 rounded-full" style={{ boxShadow: "0 0 12px rgba(249,115,22,0.4)" }} />
                </div>
                <div className="flex justify-between">
                  <p className="text-[11px] text-gray-500">Penggantian Filter Udara & Oli</p>
                  <p className="text-[11px] text-orange-500 font-bold">40% Selesai</p>
                </div>
              </div>
            </div>

            <Link href="/User/pantau">
              <div className="mt-5 flex items-center justify-center gap-1.5 p-2.5 bg-[#1a1d28] border border-[#2a2f3e] rounded-lg text-[12px] font-semibold text-gray-400 cursor-pointer">
                Lihat Detail di Pantau Service <ChevronRight size={14} />
              </div>
            </Link>
          </div>

          {/* Garasi */}
          <div className="bg-[#13161e] border border-[#1e2230] rounded-xl p-6">
            <div className="flex justify-between items-center mb-5">
              <p className="text-[10px] font-bold text-gray-600 tracking-[1.5px] uppercase">GARASI SAYA</p>
              <Link href="/User/service">
                <button className="text-[11px] font-bold text-orange-500 bg-transparent border-none cursor-pointer">+ Tambah</button>
              </Link>
            </div>

            <div className="flex flex-col gap-2.5">
              {vehicles.map(v => (
                <div key={v.plate} className={`flex items-center justify-between px-3.5 py-3 rounded-xl border ${v.active ? "bg-[#1a1d28] border-[#2a2f3e]" : "bg-transparent border-transparent"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${v.active ? "bg-orange-500/15" : "bg-[#1a1d28]"}`}>
                      <Car size={16} color={v.active ? "#f97316" : "#4b5563"} />
                    </div>
                    <div>
                      <p className={`text-[12px] font-bold uppercase ${v.active ? "text-white" : "text-gray-500"}`}>{v.name}</p>
                      <p className="text-[10px] text-gray-600 font-mono tracking-[1px]">{v.plate}</p>
                    </div>
                  </div>
                  <MoreHorizontal size={15} color="#374151" />
                </div>
              ))}
            </div>

            {/* Quick links */}
            <div className="mt-5 border-t border-[#1e2230] pt-4 flex flex-col gap-2">
              <p className="text-[10px] text-gray-600 tracking-[1.2px] font-bold mb-1">AKSI CEPAT</p>
              {[
                { label: "Pantau Service",   href: "/User/pantau",   icon: Activity    },
                { label: "Booking Service",  href: "/User/service",  icon: CalendarPlus },
                { label: "Riwayat Service",  href: "/User/riwayat",  icon: History     },
              ].map(link => (
                <Link key={link.href} href={link.href}>
                  <div className="flex items-center justify-between px-3 py-[9px] rounded-lg bg-[#0f1117] border border-[#1e2230] cursor-pointer">
                    <div className="flex items-center gap-2 text-[12px] text-gray-400">
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
    </div>
  );
}