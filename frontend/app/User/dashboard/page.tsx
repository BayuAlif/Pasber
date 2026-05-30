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
  Bike,
  Car,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import Sidebar from "@/app/components/sidebar/page";



type User = {
  name: string;
  fotoProfile?: string;
};

type Vehicle = {
  id: number;
  jenisKendaraan: string;
  merek: string;
  model: string;
  nomorPolisi: string;
};


type ActiveWO = {
  statusWO: string;

  booking: {
    kendaraan: {
      merek: string;
      model: string;
      nomorPolisi: string;
    };
  };
};


export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [activeWO, setActiveWO] =
    useState<ActiveWO[]>([]);

  const [currentWO, setCurrentWO] = useState(0);



  const progressSteps = [
    'pending',
    'approved',
    'assigned',
    'running',
    'qc',
    'done',
    'paid'
  ];

  const currentWorkOrder = activeWO[currentWO] || activeWO[0];

  const activeServiceCount = activeWO.filter( (wo) => wo.statusWO !== 'done' && wo.statusWO !== 'pending' ).length;

  const stats = [
    {
      label: "Kendaraan Terdaftar",
      value: vehicles.length.toString(),
      color: "#3b82f6",
      borderClass: "border-l-blue-700"
    },


    {
      label: "Servis Berlangsung",
      value: activeServiceCount.toString(),
      color: "#f97316",
      borderClass: "border-l-orange-600"
    },



    {
      label: "Menunggu Pembayaran",
      value: "0",
      color: "#eab308",
      borderClass: "border-l-yellow-600"
    },
  ];


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




    const fetchActiveWO = async () => {

      try {

        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://127.0.0.1:8000/api/active-work-order",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const data = await response.json();

        setActiveWO(data);

      } catch (error) {
        console.error(error);
      }
    };

    fetchActiveWO();



    const fetchVehicles = async () => {

      try {

        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://127.0.0.1:8000/api/my-kendaraan",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const data = await response.json();

        setVehicles(data);

      } catch (error) {
        console.error(error);
      }
    };

    fetchVehicles();
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
                {s.label.includes("Kendaraan") && (<Car size={20} color={s.color} />)}
                {s.label.includes("Berlangsung") && <Wrench size={20} color={s.color} />}
                {s.label.includes("Pembayaran") && <CheckSquare size={20} color={s.color} />}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom grid */}
        <div className="grid gap-3.5" style={{ gridTemplateColumns: "2fr 1fr" }}>

          {/* Service status card */}

          <div className="bg-[#13161e] border border-[#1e2230] rounded-[28px] overflow-hidden relative">

            {/* Header badge */}
            <div className="absolute top-5 right-5 flex items-center gap-1.5 px-3 py-[5px] bg-orange-500/10 border border-orange-500/30 rounded-full text-[10px] font-bold text-orange-500 tracking-[1px] z-10">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse inline-block" />
              DALAM PENGERJAAN
            </div>

            {/* Top section */}
            <div className="px-10 pt-10 pb-12 border-b border-[#1e2230]">

              {activeWO.length > 1 && (

                <div className="absolute left-6 top-[120px] flex gap-2 z-20">

                  <button
                    onClick={() =>
                      setCurrentWO((prev) =>
                        prev === 0 ? activeWO.length - 1 : prev - 1
                      )
                    }
                    className="w-11 h-11 rounded-xl bg-[#1a1d28] border border-[#2a2f3e] flex items-center justify-center hover:border-orange-500/40 transition-all"
                  >
                    ←
                  </button>

                </div>
              )}


              {activeWO.length > 1 && (

                <div className="absolute right-6 top-[120px] z-20">

                  <button
                    onClick={() =>
                      setCurrentWO((prev) =>
                        prev === activeWO.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="w-11 h-11 rounded-xl bg-[#1a1d28] border border-[#2a2f3e] flex items-center justify-center hover:border-orange-500/40 transition-all"
                  >
                    →
                  </button>

                </div>
              )}
              <p className="text-[10px] text-gray-600 font-bold tracking-[1.5px] uppercase mb-8">
                STATUS SERVIS KENDARAAN ANDA
              </p>

              {activeWO.length === 0 ? (

                <div className="flex flex-col items-center justify-center text-center py-16">

                  <div className="w-24 h-24 rounded-[28px] bg-[#1a1d28] border border-[#2a2f3e] flex items-center justify-center mb-8">
                    <Wrench size={36} color="#4b5563" />
                  </div>

                  <h2 className="text-3xl font-black text-white mb-3">
                    Belum Ada Servis Aktif
                  </h2>

                  <p className="text-sm text-gray-500 mb-8 max-w-md">
                    Anda belum memiliki booking atau work order yang sedang berjalan.
                  </p>

                  <Link href="/User/service">
                    <button className="px-7 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-black uppercase tracking-[1.5px] transition-all">
                      Buat Reservasi
                    </button>
                  </Link>

                </div>

              ) : (

                <>
                  <h2 className="text-[56px] font-black text-white mb-4 tracking-tight uppercase text-center">
                    {currentWorkOrder.booking.kendaraan.merek}
                    {' '}
                    {currentWorkOrder.booking.kendaraan.model}
                  </h2>

                  <div className="mx-auto w-fit px-6 py-2 bg-[#0f1117] border border-[#2a2f3e] rounded-xl text-[14px] font-mono tracking-[5px] text-gray-300 uppercase">
                    {currentWorkOrder.booking.kendaraan.nomorPolisi}
                  </div>

                  {activeWO.length > 1 && (

                    <div className="flex justify-center gap-2 mt-6">

                      {activeWO.map((_, index) => (

                        <div
                          key={index}
                          className={`h-2 rounded-full transition-all

        ${index === currentWO
                              ? 'w-8 bg-orange-500'
                              : 'w-2 bg-[#2a2f3e]'
                            }
      `}
                        />

                      ))}
                    </div>
                  )}


                </>
              )}
            </div>

            {/* Bottom tracker */}
            {activeWO.length > 0 && (

              <div className="px-10 py-12">

                <div className="flex justify-between items-center relative">

                  {progressSteps.map((step, index) => {

                    const currentIndex =
                      progressSteps.indexOf(currentWorkOrder.statusWO);

                    const active = index <= currentIndex;

                    return (

                      <div
                        key={step}
                        className="flex-1 flex flex-col items-center relative"
                      >

                        {/* line */}
                        {index !== progressSteps.length - 1 && (
                          <div
                            className={`absolute top-4 left-1/2 w-full h-[2px]

                            ${index < currentIndex
                                ? 'bg-gradient-to-r from-orange-500 to-orange-400'
                                : 'bg-[#202534]'
                              }
                          `}
                          />
                        )}

                        {/* circle */}
                        <div
                          className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border text-sm font-bold

                          ${active
                              ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20'
                              : 'bg-[#161b22] border-[#2a2f3e] text-gray-500'
                            }
                        `}
                        >
                          {index + 1}
                        </div>

                        {/* label */}
                        <p
                          className={`mt-4 text-[11px] uppercase tracking-[1.5px] font-bold

                          ${active
                              ? 'text-orange-500'
                              : 'text-gray-600'
                            }
                        `}
                        >
                          {step}
                        </p>

                      </div>
                    );
                  })}
                </div>

                <Link href="/User/pantau">
                  <div className="mt-12 flex items-center justify-center gap-2 p-4 bg-[#1a1d28] border border-[#2a2f3e] rounded-2xl text-[13px] font-bold text-gray-400 cursor-pointer hover:border-orange-500/30 transition-all">
                    Lihat Detail di Pantau Service
                    <ChevronRight size={16} />
                  </div>
                </Link>

              </div>

            )}
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

              {vehicles.map((v, index) => (

                <div
                  key={v.id}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl border

                      ${index === 0
                      ? "bg-[#1a1d28] border-[#2a2f3e]"
                      : "bg-transparent border-transparent"
                    }`}
                >

                  <div className="flex items-center gap-3">

                    <div className={`p-2 rounded-lg ${v.jenisKendaraan?.toLowerCase() === 'motor' ? 'bg-orange-500/15' : 'bg-blue-500/15'} `} >
                    </div>

                    <div>
                      <p className="text-[12px] font-bold uppercase text-white">
                        {v.merek} {v.model}
                      </p>

                      <p className="text-[10px] text-gray-600 font-mono tracking-[1px] uppercase">
                        {v.nomorPolisi}
                      </p>
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
                { label: "Pantau Service", href: "/User/pantau", icon: Activity },
                { label: "Booking Service", href: "/User/service", icon: CalendarPlus },
                { label: "Riwayat Service", href: "/User/riwayat", icon: History },
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