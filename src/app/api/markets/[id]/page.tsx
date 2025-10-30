"use client";

import useSWR from "swr";
import axios from "axios";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function MarketDetails() {
  const params = useParams();
  const { data, error, isLoading, mutate } = useSWR(
    params?.id ? `/api/markets/${params.id}` : null,
    fetcher
  );

  const { data: session } = useSession();

  const [amount, setAmount] = useState(100);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (error)
    return <p className="text-center text-red-600">Error Loading market</p>;

  const market = data?.market;
  if (!market) return <p className="text-center mt-10">Market n9ot found.</p>;

  async function handleBet(outcome: string) {
    if (!session) {
      setMessage("YOu must log in to place a bet.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`/api/markets/${market._id}/bet`, {
        outcome,
        amount,
      });

      if (res.data.success) {
        setMessage(
          `Bet placed on ${outcome}! New balance: $${res.data.newBalance}`
        );
        mutate();
      } else {
        setMessage(res.data.error || "Something went wrong.");
      }
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3 mb-4">
      <h1 className="text-3xl font-bold mb-4">{market.title}</h1>
      <p className="text-gray-700 mb-2">{market.description}</p>
      <p className="text-sm text-gray-500 mb-6">
        Created on {new Date(market.createdAt).toLocaleDateString()}
      </p>

      <div className="flex items-center gap-3 mb-4">
        <input
          type="number"
          value="amount"
          onChange={(e) => setAmount(Number(e.target.value))}
          className="border px-3 py-1 rounded-md w-28"
          min={1}
        />
        <span className="text-gray-700">$ to bet</span>
      </div>

      <div className="space-x-4">
        {market.outcomes.map((outcome: string) => (
          <button
            key={outcome}
            onClick={() => handleBet(outcome)}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Bet on {outcome}
          </button>
        ))}
      </div>

      {message && <p className="mt-4 text-center text-green-600">{message}</p>}

      <div className="mt-8 text-gray-600">
        <p>YES Pool: ${market.pool.YES || 0}</p>
        <p>NO Pool: ${market.pool.NO || 0}</p>
      </div>
    </div>
  );
}
