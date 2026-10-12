import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Self-hosted (no Google Fonts network dependency at runtime).
// Files downloaded from fonts.gstatic.com (OFL-licensed).
const display = localFont({
  src: "./fonts/michroma-latin.woff2",
  variable: "--font-display",
  weight: "400",
  display: "swap",
});

const sans = localFont({
  src: [
    { path: "./fonts/inter-latin.woff2", weight: "300" },
    { path: "./fonts/inter-latin.woff2", weight: "400" },
    { path: "./fonts/inter-latin.woff2", weight: "500" },
    { path: "./fonts/inter-latin.woff2", weight: "600" },
    { path: "./fonts/inter-latin.woff2", weight: "700" },
    { path: "./fonts/inter-latin.woff2", weight: "800" },
  ],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Torres Capitol College — School Voting System",
  description:
    "A transparent, secure, and convenient voting platform for Torres Capitol College community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${sans.variable} antialiased bg-black text-white`}
      >
        {children}
      </body>
    </html>
  );
}
