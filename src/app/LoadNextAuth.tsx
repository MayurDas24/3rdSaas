"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function LoadNextAuth() {
  useEffect(() => {
    console.log("📦 LoadNextAuth component mounted.");
  }, []);

  return (
    <Script
      src="https://unpkg.com/next-auth@4.24.5/dist/react.js"
      strategy="afterInteractive"
      onLoad={() => {
        console.log("✅ NextAuth client SDK loaded successfully.");
      }}
      onError={(e) => {
        console.error("❌ Failed to load NextAuth client SDK.", e);
      }}
    />
  );
}
