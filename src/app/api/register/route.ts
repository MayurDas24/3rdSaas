import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import Razorpay from "razorpay";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, contact, email, password } = body;

    // ✅ Validation
    if (!firstName || !lastName || !email || !password || !contact) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Check for existing user
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // ✅ Hash password
    const hashedPassword = await hash(password, 10);
    const name = `${firstName} ${lastName}`.trim();

    // ✅ Create user (not premium yet)
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        contact,
        isPremium: false,
      },
    });

    // ✅ Create Razorpay Order
    const order = await razorpay.orders.create({
      amount: 49900, // ₹499.00
      currency: "INR",
      receipt: `receipt_${newUser.id}`,
      notes: { userId: newUser.id },
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
