"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Flame } from "lucide-react";

interface Market {
  _id: string;
  title: string;
  category: string;
  pool: { YES: number; NO: number };
  volume?: number;
}

const categories = ["All", "Politics", "Sports", "Entertainment", "Crypto", "Business", "Science"];

export default function MarketsPage() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [trending, setTrending] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function fetchMarkets() {
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set("search", searchQuery);
        if (selectedCategory && selectedCategory !== "All") {
          params.set("category", selectedCategory);
        }

        const response = await fetch(`/api/markets?${params}`);
        const data = await response.json();

        setMarkets(data.markets || []);
        setTrending(data.trending || []);
      } catch (error) {
        console.error("Failed to fetch markets:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMarkets();
  }, [searchQuery, selectedCategory]);

  const calculatePercentage = (pool: { YES: number; NO: number }) => {
    const total = pool.YES + pool.NO;
    if (total === 0) return 50;
    return Math.round((pool.YES / total) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-blue rounded-full border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-neon-blue font-semibold text-lg" style={{ textShadow: '0 0 8px hsl(var(--neon-blue))' }}>Loading Markets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-secondary/30 backdrop-blur-sm border-b border-neon-blue/20 shadow-lg shadow-neon-blue/10">
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-neon-blue mb-4" style={{ textShadow: '0 0 10px hsl(var(--neon-blue))' }}>Markets</h1>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all transform hover:scale-105 ${
                  selectedCategory === cat
                    ? "bg-neon-blue/20 text-neon-blue shadow-[0_0_10px_hsl(var(--neon-blue)/0.7)]"
                    : "bg-secondary text-slate-300 hover:bg-secondary/70 hover:text-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mt-4 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-secondary focus:border-neon-blue rounded-lg outline-none bg-background text-slate-100"
            />
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-8">
        {trending.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Flame className="w-7 h-7 text-neon-pink animate-pulse" />
              <h2 className="text-2xl font-bold text-neon-pink" style={{ textShadow: '0 0 8px hsl(var(--neon-pink))' }}>Trending Markets</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trending.map((market) => {
                const yesPercent = calculatePercentage(market.pool);
                return (
                  <Link
                    key={market._id}
                    href={`/markets/${market._id}`}
                    className="group block p-5 bg-secondary/40 border-2 border-transparent rounded-lg hover:border-neon-pink/80 hover:shadow-[0_0_20px_hsl(var(--neon-pink)/0.5)] transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-100 mb-2 line-clamp-2 group-hover:text-neon-pink transition-colors text-lg">
                          {market.title}
                        </h3>
                        <span className="inline-block px-3 py-1 bg-neon-pink/10 text-neon-pink text-xs font-semibold rounded-full">
                          {market.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-1 bg-background/50 p-3 rounded-lg border border-neon-green/20">
                        <div className="text-xs text-neon-green font-semibold mb-1">Yes</div>
                        <div className="text-2xl font-black text-neon-green" style={{ textShadow: '0 0 5px hsl(var(--neon-green))' }}>{yesPercent}¢</div>
                      </div>
                      <div className="flex-1 bg-background/50 p-3 rounded-lg border border-neon-red/20">
                        <div className="text-xs text-neon-red font-semibold mb-1">No</div>
                        <div className="text-2xl font-black text-neon-red" style={{ textShadow: '0 0 5px hsl(var(--neon-red))' }}>{100 - yesPercent}¢</div>
                      </div>
                    </div>

                    {market.volume && (
                      <div className="text-sm text-slate-400 font-medium">
                        Volume: <span className="font-bold text-slate-200">${market.volume.toLocaleString()}</span>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-neon-blue mb-6" style={{ textShadow: '0 0 8px hsl(var(--neon-blue))' }}>
            All Markets {markets.length > 0 && `(${markets.length})`}
          </h2>
          
          {markets.length === 0 ? (
            <div className="text-center py-20 bg-secondary/30 rounded-lg border border-neon-blue/20">
              <Search className="w-16 h-16 mx-auto mb-6 text-slate-500" />
              <h3 className="text-2xl font-bold text-slate-200 mb-3">No markets found</h3>
              <p className="text-slate-400 text-lg">Try adjusting your search or category filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {markets.map((market) => {
                const yesPercent = calculatePercentage(market.pool);
                return (
                  <Link
                    key={market._id}
                    href={`/markets/${market._id}`}
                    className="group block p-5 bg-secondary/40 border-2 border-transparent rounded-lg hover:border-neon-blue/80 hover:shadow-[0_0_20px_hsl(var(--neon-blue)/0.5)] transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-100 mb-2 line-clamp-2 group-hover:text-neon-blue transition-colors text-lg">
                          {market.title}
                        </h3>
                        <span className="inline-block px-3 py-1 bg-neon-blue/10 text-neon-blue text-xs font-semibold rounded-full">
                          {market.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-1 bg-background/50 p-3 rounded-lg border border-neon-green/20">
                        <div className="text-xs text-neon-green font-semibold mb-1">Yes</div>
                        <div className="text-2xl font-black text-neon-green" style={{ textShadow: '0 0 5px hsl(var(--neon-green))' }}>{yesPercent}¢</div>
                      </div>
                      <div className="flex-1 bg-background/50 p-3 rounded-lg border border-neon-red/20">
                        <div className="text-xs text-neon-red font-semibold mb-1">No</div>
                        <div className="text-2xl font-black text-neon-red" style={{ textShadow: '0 0 5px hsl(var(--neon-red))' }}>{100 - yesPercent}¢</div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
