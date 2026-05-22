"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  Bell,
  ChevronDown,
  Search,
  CheckCircle2,
  Circle,
  Clock,
  Wrench,
  Package,
} from "lucide-react";
import Sidebar from "@/app/components/sidebar/page";

type User = { name: string; fotoProfile?: string };



const getProgressSteps = (status: string) => {
  const steps = [
    "approved",
    "assigned",
    "running",
    "qc",
    "done",
    "paid",
  ];

  return steps.map((s, i) => ({
    label: s.toUpperCase(),
    done: steps.indexOf(status) > i,
    current: steps.indexOf(status) === i,
  }));
};

const activityLog = [
  {
    icon: Wrench,
    title: "Mekanik mulai mengerjakan",
    time: "10:45 WIB",
    source: "Service Area B: Oil",
  },
  {
    icon: CheckCircle2,
    title: "Mekanik ditugaskan",
    time: "10:15 WIB",
    source: "Admin Panel",
  },
  {
    icon: Package,
    title: "Suku cadang diproses",
    time: "10:00 WIB",
    source: "Gudang",
  },
];



type WorkOrder = {
  id: number;
  statusWO: string;
  estimasiWaktu: number;

  booking: {
    tanggalBooking: string;
    Keluhan: string;
    kendaraan: {
      merek: string;
      model: string;
      nomorPolisi: string;
    };
  };

  mekanik: {
    nama: string;
  };
};



export default function PantauServicePage() {
  const [statusFilter, setStatusFilter] = useState("Semua Status");
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://127.0.0.1:8000/api/work-order",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        console.log(response.status);

        if (!response.ok) {
          throw new Error("Gagal fetch work order");
        }
        const result = await response.json();
        console.log(result.data);

        setWorkOrders(result.data);
        setLoading(false);

      } catch (error) {
        console.error(error);
        setLoading(false);
      }

    };

    fetchWorkOrders();

  }, []);


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

      const filteredWorkOrders = workOrders.filter((wo) => {

        const kendaraan =
          `${wo.booking?.kendaraan?.merek ?? ""} ${wo.booking?.kendaraan?.model ?? ""}`.toLowerCase();

        const matchesSearch =
          kendaraan.includes(searchQuery.toLowerCase()) ||
          wo.id.toString().includes(searchQuery);

        const matchesStatus =
          statusFilter === "Semua Status" ||
          wo.statusWO.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
      });

if (loading) {
  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center text-white">
      Loading...
    </div>
  );
}

  return (
    <div className="flex min-h-screen bg-[#0f1117]">
      <Sidebar activeHref="/User/pantau" user={user} />

      {/* Main */}
      <main className="ml-[200px] flex-1 p-8 px-9">
        {/* Header */}
        <div className="flex justify-between items-start mb-7">
          <div>
            <h1 className="text-2xl font-bold m-0">
              Pantau <span className="text-orange-500">Service</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1 mb-0">
              Pantau progress pengerjaan kendaraan Anda secara real-time.
            </p>
          </div>
          <div className="relative w-9 h-9 bg-[#1e2230] rounded-lg flex items-center justify-center cursor-pointer border border-[#2a2f3e]">
            <Bell size={16} className="text-gray-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-[#13161e]" />
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
            />
            <input
              type="text"
              placeholder="Cari no Work order atau kendaraan"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a1d28] border border-[#2a2f3e] rounded-lg py-2 pl-8 pr-3 text-sm text-gray-400 outline-none placeholder-gray-600 box-border"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-[#1a1d28] border border-[#2a2f3e] rounded-lg py-2 px-3.5 text-sm text-gray-400 cursor-pointer"
            >
              {statusFilter}
              <ChevronDown size={13} />
            </button>
            {dropdownOpen && (
              <div className="absolute top-[calc(100%+6px)] left-0 bg-[#1e2230] border border-[#2a2f3e] rounded-lg min-w-[150px] z-20 overflow-hidden">
                {["Semua Status", "Running", "Selesai", "Pending"].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setStatusFilter(s);
                      setDropdownOpen(false);
                    }}
                    className={`block w-full py-2 px-3.5 text-left text-sm bg-transparent border-none cursor-pointer ${statusFilter === s ? "text-orange-500" : "text-gray-400"
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Work Order Card */}
        {filteredWorkOrders.map((wo) => {

          const steps = getProgressSteps(wo.statusWO);

          return (
            <div key={wo.id} className="bg-[#13161e] border border-[#1e2230] rounded-xl overflow-hidden">
              {/* WO Header */}
              <div className="p-5 px-6 border-b border-[#1e2230] flex justify-between items-start">
                <div>
                  <div className="text-[10px] text-gray-600 tracking-[0.15em] mb-1">
                    WORK ORDER
                  </div>
                  <div className="text-[22px] font-bold text-white leading-none">
                    WO-{String(wo.id).padStart(4, "0")}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">{wo.booking?.kendaraan?.merek} {wo.booking.kendaraan.model}</div>
                  <div className="text-xs text-gray-600 mt-0.5">{wo.booking?.kendaraan?.nomorPolisi}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 py-1 px-3 bg-orange-500/10 border border-orange-500/30 rounded-full text-[11px] font-bold text-orange-500 tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                    {wo.statusWO.toUpperCase()}
                  </span>
                  <ChevronDown size={16} className="text-gray-600" />
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="p-5 px-6 border-b border-[#1e2230]">
                <div className="text-[10px] text-gray-600 tracking-[0.15em] mb-4">
                  PROGRESS TRACKER
                </div>
                <div className="flex items-start">
                  {steps.map((step, i) => (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center relative"
                    >
                      {/* Connector line left */}
                      {i > 0 && (
                        <div
                          className={`absolute top-[11px] left-0 w-1/2 h-0.5 ${steps[i - 1].done
                            ? "bg-orange-500"
                            : "bg-[#2a2f3e]"
                            }`}
                        />
                      )}
                      {/* Connector line right */}
                      {i < steps.length - 1 && (
                        <div
                          className={`absolute top-[11px] right-0 w-1/2 h-0.5 ${step.done ? "bg-orange-500" : "bg-[#2a2f3e]"
                            }`}
                        />
                      )}
                      {/* Node */}
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center relative z-10 box-border ${step.current
                          ? "bg-orange-500 border-[3px] border-orange-500/30"
                          : step.done
                            ? "bg-orange-500"
                            : "bg-[#2a2f3e]"
                          }`}
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
                        className={`mt-2 text-[9px] text-center whitespace-pre-line tracking-wide leading-snug ${step.current
                          ? "font-bold text-orange-500"
                          : step.done
                            ? "font-medium text-gray-400"
                            : "font-medium text-gray-600"
                          }`}
                      >
                        {step.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-px bg-[#1e2230] border-b border-[#1e2230]">
                {[
                  {
                    label: "TANGGAL MASUK",
                    value: new Date(
                      wo.booking.tanggalBooking
                    ).toLocaleDateString("id-ID"),
                  },
                  { label: "JENIS SERVICE", value: wo.booking.Keluhan },
                  { label: "ESTIMASI", value: `${wo.estimasiWaktu} Menit`, highlight: true },
                  { label: "MEKANIK", value: wo.mekanik?.nama },
                ].map((item) => (
                  <div key={item.label} className="bg-[#13161e] p-4 px-6">
                    <div className="text-[10px] text-gray-600 tracking-widest mb-1.5">
                      {item.label}
                    </div>
                    <div
                      className={`text-[15px] font-semibold ${item.highlight ? "text-orange-500" : "text-slate-200"
                        }`}
                    >
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Activity Log */}
              <div className="p-5 px-6">
                <div className="flex items-center gap-2 mb-4 text-[11px] font-bold text-gray-500 tracking-widest">
                  <Clock size={13} className="text-orange-500" />
                  LOG AKTIVITAS
                </div>
                <div className="flex flex-col">
                  {activityLog.map((item, i) => (
                    <div
                      key={i}
                      className={`flex gap-3 relative ${i < activityLog.length - 1 ? "pb-4" : ""
                        }`}
                    >
                      {/* Vertical line */}
                      {i < activityLog.length - 1 && (
                        <div className="absolute left-[13px] top-7 bottom-0 w-px bg-[#1e2230]" />
                      )}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 border ${i === 0
                          ? "bg-orange-500/10 border-orange-500/25"
                          : "bg-[#1a1d28] border-[#2a2f3e]"
                          }`}
                      >
                        <item.icon
                          size={13}
                          className={i === 0 ? "text-orange-500" : "text-gray-600"}
                        />
                      </div>
                      <div>
                        <div
                          className={`text-sm font-semibold ${i === 0 ? "text-slate-200" : "text-gray-500"
                            }`}
                        >
                          {item.title}
                        </div>
                        <div className="text-[11px] text-gray-600 mt-0.5">
                          {item.time} • {item.source}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
           </div>
          );
        })}
      </main>

      <style>{`
        input::placeholder { color: #4b5563; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
