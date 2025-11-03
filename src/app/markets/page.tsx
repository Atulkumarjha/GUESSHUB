import connectDB from "../../../lib/db";
import Market from "../../../lib/models/market";
import FiltersUI from "./FilterUI";
import Trade from "../../../lib/models/trade";


interface SearchParams {
  search?: string;
  category?: string;
  sort?: string;
}

export default async function MarketsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await connectDB();

  const { search, category, sort } = searchParams;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: any = {};

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  if (category) {
    query.category = category;
  }

  let marketsQuery = Market.find(query);

  // Sorting logic
  if (sort === "endingSoon") {
    marketsQuery = marketsQuery.sort({ endDate: 1 });
  }

  if (sort === "liquidity") {
    marketsQuery = marketsQuery.sort({ totalLiquidity: -1 });
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (sort === "liquidity") {
    marketsQuery = marketsQuery.sort({ totalLiquidity: -1 });
  }

  if (sort === "recent") {
    marketsQuery = marketsQuery.sort({ createdAt: -1 });
  }

  if (sort === "yesPrice") {
    marketsQuery = marketsQuery.sort({ yesPrice: -1 });
  }

  if (sort === "treding") {
    marketsQuery = marketsQuery.sort({ volume24h: -1 });
  }

  const markets = await marketsQuery.lean();

  // Calculate 24h ago timestamp for trending markets
  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

  const trending = await Trade.aggregate([
    { $match: { createdAt: { $gte: twentyFourHoursAgo } } },
    { $group: { _id: "$market", volume: { $sum: "$shares" } } },
    { $sort: { volume: -1 } },
    { $limit: 5 },
  ]);

  const trendingMarkets = await Market.find({
    _id: { $in: trending.map((t) => t._id) },
  }).lean();
  const markets = await marketsQuery.lean();

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6">
      <FiltersUI />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {markets.map((m: any) => (
          <a
            key={m._id}
            href={`/market/${m._id}`}
            className="bg-gray-900 p-5 rounded-lg hover:opacity-80 transition"
          >
            <h2 className="font-semibold text-lg">{m.title}</h2>
            <p className="opacity-50 text-sm">{m.category}</p>

            <h2 className="text-lg font-bold mt-8">Treding Markets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {trendingMarkets.map((m: any) => (
                <a
                  key={m._id}
                  href={`/market/${m._id}`}
                  className="bg-gray-900 p-4 rounded-lg hover:opacity-80"
                >
                  <h3 className="font-semibold">{m.title}</h3>
                  <p className="opacity-50 text-sm">{m.category}</p>
                  <p className="mt-1">YES: {m.yesPrice}</p>
                </a>
              ))}
            </div>

            <div className="mt-2 bg-gray-700 h-2 rounded overflow-hidden">
              <div
                className="bg-green-500 h-full"
                style={{
                  width: `${Math.min((volumne24h[0]?.total ?? 0) / 5, 100)}%`,
                }}
              />
            </div>
            <div className="mt-3 text-sm flex gap-4">
              <span className="text-green-400">YES: {m.yesPrice}</span>
              <span className="text-red-400">NO: {m.noPrice}</span>
            </div>

            <p className="opacity-50 text-xs mt-2">
              Ends {new Date(m.endDate).toLocaleDateString()}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
