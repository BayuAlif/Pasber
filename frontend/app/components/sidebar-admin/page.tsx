'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarClock,
  Users,
  UserCircle,
  CreditCard,
  Package,
  History,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';

// ── Nav items ──────────────────────────────────────────────────────────────
const navItems = [
  { label: 'Dashboard',                  href: '/Admin/admin-dashboard', icon: LayoutDashboard },
  { label: 'Kelola Booking',             href: '/Admin/Booking',         icon: CalendarCheck   },
  { label: 'Kelola Jadwal & Work Order', href: '/Admin/jadwal',          icon: CalendarClock   },
  { label: 'Kelola Mekanik',             href: '/Admin/mekanik',         icon: Users           },
  { label: 'Kelola Customer',            href: '/Admin/customer',        icon: UserCircle      },
  { label: 'Invoice & Pembayaran',       href: '/Admin/pembayaran',      icon: CreditCard      },
  { label: 'Inventory',                  href: '/Admin/inventory',       icon: Package         },
  { label: 'Riwayat & Log',              href: '/Admin/riwayat',         icon: History         },
  { label: 'Laporan Keuangan',           href: '/Admin/laporan',         icon: BarChart3       },
  { label: 'Pengaturan Sistem',          href: '/Admin/pengaturan',      icon: Settings        },
];

// ── Component ──────────────────────────────────────────────────────────────
export default function SidebarAdmin() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; role: string; fotoProfile?: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://127.0.0.1:8000/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data);
      } catch (e) { console.error(e); }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    await fetch('http://127.0.0.1:8000/api/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    localStorage.removeItem('token');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.href = '/auth/login';
  };

  return (
    <aside className="w-[220px] flex-shrink-0 flex flex-col h-screen bg-[#0f1117] border-r border-[#1e2230]">

      {/* Logo */}
      <div className="px-5 py-6 border-b border-[#1e2230]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-[10px]">PS</span>
          </div>
          <div>
            <p className="text-white font-black text-[13px] tracking-tight leading-none">PASBER</p>
            <p className="text-[#4b5563] text-[8px] tracking-[2px] uppercase mt-0.5 leading-none">Engineering Control Unit</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link key={href} href={href}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group
                ${isActive
                  ? 'bg-[rgba(249,115,22,0.1)] text-orange-500'
                  : 'text-[#6b7280] hover:text-[#d1d5db] hover:bg-[#1a1d28]'}`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-orange-500 rounded-r-full" />
              )}
              <Icon
                size={15}
                className={`flex-shrink-0 ${isActive ? 'text-orange-500' : 'text-[#4b5563] group-hover:text-[#9ca3af]'}`}
              />
              <span className={`text-[12px] font-medium truncate leading-none ${isActive ? 'text-orange-400' : ''}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-[#1e2230] px-3 py-4 space-y-3">
        <div className="flex items-center gap-2.5 px-1">
          <div className="w-8 h-8 rounded-full bg-orange-500 overflow-hidden border border-white/10 flex-shrink-0">
            <img
              src={user?.fotoProfile ? `http://127.0.0.1:8000/storage/${user.fotoProfile}` : '/images/avatar.jpg'}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-bold text-white truncate leading-none">{user?.name || 'Admin'}</p>
            <p className="text-[10px] text-[#4b5563] mt-0.5">{user?.role || 'Head Engineer'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="group flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[#6b7280] hover:text-red-400 hover:bg-[rgba(239,68,68,0.08)] transition-all"
        >
          <LogOut size={14} className="text-[#4b5563] group-hover:text-red-400 transition-colors" />
          <span className="text-[12px] font-medium">Keluar Sistem</span>
        </button>
      </div>
    </aside>
  );
}
