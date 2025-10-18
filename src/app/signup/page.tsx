// src/app/signup/page.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, contact, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      // go to checkout for payment — pass the email so verify can update the correct user
      router.push(`/checkout?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      console.error(err);
      setError("Server error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Create Your Account</h2>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <input placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)}
            className="p-3 border rounded" required />
          <input placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)}
            className="p-3 border rounded" required />
        </div>

        <input placeholder="Contact number" value={contact} onChange={(e) => setContact(e.target.value)}
          className="p-3 border rounded mb-3" />

        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="p-3 border rounded mb-3" required />

        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="p-3 border rounded mb-3" required />

        {error && <div className="text-red-600 mb-2">{error}</div>}

        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded mb-3 hover:bg-blue-700">
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <div className="text-center text-gray-500">or</div>

        <div className="mt-3 text-center">
          {/* Google OAuth button left for later — simple placeholder */}
          <button type="button" className="w-full border py-2 rounded inline-flex items-center justify-center gap-2">
            <img src="/google-icon.svg" alt="g" className="w-5 h-5" />
            Continue with Google
          </button>
        </div>
      </form>
    </div>
  );
}
