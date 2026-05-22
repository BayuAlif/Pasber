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

  // ─── Inline validation errors ───────────────────────────────────────────
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirm?: string }>({});

  const validateName = (v: string) => {
    if (!v.trim()) return "Nama lengkap wajib diisi";
    if (v.trim().length < 3) return "Nama minimal 3 karakter";
    return "";
  };
  const validateEmail = (v: string) => {
    if (!v.trim()) return "Alamat email wajib diisi";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Format email tidak valid — pastikan ada @ dan domain yang benar";
    return "";
  };
  const validatePassword = (v: string) => {
    if (!v) return "Password wajib diisi";
    if (v.length < 6) return "Password minimal 6 karakter";
    return "";
  };
  const validateConfirm = (v: string, pw: string) => {
    if (!v) return "Konfirmasi password wajib diisi";
    if (v !== pw) return "Password tidak cocok — pastikan kedua kolom sama";
    return "";
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameErr    = validateName(name);
    const emailErr   = validateEmail(email);
    const passErr    = validatePassword(password);
    const confirmErr = validateConfirm(confirmPassword, password);
    setErrors({ name: nameErr, email: emailErr, password: passErr, confirm: confirmErr });

    if (nameErr || emailErr || passErr || confirmErr) return;

    if (!agreed) {
      alert("Harap setujui Syarat & Ketentuan terlebih dahulu");
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

  const [role, setRole] = useState<'admin' | 'user'>('user');

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
      <nav className="w-full px-5 py-5 sm:px-10 sm:py-6 flex justify-between items-center relative z-10">
        <span className="font-black tracking-tighter text-xl sm:text-2xl italic">PASBER</span>
        <div className="hidden md:flex items-center gap-8">
          <span className="text-gray-400 text-xs font-semibold uppercase tracking-widest cursor-pointer hover:text-white transition-colors">System Status</span>
          <span className="text-gray-400 text-xs font-semibold uppercase tracking-widest cursor-pointer hover:text-white transition-colors">Technical Support</span>
          <Link href="/auth/login">
            <button className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-black uppercase tracking-widest rounded-lg transition-all">
              Log In
            </button>
          </Link>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 px-5 sm:px-8 lg:px-24 relative z-10 pb-8">

        {/* Left copy */}
        <div className="hidden md:flex flex-col max-w-xl space-y-5 lg:space-y-6">
          <span className="text-orange-500 font-bold text-xs uppercase tracking-widest">Kemitraan Teknis</span>
          <h1 className="text-5xl lg:text-7xl font-black leading-tight tracking-tight">
            GABUNG <br />
            <span className="text-white/90">BERSAMA</span> <br />
            KAMI.
          </h1>
          <p className="text-gray-400 text-base lg:text-lg leading-relaxed max-w-md">
            Akses penuh ke sistem diagnosa V12, manajemen inventori komponen presisi, dan penjadwalan unit kontrol otomatis.
          </p>
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-300 text-sm font-medium">Advanced Diagnostics Protocols</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <span className="text-gray-300 text-sm font-medium">Direct ECU Interface Access</span>
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="w-full max-w-md bg-[#161b22]/80 backdrop-blur-xl border border-white/10 p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-[2rem] shadow-2xl">

          {/* Mobile-only heading */}
          <div className="md:hidden mb-5">
            <span className="text-orange-500 font-bold text-[10px] uppercase tracking-widest">Kemitraan Teknis</span>
            <h1 className="text-2xl font-black leading-tight mt-0.5">GABUNG BERSAMA KAMI.</h1>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold mb-1">Registrasi Akun</h2>
          <p className="text-gray-500 text-xs sm:text-sm mb-5 font-medium">Masukan kredensial teknis anda untuk memulai</p>

          {/* Admin / User Tab */}
          <div className="grid grid-cols-2 mb-6 bg-black/40 rounded-xl p-1 border border-white/5">
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${role === 'admin' ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/30' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => setRole('user')}
              className={`py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${role === 'user' ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/30' : 'text-gray-500 hover:text-gray-300'}`}
            >
              User
            </button>
          </div>

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
                  placeholder="User Name"
                  value={name}
                  onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((prev) => ({ ...prev, name: validateName(e.target.value) })); }}
                  onBlur={(e) => setErrors((prev) => ({ ...prev, name: validateName(e.target.value) }))}
                  required
                  className={`w-full bg-black/40 border rounded-xl py-3 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-gray-600
                    ${errors.name ? "border-red-500/60 focus:border-red-500" : "border-white/5 focus:border-orange-500/50"}`}
                />
              </div>
              {errors.name && (
                <div className="flex items-start gap-1.5 mt-1.5 px-1">
                  <svg className="w-3 h-3 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-[11px] text-red-400 leading-tight">{errors.name}</span>
                </div>
              )}
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
                  placeholder="@tech@pasber.auto"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((prev) => ({ ...prev, email: validateEmail(e.target.value) })); }}
                  onBlur={(e) => setErrors((prev) => ({ ...prev, email: validateEmail(e.target.value) }))}
                  required
                  className={`w-full bg-black/40 border rounded-xl py-3 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-gray-600
                    ${errors.email ? "border-red-500/60 focus:border-red-500" : "border-white/5 focus:border-orange-500/50"}`}
                />
              </div>
              {errors.email && (
                <div className="flex items-start gap-1.5 mt-1.5 px-1">
                  <svg className="w-3 h-3 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-[11px] text-red-400 leading-tight">{errors.email}</span>
                </div>
              )}
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
                    onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors((prev) => ({ ...prev, password: validatePassword(e.target.value) })); }}
                    onBlur={(e) => setErrors((prev) => ({ ...prev, password: validatePassword(e.target.value) }))}
                    placeholder="••••••••"
                    required
                    className={`w-full bg-black/40 border rounded-xl py-3 pl-10 pr-9 text-sm outline-none transition-all
                      ${errors.password ? "border-red-500/60 focus:border-red-500" : "border-white/5 focus:border-orange-500/50"}`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-start gap-1.5 mt-1.5 px-1">
                    <svg className="w-3 h-3 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-[11px] text-red-400 leading-tight">{errors.password}</span>
                  </div>
                )}
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
                    onChange={(e) => { setConfirmPassword(e.target.value); if (errors.confirm) setErrors((prev) => ({ ...prev, confirm: validateConfirm(e.target.value, password) })); }}
                    onBlur={(e) => setErrors((prev) => ({ ...prev, confirm: validateConfirm(e.target.value, password) }))}
                    placeholder="••••••"
                    required
                    className={`w-full bg-black/40 border rounded-xl py-3 pl-10 pr-9 text-sm outline-none transition-all
                      ${errors.confirm ? "border-red-500/60 focus:border-red-500" : "border-white/5 focus:border-orange-500/50"}`}
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
                {errors.confirm && (
                  <div className="flex items-start gap-1.5 mt-1.5 px-1">
                    <svg className="w-3 h-3 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-[11px] text-red-400 leading-tight">{errors.confirm}</span>
                  </div>
                )}
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

      <footer className="w-full px-5 sm:px-10 py-5 flex flex-col sm:flex-row justify-between items-center gap-2 relative z-10 border-t border-white/5">
        <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">© 2024 PASBER AUTOMOTIVE ENGINEERING & TECHNICAL MASTERY</p>
        <div className="hidden sm:flex items-center gap-6">
          {["System Status", "API Documentation", "Compliance", "Global Support"].map((item) => (
            <span key={item} className="text-[9px] font-bold text-gray-600 uppercase tracking-widest cursor-pointer hover:text-gray-400 transition-colors">{item}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}