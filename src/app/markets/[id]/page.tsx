"use client";

import { useEffect, useState } from "react";

export default function MarketDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [market, setMarket] = useState<any>(null);

  const load = async () => {
    const res = await fetch(`/api/markets/${id}`);
    const data = await res.json();
    setMarket(data.market);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buy = async (outcome: "yes" | "no") => {
    await fetch("/api/trade/buy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ marketId: id, outcome, shares: 10 }),
    });
    load();
  };

  if (!market) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">{market.title}</h1>
      <p className="text-gray-400 mb-2">{market.description}</p>
      <p className="text-sm text-gray-500 mb-2">
        Category: <strong>{market.category?.name || "Uncategorized"}</strong>
      </p>
      <p className="text-sm text-gray-500 mb-2">
        Ends: {new Date(market.endDate).toLocaleString()}
      </p>
      <p className="text-sm text-gray-500 mb-6">Status: {market.status}</p>

      <div className="mt-4 flex gap-4">
        <button
          onClick={() => buy("yes")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Buy YES ({market.yesPrice?.toFixed(2) || "0.50"})
        </button>

        <button
          onClick={() => buy("no")}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Buy NO ({market.noPrice?.toFixed(2) || "0.50"})
        </button>
      </div>
    </div>
  );
}
