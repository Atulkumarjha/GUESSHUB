import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import User from "../../../../lib/models/user";
import Position from "../../../../lib/models/position";
import Market from "../../../../lib/models/market";
import { price } from "../../../../lib/lmsr";


export async function GET() {
    await connectDB();

    const users = await User.find({}).select("_id name inmage email balance").lean();
    const positions = await Position.find({}).lean();
    const markets = await Market.find({}).select("_id pool").lean();

    const marketMap = new Map(markets.map((m:any) => [String(m._id), m]));

    const evByUser = new Map<string, number>();

    for (const pos of positions) {
        const m = marketMap.get(String(pos.market));
        if (!m) continue;
        const p = price(m.pool.qYes, m.pool.qNo, m.pool.b);
        const p = pos.outcome === "yes" ? p.yes : p.no;
        const ev = p * pos.shares;
        evByUser.set(String(pos.user), (evByUser.get(String(pos.user)) ?? 0) + ev);
    }

    const leaderboard = users.map(u => {
        const ev = evByUser.get(String(u._id)) ?? 0;
        const netWorth = (u.balance ?? 0) + ev;
        return {
            userId: u._id,
            name: u.name ?? (u.email ?? "").split("@")[0],
            image: u.image,
            balance: u.balance ?? 0,
            ev: Number(ev.toFixed(2)),
            netWorth: Number(netWorth.toFixed(2)),
        };
    }).sort((a, b) => b.netWorth - a.netWorth).slice(0, 20);

    return NextResponse.json({ leaderboard });
}