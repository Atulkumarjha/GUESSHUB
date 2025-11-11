import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthSessionProvider from "../../components/providers/session-provider";
import Navigation from "../../components/Navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "GuessHub - Prediction Markets",
  description: "Trade on prediction markets and earn rewards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased bg-background text-foreground font-sans`}>
        <AuthSessionProvider>
          <Navigation />
          <main>{children}</main>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
