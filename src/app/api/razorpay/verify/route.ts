import crypto from "crypto";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email } = body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
    }

    // Mark user as premium
    await prisma.user.update({
      where: { email },
      data: { isPremium: true },
    });

    return NextResponse.json({ message: "Payment verified successfully" });
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json({ message: "Verification failed" }, { status: 500 });
  }
}
