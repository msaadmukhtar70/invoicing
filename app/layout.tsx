export const metadata = {
  title: "BRIX Invoice Builder",
  description: "Next.js + Tailwind fully functional invoice builder inspired by BRIX Agency design",
};

import "./globals.css";
import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
