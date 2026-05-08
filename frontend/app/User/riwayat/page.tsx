"use client";

import React, { useState } from "react";
import {
  LayoutDashboard, Activity, CalendarPlus, History, Receipt,
  Bell, Search, ChevronDown, FileText, ChevronLeft, ChevronRight,
  Car, Bike, Wrench, CheckCircle2, Clock, AlertCircle, X,
} from "lucide-react";
import Link from "next/link";

// ─── Nav ─────────────────────────────────────────────────────────────────────
const navItems = [
  { label: "Dashboard Saya",       icon: LayoutDashboard, href: "/User/dashboard" },
  { label: "Pantau Service",       icon: Activity,        href: "/User/pantau"    },
  { label: "Booking Service",      icon: CalendarPlus,    href: "/User/service"   },
  { label: "Riwayat Service",      icon: History,         href: "/User/riwayat", active: true },
  { label: "Tagihan & Pembayaran", icon: Receipt,         href: "/User/tagihan"   },
];

// ─── Dummy data ───────────────────────────────────────────────────────────────
type ServiceRecord = {
  wo: string;
  vehicle: string;
  plate: string;
  vehicleType: "motor" | "mobil";
  service: string;
  date: string;
  mechanic: string;
  total: string | null;
  status: "running" | "selesai" | "ditolak";
};

const records: ServiceRecord[] = [
  { wo:"WO-2025-0042", vehicle:"Legenda Astrea",    plate:"D 4621 XY",  vehicleType:"motor", service:"Ganti Oli",             date:"7 Mei 2025",    mechanic:"Ahmad Budi", total:null,         status:"running"  },
  { wo:"WO-2025-0035", vehicle:"Honda Beat Street", plate:"D 1234 AB",  vehicleType:"motor", service:"Ganti Oli + Filter",    date:"12 Apr 2025",   mechanic:"Deni S.",    total:"Rp 85.000",  status:"selesai"  },
  { wo:"WO-2025-0028", vehicle:"Honda Vario 150",   plate:"D 4321 YY",  vehicleType:"motor", service:"Tune Up + Karburator",  date:"20 Mar 2025",   mechanic:"Ahmad Budi", total:"Rp 175.000", status:"selesai"  },
  { wo:"WO-2025-0021", vehicle:"Honda Beat Street", plate:"D 1234 AB",  vehicleType:"motor", service:"Ganti Ban Belakang",    date:"5 Feb 2025",    mechanic:"Wahyu P.",   total:"Rp 220.000", status:"selesai"  },
  { wo:"BK-2025-0018", vehicle:"Honda Vario 150",   plate:"D 4321 YY",  vehicleType:"motor", service:"Servis Rem",            date:"15 Jan 2025",   mechanic:"—",          total:null,         status:"ditolak"  },
];

const STATUS_CONFIG = {
  running:  { label:"RUNNING",  bg:"rgba(249,115,22,0.12)", border:"rgba(249,115,22,0.3)",  color:"#f97316", icon: Activity      },
  selesai:  { label:"SELESAI",  bg:"rgba(34,197,94,0.10)",  border:"rgba(34,197,94,0.3)",   color:"#22c55e", icon: CheckCircle2  },
  ditolak:  { label:"DITOLAK",  bg:"rgba(239,68,68,0.10)",  border:"rgba(239,68,68,0.25)",  color:"#ef4444", icon: AlertCircle   },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function RiwayatServicePage() {
  const [search,        setSearch]        = useState("");
  const [statusFilter,  setStatusFilter]  = useState("Semua Status");
  const [vehicleFilter, setVehicleFilter] = useState("Semua Kendaraan");
  const [statusOpen,    setStatusOpen]    = useState(false);
  const [vehicleOpen,   setVehicleOpen]   = useState(false);
  const [detailRow,     setDetailRow]     = useState<ServiceRecord | null>(null);
  const [page,          setPage]          = useState(1);
  const PER_PAGE = 5;

  const uniqueVehicles = Array.from(new Set(records.map(r => r.vehicle)));

  const filtered = records.filter(r => {
    const matchSearch  = r.wo.toLowerCase().includes(search.toLowerCase()) || r.vehicle.toLowerCase().includes(search.toLowerCase());
    const matchStatus  = statusFilter  === "Semua Status"    || r.status  === statusFilter.toLowerCase();
    const matchVehicle = vehicleFilter === "Semua Kendaraan" || r.vehicle === vehicleFilter;
    return matchSearch && matchStatus && matchVehicle;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#0f1117", fontFamily:"'DM Sans','Segoe UI',sans-serif", color:"#e2e8f0" }}>

      {/* ── SIDEBAR ── */}
      <aside style={{ width:200, background:"#13161e", borderRight:"1px solid #1e2230", display:"flex", flexDirection:"column", padding:"24px 0", position:"fixed", top:0, left:0, bottom:0, zIndex:10 }}>
        <div style={{ padding:"0 20px 28px" }}>
          <div style={{ fontWeight:800, fontSize:18, letterSpacing:2, color:"#fff" }}>PASBER</div>
          <div style={{ fontSize:9, letterSpacing:3, color:"#4b5563", marginTop:2 }}>CUSTOMER PORTAL</div>
        </div>
        <nav style={{ flex:1 }}>
          {navItems.map(item => (
            <Link key={item.href} href={item.href} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 20px", fontSize:13, fontWeight:item.active ? 600 : 400, color:item.active ? "#f97316" : "#9ca3af", background:item.active ? "rgba(249,115,22,0.08)" : "transparent", borderLeft:item.active ? "3px solid #f97316" : "3px solid transparent", textDecoration:"none" }}>
              <item.icon size={15} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding:"14px 20px", borderTop:"1px solid #1e2230", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:30, height:30, borderRadius:"50%", background:"linear-gradient(135deg,#f97316,#ea580c)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#fff", flexShrink:0 }}>FS</div>
          <div>
            <div style={{ fontSize:11, fontWeight:600, color:"#e2e8f0" }}>FARHAN SELAT SUNDA</div>
            <div style={{ fontSize:10, color:"#4b5563" }}>Pelanggan reseller</div>
          </div>
        </div>
        <div style={{ padding:"10px 20px 0", borderTop:"1px solid #1e2230" }}>
          <div style={{ fontSize:9, color:"#374151", letterSpacing:0.5 }}>© 2026 PASBER AUTOMOTIVE ENGINEERING | CUSTOMER PORTAL</div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ marginLeft:200, flex:1, padding:"32px 36px" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28 }}>
          <div>
            <h1 style={{ fontSize:26, fontWeight:700, margin:0 }}>
              Riwayat <span style={{ color:"#f97316" }}>Service</span>
            </h1>
            <p style={{ fontSize:13, color:"#6b7280", margin:"4px 0 0" }}>Semua riwayat servis kendaraan Anda tersimpan di sini.</p>
          </div>
          <div style={{ width:36, height:36, background:"#1e2230", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", border:"1px solid #2a2f3e" }}>
            <Bell size={16} color="#9ca3af"/>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display:"flex", gap:10, marginBottom:20 }}>
          {/* Search */}
          <div style={{ flex:1, position:"relative", maxWidth:340 }}>
            <Search size={14} color="#4b5563" style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }}/>
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Cari riwayat..."
              style={{ width:"100%", background:"#1a1d28", border:"1px solid #2a2f3e", borderRadius:8, padding:"9px 12px 9px 34px", fontSize:13, color:"#9ca3af", outline:"none", boxSizing:"border-box" }}
            />
          </div>

          {/* Status filter */}
          <div style={{ position:"relative" }}>
            <button onClick={() => { setStatusOpen(o=>!o); setVehicleOpen(false); }} style={{ display:"flex", alignItems:"center", gap:8, background:"#1a1d28", border:"1px solid #2a2f3e", borderRadius:8, padding:"9px 14px", fontSize:13, color:"#9ca3af", cursor:"pointer" }}>
              {statusFilter} <ChevronDown size={13}/>
            </button>
            {statusOpen && (
              <div style={{ position:"absolute", top:"calc(100% + 6px)", left:0, background:"#1e2230", border:"1px solid #2a2f3e", borderRadius:8, minWidth:160, zIndex:20, overflow:"hidden" }}>
                {["Semua Status","Running","Selesai","Ditolak"].map(s => (
                  <button key={s} onClick={() => { setStatusFilter(s); setStatusOpen(false); setPage(1); }} style={{ display:"block", width:"100%", padding:"9px 14px", textAlign:"left", fontSize:13, color: statusFilter===s ? "#f97316" : "#9ca3af", background:"transparent", border:"none", cursor:"pointer" }}>{s}</button>
                ))}
              </div>
            )}
          </div>

          {/* Vehicle filter */}
          <div style={{ position:"relative" }}>
            <button onClick={() => { setVehicleOpen(o=>!o); setStatusOpen(false); }} style={{ display:"flex", alignItems:"center", gap:8, background:"#1a1d28", border:"1px solid #2a2f3e", borderRadius:8, padding:"9px 14px", fontSize:13, color:"#9ca3af", cursor:"pointer" }}>
              {vehicleFilter} <ChevronDown size={13}/>
            </button>
            {vehicleOpen && (
              <div style={{ position:"absolute", top:"calc(100% + 6px)", left:0, background:"#1e2230", border:"1px solid #2a2f3e", borderRadius:8, minWidth:200, zIndex:20, overflow:"hidden" }}>
                {["Semua Kendaraan", ...uniqueVehicles].map(v => (
                  <button key={v} onClick={() => { setVehicleFilter(v); setVehicleOpen(false); setPage(1); }} style={{ display:"block", width:"100%", padding:"9px 14px", textAlign:"left", fontSize:13, color: vehicleFilter===v ? "#f97316" : "#9ca3af", background:"transparent", border:"none", cursor:"pointer" }}>{v}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div style={{ background:"#13161e", border:"1px solid #1e2230", borderRadius:12, overflow:"hidden", marginBottom:16 }}>
          {/* Table head */}
          <div style={{ display:"grid", gridTemplateColumns:"140px 1fr 1fr 110px 1fr 110px 110px 48px", padding:"12px 20px", borderBottom:"1px solid #1e2230", background:"#0f1117" }}>
            {["NO. WO","KENDARAAN","JENIS SERVICE","TANGGAL","MEKANIK","TOTAL","STATUS","AKSI"].map(h => (
              <div key={h} style={{ fontSize:10, fontWeight:700, color:"#4b5563", letterSpacing:1.2 }}>{h}</div>
            ))}
          </div>

          {/* Rows */}
          {paginated.length === 0 ? (
            <div style={{ padding:"48px 20px", textAlign:"center", color:"#4b5563" }}>
              <History size={32} style={{ margin:"0 auto 10px", opacity:.4 }}/>
              <p style={{ fontSize:13 }}>Tidak ada riwayat ditemukan.</p>
            </div>
          ) : paginated.map((row, i) => {
            const sc = STATUS_CONFIG[row.status];
            return (
              <div key={row.wo} style={{ display:"grid", gridTemplateColumns:"140px 1fr 1fr 110px 1fr 110px 110px 48px", padding:"14px 20px", borderBottom: i < paginated.length-1 ? "1px solid #1a1d28" : "none", alignItems:"center" }}>
                {/* WO */}
                <div style={{ fontSize:12, fontWeight:700, color:"#9ca3af", fontFamily:"monospace", letterSpacing:.5 }}>{row.wo}</div>

                {/* Kendaraan */}
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:30, height:30, borderRadius:7, background:"#1a1d28", border:"1px solid #2a2f3e", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    {row.vehicleType === "motor" ? <Bike size={14} color="#6b7280"/> : <Car size={14} color="#6b7280"/>}
                  </div>
                  <div>
                    <p style={{ fontSize:13, fontWeight:700, color:"#e2e8f0", margin:0 }}>{row.vehicle}</p>
                    <p style={{ fontSize:10, color:"#4b5563", fontFamily:"monospace", letterSpacing:1, margin:0 }}>{row.plate}</p>
                  </div>
                </div>

                {/* Service */}
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <Wrench size={13} color="#4b5563"/>
                  <span style={{ fontSize:13, color:"#9ca3af" }}>{row.service}</span>
                </div>

                {/* Tanggal */}
                <div style={{ fontSize:12, color:"#6b7280" }}>{row.date}</div>

                {/* Mekanik */}
                <div style={{ fontSize:13, color:"#9ca3af" }}>{row.mechanic}</div>

                {/* Total */}
                <div style={{ fontSize:13, fontWeight:600, color: row.total ? "#e2e8f0" : "#374151" }}>{row.total ?? "—"}</div>

                {/* Status badge */}
                <div>
                  <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 10px", background:sc.bg, border:`1px solid ${sc.border}`, borderRadius:20, fontSize:10, fontWeight:700, color:sc.color, letterSpacing:.8 }}>
                    {row.status === "running" && <span style={{ width:5, height:5, borderRadius:"50%", background:"#f97316", animation:"pulse 1.5s infinite", display:"inline-block" }}/>}
                    {sc.label}
                  </span>
                </div>

                {/* Aksi */}
                <div>
                  <button onClick={() => setDetailRow(row)} style={{ width:30, height:30, borderRadius:7, background:"#1a1d28", border:"1px solid #2a2f3e", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                    <FileText size={13} color="#6b7280"/>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <p style={{ fontSize:12, color:"#4b5563" }}>
            Showing {filtered.length === 0 ? 0 : (page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE, filtered.length)} of {filtered.length} records
          </p>
          <div style={{ display:"flex", gap:6 }}>
            {[
              { icon:<ChevronLeft size={13}/>,  action:() => setPage(p=>Math.max(1,p-1)),          disabled:page===1         },
              { icon:<ChevronRight size={13}/>, action:() => setPage(p=>Math.min(totalPages,p+1)), disabled:page===totalPages },
            ].map((btn, i) => (
              <button key={i} onClick={btn.action} disabled={btn.disabled} style={{ width:30, height:30, borderRadius:7, background:"#1a1d28", border:"1px solid #2a2f3e", display:"flex", alignItems:"center", justifyContent:"center", cursor: btn.disabled?"not-allowed":"pointer", color: btn.disabled?"#2a2f3e":"#9ca3af" }}>
                {btn.icon}
              </button>
            ))}
            {Array.from({length:totalPages}).map((_,i) => (
              <button key={i} onClick={()=>setPage(i+1)} style={{ width:30, height:30, borderRadius:7, background: page===i+1?"#f97316":"#1a1d28", border:`1px solid ${page===i+1?"#f97316":"#2a2f3e"}`, fontSize:12, fontWeight:700, color: page===i+1?"#fff":"#6b7280", cursor:"pointer" }}>
                {i+1}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* ── DETAIL MODAL ── */}
      {detailRow && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:50 }} onClick={()=>setDetailRow(null)}>
          <div style={{ background:"#13161e", border:"1px solid #1e2230", borderRadius:14, padding:28, width:"100%", maxWidth:440 }} onClick={e=>e.stopPropagation()}>
            {/* Modal header */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22 }}>
              <div>
                <p style={{ fontSize:10, color:"#4b5563", letterSpacing:1.5, fontWeight:700, margin:"0 0 4px" }}>DETAIL WORK ORDER</p>
                <p style={{ fontSize:18, fontWeight:700, color:"#fff", margin:0, fontFamily:"monospace" }}>{detailRow.wo}</p>
              </div>
              <button onClick={()=>setDetailRow(null)} style={{ background:"transparent", border:"none", cursor:"pointer", color:"#6b7280", padding:4 }}><X size={18}/></button>
            </div>

            {/* Status */}
            {(() => { const sc = STATUS_CONFIG[detailRow.status]; return (
              <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"5px 12px", background:sc.bg, border:`1px solid ${sc.border}`, borderRadius:20, fontSize:10, fontWeight:700, color:sc.color, letterSpacing:.8, marginBottom:20 }}>
                {detailRow.status==="running" && <span style={{ width:6, height:6, borderRadius:"50%", background:"#f97316", animation:"pulse 1.5s infinite", display:"inline-block" }}/>}
                {sc.label}
              </div>
            );})()}

            {/* Kendaraan */}
            <div style={{ background:"#0f1117", border:"1px solid #1e2230", borderRadius:10, padding:"16px 18px", marginBottom:12, display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:40, height:40, borderRadius:9, background:"#1a1d28", border:"1px solid #2a2f3e", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {detailRow.vehicleType==="motor" ? <Bike size={18} color="#f97316"/> : <Car size={18} color="#f97316"/>}
              </div>
              <div>
                <p style={{ fontSize:15, fontWeight:700, color:"#fff", margin:"0 0 3px", textTransform:"uppercase" }}>{detailRow.vehicle}</p>
                <p style={{ fontSize:11, color:"#4b5563", fontFamily:"monospace", letterSpacing:2, margin:0 }}>{detailRow.plate}</p>
              </div>
            </div>

            {/* Info grid */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
              {[
                { label:"Jenis Service", value:detailRow.service,   icon:<Wrench size={13} color="#f97316"/> },
                { label:"Tanggal",       value:detailRow.date,      icon:<Clock  size={13} color="#f97316"/> },
                { label:"Mekanik",       value:detailRow.mechanic,  icon:<Activity size={13} color="#f97316"/> },
                { label:"Total Biaya",   value:detailRow.total ?? "—", icon:<Receipt size={13} color="#f97316"/> },
              ].map(item => (
                <div key={item.label} style={{ background:"#0f1117", border:"1px solid #1e2230", borderRadius:8, padding:"12px 14px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
                    {item.icon}
                    <p style={{ fontSize:9, color:"#4b5563", letterSpacing:1.2, fontWeight:700, textTransform:"uppercase", margin:0 }}>{item.label}</p>
                  </div>
                  <p style={{ fontSize:13, fontWeight:600, color:"#e2e8f0", margin:0 }}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display:"flex", gap:10 }}>
              {detailRow.status === "running" && (
                <Link href="/user/pantau" style={{ flex:1, textDecoration:"none" }}>
                  <button style={{ width:"100%", padding:"11px", background:"rgba(249,115,22,0.1)", border:"1px solid rgba(249,115,22,0.3)", borderRadius:8, fontSize:12, fontWeight:700, color:"#f97316", cursor:"pointer", letterSpacing:1 }}>
                    Pantau Service →
                  </button>
                </Link>
              )}
              <button onClick={()=>setDetailRow(null)} style={{ flex:1, padding:"11px", background:"#1a1d28", border:"1px solid #2a2f3e", borderRadius:8, fontSize:12, fontWeight:700, color:"#6b7280", cursor:"pointer" }}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(1.3)} }
        input::placeholder { color:#374151; }
        * { box-sizing:border-box; }
      `}</style>
    </div>
  );
}
