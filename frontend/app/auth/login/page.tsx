'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async(e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password });
    const res = await fetch('http://127.0.0.1:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    alert(data.message);
    router.push("/auth/register");
  };


  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'url(/tools-bg.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(6, 27, 89, 0.55)',
        backdropFilter: 'blur(4px)',
      }}/>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '88px',
        background: 'rgba(10, 25, 79, 0.85)',
      }}/>
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '88px',
        background: 'rgba(10, 25, 79, 0.85)',
      }}/>

      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '420px',
        background: 'rgba(255, 255, 255, 0.97)',
        borderRadius: '24px',
        padding: '42px 34px',
        boxShadow: '0 24px 80px rgba(0, 0, 0, 0.22)',
        border: '1px solid rgba(15, 23, 42, 0.12)',
      }}>
        <h1 style={{
          textAlign: 'center',
          fontSize: '30px',
          fontWeight: 700,
          marginBottom: '26px',
          color: '#101828',
        }}>Login</h1>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: '8px',
              letterSpacing: '0.03em',
            }}>
              Username/Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Masukkan username atau email"
              style={{
                width: '100%',
                padding: '14px 14px',
                border: '1px solid rgba(15, 23, 42, 0.16)',
                borderRadius: '14px',
                background: '#f8fafc',
                fontSize: '15px',
                color: '#0f172a',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: '8px',
              letterSpacing: '0.03em',
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Masukkan password"
                style={{
                  width: '100%',
                  padding: '14px 52px 14px 14px',
                  border: '1px solid rgba(15, 23, 42, 0.16)',
                  borderRadius: '14px',
                  background: '#f8fafc',
                  fontSize: '15px',
                  color: '#0f172a',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#334155',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '24px',
            fontSize: '13px',
            color: '#475569',
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                style={{ width: '16px', height: '16px', accentColor: '#0f172a' }}
              />
              Remember me
            </label>
            <a href="#" style={{ color: '#0f172a', fontWeight: 600, textDecoration: 'none' }}>
              Forgot Password
            </a>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '14px',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background 0.2s ease',
              marginBottom: '18px',
            }}
          >
            Log In
          </button>

          <p style={{
            textAlign: 'center',
            fontSize: '13px',
            color: '#475569',
            margin: 0,
          }}>
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" style={{ color: '#0f172a', fontWeight: 700, textDecoration: 'none' }}>
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}