import Link from "next/link";
import Sparkline from "./Sparkline";

interface MarketCardProps {
  _id: string;
  title: string;
  category?: { name?: string };
  endDate: string | Date;
  yesPrice?: number;
  noPrice?: number;
  totalLiquidity?: number;
  pool?: {
    yes?: number;
    no?: number;
    qYes?: number;
    qNo?: number;
    b?: number;
  };
  history?: Array<{
    timestamp?: Date;
    yesPrice?: number;
    noPrice?: number;
    t?: Date;
    p?: number;
  }>;
}

export default function MarketCard({ market }: { market: MarketCardProps }) {
  // LMSR: Calculate percentage based on pool shares
  const yesShares = (market.pool?.yes || market.pool?.qYes) || 1;
  const noShares = (market.pool?.no || market.pool?.qNo) || 1;
  const totalShares = yesShares + noShares;
  const yesPercent = Math.round((yesShares / totalShares) * 100);

  const endDate = new Date(market.endDate);
  const now = new Date();
  const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // Determine card color scheme based on yes percentage
  const getColorScheme = () => {
    if (yesPercent >= 70) return { 
      from: "from-green-500/20", 
      to: "to-emerald-500/20", 
      border: "border-green-500/40",
      hoverBorder: "group-hover:border-green-400",
      gradient: "from-green-400 via-emerald-500 to-teal-400"
    };
    if (yesPercent >= 50) return { 
      from: "from-blue-500/20", 
      to: "to-cyan-500/20", 
      border: "border-blue-500/40",
      hoverBorder: "group-hover:border-blue-400",
      gradient: "from-blue-400 via-cyan-500 to-sky-400"
    };
    if (yesPercent >= 30) return { 
      from: "from-yellow-500/20", 
      to: "to-orange-500/20", 
      border: "border-yellow-500/40",
      hoverBorder: "group-hover:border-yellow-400",
      gradient: "from-yellow-400 via-orange-500 to-amber-400"
    };
    return { 
      from: "from-red-500/20", 
      to: "to-pink-500/20", 
      border: "border-red-500/40",
      hoverBorder: "group-hover:border-red-400",
      gradient: "from-red-400 via-pink-500 to-rose-400"
    };
  };

  const colorScheme = getColorScheme();

  return (
    <Link
      href={`/markets/${market._id}`}
      className="block group relative"
    >
      {/* Glow effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${colorScheme.gradient} rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-500`}></div>
      
      <div className={`relative bg-gradient-to-br ${colorScheme.from} ${colorScheme.to} backdrop-blur-xl rounded-2xl border-2 ${colorScheme.border} ${colorScheme.hoverBorder} p-6 hover:scale-105 transform transition-all duration-300`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1">
            <h3 className="text-xl font-black mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-200 transition-all line-clamp-2 leading-snug">
              {market.title}
            </h3>
            {market.category && (
              <span className={`inline-block px-4 py-1.5 text-xs font-bold bg-gradient-to-r ${colorScheme.gradient} text-white rounded-full shadow-lg transform hover:scale-110 transition-transform`}>
                {market.category.name}
              </span>
            )}
          </div>
          {/* Status badge */}
          <div className={`ml-4 flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${colorScheme.gradient} flex items-center justify-center text-white font-black text-lg shadow-lg animate-pulse`}>
            {yesPercent}
          </div>
        </div>

        {/* YES/NO Percentages */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className={`text-3xl font-black bg-gradient-to-r ${colorScheme.gradient} bg-clip-text text-transparent drop-shadow-lg`}>
                YES {yesPercent}%
              </span>
              <div className="flex items-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-6 rounded-full bg-gradient-to-t ${colorScheme.gradient} ${
                      i < Math.floor(yesPercent / 33) ? 'opacity-100' : 'opacity-30'
                    } transition-opacity`}
                  />
                ))}
              </div>
            </div>
            <span className="text-lg font-bold text-gray-300">
              NO {100 - yesPercent}%
            </span>
          </div>
          {/* Enhanced progress bar with segments */}
          <div className="relative h-3 bg-gray-900/50 rounded-full overflow-hidden border border-gray-700/50 shadow-inner">
            <div
              className={`absolute inset-y-0 left-0 bg-gradient-to-r ${colorScheme.gradient} transition-all duration-700 ease-out shadow-lg`}
              style={{ width: `${yesPercent}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
            </div>
            {/* Segments */}
            <div className="absolute inset-0 flex">
              {[25, 50, 75].map((mark) => (
                <div
                  key={mark}
                  className="border-l border-gray-700/50"
                  style={{ marginLeft: `${mark}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sparkline Chart with enhanced background */}
        {market.history && market.history.length > 0 && (
          <div className="mb-5 h-20 p-3 bg-gray-900/30 rounded-xl border border-gray-700/30">
            <Sparkline
              data={market.history.map((h) => ({
                t: h.timestamp || h.t || new Date(),
                p: h.yesPrice || h.p || 0,
              }))}
            />
          </div>
        )}

        {/* Footer Info with enhanced styling */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${colorScheme.gradient} animate-pulse`}></div>
            <span className={`text-sm font-bold ${daysLeft > 7 ? 'text-green-400' : daysLeft > 3 ? 'text-yellow-400' : 'text-red-400'}`}>
              {daysLeft > 0 ? `${daysLeft}d left` : "🏁 Ended"}
            </span>
          </div>
          {market.totalLiquidity !== undefined && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Liquidity</span>
              <span className="text-lg font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                ${market.totalLiquidity.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Hover indicator */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className={`text-2xl transform group-hover:translate-x-1 transition-transform`}>
            →
          </div>
        </div>
      </div>
    </Link>
  );
}
