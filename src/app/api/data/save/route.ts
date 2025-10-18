import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { scenarios, benchmarks, waterfall } = await req.json();

    // --- Clear old data ---
    await prisma.scenario.deleteMany({ where: { userId: user.id } });
    await prisma.benchmark.deleteMany({ where: { userId: user.id } });
    await prisma.waterfall.deleteMany({ where: { userId: user.id } });

    // --- Save new data ---
    await prisma.user.update({
      where: { id: user.id },
      data: {
        scenarios: {
          create: scenarios.map((s: any) => ({
            name: s.scenario,
            exitMultiple: s.exitMultiple,
            winners: s.winners,
            neutrals: s.neutrals,
            writeOffs: s.writeOffs,
            tvpi: s.tvpi,
            irr: s.irr,
          })),
        },
        benchmarks: {
          create: benchmarks.map((b: any) => ({
            metric: b.metric,
            fundPerformance: b.fundPerformance,
            peerMedian: b.peerMedian,
            topQuartile: b.topQuartile,
          })),
        },
        waterfalls: {
          create: waterfall.map((w: any) => ({
            year: w.year,
            lpDistribution: w.lpDistribution,
            gpDistribution: w.gpDistribution,
            lpCumulative: w.lpCumulative,
            gpCumulative: w.gpCumulative,
          })),
        },
      },
    });

    return NextResponse.json({ message: "Data saved successfully" });
  } catch (err) {
    console.error("Save error:", err);
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}
