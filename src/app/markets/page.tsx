"use client";

import { useState, useEffect } from "react";

export default function MarketsPage() {
  const [categories, setCategories] = useState([]);
  const [markets, setMarkets] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchData = async () => {
    const cats = await fetch("/api/categories").then((r) => r.json());
    const mks = await fetch("/api/markets").then((r) => r.json());

    setCategories(cats.categories || []);
    setMarkets(mks.markets || []);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await fetch("/api/markets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        category,
        endDate,
      }),
    });

    setTitle("");
    setDescription("");
    setCategory("");
    setEndDate("");

    fetchData();
  };

  const buy = async (marketId: string, outcome: "yes" | "no") => {
    await fetch("/api/trade/buy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        marketId,
        outcome,
        shares: 10, // fixed amount for now
      }),
    });

    fetchData();
  };

  return (
    <div className="p-6">
      <h1 className="font-bold text-xl mb-4">Create Market</h1>

      <form onSubmit={handleSubmit} className="max-w-sm flex flex-col gap-3">
        <input
          className="border border-gray-600 bg-gray-900 text-white p-2 rounded"
          placeholder="Market Question"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="border border-gray-600 bg-gray-900 text-white p-2 rounded"
          placeholder="Details"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="border border-gray-600 bg-gray-900 text-white p-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {categories.map((cat: any) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="datetime-local"
          className="border border-gray-600 bg-gray-900 text-white p-2 rounded"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
        >
          Create
        </button>
      </form>

      <hr className="my-6 border-gray-700" />

      <h2 className="font-semibold text-lg mb-4">Markets</h2>
      {markets.length === 0 && (
        <p className="text-gray-400">No markets yet...</p>
      )}
      <ul className="space-y-2">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {markets.map((mk: any) => (
          <li
            key={mk._id}
            className="border border-gray-700 p-3 rounded hover:bg-gray-900"
          >
            <div className="font-semibold">⚡ {mk.title}</div>
            <div className="text-sm text-gray-400">
              Category: {mk.category?.name || "Uncategorized"}
            </div>
            <div className="text-sm text-gray-500 mb-2">
              Ends: {mk.endDate ? new Date(mk.endDate).toLocaleString() : "N/A"}
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => buy(mk._id, "yes")}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
              >
                Buy YES ({mk.yesPrice?.toFixed(2) || "0.50"})
              </button>
              <button
                onClick={() => buy(mk._id, "no")}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
              >
                Buy NO ({mk.noPrice?.toFixed(2) || "0.50"})
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
