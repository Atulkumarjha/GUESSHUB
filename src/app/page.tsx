"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowRight, BarChart, Briefcase, Trophy } from "lucide-react";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { FloatingCard } from "@/components/ui/FloatingCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/Container";
import { GradientText } from "@/components/ui/GradientText";
import { TextGenerateEffect } from "@/components/ui/TextGenerateEffect";
import { Meteors } from "@/components/ui/Meteors";
import { BackgroundBeams } from "@/components/ui/BackgroundBeams";
import { NumberTicker } from "@/components/ui/NumberTicker";

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-10 h-10 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <AnimatedBackground />
        <Meteors number={30} />
        
        <Container size="xl" className="relative z-10">
          <div className="text-center py-20 space-y-8">
            {/* Hero Section */}
            <FloatingCard delay={0}>
              <div className="space-y-6">
                <TextGenerateEffect 
                  words="GuessHub: Trade on the Edge of Reality"
                  className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight"
                />
                <p className="text-xl sm:text-2xl text-gray-300 font-medium max-w-3xl mx-auto">
                  Predict real-world events. Outsmart the crowd.
                </p>
                <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  Claim your rewards in the arena of prediction markets.
                </p>
              </div>
            </FloatingCard>

            {/* CTA Buttons */}
            <FloatingCard delay={0.2}>
              <div className="flex items-center justify-center gap-4 flex-wrap pt-4">
                <Link href="/login">
                  <Button size="lg" className="group">
                    Join the Arena
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/markets">
                  <Button size="lg" variant="outline">
                    Browse Markets
                  </Button>
                </Link>
              </div>
            </FloatingCard>

            {/* Stats Grid */}
            <FloatingCard delay={0.4}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12">
                <Card>
                  <CardContent className="p-6 text-center space-y-2">
                    <div className="text-4xl font-bold text-white">
                      $<NumberTicker value={2000000} />+
                    </div>
                    <p className="text-sm text-gray-400 font-medium">Trading Volume</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center space-y-2">
                    <div className="text-4xl font-bold text-white">
                      <NumberTicker value={500} />+
                    </div>
                    <p className="text-sm text-gray-400 font-medium">Active Markets</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center space-y-2">
                    <div className="text-4xl font-bold text-white">
                      <NumberTicker value={10000} />+
                    </div>
                    <p className="text-sm text-gray-400 font-medium">Traders</p>
                  </CardContent>
                </Card>
              </div>
            </FloatingCard>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <BackgroundBeams />
      
      <Container size="xl" className="relative z-10 py-12">
        {/* Welcome Card */}
        <FloatingCard delay={0}>
          <Card className="mb-8">
            <CardHeader className="space-y-2">
              <CardTitle className="text-4xl">
                Welcome back, <GradientText className="text-4xl">{session.user.name}</GradientText>
              </CardTitle>
              <CardDescription className="text-lg">
                Your balance: <span className="font-bold text-white text-2xl">${session.user.balance?.toFixed(2) || "0.00"}</span>
              </CardDescription>
            </CardHeader>
          </Card>
        </FloatingCard>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <FloatingCard delay={0.1}>
            <Link href="/markets" className="block group">
              <Card className="h-full transition-all hover:scale-[1.02] hover:border-white/40">
                <CardHeader>
                  <BarChart className="w-12 h-12 mb-4 text-white" />
                  <CardTitle>Browse Markets</CardTitle>
                  <CardDescription>
                    Explore prediction markets and start trading.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </FloatingCard>

          <FloatingCard delay={0.2}>
            <Link href="/portfolio" className="block group">
              <Card className="h-full transition-all hover:scale-[1.02] hover:border-white/40">
                <CardHeader>
                  <Briefcase className="w-12 h-12 mb-4 text-white" />
                  <CardTitle>My Portfolio</CardTitle>
                  <CardDescription>
                    Track your positions and profits.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </FloatingCard>

          <FloatingCard delay={0.3}>
            <Link href="/leaderboard" className="block group">
              <Card className="h-full transition-all hover:scale-[1.02] hover:border-white/40">
                <CardHeader>
                  <Trophy className="w-12 h-12 mb-4 text-white" />
                  <CardTitle>Leaderboard</CardTitle>
                  <CardDescription>
                    See top traders and rankings.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </FloatingCard>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <FloatingCard delay={0.4}>
            <Card>
              <CardContent className="p-6 space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Available Balance</p>
                <p className="text-3xl font-bold text-white">
                  ${session.user.balance?.toFixed(2) || "0.00"}
                </p>
              </CardContent>
            </Card>
          </FloatingCard>

          <FloatingCard delay={0.5}>
            <Card>
              <CardContent className="p-6 space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Positions</p>
                <p className="text-3xl font-bold text-white">0</p>
              </CardContent>
            </Card>
          </FloatingCard>

          <FloatingCard delay={0.6}>
            <Card>
              <CardContent className="p-6 space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total P&L</p>
                <p className="text-3xl font-bold text-white">$0.00</p>
              </CardContent>
            </Card>
          </FloatingCard>

          <FloatingCard delay={0.7}>
            <Card>
              <CardContent className="p-6 space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Win Rate</p>
                <p className="text-3xl font-bold text-white">0%</p>
              </CardContent>
            </Card>
          </FloatingCard>
        </div>
      </Container>
    </div>
  );
}
