"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Image from "next/image";

import { LogOut } from "lucide-react";

export default function Navigation() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-neon-blue/20 shadow-lg shadow-neon-blue/10">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl group">
            <div className="w-8 h-8 bg-neon-blue rounded-lg flex items-center justify-center text-black font-black shadow-[0_0_15px_hsl(var(--neon-blue))] group-hover:scale-110 transition-all">
              G
            </div>
            <span className="text-neon-cyan" style={{ textShadow: '0 0 5px hsl(var(--neon-cyan))' }}>GuessHub</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/markets"
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                isActive("/markets")
                  ? "text-neon-blue shadow-[0_0_10px_hsl(var(--neon-blue)/0.7)] bg-neon-blue/10"
                  : "text-slate-300 hover:bg-secondary hover:text-neon-blue"
              }`}
            >
              Markets
            </Link>
            <Link
              href="/leaderboard"
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                isActive("/leaderboard")
                  ? "text-neon-pink shadow-[0_0_10px_hsl(var(--neon-pink)/0.7)] bg-neon-pink/10"
                  : "text-slate-300 hover:bg-secondary hover:text-neon-pink"
              }`}
            >
              Leaderboard
            </Link>
            <Link
              href="/portfolio"
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                isActive("/portfolio")
                  ? "text-neon-purple shadow-[0_0_10px_hsl(var(--neon-purple)/0.7)] bg-neon-purple/10"
                  : "text-slate-300 hover:bg-secondary hover:text-neon-purple"
              }`}
            >
              Portfolio
            </Link>
            <Link
              href="/categories"
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                isActive("/categories")
                  ? "text-neon-green shadow-[0_0_10px_hsl(var(--neon-green)/0.7)] bg-neon-green/10"
                  : "text-slate-300 hover:bg-secondary hover:text-neon-green"
              }`}
            >
              Categories
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-lg border border-neon-green/20">
                  <span className="text-sm font-semibold text-slate-400">Balance:</span>
                  <span className="text-sm font-bold text-neon-green" style={{ textShadow: '0 0 5px hsl(var(--neon-green))' }}>
                    ${session.user.balance?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {session.user.image && (
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full ring-2 ring-neon-purple/50"
                    />
                  )}
                  <span className="hidden md:inline font-semibold text-slate-200">{session.user.name}</span>
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="p-2 text-slate-400 hover:text-neon-red hover:bg-secondary rounded-lg transition-all"
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2 bg-neon-blue text-black font-bold rounded-lg hover:shadow-[0_0_20px_hsl(var(--neon-blue))] transition-all transform hover:scale-105"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
