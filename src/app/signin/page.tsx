"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error,setError]=useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) return setError("Invalid credentials");
    // After sign in, if not premium -> checkout
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md border">
        <h2 className="text-2xl font-bold mb-4">Sign In</h2>
        <input className="w-full p-2 border rounded mb-3" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="w-full p-2 border rounded mb-3" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Sign In</button>
        <div className="text-center mt-4">
          <button type="button" onClick={()=>signIn("google",{callbackUrl:"/checkout"})}
            className="w-full border py-2 rounded hover:bg-gray-50 flex items-center gap-2 justify-center">
            <FcGoogle className="text-xl"/> Continue with Google
          </button>
        </div>
      </form>
    </div>
  );
}
