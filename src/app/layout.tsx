import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthSessionProvider from "../../components/providers/session-provider";
import Link from "next/link";

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
    <html lang="en" className="dark bg-black">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative bg-black text-white`}
      >
        <AuthSessionProvider>
          <nav className="border-b border-gray-800 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center">
              <Link href="/" className="text-xl font-bold mr-8">
                GuessHub
              </Link>
              <Link href="/markets" className="mr-4 hover:text-gray-300">
                Markets
              </Link>
              <Link href="/categories" className="mr-4 hover:text-gray-300">
                Categories
                </Link>
                <Link href="/portfolio" className="mr-4">Portfolio</Link>
            </div>
          </nav>
          <div className="relative z-10">{children}</div>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
