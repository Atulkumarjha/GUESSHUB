import { NextResponse } from "next/server";
import connectDB from "../../../../../../lib/db";
import User from "../../../../../../lib/models/user";
import Market from "../../../../../../lib/models/market";
import Position from "../../../../../../lib/models/position";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../../lib/auth-options";
import { lmsrBuy, price } from "../../../../../../lib/lmsr";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { outcome, shares } = body;

    const user = await User.findOne({ email: session.user.email });
    const market = await Market.findById(params.id);

    const p = price(market.pool.qYes, market.pool.qNo, market.pool.b).yes;

    if (!market) {
      return NextResponse.json(
        { status: "error", message: "Market not found" },
        { status: 404 }
      );
    }

    if (market.status !== "open") {
      return NextResponse.json(
        { status: "error", message: "Market is not open for trading" },
        { status: 400 }
      );
    }

    if (market.history) market.history = [];
    market.history.push({ t: new Date(), p });

    if (market.history.length > 60) market.history = market.history.slice(-60);

    await market.save();

    if (new Date() > new Date(market.endDate)) {
      market.status = "closed";
      await market.save();
      return NextResponse.json(
        { status: "error", message: "Market expired" },
        { status: 400 }
      );
    }

    // Get current pool values
    const qYes = market.pool.qyes;
    const qNo = market.pool.qNo;
    const b = market.pool.b;

    // Calculate cost using LMSR
    const { costToBuy, newQYes, newQNo } = lmsrBuy(
      qYes,
      qNo,
      outcome.toUpperCase() as "YES" | "NO",
      shares,
      b
    );

    if (user.balance < costToBuy) {
      return NextResponse.json(
        { error: "Insufficient Balance" },
        { status: 400 }
      );
    }

    // Deduct cost from user balance
    user.balance -= costToBuy;
    await user.save();

    // Update market pool
    market.pool.qyes = newQYes;
    market.pool.qNo = newQNo;

    // Calculate and update prices
    const newPrices = price(newQYes, newQNo, b);
    market.yesPrice = newPrices.yes;
    market.noPrice = newPrices.no;

    await market.save();

    // Update or create position
    let position = await Position.findOne({
      user: user._id,
      market: market._id,
      outcome,
    });

    if (!position) {
      position = await Position.create({
        user: user._id,
        market: market._id,
        outcome,
        shares,
        avgPrice: costToBuy / shares,
      });
    } else {
      const totalShares = position.shares + shares;
      position.avgPrice =
        (position.avgPrice * position.shares + costToBuy) / totalShares;
      position.shares = totalShares;
      await position.save();
    }

    return NextResponse.json({
      status: "success",
      position,
      market,
      costToBuy,
    });
  } catch (error) {
    console.error("Bet error:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
