"use client";

import useSWR from "swr";
import axios from "axios";
import Link from "next/link";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function MarketPage() {
  const { data, error, isLoading } = useSWR("/api/markets", fetcher);

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (error)
    return <p className="text-center text-red-600">Error laoding markets</p>;

  const markets = data?.markets || [];

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">        
      <h1 className="text-3xl font-bold mb-6">Active Markets</h1>
      {markets.length === 0 && <p>No Markets yet...</p>}
      <div className="space-y-4">
        {markets.map((m: any) => (
          <Link
            key={m._id}
            href={`/markets/${m.id}`}
            className="block border p-4 rounded-lg hover:bg-gray-50"
          >
            <h2 className="text-xl font-semibold">{m.title}</h2>
            <p className="text-gray-60">{m.description}</p>
            <p className="text-sm text-gray-500">
              Created: {new Date(m.createdAt).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
