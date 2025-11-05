import { NextResponse } from "next/server";
import connectDB from "../../../../../../lib/db";
import Market from "../../../../../../lib/models/market";
import Trade from "../../../../../../lib/models/trade";
import User from "../../../../../../lib/models/user";

export async function POST(req: Request, { params }: any) {
  await connectDB();

  const formData = await req.formData();
  const winner = formData.get("winner") as string;

  const market = await Market.findById(params.id);
  if (!market) return NextResponse.json({ error: "Not Found" });

  market.status = "resolved";
  market.outcome = winner;
  await market.save();

  const trades = await Trade.find({ market: market._id });

  for (const t of trades) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((t as any).side === winner) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payout = (t as any).shares * 1.0;
      await User.findByIdAndUpdate(t.user, {
        $inc: { balance: payout },
      });
    }
  }

  return NextResponse.json({ success: true });
}