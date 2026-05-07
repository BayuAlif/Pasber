"use client";

import React, { useState } from 'react';
import { 
  LayoutDashboard, CalendarCheck, Wrench, History, FileText, 
  Bell, Clock, CheckCircle2, Car
} from 'lucide-react';
import Link from 'next/link';

export default function BookingServicePasber() {
  const [step, setStep] = useState(1);
  
  // State Data Booking
  const [selectedVehicle, setSelectedVehicle] = useState('astrea');
  const [selectedService, setSelectedService] = useState('oli');
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); 
  const [selectedTime, setSelectedTime] = useState('09:00');

  const currentYear = 2026;
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  // Logika Kalender
  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; 
  };

  const daysInMonth = getDaysInMonth(selectedMonth, currentYear);
  const firstDayIndex = getFirstDayOfMonth(selectedMonth, currentYear);
  const sessions = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

  return (
    <div className="flex min-h-screen bg-[#0F1117] text-gray-300 font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className="hidden lg:flex w-64 bg-[#0F1117] border-r border-gray-800 flex-col p-6">
        <div className="mb-10 text-white font-bold text-2xl uppercase tracking-widest">Pasber</div>
        <nav className="flex-1 space-y-2">
          <Link href="/User/dashboard">
            <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard Saya" />
          </Link>
          <NavItem icon={<Wrench size={20}/>} label="Pantau Service" />
          <NavItem icon={<CalendarCheck size={20}/>} label="Booking Service" active />
          <NavItem icon={<History size={20}/>} label="Riwayat Service" />
          <NavItem icon={<FileText size={20}/>} label="Tagihan & Pembayaran" />
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white uppercase tracking-tight">
              Booking <span className="text-[#FF5722]">Service</span>
            </h2>
            <p className="text-gray-500 text-sm mt-1 tracking-wide">
              Selesaikan reservasi servis kendaraan Anda dengan mudah.
            </p>
          </div>
          <button className="p-2.5 bg-[#161B22] rounded-xl border border-gray-800 text-gray-500 hover:text-white transition-colors">
            <Bell size={20} />
          </button>
        </header>

        {/* --- STEPPER PROGRESS --- */}
        <div className="flex items-center justify-between mb-12 max-w-4xl mx-auto">
          <StepIndicator number="1" label="Diagnosa" active={step === 1} done={step > 1} />
          <div className={`flex-1 h-[1px] mx-4 ${step > 1 ? 'bg-orange-500' : 'bg-gray-800'}`} />
          <StepIndicator number="2" label="Pilih Jadwal" active={step === 2} done={step > 2} />
          <div className={`flex-1 h-[1px] mx-4 ${step > 2 ? 'bg-orange-500' : 'bg-gray-800'}`} />
          <StepIndicator number="3" label="Konfirmasi" active={step === 3} />
        </div>

        <div className="max-w-5xl mx-auto">
          
          {/* --- PAGE 1: DIAGNOSA --- */}
          {step === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500 items-stretch">
              <div className="bg-[#161B22]/40 p-8 rounded-[24px] border border-gray-800/50 flex flex-col">
                <h3 className="text-white font-bold text-xs mb-8 tracking-tight uppercase">Pilih Kendaraan</h3>
                <div className="space-y-4">
                  <VehicleCard 
                    title="LEGENDA ASTREA" 
                    plate="D 1234 XYZ" 
                    active={selectedVehicle === 'astrea'} 
                    onClick={() => setSelectedVehicle('astrea')} 
                  />
                  <VehicleCard 
                    title="HONDA BRIO SATYA" 
                    plate="D 8888 ABC" 
                    active={selectedVehicle === 'brio'} 
                    onClick={() => setSelectedVehicle('brio')} 
                  />
                </div>
              </div>

              <div className="bg-[#161B22]/40 p-8 rounded-[24px] border border-gray-800/50 flex flex-col">
                <h3 className="text-white font-bold text-xs mb-8 tracking-tight uppercase">Jenis Service</h3>
                <div className="space-y-3 mb-8">
                  <ServiceCard title="GANTI OLI" desc="Penggantian oli mesin dan filter" active={selectedService === 'oli'} onClick={() => setSelectedService('oli')} />
                  <ServiceCard title="TUNE UP" desc="Penggantian oli mesin dan filter" active={selectedService === 'tuneup'} onClick={() => setSelectedService('tuneup')} />
                  <ServiceCard title="GANTI BAN" desc="Penggantian Ban depan/belakang" active={selectedService === 'ban'} onClick={() => setSelectedService('ban')} />
                  <ServiceCard title="PERBAIKAN UMUM" desc="Identifikasi & perbaikan masalah" active={selectedService === 'umum'} onClick={() => setSelectedService('umum')} />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-white uppercase tracking-[0.2em] block">Deskripsi Masalah</label>
                  <textarea 
                    className="w-full h-32 bg-[#0F1117] border border-gray-800 rounded-xl p-4 text-sm text-gray-300 focus:outline-none focus:border-orange-500/50 transition-all resize-none"
                    placeholder="Tuliskan keluhan kendaraan anda..."
                  ></textarea>
                  <button 
                    onClick={() => setStep(2)} 
                    className="w-full mt-4 bg-[#FF5722] text-white py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-orange-600 active:scale-[0.98] transition-all"
                  >
                    NEXT
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* --- PAGE 2: JADWAL --- */}
          {step === 2 && (
            <div className="bg-[#161B22] p-8 md:p-10 rounded-[40px] border border-gray-800/50 animate-in fade-in duration-500">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-white font-bold uppercase text-[10px] tracking-[0.3em]">Pilih Tanggal</h3>
                <div className="flex items-center bg-[#0F1117] border border-gray-800 rounded-xl px-2 py-1.5">
                  <select 
                    value={selectedMonth} 
                    onChange={(e) => {
                      setSelectedMonth(parseInt(e.target.value));
                      setSelectedDate(1);
                    }} 
                    className="bg-transparent text-gray-400 text-[10px] font-bold uppercase px-3 outline-none"
                  >
                    {months.map((m, i) => i >= 4 && <option key={m} value={i} className="bg-[#161B22]">{m}</option>)}
                  </select>
                  <span className="text-gray-500 text-[10px] font-bold px-3 uppercase">2026</span>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-4 mb-12">
                {['SN','SL','RB','KM','JM','SB','MN'].map(d => <div key={d} className="text-[10px] font-black text-gray-700 text-center uppercase mb-2">{d}</div>)}
                {Array.from({ length: firstDayIndex }).map((_, i) => <div key={`empty-${i}`} className="py-6"></div>)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dateNum = i + 1;
                  return (
                    <button 
                      key={dateNum} 
                      onClick={() => setSelectedDate(dateNum)} 
                      className={`py-5 rounded-[18px] border-2 font-bold text-sm transition-all ${selectedDate === dateNum ? 'bg-[#FF5722] border-[#FF5722] text-white shadow-lg' : 'bg-[#0F1117] border-gray-800/60 text-gray-600 hover:border-gray-500'}`}
                    >
                      {dateNum}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-5">
                <button onClick={() => setStep(1)} className="flex-1 bg-[#1C2128] py-5 rounded-[20px] font-bold text-[10px] uppercase text-gray-500 border border-gray-800">KEMBALI</button>
                <button onClick={() => setStep(3)} className="flex-[2] bg-[#FF5722] py-5 rounded-[20px] font-black text-[10px] uppercase text-white shadow-lg">NEXT: KONFIRMASI</button>
              </div>
            </div>
          )}

          {/* --- PAGE 3: KONFIRMASI --- */}
          {step === 3 && (
            <div className="max-w-4xl mx-auto bg-[#161B22] p-12 rounded-[48px] border border-gray-800 shadow-2xl text-center animate-in duration-500">
              <div className="w-24 h-24 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 size={48} className="text-[#FF5722]" strokeWidth={2.5} />
              </div>
              <h3 className="text-3xl font-black text-white mb-3 uppercase tracking-tight">Cek Sekali Lagi!</h3>
              <p className="text-gray-500 text-sm mb-12 max-w-sm mx-auto leading-relaxed">Pastikan semua data booking anda sudah benar sebelum diproses oleh sistem.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-12">
                <div className="bg-[#0F1117] p-8 rounded-[32px] border border-gray-800 flex items-start gap-5 hover:border-gray-700 transition-colors">
                   <div className="p-3.5 bg-gray-800/50 rounded-2xl text-orange-500"><Car size={26}/></div>
                   <div>
                     <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest mb-1.5">Kendaraan & Layanan</p>
                     <p className="text-white font-bold text-[15px] uppercase">{selectedVehicle === 'astrea' ? 'Legenda Astrea' : 'Honda Brio'}</p>
                     <p className="text-orange-500 text-[11px] font-bold uppercase tracking-wider mt-0.5">
                       {selectedService === 'oli' ? 'Ganti Oli' : 
                        selectedService === 'tuneup' ? 'Tune Up' : 
                        selectedService === 'ban' ? 'Ganti Ban' : 'Perbaikan Umum'}
                     </p>
                   </div>
                </div>
                <div className="bg-[#0F1117] p-8 rounded-[32px] border border-gray-800 flex items-start gap-5 hover:border-gray-700 transition-colors">
                   <div className="p-3.5 bg-gray-800/50 rounded-2xl text-orange-500"><Clock size={26}/></div>
                   <div>
                     <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest mb-1.5">Waktu Kedatangan</p>
                     <p className="text-white font-bold text-[15px] uppercase">{selectedDate} {months[selectedMonth]} 2026</p>
                     <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mt-0.5">{selectedTime} WIB</p>
                   </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-5">
                <button onClick={() => setStep(2)} className="flex-1 bg-[#1C2128] py-5 rounded-[24px] font-bold text-[10px] uppercase text-gray-500 border border-gray-800">GANTI JADWAL</button>
                <button className="flex-[2] bg-[#FF5722] py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] text-white shadow-xl">KONFIRMASI SEKARANG</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---
function NavItem({ icon, label, active = false }: any) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${active ? 'bg-orange-500/10 text-orange-500 border-l-[3px] border-orange-500' : 'text-gray-500 hover:bg-gray-800/30'}`}>
      {icon} <span className="text-xs font-black uppercase tracking-widest">{label}</span>
    </div>
  );
}

function StepIndicator({ number, label, active, done }: any) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center font-bold text-sm transition-all duration-500 ${active || done ? 'bg-[#FF5722] text-white shadow-lg' : 'bg-[#161B22] text-gray-700 border border-gray-800'}`}>
        {done ? <CheckCircle2 size={20}/> : number}
      </div>
      <span className={`text-[9px] font-black uppercase tracking-[0.15em] ${active ? 'text-white' : 'text-gray-700'}`}>{label}</span>
    </div>
  );
}

function VehicleCard({ title, plate, active, onClick }: any) {
  return (
    <div onClick={onClick} className={`p-6 rounded-[24px] border-2 cursor-pointer transition-all duration-300 flex justify-between items-center ${active ? 'border-orange-500 bg-orange-500/5' : 'border-gray-800 bg-[#0F1117] hover:border-gray-700'}`}>
      <div className="flex items-center gap-5">
        <div className={`p-3 rounded-xl transition-colors ${active ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-800 text-gray-600'}`}><Car size={22}/></div>
        <div className="text-left">
          <p className="text-[13px] font-black text-white uppercase tracking-tight">{title}</p>
          <p className="text-[10px] text-gray-600 font-mono tracking-widest">{plate}</p>
        </div>
      </div>
      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${active ? 'bg-orange-500 border-orange-500' : 'border-gray-800 opacity-50'}`}>
        {active && <CheckCircle2 size={14} className="text-white" />}
      </div>
    </div>
  );
}

function ServiceCard({ title, desc, active, onClick }: any) {
  return (
    <div onClick={onClick} className={`p-5 rounded-2xl border-2 flex justify-between items-center cursor-pointer transition-all duration-300 ${active ? 'bg-orange-500/10 border-orange-500/60' : 'bg-[#0F1117] border-gray-800 hover:border-gray-700'}`}>
      <div className="flex items-center gap-5">
        <div className={`p-2.5 rounded-xl transition-colors ${active ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-700'}`}><Wrench size={20}/></div>
        <div className="text-left">
          <p className="text-[12px] font-black text-white uppercase tracking-wider">{title}</p>
          <p className="text-[10px] text-gray-500 tracking-tight mt-0.5 leading-none">{desc}</p>
        </div>
      </div>
      <div className={`w-2.5 h-2.5 rounded-full border-2 transition-all ${active ? 'bg-orange-500 border-orange-500 scale-125' : 'border-gray-800 scale-100'}`} />
    </div>
  );
}