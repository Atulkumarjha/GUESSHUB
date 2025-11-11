"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Briefcase, TrendingUp, TrendingDown, Loader2, Wallet, Coins, Scale } from "lucide-react";

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
      <div className="bg-secondary/30 backdrop-blur-sm rounded-2xl border border-neon-purple/20 p-6
                      transition-all duration-300 hover:border-neon-purple/50 hover:shadow-[0_0_20px_hsl(var(--neon-purple)/0.2)]">
        <h3 className="font-bold text-lg text-slate-200 mb-3">{market.title}</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div className="flex flex-col">
            <span className="text-slate-400 mb-1">Outcome</span>
            <span className={`font-bold text-base ${outcome === 'yes' ? 'text-neon-green' : 'text-neon-red'}`}>{outcome.toUpperCase()}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400 mb-1">Shares</span>
            <span className="font-bold text-base text-slate-200">{shares}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400 mb-1">Avg. Price</span>
            <span className="font-bold text-base text-slate-200">${avgPrice.toFixed(2)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400 mb-1">Current Value</span>
            <span className="font-bold text-base text-slate-200">${value.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800/50 flex items-center justify-end gap-4">
            <span className="text-slate-400 text-sm">PnL</span>
            <div className={`flex items-center gap-2 font-bold text-lg ${isProfit ? 'text-neon-green' : 'text-neon-red'}`}>
              {isProfit ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              <span>{pnl.toFixed(2)} ({isFinite(pnlPercentage) ? pnlPercentage.toFixed(2) : '0.00'}%)</span>
            </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading || status === "loading") {
      return (
        <div className="flex flex-col items-center justify-center text-center py-20">
          <Loader2 className="w-16 h-16 text-neon-purple animate-spin mb-6" />
          <h2 className="text-2xl font-bold text-slate-300">Loading Portfolio...</h2>
          <p className="text-slate-500">Please wait while we fetch your data.</p>
        </div>
      );
    }

    if (!session) {
      return (
        <div className="text-center py-20 bg-secondary/30 backdrop-blur-sm rounded-2xl border border-neon-red/20 p-8">
          <Wallet className="mx-auto text-slate-600 mb-4" size={64} />
          <h2 className="text-3xl font-bold text-neon-red mb-3">Access Denied</h2>
          <p className="text-slate-400 text-lg">Please log in to view your portfolio.</p>
        </div>
      );
    }

    if (!portfolio || portfolio.positions.length === 0) {
      return (
        <div className="text-center py-20 bg-secondary/30 backdrop-blur-sm rounded-2xl border border-neon-blue/20 p-8">
          <Briefcase className="mx-auto text-slate-600 mb-4" size={64} />
          <h2 className="text-3xl font-bold text-neon-blue mb-3">No Positions Yet</h2>
          <p className="text-slate-400 text-lg">Your portfolio is empty. Start making predictions to build it up!</p>
        </div>
      );
    }

    return (
      <>
        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-secondary/30 backdrop-blur-sm rounded-2xl border border-neon-purple/20 p-6 flex items-center gap-4">
                <div className="p-3 bg-neon-purple/10 rounded-full"><Coins className="text-neon-purple" size={28}/></div>
                <div>
                    <p className="text-slate-400">Total Value</p>
                    <p className="text-2xl font-bold text-white">${portfolio.totalValue.toFixed(2)}</p>
                </div>
            </div>
            <div className="bg-secondary/30 backdrop-blur-sm rounded-2xl border border-neon-purple/20 p-6 flex items-center gap-4">
                <div className={`p-3 rounded-full ${portfolio.totalPnl >= 0 ? 'bg-neon-green/10' : 'bg-neon-red/10'}`}>
                    <Scale className={`${portfolio.totalPnl >= 0 ? 'text-neon-green' : 'text-neon-red'}`} size={28}/>
                </div>
                <div>
                    <p className="text-slate-400">Total PnL</p>
                    <p className={`text-2xl font-bold ${portfolio.totalPnl >= 0 ? 'text-neon-green' : 'text-neon-red'}`}>
                        ${portfolio.totalPnl.toFixed(2)}
                    </p>
                </div>
            </div>
            <div className="bg-secondary/30 backdrop-blur-sm rounded-2xl border border-neon-purple/20 p-6 flex items-center gap-4">
                <div className="p-3 bg-neon-purple/10 rounded-full"><Briefcase className="text-neon-purple" size={28}/></div>
                <div>
                    <p className="text-slate-400">Positions</p>
                    <p className="text-2xl font-bold text-white">{portfolio.positions.length}</p>
                </div>
            </div>
        </div>

        {/* Positions List */}
        <div className="flex flex-col gap-6">
          {portfolio.positions.map((p) => (
            <PositionCard key={p._id} position={p} />
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen text-slate-300">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 
            className="text-5xl md:text-6xl font-bold mb-4 text-neon-purple"
            style={{ textShadow: '0 0 10px hsl(var(--neon-purple)), 0 0 20px hsl(var(--neon-purple))' }}
          >
            My Portfolio
          </h1>
          <p className="text-lg text-slate-400">Track your investments and performance</p>
        </div>
        
        {renderContent()}
      </div>
    </div>
  );
}
