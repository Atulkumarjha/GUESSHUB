import connectDB from "../../../../lib/db";
import Market from "../../../../lib/models/market";
import Trade from "../../../../lib/models/trade";

// Define a Market interface for typing
interface IMarket {
  _id: string;
  title: string;
  description: string;
  totalLiquidity: number;
  yesPrice: number;
  endDate: string;
}

export default async function MarketPage({
  params,
}: {
  params: { id: string };
}) {
  await connectDB();

  const market = (await Market.findById(params.id).lean()) as IMarket | null;

  if (!market) {
    return (
      <div className="max-w-3xl mx-auto mt-12 p-6">
        <h1 className="text-2xl font-bold">Market not found</h1>
      </div>
    );
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

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6">
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
          <p className="opacity-50">Ends</p>
          <p className="font-semibold">
            {new Date(market.endDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="mt-5 p-4 bg-gray-800 rounded-lg text-sm">
        <p className="opacity-50">Current Price</p>
        <p className="text-xl font-bold flex gap-2">
          {market.yesPrice}
          <span className="text-green-400">+2%</span>
        </p>
      </div>

      <h2 className="mt-8 font-bold text-lg">Recent Trades</h2>

      <div className="space-y-3 mt-3">
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
