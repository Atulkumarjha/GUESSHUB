"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Flame } from "lucide-react";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { FloatingCard } from "@/components/ui/FloatingCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/ui/Container";
import { GradientText } from "@/components/ui/GradientText";
import { Badge } from "@/components/ui/Badge";
import { Meteors } from "@/components/ui/Meteors";
import { BackgroundBeams } from "@/components/ui/BackgroundBeams";

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
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        <AnimatedBackground />
        <Meteors number={20} />
        <div className="text-center relative z-10">
          <div className="w-16 h-16 border-4 border-white rounded-full border-t-transparent animate-spin mx-auto mb-4"></div>
          <GradientText className="text-xl">Loading Markets...</GradientText>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <BackgroundBeams />
      
      {/* Header Section */}
      <div className="bg-black/40 backdrop-blur-sm border-b border-white/10 relative z-10">
        <Container size="xl" className="py-8">
          <h1 className="text-5xl sm:text-6xl font-bold mb-8">
            <GradientText className="text-5xl sm:text-6xl">Prediction Markets</GradientText>
          </h1>
          
          {/* Category Filters */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 mb-6">
            {categories.map((cat) => (
              <Badge
                key={cat}
                variant={selectedCategory === cat ? "default" : "secondary"}
                className={`cursor-pointer px-5 py-2 text-sm font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === cat ? "" : "hover:scale-105"
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12"
            />
          </div>
        </Container>
      </div>

      <Container size="xl" className="relative z-10 py-12">
        {/* Trending Markets */}
        {trending.length > 0 && (
          <div className="mb-12">
            <FloatingCard delay={0.1}>
              <div className="flex items-center gap-3 mb-6">
                <Flame className="w-7 h-7 text-[#FF00FF] animate-pulse" />
                <h2 className="text-3xl font-bold">
                  <GradientText className="text-3xl">Trending Markets</GradientText>
                </h2>
              </div>
            </FloatingCard>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trending.map((market, index) => {
                const yesPercent = calculatePercentage(market.pool);
                return (
                  <FloatingCard key={market._id} delay={0.1 + index * 0.05}>
                    <Link href={`/markets/${market._id}`} className="block group">
                      <Card className="h-full hover:scale-[1.02] transition-all">
                        <CardHeader className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="line-clamp-2 group-hover:text-[#FF00FF] transition-colors text-base leading-tight">
                              {market.title}
                            </CardTitle>
                          </div>
                          <Badge variant="purple" className="text-xs w-fit">
                            {market.category}
                          </Badge>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-black/40 p-4 rounded-lg border border-[#39FF14]/30 hover:border-[#39FF14]/50 transition-colors">
                              <p className="text-xs text-[#39FF14]/80 font-semibold mb-1">Yes</p>
                              <p className="text-3xl font-bold text-[#39FF14]">{yesPercent}¢</p>
                            </div>
                            <div className="bg-black/40 p-4 rounded-lg border border-red-500/30 hover:border-red-500/50 transition-colors">
                              <p className="text-xs text-red-500/80 font-semibold mb-1">No</p>
                              <p className="text-3xl font-bold text-red-500">{100 - yesPercent}¢</p>
                            </div>
                          </div>

                          {market.volume && (
                            <CardDescription className="text-sm">
                              Volume: <span className="font-bold text-white">${market.volume.toLocaleString()}</span>
                            </CardDescription>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  </FloatingCard>
                );
              })}
            </div>
          </div>
        )}

        {/* All Markets */}
        <div>
          <FloatingCard delay={0.2}>
            <h2 className="text-3xl font-bold mb-6">
              <GradientText className="text-3xl">
                All Markets {markets.length > 0 && `(${markets.length})`}
              </GradientText>
            </h2>
          </FloatingCard>
          
          {markets.length === 0 ? (
            <FloatingCard delay={0.3}>
              <Card>
                <CardContent className="text-center py-16">
                  <Search className="w-16 h-16 mx-auto mb-6 text-gray-500" />
                  <h3 className="text-2xl font-bold text-white mb-3">No markets found</h3>
                  <p className="text-gray-400 text-lg">Try adjusting your search or category filter.</p>
                </CardContent>
              </Card>
            </FloatingCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {markets.map((market, index) => {
                const yesPercent = calculatePercentage(market.pool);
                return (
                  <FloatingCard key={market._id} delay={0.3 + index * 0.05}>
                    <Link href={`/markets/${market._id}`} className="block group">
                      <Card className="h-full hover:scale-[1.02] transition-all">
                        <CardHeader className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="line-clamp-2 group-hover:text-[#00BFFF] transition-colors text-base leading-tight">
                              {market.title}
                            </CardTitle>
                          </div>
                          <Badge variant="default" className="text-xs w-fit">
                            {market.category}
                          </Badge>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-black/40 p-4 rounded-lg border border-[#39FF14]/30 hover:border-[#39FF14]/50 transition-colors">
                              <p className="text-xs text-[#39FF14]/80 font-semibold mb-1">Yes</p>
                              <p className="text-3xl font-bold text-[#39FF14]">{yesPercent}¢</p>
                            </div>
                            <div className="bg-black/40 p-4 rounded-lg border border-red-500/30 hover:border-red-500/50 transition-colors">
                              <p className="text-xs text-red-500/80 font-semibold mb-1">No</p>
                              <p className="text-3xl font-bold text-red-500">{100 - yesPercent}¢</p>
                            </div>
                          </div>

                          {market.volume && (
                            <CardDescription className="text-sm">
                              Volume: <span className="font-bold text-white">${market.volume.toLocaleString()}</span>
                            </CardDescription>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  </FloatingCard>
                );
              })}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
