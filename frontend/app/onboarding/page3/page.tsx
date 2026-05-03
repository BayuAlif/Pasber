'use client';
import { useRouter } from 'next/navigation';

export default function Stage3Page() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full bg-[#0d1117] text-white font-sans flex flex-col overflow-hidden">
      <nav className="relative z-10 w-full p-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="font-black tracking-tighter text-xl italic">PASBER</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-orange-500 text-[10px] font-black tracking-widest uppercase">Onboarding Process</span>
          <span className="text-[10px] text-gray-500 font-bold tracking-widest">STAGE 3 / 3</span>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-full max-w-md bg-[#161b22] border border-white/10 rounded-[2.5rem] p-12 shadow-2xl relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-orange-600 rounded-2xl rotate-12 flex items-center justify-center shadow-xl shadow-orange-900/40">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white -rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold mb-4 mt-4 uppercase">Nota Jelas, <span className="text-orange-500">Bayar Ringkas.</span></h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">Nikmati transparansi penuh dalam setiap penagihan. Kelola invoice dengan mudah.</p>
          
          <div className="flex justify-center gap-3 mb-10">
             <span className="text-[8px] font-bold bg-white/5 border border-white/10 px-3 py-2 rounded-full uppercase tracking-tighter text-gray-400 italic">✔ Billing Otomatis</span>
             <span className="text-[8px] font-bold bg-white/5 border border-white/10 px-3 py-2 rounded-full uppercase tracking-tighter text-gray-400 italic">✔ Multi-Payment Gateway</span>
          </div>

          <button 
            onClick={() => router.push('/Profile')}
            className="w-full bg-orange-600 hover:bg-orange-500 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-3 transition-all shadow-xl shadow-orange-900/20 active:scale-95"
          >
            Mulai Gunakan Pasber <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
          
          <div className="mt-8 flex justify-center gap-2">
            <div className="w-6 h-1 bg-white/10 rounded-full" />
            <div className="w-6 h-1 bg-white/10 rounded-full" />
            <div className="w-12 h-1 bg-orange-600 rounded-full" />
          </div>
        </div>
      </main>
    </div>
  );
}