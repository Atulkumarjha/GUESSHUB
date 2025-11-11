"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowRight, BarChart, Briefcase, Trophy } from "lucide-react";

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-10 h-10 border-2 border-neon-blue rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-background">
        <div className="text-center max-w-3xl px-6">
          <h1 className="text-7xl font-black mb-6 text-neon-cyan" style={{ textShadow: '0 0 10px hsl(var(--neon-cyan)), 0 0 20px hsl(var(--neon-cyan))' }}>
            GuessHub
          </h1>
          <p className="text-2xl text-slate-300 mb-4 font-semibold">
            Trade on the Edge of Reality
          </p>
          <p className="text-lg text-slate-400 mb-10 leading-relaxed">
            Predict real-world events. Outsmart the crowd. Claim your rewards in the neon-drenched arena of prediction markets.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/login"
              className="group px-8 py-4 bg-neon-blue text-black font-bold rounded-lg hover:shadow-[0_0_20px_hsl(var(--neon-blue))] transition-all transform hover:scale-105 flex items-center gap-2"
            >
              Join the Arena <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/markets"
              className="px-8 py-4 border-2 border-neon-pink text-neon-pink font-semibold rounded-lg hover:bg-neon-pink/10 hover:shadow-[0_0_20px_hsl(var(--neon-pink))] transition-all"
            >
              Browse Markets
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-3 gap-6">
            <div className="bg-secondary/50 backdrop-blur-sm rounded-lg p-6 border border-neon-blue/30">
              <div className="text-4xl font-bold text-neon-blue" style={{ textShadow: '0 0 8px hsl(var(--neon-blue))' }}>$2M+</div>
              <div className="text-sm text-slate-400 mt-2 font-medium">Trading Volume</div>
            </div>
            <div className="bg-secondary/50 backdrop-blur-sm rounded-lg p-6 border border-neon-pink/30">
              <div className="text-4xl font-bold text-neon-pink" style={{ textShadow: '0 0 8px hsl(var(--neon-pink))' }}>500+</div>
              <div className="text-sm text-slate-400 mt-2 font-medium">Active Markets</div>
            </div>
            <div className="bg-secondary/50 backdrop-blur-sm rounded-lg p-6 border border-neon-green/30">
              <div className="text-4xl font-bold text-neon-green" style={{ textShadow: '0 0 8px hsl(var(--neon-green))' }}>10K+</div>
              <div className="text-sm text-slate-400 mt-2 font-medium">Traders</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="mb-8 bg-secondary/30 backdrop-blur-sm rounded-lg p-6 border border-neon-purple/20">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">
            Welcome back, <span className="text-neon-purple" style={{ textShadow: '0 0 8px hsl(var(--neon-purple))' }}>{session.user.name}</span>
          </h1>
          <p className="text-slate-400">
            Your balance: <span className="font-bold text-neon-green text-xl">${session.user.balance?.toFixed(2) || "0.00"}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link
            href="/markets"
            className="group p-6 bg-secondary/40 rounded-lg border-2 border-transparent hover:border-neon-blue hover:shadow-[0_0_20px_hsl(var(--neon-blue)/0.5)] transition-all"
          >
            <BarChart className="w-10 h-10 mb-3 text-neon-blue" />
            <h3 className="text-xl font-bold text-slate-100 mb-2">
              Browse Markets
            </h3>
            <p className="text-slate-400">
              Explore prediction markets and start trading.
            </p>
          </Link>

          <Link
            href="/portfolio"
            className="group p-6 bg-secondary/40 rounded-lg border-2 border-transparent hover:border-neon-pink hover:shadow-[0_0_20px_hsl(var(--neon-pink)/0.5)] transition-all"
          >
            <Briefcase className="w-10 h-10 mb-3 text-neon-pink" />
            <h3 className="text-xl font-bold text-slate-100 mb-2">
              My Portfolio
            </h3>
            <p className="text-slate-400">
              Track your positions and profits.
            </p>
          </Link>

          <Link
            href="/leaderboard"
            className="group p-6 bg-secondary/40 rounded-lg border-2 border-transparent hover:border-neon-cyan hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.5)] transition-all"
          >
            <Trophy className="w-10 h-10 mb-3 text-neon-cyan" />
            <h3 className="text-xl font-bold text-slate-100 mb-2">
              Leaderboard
            </h3>
            <p className="text-slate-400">
              See top traders and rankings.
            </p>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-6 bg-secondary/40 rounded-lg border border-neon-green/20">
            <div className="text-sm font-medium text-slate-400 mb-2">Available Balance</div>
            <div className="text-3xl font-bold text-neon-green" style={{ textShadow: '0 0 8px hsl(var(--neon-green))' }}>
              ${session.user.balance?.toFixed(2) || "0.00"}
            </div>
          </div>

          <div className="p-6 bg-secondary/40 rounded-lg border border-neon-blue/20">
            <div className="text-sm font-medium text-slate-400 mb-2">Active Positions</div>
            <div className="text-3xl font-bold text-neon-blue">-</div>
          </div>

          <div className="p-6 bg-secondary/40 rounded-lg border border-neon-pink/20">
            <div className="text-sm font-medium text-slate-400 mb-2">Total P&L</div>
            <div className="text-3xl font-bold text-neon-pink">-</div>
          </div>

          <div className="p-6 bg-secondary/40 rounded-lg border border-neon-red/20">
            <div className="text-sm font-medium text-slate-400 mb-2">Win Rate</div>
            <div className="text-3xl font-bold text-neon-red">-</div>
          </div>
        </div>
      </div>
    </div>
  );
}
