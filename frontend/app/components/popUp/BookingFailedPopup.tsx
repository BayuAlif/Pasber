"use client";

import React, { useEffect, useState } from "react";
import { XCircle, RefreshCcw, X, AlertTriangle } from "lucide-react";

type Props = {
  show: boolean;
  message?: string;
  onClose: () => void;
  onRetry?: () => void;
};

export default function BookingFailedPopup({ show, message, onClose, onRetry }: Props) {
  const [visible, setVisible] = useState(false);
  const [animateIcon, setAnimateIcon] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      setTimeout(() => setAnimateIcon(true), 150);
    } else {
      setAnimateIcon(false);
      const t = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(t);
    }
  }, [show]);

  if (!visible) return null;

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
          border: "1px solid #2a1a1a",
          borderRadius: "20px",
          padding: "36px 32px 28px",
          width: "100%",
          maxWidth: "380px",
          position: "relative",
          transform: show ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
          opacity: show ? 1 : 0,
          transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease",
          boxShadow: "0 0 60px rgba(239,68,68,0.06), 0 24px 64px rgba(0,0,0,0.5)",
        }}
      >
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

        {/* Icon */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: animateIcon
                ? "radial-gradient(circle, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.03) 70%)"
                : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.5s ease",
              position: "relative",
            }}
          >
            {/* Ring */}
            <div
              style={{
                position: "absolute",
                inset: "0",
                borderRadius: "50%",
                border: "2px solid rgba(239,68,68,0.3)",
                transform: animateIcon ? "scale(1)" : "scale(0.5)",
                opacity: animateIcon ? 1 : 0,
                transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease",
              }}
            />
            <div
              style={{
                background: animateIcon ? "#ef4444" : "transparent",
                borderRadius: "50%",
                width: "56px",
                height: "56px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: animateIcon ? "scale(1)" : "scale(0.3)",
                opacity: animateIcon ? 1 : 0,
                transition: "all 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.1s",
                boxShadow: animateIcon ? "0 0 24px rgba(239,68,68,0.4)" : "none",
              }}
            >
              <XCircle size={26} color="white" />
            </div>
          </div>
        </div>

        {/* Text */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <p
            style={{
              fontSize: "9px",
              color: "#ef4444",
              letterSpacing: "2px",
              fontWeight: 700,
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            Booking Gagal
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
            Oops, Ada Masalah!
          </h2>
          <p style={{ fontSize: "12px", color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
            {message || "Booking tidak berhasil diproses. Silakan coba lagi atau hubungi support."}
          </p>
        </div>

        {/* Info box */}
        <div
          style={{
            background: "rgba(239,68,68,0.06)",
            border: "1px solid rgba(239,68,68,0.15)",
            borderRadius: "10px",
            padding: "12px 14px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >
          <AlertTriangle size={14} color="#ef4444" style={{ marginTop: "1px", flexShrink: 0 }} />
          <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0, lineHeight: 1.6 }}>
            Tidak ada perubahan yang tersimpan. Data kamu aman dan tidak ada booking yang terbuat.
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {onRetry && (
            <button
              onClick={onRetry}
              style={{
                width: "100%",
                padding: "13px",
                background: "#ef4444",
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
              <RefreshCcw size={13} /> Coba Lagi
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
