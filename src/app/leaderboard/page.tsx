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
    `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/api/leaderboard`,
    { cache: "no-store" }
  );
  const { leaderboard } = await res.json();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            🏆 Leaderboard
          </h1>
          <p className="text-gray-400">Top traders ranked by net worth</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-900/50 text-left border-b border-gray-700">
              <tr>
                <th className="p-4 font-semibold text-gray-300">Rank</th>
                <th className="p-4 font-semibold text-gray-300">User</th>
                <th className="p-4 text-right font-semibold text-gray-300">
                  Balance
                </th>
                <th className="p-4 text-right font-semibold text-gray-300">
                  EV (Open)
                </th>
                <th className="p-4 text-right font-semibold text-gray-300">
                  Net Worth
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((u: LeaderboardUser, i: number) => (
                <tr
                  key={u.userId}
                  className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 font-bold">
                      {i === 0 && "🥇"}
                      {i === 1 && "🥈"}
                      {i === 2 && "🥉"}
                      {i > 2 && i + 1}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {u.image && (
                        <Image
                          src={u.image}
                          alt={u.name || "User"}
                          width={32}
                          height={32}
                          className="rounded-full ring-2 ring-gray-600"
                        />
                      )}
                      <span className="font-medium text-white">{u.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right text-gray-300">
                    ${u.balance.toFixed(2)}
                  </td>
                  <td className="p-4 text-right text-gray-300">
                    ${u.ev.toFixed(2)}
                  </td>
                  <td className="p-4 text-right">
                    <span className="font-bold text-lg text-green-400">
                      ${u.netWorth.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-16 bg-gray-800/30 rounded-2xl border border-gray-700 mt-8">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold mb-2">No traders yet</h3>
            <p className="text-gray-400">
              Be the first to trade and top the leaderboard!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
