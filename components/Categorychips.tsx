"use client";

import { useSearchParams, useRouter } from "next/navigation";

const cats = ["All", "Crypto", "Politics", "Sports", "Tech", "World"];

export default function CategoryChips() {
  const params = useSearchParams();
  const router = useRouter();

  const active = params.get("category") ?? "All";

  const setCat = (cat: string) => {
    const p = new URLSearchParams(params.toString());
    if (cat === "All") p.delete("category");
    else p.set("category", cat.toLowerCase());
    router.push(`/markets?${p.toString()}`);
  };

  return (
    <div className="flex gap-2 mt-4 overflow-x-auto hide-scroll">
      {cats.map((c) => (
        <button
          key={c}
          onClick={() => setCat(c)}
          className={`px-3 py-1.5 roudned-full text-xs border ${
            active.toLowerCase() === c.toLowerCase()
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
