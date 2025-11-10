"use client";

import { useSearchParams, useRouter } from "next/navigation";

const tabs = [
  { key: "", label: "" },
  { key: "endingsoon", label: "Ending Soon" },
  { key: "new", label: "New" },
  { key: "highVolume", label: "High Volume" },
];

export default function ExploreTabs() {
  const params = useSearchParams();
  const router = useRouter();

  const active = params.get("sort") ?? "";

  const setTab = (key: string) => {
    const p = new URLSearchParams(params.toString());
    if (!key) p.delete("sort");
    else p.set("sort", key);
    router.push(`/markets?${p.toString()}`);
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 hide-scroll">
      {tabs.map(t => (
        <button
          key={t.key}
          onClick={() => setTab(t.key)}
          className={`px-4 py-2 rounded-full text-sm font-medium border ${
            active === t.key
              ? "bg-black text-white vorder-black"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
