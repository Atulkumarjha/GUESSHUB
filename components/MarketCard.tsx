import Link from "next/link";
import Sparkline from "./Sparkline";

interface MarketCardProps {
  market: {
    _id: string;
    title: string;
    description?: string;
    category?: { name?: string };
    endDate: Date;
    yesPrice?: number;
    noPrice?: number;
    totalLiquidity?: number;
    pool?: {
      qYes?: number;
      qNo?: number;
      b?: number;
    };
    history?: Array<{ t: Date; p: number }>;
  };
}

export default function MarketCard({ market }: MarketCardProps) {
  const yesPct =
    market.pool && market.pool.qYes !== undefined && market.pool.qNo !== undefined && market.pool.b
      ? Math.exp(market.pool.qYes / market.pool.b) /
        (Math.exp(market.pool.qYes / market.pool.b) +
          Math.exp(market.pool.qNo / market.pool.b))
      : market.yesPrice || 0.5;

  const pct = (yesPct * 100).toFixed(1);

  return (
    <Link
      href={`/markets/${market._id}`}
      className="block bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-5 hover:bg-gray-700/50 hover:scale-105 transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1">
          <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">
            {market.category?.name ?? "General"}
          </div>
          <h3 className="text-lg font-bold line-clamp-2 text-white">
            {market.title}
          </h3>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs text-gray-400 mb-1">YES</div>
          <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            {pct}%
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-400">
          Ends {new Date(market.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </div>
        {market.history && market.history.length > 0 && (
          <div className="opacity-90">
            <Sparkline
              data={market.history.map((d) => ({ t: d.t, p: d.p }))}
            />
          </div>
        )}
      </div>

      {market.totalLiquidity && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <div className="text-xs text-gray-400">
            Liquidity: <span className="text-white font-semibold">${market.totalLiquidity.toLocaleString()}</span>
          </div>
        </div>
      )}
    </Link>
  );
}
