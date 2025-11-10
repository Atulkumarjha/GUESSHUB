import Image from "next/image";

interface LeaderboardUser {
  userId: string;
  name: string;
  image?: string;
  balance: number;
  ev: number;
  netWorth: number;
}

export default async function LeaderboardPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/leaderboard`,
    { cache: "no-store" }
  );
  const { leaderboard } = await res.json();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
      <div className="overflowhidden rounded-2xl border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Rank</th>
              <th className="p-3">User</th>
              <th className="p-3 text-right">Balance</th>
              <th className="p-3 text-right">EV (Open)</th>
              <th className="p-3 text-right">Net Worth</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((u: LeaderboardUser, i: number) => (
              <tr key={u.userId} className="boder-t">
                <td className="p-3">{i + 1}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    {u.image && (
                      <Image
                        src={u.image}
                        alt={u.name || "User"}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    )}
                    <span className="font-medium">{u.name}</span>
                  </div>
                </td>
                <td className="p-3 text-right">{u.balance.toFixed(2)}</td>
                <td className="p-3 text-right">{u.ev.toFixed(2)}</td>
                <td className="p-3 text-right font-semibold">
                  {u.netWorth.toFixed(2)}  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
