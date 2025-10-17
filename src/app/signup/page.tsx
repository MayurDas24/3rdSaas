"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", lastName: "", contact: "", email: "", password: "" });
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.message || "Error creating account");
    // -> Razorpay
    router.push(`/checkout?email=${encodeURIComponent(form.email)}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={onSubmit} className="bg-white shadow-lg border rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Create Your Account</h2>

        <div className="grid grid-cols-2 gap-2">
          <input className="border p-2 rounded" placeholder="First Name" required
            value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})}/>
          <input className="border p-2 rounded" placeholder="Last Name"
            value={form.lastName} onChange={(e)=>setForm({...form, lastName:e.target.value})}/>
        </div>

        <input className="border p-2 rounded w-full mt-2" placeholder="Contact Number"
          value={form.contact} onChange={(e)=>setForm({...form, contact:e.target.value})}/>
        <input className="border p-2 rounded w-full mt-2" type="email" placeholder="Email" required
          value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})}/>
        <input className="border p-2 rounded w-full mt-2" type="password" placeholder="Password" required
          value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})}/>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button disabled={loading} className="bg-blue-800 hover:bg-blue-900 w-full text-white py-2 rounded mt-4">
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <div className="flex items-center justify-center mt-4">
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/checkout" })}
            className="flex items-center gap-2 border px-4 py-2 rounded hover:bg-gray-50 w-full justify-center"
          >
            <FcGoogle className="text-xl" /> Continue with Google
          </button>
        </div>
      </form>
    </div>
  );
}
