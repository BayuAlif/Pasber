"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Bell, Save, X, Eye, EyeOff, Camera, AlertTriangle, Loader2,
} from "lucide-react";
import Sidebar from "@/app/components/sidebar/page";

// ─── Types ────────────────────────────────────────────────────────────────────

type UserProfile = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  primaryAddress: string;
  accountId: string;
  avatarUrl?: string;
};

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
};

type ToastType = "success" | "error";

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, type, onClose }: { message: string; type: ToastType; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border text-[13px] font-semibold shadow-xl"
      style={{
        background: type === "success" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
        borderColor: type === "success" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)",
        color: type === "success" ? "#22c55e" : "#ef4444",
      }}
    >
      {type === "success" ? <Save size={14} /> : <AlertTriangle size={14} />}
      {message}
      <button onClick={onClose} className="ml-1 opacity-60 hover:opacity-100 bg-transparent border-none cursor-pointer p-0">
        <X size={13} />
      </button>
    </div>
  );
}

// ─── Form Input ───────────────────────────────────────────────────────────────

function FormInput({
  label, value, onChange, type = "text", placeholder, disabled,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#4b5563]">
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className="bg-[#0f1117] border border-[#2a2f3e] rounded-lg px-3.5 py-[10px] text-[13.5px] text-[#e2e8f0] placeholder:text-[#374151] outline-none focus:border-[#f97316] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      />
    </div>
  );
}

// ─── Password Input ───────────────────────────────────────────────────────────

function PasswordInput({
  label, value, onChange, placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#4b5563]">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#0f1117] border border-[#2a2f3e] rounded-lg pl-3.5 pr-10 py-[10px] text-[13.5px] text-[#e2e8f0] placeholder:text-[#374151] outline-none focus:border-[#f97316] transition-colors"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4b5563] hover:text-[#9ca3af] transition-colors bg-transparent border-none cursor-pointer p-0"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

// ─── Section Label ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold tracking-[2px] uppercase text-[#f97316] mb-5 pb-2.5 border-b border-[#1e2230] m-0">
      {children}
    </p>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EditProfilePage() {
  const [profile, setProfile]         = useState<UserProfile>({
    firstName: "", lastName: "", phoneNumber: "",
    emailAddress: "", primaryAddress: "", accountId: "",
  });
  const [original, setOriginal]       = useState<UserProfile | null>(null);
  const [passwords, setPasswords]     = useState<PasswordForm>({ currentPassword: "", newPassword: "" });
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [deleting, setDeleting]       = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast]             = useState<{ message: string; type: ToastType } | null>(null);
  const fileInputRef                  = useRef<HTMLInputElement>(null);

  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(" ");
  const initials = [profile.firstName[0], profile.lastName[0]].filter(Boolean).join("").toUpperCase();

  // ── Fetch profile ─────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://127.0.0.1:8000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (!res.ok) throw new Error("Gagal fetch profile");
        const result = await res.json();
        const data = result.data ?? result;

        const mapped: UserProfile = {
          firstName:      data.firstName    ?? data.nama?.split(" ")[0]  ?? "",
          lastName:       data.lastName     ?? data.nama?.split(" ").slice(1).join(" ") ?? "",
          phoneNumber:    data.phoneNumber  ?? data.noTelp   ?? "",
          emailAddress:   data.emailAddress ?? data.email    ?? "",
          primaryAddress: data.primaryAddress ?? data.alamat ?? "",
          accountId:      data.accountId    ?? data.kodeAkun ?? "",
          avatarUrl:      data.avatarUrl    ?? data.foto     ?? undefined,
        };
        setProfile(mapped);
        setOriginal(mapped);
      } catch (err) {
        console.error(err);
        setToast({ message: "Gagal memuat data profil.", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ── Save profile ──────────────────────────────────────────────────────────

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const body: Record<string, string> = {
        firstName:      profile.firstName,
        lastName:       profile.lastName,
        phoneNumber:    profile.phoneNumber,
        emailAddress:   profile.emailAddress,
        primaryAddress: profile.primaryAddress,
      };
      if (passwords.currentPassword && passwords.newPassword) {
        body.currentPassword = passwords.currentPassword;
        body.newPassword     = passwords.newPassword;
      }

      const res = await fetch("http://127.0.0.1:8000/api/profile", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Gagal menyimpan perubahan");
      setOriginal(profile);
      setPasswords({ currentPassword: "", newPassword: "" });
      setToast({ message: "Profil berhasil diperbarui.", type: "success" });
    } catch (err) {
      console.error(err);
      setToast({ message: "Gagal memperbarui profil.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  // ── Cancel ────────────────────────────────────────────────────────────────

  const handleCancel = () => {
    if (original) setProfile(original);
    setPasswords({ currentPassword: "", newPassword: "" });
  };

  // ── Delete account ────────────────────────────────────────────────────────

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/api/account", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (!res.ok) throw new Error("Gagal menghapus akun");
      localStorage.removeItem("token");
      window.location.href = "/auth/login";
    } catch (err) {
      console.error(err);
      setToast({ message: "Gagal menghapus akun.", type: "error" });
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  // ── Avatar upload ─────────────────────────────────────────────────────────

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // TODO: upload to /api/profile/avatar with FormData
    const objectUrl = URL.createObjectURL(file);
    setProfile((p) => ({ ...p, avatarUrl: objectUrl }));
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen bg-[#0f1117] text-[#e2e8f0]" style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

      {/* SIDEBAR */}
      <Sidebar activeHref="/User/profile" />

      {/* MAIN */}
      <main className="ml-[200px] flex-1 px-9 py-8">

        {/* Header */}
        <div className="flex justify-between items-start mb-7">
          <div>
            <h1 className="text-[26px] font-bold m-0">
              Edit <span className="text-[#f97316]">Profile</span>
            </h1>
            <p className="text-[13px] text-[#6b7280] mt-1 mb-0">
              Kelola informasi akun dan keamanan akun PASBER Anda.
            </p>
          </div>
          <div className="w-9 h-9 bg-[#1e2230] rounded-lg flex items-center justify-center cursor-pointer border border-[#2a2f3e]">
            <Bell size={16} color="#9ca3af" />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 gap-3 text-[#4b5563]">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-[13px]">Memuat data profil...</span>
          </div>
        ) : (
          <div className="grid gap-6" style={{ gridTemplateColumns: "260px 1fr" }}>

            {/* ── Profile Card ── */}
          <div className="bg-[#13161e] border border-[#1e2230] rounded-xl p-7 flex flex-col items-center h-fit">
              {/* Avatar */}
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-[#1a1d28] border-2 border-[#2a2f3e] flex items-center justify-center overflow-hidden">
                  {profile.avatarUrl ? (
                    <Image
                      src={`http://localhost:8000/storage/${profile.avatarUrl}`}
                      alt="avatar"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="text-[28px] font-bold text-[#6b7280]">{initials || "--"}</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0.5 right-0.5 w-7 h-7 rounded-full bg-[#f97316] hover:bg-[#ea6c10] flex items-center justify-center border-2 border-[#13161e] cursor-pointer transition-colors"
                >
                  <Camera size={12} color="#fff" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              <p className="text-[16px] font-bold text-white text-center mb-4 m-0">
                {fullName || "— —"}
              </p>

              <div className="w-full border-t border-[#1e2230] pt-4 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-[0.5px] text-[#4b5563] font-bold">Account ID</span>
                  <span className="text-[11px] text-[#6b7280] font-mono">{profile.accountId || "—"}</span>
                </div>
              </div>
            </div>

            {/* ── Form Card ── */}
            <div className="bg-[#13161e] border border-[#1e2230] rounded-xl overflow-hidden">

              {/* Profile section */}
              <div className="p-7 border-b border-[#1e2230]">
                <SectionLabel>Profile Pengguna</SectionLabel>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <FormInput label="First Name" value={profile.firstName} placeholder="First name"
                    onChange={(v) => setProfile((p) => ({ ...p, firstName: v }))} />
                  <FormInput label="Last Name" value={profile.lastName} placeholder="Last name"
                    onChange={(v) => setProfile((p) => ({ ...p, lastName: v }))} />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <FormInput label="Phone Number" type="tel" value={profile.phoneNumber} placeholder="+62 ..."
                    onChange={(v) => setProfile((p) => ({ ...p, phoneNumber: v }))} />
                  <FormInput label="Email Address" type="email" value={profile.emailAddress} placeholder="email@example.com"
                    onChange={(v) => setProfile((p) => ({ ...p, emailAddress: v }))} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#4b5563]">Primary Address</label>
                  <textarea
                    value={profile.primaryAddress}
                    placeholder="Alamat lengkap..."
                    rows={3}
                    onChange={(e) => setProfile((p) => ({ ...p, primaryAddress: e.target.value }))}
                    className="bg-[#0f1117] border border-[#2a2f3e] rounded-lg px-3.5 py-[10px] text-[13.5px] text-[#e2e8f0] placeholder:text-[#374151] outline-none focus:border-[#f97316] transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Password section */}
              <div className="p-7 border-b border-[#1e2230]">
                <SectionLabel>Password dan Keamanan</SectionLabel>
                <div className="grid grid-cols-2 gap-4">
                  <PasswordInput label="Sandi Sekarang" value={passwords.currentPassword} placeholder="••••••••"
                    onChange={(v) => setPasswords((p) => ({ ...p, currentPassword: v }))} />
                  <PasswordInput label="Sandi Baru" value={passwords.newPassword} placeholder="Min. 8 characters"
                    onChange={(v) => setPasswords((p) => ({ ...p, newPassword: v }))} />
                </div>
              </div>

              {/* Actions */}
              <div className="px-7 py-5 border-b border-[#1e2230] flex gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-[10px] bg-[#f97316] hover:bg-[#ea6c10] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[12px] font-bold uppercase tracking-[1px] rounded-lg transition-colors cursor-pointer border-none"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Perbarui Profile
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-5 py-[10px] bg-transparent border border-[#2a2f3e] hover:bg-[#1a1d28] text-[#9ca3af] text-[12px] font-bold uppercase tracking-[1px] rounded-lg transition-colors cursor-pointer"
                >
                  <X size={14} />
                  Batalkan Perubahan
                </button>
              </div>

              {/* Danger zone */}
              <div className="px-7 py-5">
                <p className="text-[10px] font-bold tracking-[2px] uppercase text-[#4b5563] mb-3 m-0">
                  Peringatan
                </p>
                <div
                  className="flex items-center justify-between gap-4 rounded-xl px-5 py-4 border"
                  style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.2)" }}
                >
                  <div>
                    <p className="text-[14px] font-bold text-[#ef4444] mb-1 m-0">Menghapus Akun Permanen</p>
                    <p className="text-[12px] text-[#4b5563] m-0 leading-relaxed max-w-md">
                      Tindakan ini bersifat ireversibel. Seluruh riwayat layanan, catatan digital,
                      dan pelacakan garansi yang aktif akan dihapus permanen dari database PASBER.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    className="shrink-0 px-4 py-[10px] bg-[#ef4444] hover:bg-[#dc2626] text-white text-[11px] font-bold uppercase tracking-[1px] rounded-lg transition-colors cursor-pointer border-none"
                  >
                    Hapus Akun
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* ── DELETE CONFIRM MODAL ── */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="bg-[#13161e] border border-[#1e2230] rounded-[14px] p-7 w-full max-w-[400px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-5">
              <div>
                <p className="text-[10px] text-[#4b5563] tracking-[1.5px] font-bold m-0 mb-1">KONFIRMASI HAPUS</p>
                <p className="text-[18px] font-bold text-white m-0">Hapus Akun?</p>
              </div>
              <button onClick={() => setShowDeleteModal(false)} className="bg-transparent border-none cursor-pointer text-[#6b7280] p-1">
                <X size={18} />
              </button>
            </div>
            <div
              className="rounded-xl px-4 py-3.5 mb-5 border"
              style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.2)" }}
            >
              <div className="flex items-start gap-2.5">
                <AlertTriangle size={15} color="#ef4444" className="mt-0.5 shrink-0" />
                <p className="text-[12.5px] text-[#9ca3af] m-0 leading-relaxed">
                  Seluruh data akun, riwayat service, dan garansi aktif akan dihapus secara permanen dan <strong className="text-[#ef4444]">tidak dapat dipulihkan</strong>.
                </p>
              </div>
            </div>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex-1 flex items-center justify-center gap-2 py-[11px] bg-[#ef4444] hover:bg-[#dc2626] disabled:opacity-50 text-white text-[12px] font-bold tracking-[1px] rounded-lg cursor-pointer border-none transition-colors"
              >
                {deleting ? <Loader2 size={13} className="animate-spin" /> : <AlertTriangle size={13} />}
                Ya, Hapus Akun
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-[11px] bg-[#1a1d28] border border-[#2a2f3e] rounded-lg text-[12px] font-bold text-[#6b7280] cursor-pointer hover:bg-[#1e2230] transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <style>{`
        * { box-sizing: border-box; }
        input::placeholder, textarea::placeholder { color: #374151; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}
