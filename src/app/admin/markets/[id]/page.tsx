import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import connectDB from "../../../../../lib/db";
import Market from "../../../../../lib/models/market";
import { authOptions } from "../../../../../lib/auth-options";
import { Check, X, Calendar, Info } from "lucide-react";

export default async function AdminResolvePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await connectDB();

  const market = await Market.findById(params.id);

  if (!market) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-300">
        <div className="text-center p-8 bg-secondary/50 rounded-2xl border border-neon-red/20">
          <X size={48} className="mx-auto text-neon-red" />
          <h1 className="mt-4 text-3xl font-bold">Market Not Found</h1>
          <p className="text-slate-400">The requested market does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-300">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4 text-neon-cyan"
            style={{ textShadow: '0 0 10px hsl(var(--neon-cyan)), 0 0 20px hsl(var(--neon-cyan))' }}
          >
            Resolve Market
          </h1>
          <p className="text-lg text-slate-400">Settle the outcome and distribute funds</p>
        </div>

        <div className="bg-secondary/30 backdrop-blur-sm rounded-2xl border border-neon-cyan/20 p-8 shadow-[0_0_20px_hsl(var(--neon-cyan)/0.1)]">
          <div className="border-b border-slate-800/50 pb-6 mb-6">
            <h2 className="font-bold text-2xl text-slate-100 mb-2">{market.title}</h2>
            <p className="text-slate-400">{market.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-sm">
            <div className="flex items-center gap-3 bg-background/30 p-4 rounded-lg">
              <Info size={20} className="text-neon-cyan" />
              <div>
                <p className="text-slate-500">Status</p>
                <p className="font-bold text-slate-200 capitalize">{market.status}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-background/30 p-4 rounded-lg">
              <Calendar size={20} className="text-neon-cyan" />
              <div>
                <p className="text-slate-500">Created At</p>
                <p className="font-bold text-slate-200">{new Date(market.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {market.status === 'open' ? (
            <div>
              <h3 className="text-xl font-bold text-center mb-4 text-slate-300">Choose the Winning Outcome</h3>
              <form action={`/api/markets/${market._id}/resolve`} method="POST" className="flex justify-center gap-4 md:gap-8">
                <button
                  name="winner"
                  value="yes"
                  className="flex-1 px-6 py-4 bg-neon-green/10 text-neon-green border-2 border-neon-green/50 rounded-xl
                             font-bold text-lg transition-all duration-300 hover:bg-neon-green/20 hover:shadow-[0_0_20px_hsl(var(--neon-green)/0.5)]
                             flex items-center justify-center gap-3"
                >
                  <Check size={24} />
                  Resolve YES
                </button>
                <button
                  name="winner"
                  value="no"
                  className="flex-1 px-6 py-4 bg-neon-red/10 text-neon-red border-2 border-neon-red/50 rounded-xl
                             font-bold text-lg transition-all duration-300 hover:bg-neon-red/20 hover:shadow-[0_0_20px_hsl(var(--neon-red)/0.5)]
                             flex items-center justify-center gap-3"
                >
                  <X size={24} />
                  Resolve NO
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center bg-background/50 p-6 rounded-lg border border-slate-700">
              <h3 className="text-xl font-bold text-slate-200 mb-2">Market Already Resolved</h3>
              <p className="text-slate-400">This market was resolved with the outcome: 
                <span className={`font-bold ml-2 ${market.winner === 'yes' ? 'text-neon-green' : 'text-neon-red'}`}>
                  {market.winner.toUpperCase()}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
