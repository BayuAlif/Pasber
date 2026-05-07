'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreed) {
      alert("Harap setujui Syarat & Ketentuan terlebih dahulu");
      return;
    }
    if (password.length < 6) {
      alert("Password minimal harus 6 karakter");
      return;
    }
    if (password !== confirmPassword) {
      alert("Password tidak sama");
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        alert("Response tidak valid dari server");
        return;
      }

      if (res.ok) {
        alert("Register berhasil");
        router.push('/auth/login');
      } else {
        if (data.errors) {
          const allErrors = Object.values(data.errors).flat().join('\n');
          alert(allErrors);
        } else {
          alert(data.message || "Register gagal");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi error");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0d1117] text-white font-sans flex flex-col relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/auth/Mekanik.jpg"
          alt="Background"
          className="w-full h-full object-cover opacity-30 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0d1117] via-[#0d1117]/80 to-transparent" />
      </div>

      {/* Navbar */}
      <nav className="w-full px-5 py-6 sm:px-10 sm:py-8 flex justify-between items-center relative z-10">
        <span className="font-black tracking-tighter text-xl sm:text-2xl italic">PASBER</span>
      </nav>

      {/* Main */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 px-5 sm:px-8 lg:px-24 relative z-10 pb-8">

        {/* Left copy - hidden on small, visible md+ */}
        <div className="hidden md:block max-w-xl space-y-5 lg:space-y-6">
          <span className="text-orange-500 font-bold text-xs uppercase tracking-widest">Kemitraan Teknis</span>
          <h1 className="text-5xl lg:text-7xl font-black leading-tight tracking-tight">
            GABUNG <br />
            <span className="text-white/90">BERSAMA</span> <br />
            KAMI.
          </h1>
          <p className="text-gray-400 text-base lg:text-lg leading-relaxed max-w-md">
            Akses penuh ke sistem diagnosa V12 dan manajemen inventori komponen presisi.
          </p>
        </div>

        {/* Form card */}
        <div className="w-full max-w-md bg-[#161b22]/70 backdrop-blur-xl border border-white/10 p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-[2rem] shadow-2xl">

          {/* Mobile-only heading */}
          <div className="md:hidden mb-5">
            <span className="text-orange-500 font-bold text-[10px] uppercase tracking-widest">Kemitraan Teknis</span>
            <h1 className="text-2xl font-black leading-tight mt-0.5">GABUNG BERSAMA KAMI.</h1>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold mb-1">Registrasi Akun</h2>
          <p className="text-gray-500 text-xs sm:text-sm mb-6 font-medium">Masukkan kredensial teknis anda untuk memulai</p>

          <form className="space-y-4" onSubmit={handleRegister}>

            {/* Nama */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Nama Lengkap</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-orange-500/50 transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Alamat Email</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  placeholder="admin@pasber.auto"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-orange-500/50 transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            {/* Password row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Password</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-9 text-sm outline-none focus:border-orange-500/50 transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Konfirmasi</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-9 text-sm outline-none focus:border-orange-500/50 transition-all"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Checkbox syarat & ketentuan */}
            <div
              onClick={() => setAgreed(!agreed)}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all select-none
                ${agreed
                  ? 'border-orange-500/40 bg-orange-500/5'
                  : 'border-white/5 bg-black/20 hover:border-white/10'
                }`}
            >
              <div className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded-md border-2 flex items-center justify-center transition-all
                ${agreed ? 'bg-orange-600 border-orange-600' : 'border-gray-600'}`}>
                {agreed && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Saya menyetujui{' '}
                <span
                  className="text-orange-500 font-bold hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Syarat & Ketentuan
                </span>
                {' '}serta{' '}
                <span
                  className="text-orange-500 font-bold hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Kebijakan Privasi
                </span>
                {' '}Pasber.
              </p>
            </div>

            <button
              type="submit"
              disabled={!agreed}
              className={`w-full py-3.5 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-xl active:scale-[0.98]
                ${agreed
                  ? 'bg-orange-600 hover:bg-orange-500 shadow-orange-900/20 cursor-pointer'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
            >
              Daftar Sekarang →
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-gray-500 font-medium">
            Sudah punya akun?{' '}
            <Link href="/auth/login" className="text-orange-500 font-bold hover:underline">Login Disini</Link>
          </p>
        </div>
      </main>

      <footer className="w-full px-5 py-5 text-center relative z-10">
        <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">© 2024 PASBER AUTOMOTIVE ENGINEERING</p>
      </footer>
    </div>
  );
}