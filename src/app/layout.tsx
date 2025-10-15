// PASTE THIS INTO: src/app/layout.tsx

export const metadata = {
  title: 'VC Scenario SaaS',
  description: 'The Future of Fund Forecasting',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

