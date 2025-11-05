"use server";

import connectDB from "../../../../lib/db";
import Market from "../../../../lib/models/market";
import Trade from "../../../../lib/models/trade";
import Position from "../../../../lib/models/position";
import { price } from "../../../../lib/lmsr";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth-options";

// Define a Market interface for typing
interface IMarket {
  _id: string;
  title: string;
  description: string;
  totalLiquidity: number;
  yesPrice: number;
  noPrice: number;
  endDate: string;
  status: "open" | "closed" | "resolved";
  outcome?: "yes" | "no" | "pending";
  pool: {
    qyes: number;
    qNo: number;
    b: number;
  };
}

export default async function MarketPage({
  params,
}: {
  params: { id: string };
}) {
  await connectDB();

  const session = await getServerSession(authOptions);

  const market = (await Market.findById(params.id).lean()) as IMarket | null;

  if (!market) {
    return (
      <div className="max-w-3xl mx-auto mt-12 p-6">
        <h1 className="text-2xl font-bold">Market not found</h1>
      </div>
    );
  }

  // Fetch user position if authenticated
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let userPosition: any = null;
  if (session?.user?.email) {
    userPosition = await Position.findOne({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      user: (session.user as any)._id,
      market: market._id,
    }).lean();
  }

  const trades = await Trade.find({ market: params.id })
    .sort({ createdAt: -1 })
    .limit(20)
    .populate("user", "name")
    .lean();

  const tradersCount = await Trade.distinct("user", { market: params.id });

  const totalShares = await Trade.aggregate([
    { $match: { market: market._id } },
    { $group: { _id: null, shares: { $sum: "$shares" } } },
  ]);

  // Calculate 24h ago timestamp for volume calculation
  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

  const volume24h = await Trade.aggregate([
    { $match: { match: market._id, createdAt: { $gte: twentyFourHoursAgo } } },
    { $group: { _id: null, total: { $sum: "$shares" } } },
  ]);

  // Get previous trade from 24h ago to calculate price change
  const previousTrade = await Trade.findOne({
    market: params.id,
    createdAt: { $lte: twentyFourHoursAgo },
  })
    .sort({ createdAt: -1 })
    .lean();

  // Calculate price change percentage
  let priceChange = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (previousTrade && (previousTrade as any).price) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const oldPrice = (previousTrade as any).price;
    priceChange = ((market.yesPrice - oldPrice) / oldPrice) * 100;
  }

  // Calculate LMSR prices from pool
  const lmsrPrices = price(market.pool.qyes, market.pool.qNo, market.pool.b);


  return (
    <div className="max-w-3xl mx-auto mt-12 p-6">
      {/* Market Status Badge */}
      {market.status === "resolved" && (
        <div className="bg-blue-600 text-white px-3 py-1 rounded mb-3 inline-block text-sm">
          ✅ Resolved — Winner: {market.outcome?.toUpperCase()}
        </div>
      )}

      {market.status === "closed" && (
        <div className="bg-yellow-500 text-black px-3 py-1 rounded mb-3 inline-block text-sm">
          ⏳ Market Closed — Awaiting Resolution
        </div>
      )}

      {market.status === "open" && (
        <div className="bg-green-600 px-3 py-1 rounded mb-3 inline-block text-sm">
          🟢 Market Active
        </div>
      )}

      <h1 className="text-2xl font-bold">{market.title}</h1>
      <p className="opacity-70 mt-2">{market.description}</p>

      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div className="p-4 bg-gray-900 rounded-lg">
          <p className="opacity-50">Total Liquidity</p>
          <p className="text-xl font-semibold">${market.totalLiquidity}</p>
        </div>

        <div className="mt-4 bg-gray-800 h-2 rounded overflow-hidden">
          <div
            className="h-full bg-green-500"
            style={{ width: `$market.yesPrice * 100}%` }}
          ></div>
        </div>

        <div className="p-4 bg-gray-900 rounded-lg">
          <p className="opacity-50">Total Traders</p>
          <p className="text-xl font-semibold">{tradersCount.length}</p>
        </div>

        <div className="p-4 bg-gray-900 rounded-lg">
          <p className="opacity-50">Total Shares</p>
          <p className="text-xl font-semibold">{totalShares[0]?.shares ?? 0}</p>
        </div>

        <div className="p-4 bg-gray-900 rounded-lg">
          <p className="opacity-50">24h Volume</p>
          <p className="text-xl font-semibold">{volume24h[0]?.total ?? 0} shares</p>
        </div>

        <div className="p-4 bg-gray-900 rounded-lg">

          <p className="opacity-50">Ends</p>
          <p className="font-semibold">
            {new Date(market.endDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="mt-5 p-4 bg-gray-800 rounded-lg text-sm">
        <p className="opacity-50">Current Price</p>
        <p className="text-xl font-bold flex gap-2 items-center">
          YES: {market.yesPrice.toFixed(2)}
          {priceChange !== 0 && (
            <span
              className={`text-sm ${
                priceChange > 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {priceChange > 0 ? "+" : ""}
              {priceChange.toFixed(2)}%
            </span>
          )}
          {!previousTrade && (
            <span className="text-yellow-400 opacity-50 text-sm">(New)</span>
          )}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="p-4 bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-700/30 rounded-lg">
          <p className="opacity-70 text-xs mb-1">LMSR Price (YES)</p>
          <p className="text-2xl font-bold text-green-400">
            {(lmsrPrices.yes * 100).toFixed(2)}%
          </p>
          <p className="text-xs opacity-50 mt-1">
            ${lmsrPrices.yes.toFixed(4)}
          </p>
        </div>

        <div className="p-4 bg-gradient-to-br from-red-900/40 to-red-800/20 border border-red-700/30 rounded-lg">
          <p className="opacity-70 text-xs mb-1">LMSR Price (NO)</p>
          <p className="text-2xl font-bold text-red-400">
            {(lmsrPrices.no * 100).toFixed(2)}%
          </p>
          <p className="text-xs opacity-50 mt-1">
            ${lmsrPrices.no.toFixed(4)}
          </p>
        </div>
      </div>

      {/* User Position Display */}
      {userPosition && (
        <div className="bg-gray-800 p-4 rounded-lg mt-4">
          <p className="font-semibold text-lg mb-2">Your Position</p>
          <p className="text-sm">
            {userPosition.outcome.toUpperCase()} — {userPosition.shares} shares
          </p>
          <p className="text-green-400 mt-2 text-sm">
            Current Value:{" "}
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(userPosition.shares * (lmsrPrices as any)[userPosition.outcome]).toFixed(2)} tokens
          </p>
          
          {market.status === "open" && (
            <p className="text-blue-300 mt-2 text-sm">
              Potential Payout: {userPosition.shares} tokens if {userPosition.outcome.toUpperCase()} wins
            </p>
          )}

          {market.status === "resolved" && (
            <p className="mt-2 text-sm">
              {userPosition.outcome === market.outcome
                ? `🎉 You won ${userPosition.shares} tokens`
                : `❌ You lost your stake`}
            </p>
          )}
        </div>
      )}

      {market.status !== "open" && (
        <p className="text-red-400 mt-4 font-medium text-center">
          Trading closed.
        </p>
      )}

      <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
        <p className="text-xs opacity-50 mb-2">Pool Information</p>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="opacity-50 text-xs">YES Shares</p>
            <p className="font-semibold">{market.pool.qyes.toFixed(2)}</p>
          </div>
          <div>
            <p className="opacity-50 text-xs">NO Shares</p>
            <p className="font-semibold">{market.pool.qNo.toFixed(2)}</p>
          </div>
          <div>
            <p className="opacity-50 text-xs">Liquidity (b)</p>
            <p className="font-semibold">{market.pool.b}</p>
          </div>
        </div>
      </div>

      <h2 className="mt-8 font-bold text-lg">Recent Trades</h2>

      <div className="space-y-3 mt-3">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {trades.map((t: any) => (
          <div
            key={t._id}
            className="p-3 bg-gray-900 rounded-lg text-sm flex justify-between"
          >
            <div>
              <p className="font-medium">{t.user?.name ?? "User"}</p>
              <p className="opacity-50">{t.side.toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p>{t.shares} shares</p>
              <p className="opacity-50">${t.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
