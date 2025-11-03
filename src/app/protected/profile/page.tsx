import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import connectDB from "../../../../lib/db";
import Trade from "../../../../lib/models/trade";
import { authOptions } from "../../../../lib/auth-options";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await connectDB();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const trades = await Trade.find({ user: (session.user as any)._id })
    .populate("market")
    .sort({ createdAt: -1 });

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6">
      <h1 className="text-2xl font-bold mb-6">Your Positions</h1>

      {trades.length === 0 && (
        <p className="opacity-70">
          You don&apos;t have any active positions yet.
        </p>
        <p className="opacity-70">You don&apos;t have any active positions yet.</p>
      )}

      <div className="space-y-4">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {trades.map((t: any) => (
          <div
            key={t._id}
            className="border p-4 rounded-lg bg-gray-900 text-white"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="font-semibold">{t.market.title}</div>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  t.side === "yes" ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {t.side.toUpperCase()}
              </span>
            </div>
            <p className="text-sm opacity-60">{t.market.description}</p>

            <div className="mt-3 text-sm">
              <p>
                Qty: <strong>{t.shares}</strong>
              </p>
              <p>
                Entry Price: <strong>${t.price.toFixed(2)}</strong>
              </p>
            </div>

            <p className="mt-2 text-xs opacity-40">
              Traded on: {new Date(t.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
