'use client';
import { useRouter } from 'next/navigation';

export default function Stage2Page() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full bg-[#0d1117] text-white font-sans flex flex-col overflow-hidden">
      <nav className="relative z-10 w-full p-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="font-black tracking-tighter text-xl italic">PASBER</span>
          <span className="bg-white/10 border border-white/20 px-2 py-0.5 rounded text-[8px] font-bold uppercase text-gray-400 tracking-widest">Engineering</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-orange-500 text-[10px] font-black tracking-widest uppercase">Onboarding Process</span>
          <span className="text-[10px] text-gray-500 font-bold tracking-widest">STAGE 2 / 3</span>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-2xl bg-[#161b22] border border-white/10 rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-2xl">
          <div className="flex-1 bg-black/20 flex items-center justify-center p-12">
             <div className="w-20 h-20 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20 shadow-2xl shadow-orange-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.99 7.99 0 0120 13a7.99 7.99 0 01-2.343 5.657z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14l.879 2.121z" />
                </svg>
             </div>
          </div>
          <div className="flex-1 p-10 flex flex-col justify-center">
            <span className="text-orange-500 text-[10px] font-black tracking-widest uppercase mb-4">Stage 02</span>
            <h2 className="text-3xl font-bold mb-4 leading-tight uppercase">Pantau Progres <br/><span className="text-orange-500">Transparan.</span></h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">Dapatkan pembaruan real-time mengenai setiap tahap pengerjaan unit Anda.</p>
            
            <button 
              onClick={() => router.push('/onboarding/page3')}
              className="w-full bg-orange-600 hover:bg-orange-500 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              Lanjut <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
            <button 
              onClick={() => router.back()}
              className="mt-4 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition-colors"
            >
              Kembali
            </button>
          </div>
        </div>

        <div className="flex gap-2 mt-10">
          <div className="w-10 h-1 bg-white/10 rounded-full" />
          <div className="w-10 h-1 bg-orange-600 rounded-full" />
          <div className="w-10 h-1 bg-white/10 rounded-full" />
        </div>
      </main>
    </div>
  );
}