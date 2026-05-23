"use client";

import React, { useEffect, useState } from "react";
import { LogIn, X, ArrowRight, Sparkles } from "lucide-react";

export type LoginSuccessData = {
  nama: string;
  email: string;
  role?: string;
};

type Props = {
  show: boolean;
  data?: LoginSuccessData;
  onClose: () => void;
  onGoToDashboard?: () => void;
};

export default function LoginSuccessPopup({ show, data, onClose, onGoToDashboard }: Props) {
  const [visible, setVisible] = useState(false);
  const [animateCheck, setAnimateCheck] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      setTimeout(() => setAnimateCheck(true), 200);
      setTimeout(() => setShowParticles(true), 400);
    } else {
      setAnimateCheck(false);
      setShowParticles(false);
      const t = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(t);
    }
  }, [show]);

  if (!visible) return null;

  const particles = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    angle: i * 60,
    delay: i * 0.07,
  }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
        opacity: show ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#13161e",
          border: "1px solid #1e2230",
          borderRadius: "20px",
          padding: "36px 32px 28px",
          width: "100%",
          maxWidth: "400px",
          position: "relative",
          transform: show ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
          opacity: show ? 1 : 0,
          transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease",
          boxShadow: "0 0 60px rgba(249,115,22,0.08), 0 24px 64px rgba(0,0,0,0.5)",
          overflow: "hidden",
        }}
      >
        {/* Subtle top glow line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "60%",
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(249,115,22,0.5), transparent)",
            opacity: animateCheck ? 1 : 0,
            transition: "opacity 0.6s ease 0.3s",
          }}
        />

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid #2a2f3e",
            borderRadius: "8px",
            width: "30px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#6b7280",
          }}
        >
          <X size={14} />
        </button>

        {/* Icon + Particles */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
          <div style={{ position: "relative", width: "80px", height: "80px" }}>
            {/* Particles */}
            {particles.map((p) => (
              <div
                key={p.id}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  background: "#f97316",
                  transform: showParticles
                    ? `translate(-50%, -50%) rotate(${p.angle}deg) translateY(-44px) scale(0)`
                    : "translate(-50%, -50%) rotate(0deg) translateY(0px) scale(1)",
                  opacity: showParticles ? 0 : 0,
                  transition: `transform 0.6s cubic-bezier(0.2,0,0.8,1) ${p.delay}s, opacity 0.6s ease ${p.delay}s`,
                  ...(showParticles && {
                    opacity: 0,
                    animation: `particle-out 0.6s ease ${p.delay}s forwards`,
                  }),
                }}
              />
            ))}

            <style>{`
              @keyframes particle-out {
                0% { opacity: 1; transform: translate(-50%, -50%) rotate(var(--angle, 0deg)) translateY(0px) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) rotate(var(--angle, 0deg)) translateY(-44px) scale(0); }
              }
            `}</style>

            {/* Glow BG */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: animateCheck
                  ? "radial-gradient(circle, rgba(249,115,22,0.18) 0%, rgba(249,115,22,0.04) 70%)"
                  : "transparent",
                transition: "background 0.5s ease",
              }}
            />
            {/* Ring */}
            <div
              style={{
                position: "absolute",
                inset: "0",
                borderRadius: "50%",
                border: "2px solid rgba(249,115,22,0.3)",
                transform: animateCheck ? "scale(1)" : "scale(0.5)",
                opacity: animateCheck ? 1 : 0,
                transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease",
              }}
            />
            {/* Icon circle */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: animateCheck
                  ? "translate(-50%, -50%) scale(1)"
                  : "translate(-50%, -50%) scale(0.3)",
                opacity: animateCheck ? 1 : 0,
                transition: "all 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.1s",
                background: "#f97316",
                borderRadius: "50%",
                width: "56px",
                height: "56px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: animateCheck ? "0 0 24px rgba(249,115,22,0.5)" : "none",
              }}
            >
              <LogIn size={24} color="white" />
            </div>
          </div>
        </div>

        {/* Text */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <p
            style={{
              fontSize: "9px",
              color: "#f97316",
              letterSpacing: "2px",
              fontWeight: 700,
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            Login Berhasil
          </p>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 800,
              color: "#f1f5f9",
              margin: "0 0 8px",
              lineHeight: 1.2,
            }}
          >
            Selamat Datang Kembali! 👋
          </h2>
          <p style={{ fontSize: "12px", color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
            Kamu berhasil masuk. Yuk, mulai kelola kendaraanmu!
          </p>
        </div>

        {/* Detail card */}
        {data && (
          <div
            style={{
              background: "#0f1117",
              border: "1px solid #1e2230",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {[
              { label: "Nama", value: data.nama },
              { label: "Email", value: data.email },
              ...(data.role ? [{ label: "Role", value: data.role, accent: true }] : []),
            ].map((row) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "12px",
                }}
              >
                <span
                  style={{ fontSize: "11px", color: "#4b5563", fontWeight: 600, flexShrink: 0 }}
                >
                  {row.label}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: row.accent ? "#f97316" : "#e2e8f0",
                    textAlign: "right",
                  }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {onGoToDashboard && (
            <button
              onClick={onGoToDashboard}
              style={{
                width: "100%",
                padding: "13px",
                background: "#f97316",
                border: "none",
                borderRadius: "10px",
                fontSize: "12px",
                fontWeight: 700,
                color: "white",
                cursor: "pointer",
                letterSpacing: "1px",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              <Sparkles size={14} /> Ke Dashboard <ArrowRight size={13} />
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              width: "100%",
              padding: "12px",
              background: "transparent",
              border: "1px solid #2a2f3e",
              borderRadius: "10px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#6b7280",
              cursor: "pointer",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
