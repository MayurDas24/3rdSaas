"use client";

import { useSession } from "next-auth/react";
import VCScenarioApp from "@/components/VCScenarioApp";

export default function DashboardPage() {
  const { status } = useSession();
  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  }
  return <VCScenarioApp />;
}
