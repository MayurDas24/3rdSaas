"use client";
import { SessionProvider } from "next-auth/react";
import Script from "next/script";
import React from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {/* Razorpay script for checkout */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      {children}
    </SessionProvider>
  );
}
