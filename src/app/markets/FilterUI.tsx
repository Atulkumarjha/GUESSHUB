"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function FiltersUI() {
  const router = useRouter();
  const params = useSearchParams();

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(params.toString());
    if (value === "") newParams.delete(key);
    else newParams.set(key, value);

    router.push(`/markets?${newParams.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <input
        placeholder="Search markets ..."
        defaultValue={params.get("search") ?? ""}
        className="bg-gray-800 px-3 py-2 rounded-lg w-full"
        onChange={(e) => updateParam("search", e.target.value)}
      />

      <select
        defaultValue={params.get("category") ?? ""}
        onChange={(e) => updateParam("category", e.target.value)}
        className="bg-gray-800 px-3 py-2 rounded-lg"
      >
        <option value=""></option>
        <option value="politics"></option>
        <option value="sports"></option>
        <option value="crypto"></option>
        <option value="tech"></option>
      </select>

      <select
        defaultValue={params.get("sort") ?? ""}
        onChange={(e) => updateParam("sort", e.target.value)}
        className="bg-gray-800 px-3 py-2 rounded-lg"
      >
        <option value=""></option>
        <option value="endingSoon"></option>
        <option value="liquidity"></option>
        <option value="yesPrice"></option>
        <option value="recent"></option>
      </select>
    </div>
  );
}
