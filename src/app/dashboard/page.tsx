"use client";

import { useEffect, useState } from "react";
import VCScenarioApp from "./VCScenarioApp";

export default function DashboardPage() {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPremium = async () => {
      try {
        const res = await fetch("/api/user/status");
        const data = await res.json();
        setIsPremium(data.isPremium);
      } catch (err) {
        console.error("Failed to fetch user status:", err);
      } finally {
        setLoading(false);
      }
    };
    checkPremium();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <h1 className="text-gray-600 text-lg">Loading your dashboard…</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <VCScenarioApp isPremium={isPremium} />
    </main>
  );
}
