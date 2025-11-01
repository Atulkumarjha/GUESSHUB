import connectDB from "../../../lib/db";
import Market from "../../../lib/models/market";
import FiltersUI from "./FilterUI";

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

  if (sort === "recent") {
    marketsQuery = marketsQuery.sort({ createdAt: -1 });
  }

  if (sort === "yesPrice") {
    marketsQuery = marketsQuery.sort({ yesPrice: -1 });
  }

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
