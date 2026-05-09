"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Activity,
  CalendarPlus,
  History,
  Receipt,
} from "lucide-react";

const navItems = [
  { label: "Dashboard Saya",       icon: LayoutDashboard, href: "/User/dashboard" },
  { label: "Pantau Service",       icon: Activity,        href: "/User/pantau"    },
  { label: "Booking Service",      icon: CalendarPlus,    href: "/User/service"   },
  { label: "Riwayat Service",      icon: History,         href: "/User/riwayat"   },
  { label: "Tagihan & Pembayaran", icon: Receipt,         href: "/User/tagihan"   },
];

type SidebarProps = {
  activeHref?: string;
  user?: {
    name?: string;
    fotoProfile?: string;
  } | null;
};

export default function Sidebar({ activeHref, user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-[200px] bg-[#13161e] border-r border-[#1e2230] flex flex-col py-6 z-10">

      {/* Logo */}
      <div className="px-5 pb-7">
        <div className="font-extrabold text-[18px] tracking-[2px] text-white">PASBER</div>
        <div className="text-[9px] tracking-[3px] text-[#4b5563] mt-0.5">CUSTOMER PORTAL</div>
      </div>

      {/* Nav */}
      <nav className="flex-1">
        {navItems.map((item) => {
          const isActive = activeHref === item.href ||
            (pathname !== null && (pathname === item.href || pathname.startsWith(item.href + "/")));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-5 py-2.5 text-[13px] no-underline
                border-l-[3px] transition-colors
                ${isActive
                  ? "font-semibold text-[#f97316] bg-[rgba(249,115,22,0.08)] border-[#f97316]"
                  : "font-normal text-[#9ca3af] bg-transparent border-transparent hover:bg-[#1a1d28] hover:text-white"
                }`}
            >
              <item.icon size={15} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="px-5 pt-3.5 border-t border-[#1e2230] flex items-center gap-2.5">
        <div className="w-[30px] h-[30px] rounded-full overflow-hidden shrink-0 bg-[#1e2230] flex items-center justify-center">
          {user?.fotoProfile ? (
            <img
              src={`http://127.0.0.1:8000/storage/${user.fotoProfile}`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[11px] font-bold text-white">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </span>
          )}
        </div>
        <div>
          <div className="text-[11px] font-semibold text-[#e2e8f0]">
            {user?.name || "Loading..."}
          </div>
          <div className="text-[10px] text-[#4b5563]">Pelanggan Terdaftar</div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pt-2.5 border-t border-[#1e2230]">
        <div className="text-[9px] text-[#374151] tracking-[0.5px]">
          © 2026 PASBER AUTOMOTIVE ENGINEERING | CUSTOMER PORTAL
        </div>
      </div>

    </aside>
  );
}