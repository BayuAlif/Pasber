'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react'; // Tambahkan useState
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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
    <div className="relative min-h-screen w-full bg-[#0d1117] text-white font-sans flex flex-col overflow-hidden">

      {/* NAVBAR ATAS */}
      <nav className="relative z-10 w-full p-8 flex justify-between items-center bg-gradient-to-b from-black/20 to-transparent">
        <div className="flex items-center gap-2">
          <span className="font-black tracking-tighter text-xl italic">PASBER</span>
          <span className="bg-white/10 border border-white/20 px-2 py-0.5 rounded text-[8px] font-bold tracking-widest uppercase text-gray-400">
            Engineering
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-orange-500 text-[10px] font-black tracking-widest uppercase">Onboarding Process</span>
            <span className="text-[10px] text-gray-500 font-bold tracking-widest">STAGE 1 / 3</span>
          </div>
          {/* Tombol memicu modal */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="ml-4 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors border border-red-500/20 px-4 py-2 rounded-lg bg-red-500/5"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT (SENTRAL) */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-32 h-32 bg-[#161b22] border border-white/10 rounded-[2.5rem] shadow-2xl shadow-orange-500/10 flex items-center justify-center gap-3 mb-10 relative group transition-all">
          <div className="absolute inset-0 bg-orange-500/5 rounded-[2.5rem] blur-xl group-hover:bg-orange-500/10 transition-all" />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.423 20.107a3 3 0 01-1.558-3.607l.584-1.845a3 3 0 01.353-1.03l1.152-1.92a3 3 0 011.66-1.282l2.368-.61a3 3 0 001.62-4.01l-.573-1.328A3 3 0 0014.194 3.5H12a3 3 0 00-2.828 2.01l-.573 1.328a3 3 0 01-1.62 4.01l-2.368.61a3 3 0 00-1.66 1.282l-1.152 1.92a3 3 0 00-.353 1.03l-.584 1.845a3 3 0 001.558 3.607l1.83.605A3 3 0 009.6 20h4.8a3 3 0 002.322-1.07l1.83-.605z" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
        </div>

        <span className="text-[10px] font-black tracking-[0.4em] text-gray-500 uppercase mb-4">Selamat Datang di Pasber</span>
        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight uppercase">Reservasi Tanpa Antre</h2>
        <p className="text-gray-400 max-w-xl text-sm md:text-base leading-relaxed mb-10 opacity-80">
          Pilih waktu servis, masukkan detail kendaraan, dan sampaikan keluhan Anda. Kami siapkan segalanya sebelum Anda tiba.
        </p>

        <button className="bg-orange-600 hover:bg-orange-500 text-white px-16 py-4 rounded-xl font-black uppercase tracking-[0.3em] text-xs transition-all shadow-xl shadow-orange-900/30 active:scale-95 mb-8">
          Lanjut
        </button>

        <div className="flex gap-2">
          <div className="w-10 h-1 bg-orange-600 rounded-full" />
          <div className="w-10 h-1 bg-white/10 rounded-full" />
          <div className="w-10 h-1 bg-white/10 rounded-full" />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 w-full p-8 flex flex-col md:flex-row justify-between items-center bg-gradient-to-t from-black/20 to-transparent">
        <p className="text-[9px] tracking-widest text-gray-600 uppercase font-bold">© 2024 Pasber Automotive Engineering | Technical Mastery</p>
        <div className="flex gap-6 mt-4 md:mt-0 text-[9px] font-black uppercase tracking-widest text-gray-600">
          <Link href="#" className="hover:text-white transition-colors">System Status</Link>
          <Link href="#" className="hover:text-white transition-colors">API Documentation</Link>
          <Link href="#" className="hover:text-white transition-colors">Compliance</Link>
        </div>
      </footer>

      {/* MODAL KONFIRMASI LOGOUT */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />

          {/* Card Modal */}
          <div className="relative z-10 w-full max-w-sm bg-[#161b22] border border-white/10 rounded-[2rem] p-10 text-center shadow-2xl">
            <div className="mx-auto w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Akhiri Sesi?</h3>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Anda akan keluar dari portal teknik PASBER.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="py-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all border border-white/5"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-red-900/20"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BACKGROUND DECORATION */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}