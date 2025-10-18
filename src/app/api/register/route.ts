// src/app/api/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, contact, email, password } = body;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // check exists
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ message: "User already exists. Try Sign In." }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        password: hashed,
        contact,
        isPremium: false,
      },
      select: { id: true, email: true },
    });

    return NextResponse.json({ ok: true, email: user.email });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
