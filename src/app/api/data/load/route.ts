import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        scenarios: true,
        benchmarks: true,
        waterfalls: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      scenarios: user.scenarios || [],
      benchmarks: user.benchmarks || [],
      waterfall: user.waterfalls || [],
    });
  } catch (err) {
    console.error("Load error:", err);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}
