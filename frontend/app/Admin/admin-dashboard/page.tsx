'use client';

import { useState } from 'react';
import {
  Search, Car, Wrench, Box, CheckCircle2,
  AlertTriangle, ThumbsUp, ThumbsDown,
} from 'lucide-react';
import SidebarAdmin from '../../components/sidebar-admin/page';

export default function AdminDashboardPage() {
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
          <div className="grid grid-cols-4 gap-3.5">
            {[
              { label: 'Unit Masuk',         value: '12', icon: Car,         color: 'text-blue-400',   border: 'border-l-blue-500'   },
              { label: 'Proses Pengerjaan',  value: '4',  icon: Wrench,      color: 'text-orange-400', border: 'border-l-orange-500' },
              { label: 'Menunggu Komponen',  value: '2',  icon: Box,         color: 'text-yellow-400', border: 'border-l-yellow-500' },
              { label: 'Selesai & Siap Ambil', value: '6', icon: CheckCircle2, color: 'text-green-400', border: 'border-l-green-500'  },
            ].map(({ label, value, icon: Icon, color, border }) => (
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
          <div className="grid gap-3.5" style={{ gridTemplateColumns: '2fr 1fr' }}>

            {/* Live Telemetry */}
            <div className="bg-[#13161e] border border-[#1e2230] rounded-xl p-6">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <span className="flex items-center gap-1.5 text-[10px] font-black text-orange-500 uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" /> Live Telemetry
                  </span>
                  <h3 className="text-[22px] font-bold text-white mt-1.5 leading-none">Legenda Astrea</h3>
                  <p className="text-[11px] text-[#4b5563] mt-1">Service ID #ENG-992-42</p>
                </div>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all">
                  Buka Kontrol Panel
                </button>
              </div>

              <div className="w-full h-52 bg-[#0f1117] rounded-xl border border-[#1e2230] mb-5 flex flex-col justify-end p-5">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-[#4b5563]">Tugas Saat Ini</span>
                    <span className="text-orange-500">65%</span>
                  </div>
                  <h4 className="text-[13px] font-bold text-white">Engine Tuning (Protokol V12)</h4>
                  <div className="w-full h-1.5 bg-[#1a1d28] rounded-full overflow-hidden">
                    <div className="w-[65%] h-full bg-orange-500 rounded-full" style={{ boxShadow: '0 0 10px rgba(249,115,22,0.4)' }} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[{ l: 'Oil Temp', v: '98°C' }, { l: 'RPM Idle', v: '850' }, { l: 'Turbo PSI', v: '14.2' }].map(({ l, v }) => (
                  <div key={l} className="bg-[#0f1117] border border-[#1e2230] p-3.5 rounded-xl">
                    <p className="text-[9px] text-[#4b5563] font-bold uppercase tracking-widest mb-1">{l}</p>
                    <p className="text-[16px] font-bold text-white">{v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Antrean Servis */}
            <div className="bg-[#13161e] border border-[#1e2230] rounded-xl flex flex-col">
              <div className="px-5 py-4 border-b border-[#1e2230] flex justify-between items-center">
                <h3 className="text-[13px] font-bold text-white">Antrean Servis</h3>
                <span className="text-[10px] text-[#4b5563] font-bold">UNIT: 3</span>
              </div>
              <div className="flex-1 p-2 space-y-0.5">
                {[
                  { title: 'Toyota Fortuner GR',  plate: 'B 1234 XYZ', time: '14:00', done: false },
                  { title: 'Honda Civic Type R',   plate: 'L 9901 AB',  time: '15:30', done: false },
                  { title: 'BMW M3 Competition',   plate: 'D 4452 CC',  time: undefined, done: true },
                ].map(({ title, plate, time, done }) => (
                  <div key={plate} className="p-3.5 hover:bg-[#1a1d28] rounded-lg transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-[12px] font-bold text-white group-hover:text-orange-400 transition-colors">{title}</p>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold ${done ? 'bg-green-500/10 text-green-500' : 'bg-[#1a1d28] text-[#4b5563]'}`}>
                        {done ? 'SIAP AMBIL' : 'PENDING'}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#4b5563] font-mono tracking-wide">{plate}</p>
                    {time && <p className="text-[9px] text-[#374151] mt-1">Estimasi mulai: {time} WIB</p>}
                    {done && <p className="text-[9px] text-green-500 font-bold mt-1 flex items-center gap-1"><CheckCircle2 size={9} /> Pengecekan Akhir Selesai</p>}
                  </div>
                ))}
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
                {[
                  { name: 'Castrol Edge 5W-40 (4L)',    code: 'OIL-001', status: 'HABIS',           statusColor: 'text-red-500 bg-red-500/10',         dot: 'bg-red-500'    },
                  { name: 'Brake Pads - Brembo Front',  code: 'BRK-923', status: 'MENIPIS (2 Unit)', statusColor: 'text-yellow-500 bg-yellow-500/10',  dot: 'bg-yellow-500' },
                  { name: 'NGK Spark Plugs Iridium',    code: 'SPK-115', status: 'AMAN (48 Unit)',   statusColor: 'text-green-500 bg-green-500/10',    dot: 'bg-green-500'  },
                ].map(({ name, code, status, statusColor, dot }) => (
                  <div key={code} className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
                      <div>
                        <p className="text-[12px] font-semibold text-white">{name}</p>
                        <p className="text-[10px] text-[#4b5563] font-mono">KODE: {code}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${statusColor}`}>{status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Perlu Approval */}
            <div className="bg-[#13161e] border border-[#1e2230] rounded-xl flex flex-col">
              <div className="px-5 py-4 border-b border-[#1e2230]">
                <h3 className="text-[13px] font-bold text-white">Booking Perlu Approval</h3>
              </div>
              <div className="flex-1 divide-y divide-[#1e2230]">
                {[
                  { name: 'Budi Santoso',   time: '22 Okt, 09:00', service: 'Transmission Slipping' },
                  { name: 'Jessica Wijaya', time: '22 Okt, 10:00', service: 'Transmission Slipping' },
                ].map(({ name, time, service }) => (
                  <div key={name} className="px-5 py-4">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-[12px] font-bold text-white">{name}</p>
                      <p className="text-[9px] text-[#4b5563]">{time}</p>
                    </div>
                    <p className="text-[10px] text-orange-500 font-semibold mb-3">{service}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="flex items-center justify-center gap-1.5 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-lg text-[11px] font-bold text-green-500 transition-all">
                        <ThumbsUp size={11} /> Approve
                      </button>
                      <button className="flex items-center justify-center gap-1.5 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-[11px] font-bold text-red-500 transition-all">
                        <ThumbsDown size={11} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
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
    </div>
  );
}
