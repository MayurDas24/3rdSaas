import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    console.log("🟦 Creating Razorpay order...");

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error("❌ Missing Razorpay environment variables");
      return NextResponse.json(
        { message: "Missing Razorpay keys" },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId.trim(),
      key_secret: keySecret.trim(),
    });

    const order = await razorpay.orders.create({
      amount: 49900, // ₹499
      currency: "INR",
      receipt: `order_rcpt_${Date.now()}`,
      notes: {
        description: "VC Scenario Premium Access",
      },
    });

    console.log("✅ Razorpay order created:", order.id);
    return NextResponse.json({ order });
  } catch (error: any) {
    console.error("❌ Razorpay order creation error:", error);
    return NextResponse.json(
      {
        message:
          error.error?.description ||
          error.message ||
          "Razorpay order creation failed",
      },
      { status: 500 }
    );
  }
}
