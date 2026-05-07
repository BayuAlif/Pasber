"use client";

import React from 'react';
import { 
  LayoutDashboard, Wrench, CalendarCheck, History, FileText, 
  Plus, Bell, MoreHorizontal, CheckSquare
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-[#0F1117] text-gray-300 font-sans">
      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-64 bg-[#0F1117] border-r border-gray-800 flex-col p-6">
        <div className="mb-10 text-white">
          <h1 className="text-2xl font-bold tracking-wider uppercase">Pasber</h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Customer Portal</p>
        </div>
        <nav className="flex-1 space-y-2">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard Saya" active />
          <NavItem icon={<Wrench size={20}/>} label="Pantau Service" />
          <Link href="/User/service">
            <NavItem icon={<CalendarCheck size={20}/>} label="Booking Service" />
          </Link>
          <NavItem icon={<History size={20}/>} label="Riwayat Service" />
          <NavItem icon={<FileText size={20}/>} label="Tagihan & Pembayaran" />
        </nav>
        <div className="mt-auto flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl border border-gray-800/50">
          <div className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center font-bold text-xs shrink-0 text-white">FSS</div>
          <div className="overflow-hidden"><p className="text-xs font-semibold text-white truncate uppercase">Farhan Selat Sunda</p></div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white uppercase">Halo, Farhan Selat Sunda!</h2>
            <p className="text-gray-500 text-sm mt-1">Selamat datang di portal pelanggan. Pantau status kendaraan dan jadwal servis Anda di sini.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/User/service">
              <button className="bg-[#FF5722] hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold text-sm shadow-lg shadow-orange-900/20 uppercase tracking-widest">
                <Plus size={18} /> BUAT RESERVASI
              </button>
            </Link>
            <button className="p-2.5 bg-gray-800 rounded-lg text-gray-400 border border-gray-700"><Bell size={20} /></button>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <StatCard label="Kendaraan Terdaftar" value="2" icon={<LayoutDashboard size={20} className="text-blue-500"/>} color="border-l-blue-600" />
          <StatCard label="Servis Berlangsung" value="1" icon={<Wrench size={20} className="text-orange-500"/>} color="border-l-orange-600" />
          <StatCard label="Menunggu Pembayaran" value="0" icon={<CheckSquare size={20} className="text-yellow-500"/>} color="border-l-yellow-600" />
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 bg-[#161B22] rounded-2xl p-10 border border-gray-800 relative flex flex-col items-center justify-center text-center">
            <span className="absolute top-6 right-6 text-[10px] bg-orange-900/20 text-orange-500 px-4 py-1.5 rounded border border-orange-800/50 font-bold tracking-widest uppercase">Dalam Pengerjaan</span>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-10 text-left w-full">Status Servis Kendaraan Anda</h3>
            <h2 className="text-5xl font-black text-white mb-2 tracking-tight uppercase">Legenda Astrea</h2>
            <div className="bg-[#0F1117] px-6 py-1.5 rounded text-sm font-mono tracking-widest text-white border border-gray-800 mb-8 uppercase">D 1234 XYZ</div>
            <div className="w-full max-w-md bg-gray-800 h-2 rounded-full overflow-hidden mb-2">
              <div className="bg-orange-600 h-full w-[40%] shadow-[0_0_15px_rgba(255,87,34,0.4)]"></div>
            </div>
            <p className="text-xs text-gray-400">Penggantian Filter Udara & Oli <span className="text-orange-500 font-bold ml-1">40% Selesai</span></p>
          </div>

          <div className="bg-[#161B22] rounded-2xl p-6 border border-gray-800">
            <div className="flex justify-between items-center mb-8"><h3 className="font-bold text-white uppercase tracking-wide">Garasi Saya</h3><button className="text-[10px] font-bold text-orange-500 uppercase">+ Tambah</button></div>
            <div className="space-y-3">
              <VehicleItem name="LEGENDA ASTREA" plate="D 1234 XYZ" active />
              <VehicleItem name="Honda Brio Satya" plate="D 8888 ABC" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- Shared Components ---
function NavItem({ icon, label, active = false }: any) {
  return (
    <div className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all ${active ? 'bg-orange-500/10 text-orange-500 border-l-4 border-orange-500' : 'text-gray-500 hover:bg-gray-800/50'}`}>
      {icon} <span className="text-sm font-bold">{label}</span>
    </div>
  );
}

function StatCard({ label, value, icon, color }: any) {
  return (
    <div className={`bg-[#161B22] p-6 rounded-2xl border border-gray-800 border-l-4 ${color} flex justify-between items-center`}>
      <div><p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">{label}</p><p className="text-4xl font-black text-white">{value}</p></div>
      <div className="p-4 bg-gray-800/40 rounded-xl">{icon}</div>
    </div>
  );
}

function VehicleItem({ name, plate, active = false }: any) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border ${active ? 'bg-gray-800/40 border-gray-700' : 'border-transparent'}`}>
      <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-lg ${active ? 'bg-orange-500/20 text-orange-500' : 'bg-gray-800 text-gray-600'}`}><LayoutDashboard size={18} /></div>
        <div className="text-left"><p className={`text-xs font-black uppercase ${active ? 'text-white' : 'text-gray-400'}`}>{name}</p><p className="text-[10px] text-gray-600 font-mono uppercase">{plate}</p></div>
      </div>
      <MoreHorizontal size={16} className="text-gray-700" />
    </div>
  );
}