import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DottedGlowBackground } from "../../components/ui/dotted-glow-background";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GuessHub",
  description: "A real time bidding app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white.`}
    <html lang="en" className="dark bg-black">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative bg-black text-white`}
      >
        <DottedGlowBackground 
          className="fixed inset-0 z-0"
          darkColor="rgba(255,255,255,0.5)"
          darkGlowColor="rgba(59, 130, 246, 0.7)"
        />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
