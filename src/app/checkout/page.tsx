"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const run = async () => {
      try {
        const orderRes = await fetch("/api/razorpay/order", { method: "POST" });
        const { order } = await orderRes.json();
        if (!order) throw new Error("Order creation failed");

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: "VC-scenario Premium",
          description: "Unlock full access",
          order_id: order.id,
          handler: async function (response: any) {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            if (verifyRes.ok) {
              router.push("/dashboard");
            } else {
              alert("Payment verification failed!");
            }
          },
          theme: { color: "#1e3a8a" },
        };

        // @ts-ignore
        const rz = new window.Razorpay(options);
        rz.open();
      } catch (e) {
        console.error(e);
        alert("Unable to start checkout.");
      }
    };
    run();
  }, [router, params]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-800">
      <h1 className="text-xl font-semibold">Opening Razorpay secure checkout…</h1>
    </div>
  );
}
