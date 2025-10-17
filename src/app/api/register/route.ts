import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, lastName, contact, email, password } = await req.json();
    if (!name || !email || !password) return NextResponse.json({ message: "Missing fields" }, { status: 400 });

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ message: "User already exists. Try Sign In." }, { status: 409 });

    const hashed = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name: `${name} ${lastName || ""}`.trim(),
        email,
        contact,
        password: hashed,
        isPremium: false,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
