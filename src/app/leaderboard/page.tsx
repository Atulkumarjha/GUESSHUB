"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Trophy } from "lucide-react";

interface LeaderboardUser {
  userId: string;
  name: string;
  image?: string;
  balance: number;
  ev: number;
  netWorth: number;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/leaderboard", { cache: "no-store" });
        const data = await res.json();
        setLeaderboard(data.leaderboard || []);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-pink rounded-full border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-neon-pink font-semibold text-lg" style={{ textShadow: '0 0 8px hsl(var(--neon-pink))' }}>Loading Leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-neon-pink animate-pulse" />
          <h1 className="text-4xl font-black text-neon-pink mb-3" style={{ textShadow: '0 0 10px hsl(var(--neon-pink))' }}>Leaderboard</h1>
          <p className="text-slate-400 text-lg font-medium">Top traders ranked by net worth</p>
        </div>

        <div className="bg-secondary/30 backdrop-blur-sm rounded-lg border border-neon-pink/20 overflow-hidden shadow-lg shadow-neon-pink/10">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neon-pink/20">
                  <th className="px-6 py-4 text-left text-sm font-bold text-neon-pink">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-neon-pink">
                    Trader
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-neon-pink">
                    Balance
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-neon-pink">
                    EV (Open)
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-neon-pink">
                    Net Worth
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary">
                {leaderboard.map((user, index) => (
                  <tr key={user.userId} className="hover:bg-secondary/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center w-12 h-12">
                        {index === 0 && <span className="text-4xl animate-bounce">🥇</span>}
                        {index === 1 && <span className="text-4xl">🥈</span>}
                        {index === 2 && <span className="text-4xl">🥉</span>}
                        {index > 2 && (
                          <span className="text-slate-300 font-bold text-lg bg-secondary w-10 h-10 rounded-full flex items-center justify-center border-2 border-neon-pink/30">{index + 1}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        {user.image && (
                          <Image
                            src={user.image}
                            alt={user.name || "User"}
                            width={40}
                            height={40}
                            className="rounded-full ring-2 ring-neon-pink/50"
                          />
                        )}
                        <span className="font-bold text-slate-100 text-lg">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className="font-semibold text-neon-green text-lg" style={{ textShadow: '0 0 5px hsl(var(--neon-green))' }}>${user.balance.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className="font-semibold text-neon-blue text-lg" style={{ textShadow: '0 0 5px hsl(var(--neon-blue))' }}>${user.ev.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className="font-black text-2xl text-neon-pink" style={{ textShadow: '0 0 8px hsl(var(--neon-pink))' }}>
                        ${user.netWorth.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {leaderboard.length === 0 && (
            <div className="text-center py-16">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-slate-500" />
              <h3 className="text-lg font-semibold text-slate-200 mb-2">No traders yet</h3>
              <p className="text-slate-400">Be the first to trade and top the leaderboard!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
