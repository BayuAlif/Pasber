'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import AuthPopup from '../components/auth_popup/Auth_popup';

export default function FinalStepPage() {
  const router = useRouter();

  // States untuk data user dan upload
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');


  const [errors, setErrors] = useState<{
    noKontak?: string;
    alamat?: string;
  }>({});


  const [showPopup, setShowPopup] = useState(false);

  const [popupType, setPopupType] =
    useState<'success' | 'error'>('success');

  const [popupTitle, setPopupTitle] =
    useState('');

  const [popupMessage, setPopupMessage] =
    useState('');


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/api/user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        console.log("TOKEN USER:", token);

        if (response.ok) {
          const data = await response.json();
          setUserData({ name: data.name, email: data.email });
        }
      } catch (error) {
        console.error("Gagal menarik data user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    const formData = new FormData();

    formData.append('name', userData.name);
    formData.append('noKontak', phone);
    formData.append('alamat', address);

    if (selectedFile) {
      formData.append('fotoProfile', selectedFile);
    }

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:8000/api/update-profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const text = await response.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.log("RESP BUKAN JSON:", text);
        return;
      }
      console.log("RESPONSE:", data);

      if (response.ok) {

        setPopupType('success');

        setPopupTitle('Profil Berhasil Disimpan');

        setPopupMessage(
          'Data profil berhasil diperbarui. Anda akan masuk ke dashboard.'
        );

        setShowPopup(true);

        setTimeout(() => {
          router.push('/User/dashboard');
        }, 1800);

      }
      else {

        if (data.errors) {

          setErrors({
            noKontak: data.errors?.noKontak?.[0],
            alamat: data.errors?.alamat?.[0],
          });

        } else {

          setPopupType('error');

          setPopupTitle('Gagal Menyimpan');

          setPopupMessage(
            data.message || 'Terjadi kesalahan saat menyimpan profil.'
          );

          setShowPopup(true);

        }


      }
    } catch (error) {

      console.error("Error saving profile:", error);

      setPopupType('error');

      setPopupTitle('Server Error');

      setPopupMessage(
        'Tidak dapat terhubung ke server.'
      );

      setShowPopup(true);
    }
  };




  return (
    <div className="min-h-screen w-full bg-[#0d1117] text-white font-sans flex flex-col overflow-hidden">

      <nav className="w-full p-8 flex justify-between items-center bg-gradient-to-b from-black/20 to-transparent">
        <div className="flex items-center gap-2">
          <span className="font-black tracking-tighter text-xl italic">PASBER</span>
          <span className="bg-white/10 border border-white/20 px-2 py-0.5 rounded text-[8px] font-bold tracking-widest uppercase text-gray-400">
            Engineering
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
          <span className="text-gray-500">Account Configuration</span>
          <span className="text-gray-700">|</span>
          <span className="text-orange-500">Final Step</span>
        </div>
      </nav>


      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl bg-[#161b22] border border-white/5 rounded-3xl flex flex-col md:flex-row overflow-hidden shadow-2xl">

          {/* Left Side: Upload Photo */}
          <div className="w-full md:w-[40%] bg-black/20 p-12 flex flex-col items-center justify-center text-center border-r border-white/5">
            <div
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-600 flex flex-col items-center justify-center transition-all group-hover:border-orange-500 group-hover:bg-orange-500/5 overflow-hidden">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500 group-hover:text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <span className="text-[10px] mt-2 font-bold uppercase tracking-widest text-gray-500 group-hover:text-orange-500">
                      Upload Foto
                    </span>
                  </>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>

            <h3 className="mt-8 font-bold uppercase tracking-widest text-sm">Foto Profil</h3>
            <p className="mt-2 text-gray-500 text-[10px] leading-relaxed max-w-[180px]">
              Silakan unggah foto identitas Anda untuk melengkapi profil sistem.
            </p>
          </div>


          <div className="flex-1 p-10 md:p-14">
            <h2 className="text-2xl font-bold uppercase tracking-tight mb-2">Lengkapi Data Anda</h2>
            <p className="text-gray-500 text-xs mb-8">
              Sebagian data Anda telah ditarik dari proses registrasi. Mohon lengkapi informasi yang tersisa.
            </p>

            <form className="space-y-6">

              {/* Data Terdaftar */}
              <div>
                <span className="text-orange-600 text-[9px] font-black uppercase tracking-[0.2em] block mb-4">
                  Data Terdaftar
                </span>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      disabled
                      value={loading ? 'Memuat...' : userData.name}
                      className="w-full bg-[#0d1117] border border-white/5 rounded-xl px-4 py-3 text-sm text-gray-400 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      disabled
                      value={loading ? 'Memuat...' : userData.email}
                      className="w-full bg-[#0d1117] border border-white/5 rounded-xl px-4 py-3 text-sm text-gray-400 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Data Tambahan */}
              <div>
                <span className="text-orange-600 text-[9px] font-black uppercase tracking-[0.2em] block mb-4">
                  Data Tambahan (Wajib Diisi)
                </span>

                <div className="space-y-4">

                  {/* PHONE */}
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                      Nomor Kontak (Aktif)
                    </label>
                    <input
                      type="tel"
                      placeholder="08xxxxxxxxxx"
                      value={phone}
                      onChange={(e) => {

                        let value = e.target.value.replace(/\D/g, '');

                        if (value.length >= 2 && !value.startsWith('08')) {
                          return;
                        }

                        if (value.length > 13) {
                          value = value.slice(0, 13);
                        }
                        setErrors((prev) => ({ ...prev, noKontak: undefined }));
                        setPhone(value);
                      }}
                      className={`w-full bg-[#0d1117] border outline-none rounded-xl px-4 py-3 text-sm transition-all ${errors.noKontak ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-orange-500/50'} `}
                    />


                    {errors.noKontak && (
                      <p className="text-red-400 text-[11px] mt-2 px-1">
                        {errors.noKontak}
                      </p>
                    )}


                  </div>

                  {/* ADDRESS */}
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                      Alamat Lengkap
                    </label>
                    <textarea
                      placeholder="Masukkan detail alamat tempat tinggal saat ini..."
                      rows={3}
                      value={address}

                      onChange={(e) => {

                        setErrors((prev) => ({
                          ...prev,
                          alamat: undefined
                        }));

                        setAddress(e.target.value);
                      }}
                      className={`w-full bg-[#0d1117] border outline-none rounded-xl px-4 py-3 text-sm transition-all resize-none

                      ${errors.alamat
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-white/10 focus:border-orange-500/50'
                        }
                      `}
                    />
                    {errors.alamat && (<p className="text-red-400 text-[11px] mt-2 px-1"> {errors.alamat} </p>)}
                  </div>

                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveProfile}
                className="w-full bg-orange-600 hover:bg-orange-500 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-4"
              >
                Simpan & Masuk Dashboard
              </button>

            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full p-8 flex justify-between items-center text-[8px] font-bold text-gray-600 uppercase tracking-[0.2em]">
        <span>© 2024 PASBER AUTOMOTIVE ENGINEERING | TECHNICAL MASTERY</span>
        <div className="flex gap-6">
          <span className="hover:text-gray-400 cursor-pointer">System Status</span>
          <span className="hover:text-gray-400 cursor-pointer">API Documentation</span>
          <span className="hover:text-gray-400 cursor-pointer">Compliance</span>
        </div>
      </footer>
    </div>
  );
}