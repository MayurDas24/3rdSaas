"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();

  useEffect(() => {
    const loadRazorpay = () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    };
    loadRazorpay();
  }, []);

  const startPayment = async () => {
    try {
      // 1️⃣ Create Razorpay order
      const orderRes = await fetch("/api/razorpay/order", { method: "POST" });
      const orderData = await orderRes.json();

      if (!orderData?.orderId) {
        alert("Error creating Razorpay order");
        return;
      }

      // 2️⃣ Open Razorpay payment popup
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "VC-Scenario Premium",
        description: "Unlock full dashboard features",
        order_id: orderData.orderId,
        handler: async (response) => {
          // 3️⃣ Verify payment on backend
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const result = await verifyRes.json();

          if (result.success) {
            alert("✅ Payment successful! Redirecting to dashboard...");
            router.push("/dashboard");
          } else {
            alert("❌ Payment verification failed. Please try again.");
          }
        },
        prefill: {
          name: "VC Scenario User",
          email: "user@example.com",
        },
        theme: {
          color: "#1e3a8a",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Error starting payment");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white shadow-md rounded-xl p-8 max-w-md text-center border">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">
          Upgrade to Premium 🚀
        </h1>
        <p className="text-gray-600 mb-6">
          Get access to data saving, report downloads, and advanced analytics.
        </p>
        <button
          onClick={startPayment}
          className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
        >
          Proceed to Pay ₹499
        </button>
      </div>
    </main>
  );
}
