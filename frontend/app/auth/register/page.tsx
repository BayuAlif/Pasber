"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //handling confrim password
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Password tidak sama");
      return;
    }

    const res = await fetch("http://127.0.0.1:8000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });
    const data = await res.json();
    alert(data.message);
    router.push("/auth/login");
  }



  //api ke backend
  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/auth/bg-auth.png')",
        }}
      />

      <div className="absolute inset-0 bg-white/50" />

      <div className="absolute top-0 left-0 w-full h-24 bg-[#000121]/90 opacity-70" />

      <div className="absolute bottom-0 left-0 w-full h-24 bg-[#000121]/90 opacity-70" />

      <div className="relative z-10 w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border-2 border-black">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Register
        </h1>

        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000121] text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000121] text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000121] text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000121] text-black"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#000121] text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Have an account?{" "}
          <a href="#" className="text-[#000121] hover:underline">
            Login
          </a>
        </p>
      </div>
    </main>
  );
}