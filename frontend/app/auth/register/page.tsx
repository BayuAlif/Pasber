'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#0d1117] text-white font-sans flex flex-col relative overflow-hidden">
      
      <div className="absolute inset-0 z-0">
        <img 
          src="public/images/Mekanik.jpg" 
          alt="Background"
          className="w-full h-full object-cover opacity-30 grayscale" 
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0d1117] via-[#0d1117]/80 to-transparent" />
      </div>

      <nav className="w-full p-10 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          <span className="font-black tracking-tighter text-2xl italic">PASBER</span>
        </div>
      </nav>

      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-16 px-10 lg:px-24 relative z-10 -mt-10">
        
        <div className="max-w-xl space-y-6">
          <span className="text-orange-500 font-bold tracking-[0.3em] text-xs uppercase">Kemitraan Teknis</span>
          <h1 className="text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight">
            GABUNG <br /> 
            <span className="text-white/90">BERSAMA </span> <br />
            KAMI.
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-md">
            Akses penuh ke sistem diagnosa V12 dan manajemen inventori komponen presisi.
          </p>
        </div>

        <div className="w-full max-w-md bg-[#161b22]/70 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
          <h2 className="text-3xl font-bold mb-2">Registrasi Akun</h2>
          <p className="text-gray-500 text-sm mb-10 font-medium">Masukkan kredensial teknis anda untuk memulai</p>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Username</label>
              <input 
                type="text" 
                placeholder="Masukkan username"
                className="w-full bg-black/40 border border-white/5 rounded-2xl py-3.5 px-5 text-sm outline-none focus:border-orange-500/50 transition-all placeholder:text-gray-700"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Alamat Email</label>
              <input 
                type="email" 
                placeholder="@tech@pasber.auto"
                className="w-full bg-black/40 border border-white/5 rounded-2xl py-3.5 px-5 text-sm outline-none focus:border-orange-500/50 transition-all placeholder:text-gray-700"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-3.5 px-5 text-sm outline-none focus:border-orange-500/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Konfirmasi</label>
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-3.5 px-5 text-sm outline-none focus:border-orange-500/50 transition-all"
                />
              </div>
            </div>

            <button className="w-full bg-orange-600 hover:bg-orange-500 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-orange-900/20 active:scale-[0.98]">
              Daftar Sekarang
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-500 font-medium">
            Sudah memiliki akun? <Link href="/auth/login" className="text-orange-500 font-bold hover:underline">Login Disini</Link>
          </p>
        </div>
      </main>

      <footer className="w-full p-8 text-center relative z-10">
        <p className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.3em]">© 2024 PASBER AUTOMOTIVE ENGINEERING</p>
      </footer>
    </div>
  );
}