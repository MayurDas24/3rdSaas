"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  useEffect(() => {
    const initPayment = async () => {
      try {
        const res = await fetch("/api/razorpay/order", { method: "POST" });
        const data = await res.json();

        if (!res.ok || !data.order) throw new Error(data.message || "Order creation failed");

        const order = data.order;

        const options: any = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: "VC Scenario Premium",
          description: "Unlock premium dashboard access",
          order_id: order.id,
          handler: async (response: any) => {
            alert("✅ Payment successful!");
            router.push("/dashboard?mode=premium");
          },
          prefill: { email },
          theme: { color: "#1e3a8a" },
        };

        if (!(window as any).Razorpay) {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => new (window as any).Razorpay(options).open();
          document.body.appendChild(script);
        } else {
          new (window as any).Razorpay(options).open();
        }
      } catch (err) {
        console.error("❌ Checkout error:", err);
        alert("Could not open checkout. Try again.");
      }
    };

    initPayment();
  }, [email, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <h1 className="text-lg text-gray-700">Opening Razorpay secure checkout…</h1>
    </div>
  );
}
