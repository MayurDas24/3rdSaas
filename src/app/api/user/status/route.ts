import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ isPremium: false });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { isPremium: true },
    });

    return NextResponse.json({ isPremium: user?.isPremium ?? false });
  } catch (err) {
    console.error("Error checking premium:", err);
    return NextResponse.json({ isPremium: false });
  }
}
