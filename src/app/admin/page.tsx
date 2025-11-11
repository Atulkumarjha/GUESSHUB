import { Shield, ChevronRight } from "lucide-react";
import Link from "next/link";
import connectDB from "@/lib/db";
import Market from "@/lib/models/market";
import { Button } from "@/components/ui/Button";

interface MarketDocument {
  _id: string;
  title: string;
  status: 'open' | 'closed' | 'resolved';
  createdAt: Date;
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'open':
      return 'bg-neon-green/10 text-neon-green';
    case 'closed':
      return 'bg-neon-red/10 text-neon-red';
    case 'resolved':
      return 'bg-neon-blue/10 text-neon-blue';
    default:
      return 'bg-slate-700/50 text-slate-400';
  }
}

const MarketListItem = ({ market }: { market: MarketDocument }) => (
  <Link
    href={`/admin/markets/${market._id}`}
    className="block px-6 py-5 hover:bg-background/30 transition-colors duration-200"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="font-bold text-lg text-slate-200">{market.title}</p>
        <p className="text-sm text-slate-500">Created: {new Date(market.createdAt).toLocaleString()}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClass(market.status)}`}>
          {market.status}
        </span>
        <ChevronRight className="text-slate-600" />
      </div>
    </div>
  </Link>
);

export default async function AdminPage() {
  await connectDB();

  const marketsRaw = await Market.find().sort({ createdAt: -1 }).lean();
  const markets = marketsRaw as unknown as MarketDocument[];

  return (
    <div className="min-h-screen text-slate-300">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 
            className="text-5xl md:text-6xl font-bold mb-4 text-neon-red"
            style={{ textShadow: '0 0 10px hsl(var(--neon-red)), 0 0 20px hsl(var(--neon-red))' }}
          >
            <Shield className="inline-block w-12 h-12 mr-4" />
            Admin Panel
          </h1>
          <p className="text-lg text-slate-400">Manage and resolve markets</p>
        </header>

        <main className="bg-secondary/30 backdrop-blur-sm rounded-2xl border border-neon-red/20 shadow-[0_0_20px_hsl(var(--neon-red)/0.1)]">
          <div className="px-6 py-4 border-b border-slate-800/50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-200">All Markets ({markets.length})</h2>
            <Button asChild>
              <Link href="/admin/markets/new">Create New Market</Link>
            </Button>
          </div>
          
          <div className="divide-y divide-slate-800/50">
            {markets.map((m) => (
              <MarketListItem key={m._id} market={m} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
