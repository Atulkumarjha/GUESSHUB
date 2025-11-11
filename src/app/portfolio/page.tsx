"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Briefcase, TrendingUp, TrendingDown, Loader2, Wallet, Coins, Scale } from "lucide-react";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { BackgroundBeams } from "@/components/ui/BackgroundBeams";
import { FloatingCard } from "@/components/ui/FloatingCard";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { GradientText } from "@/components/ui/GradientText";
import { NumberTicker } from "@/components/ui/NumberTicker";
import { Badge } from "@/components/ui/Badge";
import { MovingBorder } from "@/components/ui/MovingBorder";

// Define more specific types for clarity
interface MarketInfo {
  title: string;
  yesPrice: number;
  noPrice: number;
}

interface Position {
  _id: string;
  market: MarketInfo;
  outcome: "yes" | "no";
  shares: number;
  avgPrice: number;
}

interface PortfolioData {
  positions: Position[];
  totalValue: number;
  totalPnl: number;
}

export default function PortfolioPage() {
  const { data: session, status } = useSession();
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      const fetchPortfolio = async () => {
        setLoading(true);
        try {
          const res = await fetch("/api/portfolio");
          if (res.ok) {
            const data: PortfolioData = await res.json();
            setPortfolio(data);
          } else {
            setPortfolio(null);
          }
        } catch (error) {
          console.error("Error fetching portfolio:", error);
          setPortfolio(null);
        } finally {
          setLoading(false);
        }
      };
      fetchPortfolio();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  const PositionCard = ({ position }: { position: Position }) => {
    const { market, outcome, shares, avgPrice } = position;
    const currentPrice = outcome === "yes" ? market.yesPrice : 1 - market.yesPrice;
    const value = shares * currentPrice;
    const pnl = (currentPrice - avgPrice) * shares;
    const pnlPercentage = (pnl / (avgPrice * shares)) * 100;
    const isProfit = pnl >= 0;

    return (
      <MovingBorder duration={3000} containerClassName="w-full">
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between mb-4 sm:mb-5 gap-3">
            <h3 className="font-bold text-base sm:text-lg text-slate-200 flex-1 min-w-0 line-clamp-2">{market.title}</h3>
            <Badge variant={outcome === "yes" ? "success" : "danger"} className="ml-2 flex-shrink-0 text-xs">
              {outcome.toUpperCase()}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-sm mb-4 sm:mb-5">
            <div className="flex flex-col">
              <span className="text-slate-400 mb-1 text-xs">Shares</span>
              <span className="font-bold text-sm sm:text-base text-slate-200">{shares}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 mb-1 text-xs">Avg. Price</span>
              <span className="font-bold text-sm sm:text-base text-slate-200">${avgPrice.toFixed(2)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 mb-1 text-xs">Current Value</span>
              <span className="font-bold text-sm sm:text-base text-neon-blue">${value.toFixed(2)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 mb-1 text-xs">PnL</span>
              <div className={`flex items-center gap-1 font-bold text-sm sm:text-base ${isProfit ? 'text-neon-green' : 'text-neon-red'}`}>
                {isProfit ? <TrendingUp size={14} className="flex-shrink-0" /> : <TrendingDown size={14} className="flex-shrink-0" />}
                <span className="truncate">{pnl.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 sm:pt-5 border-t border-slate-700/50">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs sm:text-sm">Return</span>
              <span className={`font-bold text-base sm:text-lg ${isProfit ? 'text-neon-green' : 'text-neon-red'}`}>
                {isFinite(pnlPercentage) ? pnlPercentage.toFixed(2) : '0.00'}%
              </span>
            </div>
          </div>
        </div>
      </MovingBorder>
    );
  };

  const renderContent = () => {
    if (loading || status === "loading") {
      return (
        <FloatingCard delay={0.2}>
          <div className="flex flex-col items-center justify-center text-center py-20">
            <Loader2 className="w-16 h-16 text-neon-purple animate-spin mb-6" />
            <GradientText className="text-2xl font-bold mb-2">Loading Portfolio...</GradientText>
            <p className="text-slate-500">Please wait while we fetch your data.</p>
          </div>
        </FloatingCard>
      );
    }

    if (!session) {
      return (
        <FloatingCard delay={0.2}>
          <SpotlightCard>
            <div className="text-center py-20 bg-secondary/30 backdrop-blur-sm rounded-2xl border border-neon-red/20 p-8">
              <Wallet className="mx-auto text-slate-600 mb-4" size={64} />
              <GradientText className="text-3xl font-bold mb-3">Access Denied</GradientText>
              <p className="text-slate-400 text-lg">Please log in to view your portfolio.</p>
            </div>
          </SpotlightCard>
        </FloatingCard>
      );
    }

    if (!portfolio || portfolio.positions.length === 0) {
      return (
        <FloatingCard delay={0.2}>
          <SpotlightCard>
            <div className="text-center py-20 bg-secondary/30 backdrop-blur-sm rounded-2xl border border-neon-blue/20 p-8">
              <Briefcase className="mx-auto text-slate-600 mb-4" size={64} />
              <GradientText className="text-3xl font-bold mb-3">No Positions Yet</GradientText>
              <p className="text-slate-400 text-lg">Your portfolio is empty. Start making predictions to build it up!</p>
            </div>
          </SpotlightCard>
        </FloatingCard>
      );
    }

    return (
      <>
        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12">
          <FloatingCard delay={0.1}>
            <SpotlightCard>
              <div className="bg-secondary/40 backdrop-blur-sm rounded-2xl border border-neon-purple/30 p-5 sm:p-6 lg:p-8 flex items-center gap-4">
                <div className="p-3 bg-neon-purple/20 rounded-full shadow-[0_0_15px_hsl(var(--neon-purple)/0.5)] flex-shrink-0">
                  <Coins className="text-neon-purple w-6 h-6 sm:w-7 sm:h-7"/>
                </div>
                <div className="min-w-0">
                  <p className="text-slate-400 text-xs sm:text-sm mb-1 sm:mb-2">Total Value</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white truncate">
                    $<NumberTicker value={portfolio.totalValue} decimalPlaces={2} />
                  </p>
                </div>
              </div>
            </SpotlightCard>
          </FloatingCard>

          <FloatingCard delay={0.2}>
            <SpotlightCard>
              <div className="bg-secondary/40 backdrop-blur-sm rounded-2xl border border-neon-purple/30 p-5 sm:p-6 lg:p-8 flex items-center gap-4">
                <div className={`p-3 rounded-full shadow-[0_0_15px_hsl(var(${portfolio.totalPnl >= 0 ? '--neon-green' : '--neon-red'})/0.5)] ${portfolio.totalPnl >= 0 ? 'bg-neon-green/20' : 'bg-neon-red/20'} flex-shrink-0`}>
                  <Scale className={`${portfolio.totalPnl >= 0 ? 'text-neon-green' : 'text-neon-red'} w-6 h-6 sm:w-7 sm:h-7`}/>
                </div>
                <div className="min-w-0">
                  <p className="text-slate-400 text-xs sm:text-sm mb-1 sm:mb-2">Total PnL</p>
                  <p className={`text-2xl sm:text-3xl font-bold ${portfolio.totalPnl >= 0 ? 'text-neon-green' : 'text-neon-red'} truncate`}>
                    ${portfolio.totalPnl >= 0 ? '+' : ''}<NumberTicker value={Math.abs(portfolio.totalPnl)} decimalPlaces={2} />
                  </p>
                </div>
              </div>
            </SpotlightCard>
          </FloatingCard>

          <FloatingCard delay={0.3}>
            <SpotlightCard>
              <div className="bg-secondary/40 backdrop-blur-sm rounded-2xl border border-neon-purple/30 p-5 sm:p-6 lg:p-8 flex items-center gap-4">
                <div className="p-3 bg-neon-purple/20 rounded-full shadow-[0_0_15px_hsl(var(--neon-purple)/0.5)] flex-shrink-0">
                  <Briefcase className="text-neon-purple w-6 h-6 sm:w-7 sm:h-7"/>
                </div>
                <div className="min-w-0">
                  <p className="text-slate-400 text-xs sm:text-sm mb-1 sm:mb-2">Active Positions</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white">
                    <NumberTicker value={portfolio.positions.length} />
                  </p>
                </div>
              </div>
            </SpotlightCard>
          </FloatingCard>
        </div>

        {/* Positions List */}
        <div className="flex flex-col gap-4 sm:gap-6">
          {portfolio.positions.map((p, idx) => (
            <FloatingCard key={p._id} delay={0.4 + idx * 0.05}>
              <PositionCard position={p} />
            </FloatingCard>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen text-slate-300 relative overflow-hidden">
      <AnimatedBackground />
      <BackgroundBeams />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        <FloatingCard delay={0}>
          <div className="mb-10 sm:mb-12 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              <GradientText className="text-4xl sm:text-5xl lg:text-6xl">My Portfolio</GradientText>
            </h1>
            <p className="text-base sm:text-lg text-slate-400">Track your investments and performance</p>
          </div>
        </FloatingCard>
        
        {renderContent()}
      </div>
    </div>
  );
}
