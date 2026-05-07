'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Wrench,
  Activity,
  CreditCard,
  Settings,
  LogOut,
  Search,
  Bell,
  Car,
  Box,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  type User = {
    name: string;
    role: string;
    fotoProfile?: string;
  };

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');

      const res = await fetch('http://127.0.0.1:8000/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      console.log("USER DATA:", data);

      setUser(data);
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    console.log("TOKEN SEBELUM LOGOUT:", localStorage.getItem('token'));

    const token = localStorage.getItem('token');

    const res = await fetch('http://127.0.0.1:8000/api/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("STATUS LOGOUT:", res.status);

    localStorage.removeItem('token');
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    console.log("TOKEN SETELAH LOGOUT:", localStorage.getItem('token'));
    console.log("COOKIE SETELAH LOGOUT:", document.cookie);

    router.push('/auth/login');
  };

  return (
    <div className="flex min-h-screen bg-[#0d1117] text-gray-300 font-sans">

      <aside className="w-64 border-r border-white/5 flex flex-col p-6">
        <div className="mb-10">
          <h1 className="text-xl font-black italic tracking-tighter text-white">PASBER</h1>
          <p className="text-[8px] uppercase tracking-[0.3em] text-gray-500 font-bold">Engineering V12 Control Unit</p>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" active />
          <NavItem icon={<Wrench size={18} />} label="Servis Aktif" />
          <NavItem icon={<Activity size={18} />} label="Diagnosa Mesin" />
          <NavItem icon={<CreditCard size={18} />} label="Invoice & Pembayaran" />
          <NavItem icon={<Settings size={18} />} label="Pengaturan Sistem" />
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-orange-500 overflow-hidden border border-white/10">
              <img src={
                user?.fotoProfile
                  ? `http://127.0.0.1:8000/storage/${user.fotoProfile}`
                  : "/images/avatar.jpg"
              }
                alt="Profile"
                className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">{user?.name || "Loading..."}</p>
              <p className="text-[10px] text-gray-500">{user?.role || "User"}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition-all group"
          >
            <div className="flex items-center gap-3">
              <LogOut size={16} />
              <span>{isLoggingOut ? 'Logging out...' : 'Keluar Sistem'}</span>
            </div>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">

        <header className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Sistem Kontrol Bengkel</h2>
            <p className="text-xs text-gray-500 mt-1">Ringkasan operasional dan telemetri kendaraan untuk hari ini</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <input
                type="text"
                placeholder="ID Servis/Plat Nomor"
                className="bg-[#161b22] border border-white/5 rounded-lg py-2 pl-10 pr-4 text-xs outline-none focus:border-orange-500/50 w-64"
              />
            </div>
            <button className="p-2 bg-[#161b22] border border-white/5 rounded-lg text-gray-500 hover:text-white">
              <Bell size={18} />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <StatCard label="Unit Masuk" value="12" icon={<Car className="text-blue-500" />} border="border-l-blue-500" />
          <StatCard label="Proses Pengerjaan" value="4" icon={<Wrench className="text-orange-500" />} border="border-l-orange-500" />
          <StatCard label="Menunggu Komponen" value="2" icon={<Box className="text-yellow-500" />} border="border-l-yellow-500" />
          <StatCard label="Selesai & Siap Ambil" value="6" icon={<CheckCircle2 className="text-green-500" />} border="border-l-green-500" />
        </div>

        <div className="flex gap-6">
          <div className="flex-[2] bg-[#161b22] rounded-3xl border border-white/5 p-8 relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" /> Live Telemetry
                </span>
                <h3 className="text-3xl font-bold text-white mt-2">Legenda Astrea</h3>
                <p className="text-xs text-gray-500 mt-1">Service ID #ENG-992-42</p>
              </div>
              <button className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                Buka Kontrol Panel
              </button>
            </div>

            <div className="w-full h-80 bg-black/40 rounded-2xl border border-white/5 mb-6 flex flex-col justify-end p-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-gray-400">Tugas Saat Ini</span>
                  <span className="text-orange-500">65%</span>
                </div>
                <h4 className="text-sm font-bold text-white">Engine Tuning (Protokol V12)</h4>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="w-[65%] h-full bg-orange-600" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <TelemetryItem label="Oil Temp" value="98°C" />
              <TelemetryItem label="RPM Idle" value="850" />
              <TelemetryItem label="Turbo PSI" value="14.2" />
            </div>
          </div>

          <div className="flex-1 bg-[#161b22] rounded-3xl border border-white/5 flex flex-col">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-bold text-white text-sm">Antrean Servis</h3>
              <span className="text-[10px] text-gray-500 font-bold">UNIT: 3</span>
            </div>
            <div className="flex-1 p-2 space-y-1">
              <QueueItem title="Toyota Fortuner GR" plate="B 1234 XYZ" time="14:00" status="PENDING" />
              <QueueItem title="Honda Civic Type R" plate="L 9901 AB" time="15:30" status="PENDING" />
              <QueueItem title="BMW M3 Competition" plate="D 4452 CC" status="SIAP AMBIL" done />
            </div>
            <button className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-all text-center border-t border-white/5">
              Lihat Semua Antrean
            </button>
          </div>
        </div>

        <footer className="mt-10 flex justify-between items-center text-[8px] font-bold text-gray-600 uppercase tracking-[0.2em]">
          <p>© 2024 PRECISION AUTOMOTIVE ENGINEERING | TECHNICAL MASTERY</p>
          <div className="flex gap-6">
            <span>System Status</span>
            <span>API Documentation</span>
            <span>Compliance</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-orange-600/10 text-orange-500 border border-orange-500/20' : 'hover:bg-white/5 text-gray-500'}`}>
      {icon}
      <span className="text-xs font-bold">{label}</span>
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
  border: string;
};

function StatCard({ label, value, icon, border }: StatCardProps) {
  return (
    <div className={`bg-[#161b22] p-6 rounded-2xl border border-white/5 border-l-4 ${border} flex justify-between items-start`}>
      <div>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">{label}</p>
        <p className="text-3xl font-black text-white">{value}</p>
      </div>
      <div className="p-2 bg-white/5 rounded-lg">{icon}</div>
    </div>
  );
}

type TelemetryItemProps = {
  label: string;
  value: string;
};

function TelemetryItem({ label, value }: TelemetryItemProps) {
  return (
    <div className="bg-black/20 p-4 rounded-xl border border-white/5">
      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-lg font-bold text-white">{value}</p>
    </div>
  );
}

type QueueItemProps = {
  title: string;
  plate: string;
  time?: string;
  status: string;
  done?: boolean;
};

function QueueItem({ title, plate, time, status, done = false }: QueueItemProps) {
  return (
    <div className="p-4 hover:bg-white/5 rounded-2xl transition-all cursor-pointer group">
      <div className="flex justify-between items-start mb-1">
        <h4 className="text-xs font-bold text-white group-hover:text-orange-500 transition-colors">{title}</h4>
        <span className={`text-[8px] px-1.5 py-0.5 rounded font-black ${done ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-gray-500'}`}>
          {status}
        </span>
      </div>
      <p className="text-[10px] text-gray-500 font-medium mb-2">{plate}</p>
      {time && (
        <div className="flex items-center gap-2 text-[9px] text-gray-600">
          <div className="w-1 h-1 rounded-full bg-gray-600" /> Estimasi Mulai: {time} WIB
        </div>
      )}
      {done && (
        <div className="flex items-center gap-2 text-[9px] text-green-500 font-bold">
          <CheckCircle2 size={10} /> Pengecekan Akhir Selesai
        </div>
      )}
    </div>
  );
}