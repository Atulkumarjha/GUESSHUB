"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Trophy } from "lucide-react";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { BackgroundBeams } from "@/components/ui/BackgroundBeams";
import { FloatingCard } from "@/components/ui/FloatingCard";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/Container";
import { GradientText } from "@/components/ui/GradientText";
import { NumberTicker } from "@/components/ui/NumberTicker";
import { Meteors } from "@/components/ui/Meteors";
import { Badge } from "@/components/ui/Badge";

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
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        <AnimatedBackground />
        <Meteors number={25} />
        <div className="text-center relative z-10">
          <div className="w-16 h-16 border-4 border-neon-pink rounded-full border-t-transparent animate-spin mx-auto mb-4"></div>
          <GradientText className="text-xl font-semibold">Loading Leaderboard...</GradientText>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <BackgroundBeams />
      
      <Container size="xl" className="relative z-10 py-12">
        {/* Header */}
        <FloatingCard delay={0}>
          <div className="text-center mb-10 space-y-4">
            <Trophy className="w-16 h-16 mx-auto text-[#FF00FF] animate-pulse" />
            <h1 className="text-5xl sm:text-6xl font-bold">
              <GradientText className="text-5xl sm:text-6xl">Leaderboard</GradientText>
            </h1>
            <p className="text-gray-400 text-lg">Top traders ranked by net worth</p>
          </div>
        </FloatingCard>

        {/* Leaderboard Table */}
        <FloatingCard delay={0.2}>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Rank</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Trader</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">Balance</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400 hidden sm:table-cell">EV (Open)</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">Net Worth</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {leaderboard.map((user, index) => (
                      <tr key={user.userId} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center w-12 h-12">
                            {index === 0 && <span className="text-4xl animate-bounce">🥇</span>}
                            {index === 1 && <span className="text-4xl">🥈</span>}
                            {index === 2 && <span className="text-4xl">🥉</span>}
                            {index > 2 && (
                              <span className="text-white font-bold text-lg bg-white/5 w-10 h-10 rounded-full flex items-center justify-center border border-white/20">
                                {index + 1}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {user.image && (
                              <Image
                                src={user.image}
                                alt={user.name || "User"}
                                width={40}
                                height={40}
                                className="rounded-full ring-2 ring-[#FF00FF]/50"
                              />
                            )}
                            <span className="font-semibold text-white text-lg">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-semibold text-[#39FF14] text-lg inline-flex items-center justify-end">
                            $<NumberTicker value={user.balance} decimalPlaces={2} />
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right hidden sm:table-cell">
                          <span className="font-semibold text-[#00BFFF] text-lg inline-flex items-center justify-end">
                            $<NumberTicker value={user.ev} decimalPlaces={2} />
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span className="font-bold text-2xl text-[#FF00FF] inline-flex items-center">
                              $<NumberTicker value={user.netWorth} decimalPlaces={2} />
                            </span>
                            {index < 3 && (
                              <Badge 
                                variant={index === 0 ? "warning" : index === 1 ? "secondary" : "default"}
                                className="text-xs px-2 py-0.5"
                              >
                                TOP {index + 1}
                              </Badge>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {leaderboard.length === 0 && (
                <div className="text-center py-16">
                  <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                  <h3 className="text-lg font-semibold text-white mb-2">No traders yet</h3>
                  <p className="text-gray-400">Be the first to trade and top the leaderboard!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </FloatingCard>
      </Container>
    </div>
  );
}
