"use client";

import { useState, useEffect } from "react";

export default function PortfolioPage() {
  const [positions, setPositions] = useState([]);

  const load = async () => {
    const res = await fetch("/api/portfolio");
    const data = await res.json();
    setPositions(data.positions);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Your Portfolio</h1>
      <div className="mt-4 flex flex-col gap-3">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {positions.map((p: any) => {
          const current = p.outcome === "yes"
            ? p.market.yesPrice
            : p.market.noPrice;
          
          const pnl = (current - p.avgPrice) * p.shares;

          return (
            <div key={p._id} className="border border-gray-700 p-3 rounded hover:bg-gray-900">
              <p className="font-semibold">{p.market.title}</p>
              <p className="text-sm text-gray-400">Outcome: {p.outcome.toUpperCase()}</p>
              <p className="text-sm text-gray-400">Shares: {p.shares}</p>
              <p className="text-sm text-gray-400">Avg Price: ${p.avgPrice.toFixed(2)}</p>
              <p className="text-sm text-gray-400">
                Current: ${current.toFixed(2)}
              </p>
              <p className={`text-sm font-semibold ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                PnL: ${pnl.toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
