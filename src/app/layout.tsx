import "./globals.css";
import NextAuthProvider from "./providers";

export const metadata = {
  title: "VC Scenario Tool",
  description: "Analyze investment scenarios and benchmark performance.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
