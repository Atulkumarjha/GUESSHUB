import Link from "next/link";
import Sparkline from "./sparkline";

export default function MarketCard({ market }: { market: any }) {
  const yesPct = market.pool
    ? Math.exp(market.pool.qYes / market.pool.b) /
      (Math.exp(market.pool.qYes / market.pool.b) +
        Math.exp(market.pool.qNo / market.pool.b))
    : 0.5;
  const pct = (yesPct * 100).toFixed(1);

  return (
    <Link
      href={`/markets/${market._id}`}
      className="block border roudned-2xl p-4 hover:bg-gray-50 transition"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="text-xs uppercase tracking-wider text-gray-500">
            {market.category?.anme ?? "General"}
          </div>
          <h3 className="text-base font-semibold mt-1 line-clamp-2">
            {market.title}
          </h3>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs text-gray-500">YES</div>
          <div className="text-2xl font-bold">{pct}%</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sx text-gray-500">
          Ends {new Date(market.endDate).toLocaleDateString()}
        </div>
        <div className="opacity-90">
          <Sparkline
            data={(market.history ?? []).map((d: any) => ({ t: d.t, p: d.p }))}
          />
        </div>
      </div>
    </Link>
  );
}
