'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      console.log("STATUS:", res.status);
      console.log("LOGIN RESPONSE:", data);

      if (!res.ok) {
        setErrorMessage(data.debug || data.message || 'Terjadi kesalahan');
        setShowErrorModal(true);
        return;
      }

      localStorage.setItem('token', data.token);
      document.cookie = `token=${data.token}; path=/`;

      if (data.user.is_profile_complete) {
        router.push("/User/dashboard");
      } else {
        router.push("/onboarding");
      }

    } catch (error) {
      console.log("ERROR:", error);
      setShowErrorModal(true);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0d1117] text-white font-sans overflow-hidden">

      {/* LEFT PANEL - hidden on mobile */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/auth/Mekanik.jpg"
            className="w-full h-full object-cover opacity-40 grayscale"
            alt="Mechanic working"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d1117] via-transparent to-[#0d1117]/20" />
        </div>

        <div className="relative z-10">
          <span className="text-orange-500 font-black tracking-[0.3em] text-sm uppercase">PASBER</span>
          <h1 className="text-6xl font-bold mt-4 leading-tight">Pasti Beres.</h1>
          <p className="text-gray-300 mt-6 max-w-md text-lg leading-relaxed">
            Sistem manajemen dan portal teknik terpadu untuk menjamin efisiensi layanan bengkel Anda.
          </p>
        </div>

        <div className="relative z-10 flex gap-8">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4">
            <div className="text-orange-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Dukungan Teknis</p>
              <p className="text-sm font-semibold">cs@pasber.auto</p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4">
            <div className="text-orange-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Hotline Layanan</p>
              <p className="text-sm font-semibold">+62 811 2345 6789</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - full width on mobile */}
      <div className="w-full lg:w-1/2 flex flex-col bg-[#10141b]">

        {/* Mobile top branding bar */}
        <div className="relative lg:hidden overflow-hidden h-40 sm:h-48 flex-shrink-0">
          <img
            src="/images/auth/Mekanik.jpg"
            className="w-full h-full object-cover opacity-30 grayscale"
            alt="Mechanic working"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d1117]/60 to-[#10141b]" />
          <div className="absolute inset-0 flex flex-col justify-center px-6 pt-4">
            <span className="text-orange-500 font-black tracking-[0.3em] text-xs uppercase">PASBER</span>
            <h1 className="text-3xl sm:text-4xl font-bold mt-1 leading-tight">Pasti Beres.</h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-xs">
              Portal teknik terpadu untuk layanan bengkel Anda.
            </p>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 sm:px-8 lg:px-24 lg:py-0">
          <div className="w-full max-w-md">
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">Masuk</h2>
            <p className="text-gray-400 mb-8 sm:mb-10 text-sm">
              Akses panel diagnosa dan riwayat servis unit Anda melalui portal teknik kami.
            </p>

            <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">
                  Email atau Telepon
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="@admin@pasber.auto"
                    className="w-full bg-[#161b22] border border-white/5 rounded-xl py-3.5 sm:py-4 pl-12 pr-4 text-sm outline-none focus:border-orange-500/50 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Kata Sandi</label>
                  <a href="#" className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-widest">Lupa?</a>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#161b22] border border-white/5 rounded-xl py-3.5 sm:py-4 pl-12 pr-12 text-sm outline-none focus:border-orange-500/50 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 sm:py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-lg shadow-orange-900/20 active:scale-95"
              >
                Login
              </button>
            </form>

            <div className="mt-8 sm:mt-10 flex flex-col items-center gap-3 text-sm">
              <p className="text-gray-500">
                Belum memiliki akun?{' '}
                <Link href="/auth/register" className="text-orange-500 font-bold">
                  Daftar Sekarang
                </Link>
              </p>
              <Link
                href="/auth/forgot-password"
                className="text-[11px] text-gray-600 hover:text-orange-400 uppercase font-bold tracking-widest transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Mobile contact info */}
            <div className="mt-8 lg:hidden flex flex-col sm:flex-row gap-3">
              <div className="flex-1 bg-white/5 border border-white/10 p-3 rounded-xl flex items-center gap-3">
                <div className="text-orange-500 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest">Support</p>
                  <p className="text-xs font-semibold truncate">cs@pasber.auto</p>
                </div>
              </div>
              <div className="flex-1 bg-white/5 border border-white/10 p-3 rounded-xl flex items-center gap-3">
                <div className="text-orange-500 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest">Hotline</p>
                  <p className="text-xs font-semibold truncate">+62 811 2345 6789</p>
                </div>
              </div>
            </div>

            <div className="mt-8 sm:mt-10 lg:mt-20 text-center text-[10px] text-gray-600 font-bold uppercase tracking-widest">
              <span>© Pasti Beres.</span>
            </div>
          </div>
        </div>
      </div>

      {/* ERROR MODAL */}
      {showErrorModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowErrorModal(false)} />
          <div className="relative z-10 w-full max-w-md bg-[#161b22] border border-white/10 rounded-3xl p-8 sm:p-10 text-center shadow-2xl mx-4">
            <div className="mx-auto w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Login Gagal</h2>
            <p className="text-gray-400 text-sm mb-8">{errorMessage || 'Terjadi kesalahan, coba lagi.'}</p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold uppercase tracking-widest text-xs"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
