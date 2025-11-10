import connectDB from "../../../lib/db";
import Market from "../../../lib/models/market";
import FiltersUI from "./FilterUI";
import Trade from "../../../lib/models/trade";
import MarketCard from "../../../components/MarketCard";

interface SearchParams {
  search?: string;
  category?: string;
  sort?: string;
}

interface MarketData {
  _id: string;
  title: string;
  description?: string;
  category?: { name?: string };
  endDate: Date;
  yesPrice: number;
  noPrice: number;
  totalLiquidity: number;
  pool?: {
    qYes: number;
    qNo: number;
    b: number;
  };
  history?: Array<{ t: Date; p: number }>;
}

export default async function MarketsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await connectDB();

  const { search, category, sort } = searchParams;

  const query: Record<string, unknown> = {};

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  if (category) {
    query.category = category;
  }

  let marketsQuery = Market.find(query).populate("category", "name");

  // Sorting logic
  if (sort === "endingSoon") {
    marketsQuery = marketsQuery.sort({ endDate: 1 });
  } else if (sort === "liquidity") {
    marketsQuery = marketsQuery.sort({ totalLiquidity: -1 });
  } else if (sort === "recent") {
    marketsQuery = marketsQuery.sort({ createdAt: -1 });
  } else if (sort === "yesPrice") {
    marketsQuery = marketsQuery.sort({ yesPrice: -1 });
  }

  const markets = (await marketsQuery.lean()) as unknown as MarketData[];

  // Calculate 24h ago timestamp for trending markets
  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

  const trending = await Trade.aggregate([
    { $match: { createdAt: { $gte: twentyFourHoursAgo } } },
    { $group: { _id: "$market", volume: { $sum: "$shares" } } },
    { $sort: { volume: -1 } },
    { $limit: 5 },
  ]);

  const trendingMarkets = (await Market.find({
    _id: { $in: trending.map((t) => t._id) },
  })
    .populate("category", "name")
    .lean()) as unknown as MarketData[];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Markets
          </h1>
          <p className="text-gray-400">
            Trade on prediction markets and earn rewards
          </p>
        </div>

        <FiltersUI />

        {trendingMarkets.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span>🔥</span>
              <span>Trending Markets</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingMarkets.map((m) => (
                <MarketCard key={m._id.toString()} market={m} />
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-2xl font-bold">All Markets</h2>
          <p className="text-gray-400 text-sm mt-1">
            {markets.length} {markets.length === 1 ? "market" : "markets"}{" "}
            available
          </p>
        </div>

        {markets.length === 0 ? (
          <div className="text-center py-16 bg-gray-800/30 rounded-2xl border border-gray-700">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">No markets found</h3>
            <p className="text-gray-400">
              Try adjusting your filters or check back later
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {markets.map((m) => (
              <MarketCard key={m._id.toString()} market={m} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
