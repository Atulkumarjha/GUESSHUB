"use client";

import useSWR from "swr";
import axios from "axios";
import { useParams } from "next/navigation";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function MarketDetails() {
  const params = useParams();
  const { data, error, isLoading } = useSWR(
    params?.id ? `/api/markets/${params.id}` : null,
    fetcher
  );

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (error)
    return <p className="text-center text-red-600">Error loading market</p>;

  const market = data?.market;

  if (!market) return <p className="text-center mt-10">Market not ofund.</p>;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">{market.title}</h1>
      <p className="text-gray-700 mb-2">{market.description}</p>
      <p className="text-sm text-gray-500 mb-4">
        Created On {new Date(market.createdAt).toLocaleDateString()}
      </p>

      <div className="space-x-4">
        {market.outcomes.map((outcome: string) => (
          <button
            key={outcome}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:ng-blue-700"
          >
            Bet on {outcome}
          </button>
        ))}
      </div>
    </div>
  );
}
