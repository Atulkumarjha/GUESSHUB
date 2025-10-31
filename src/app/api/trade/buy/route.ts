import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/db";
import User from "../../../../../lib/models/user";
import Market from "../../../../../lib/models/market";
import Position from "../../../../../lib/models/position";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth-options";

export async function POST(req: Request) {
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
    const { marketId, outcome, shares } = body;

    const user = await User.findOne({ email: session.user.email });
    const market = await Market.findById(marketId);

    if (!market) {
      return NextResponse.json(
        { status: "error", message: "Market not found" },
        { status: 404 }
      );
    }

    if (market.status != "open") {
      return NextResponse.json(
        { status: " error", message: "Market is not open for trading" },
        { status: 400 }
      );
    }

    if (new Date() > new Date(market.endDate)) {
      market.status = "closed";
      await market.save();

      return NextResponse.json(
        { status: "error", message: "Marked expired" },
        { status: 400 }
      );
    }

    const price = outcome === "yes" ? market.yesPrice : market.noPrice;
    const cost = price * shares;

    if (user.balance < cost) {
      return NextResponse.json(
        { status: "error", message: "Insufficient balance" },
        { status: 400 }
      );
    }

    user.balance -= cost;
    await user.save();

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
        avgPrice: price,
      });
    } else {
      position.avgPrice =
        (position.avgPrice * position.shares * price * shares) /
        (position.shares + shares);

      position.shares += shares;
      await position.save();
    }

    const bump = shares * 0.001;

    if (outcome === "yes") {
      market.yesPrice += bump;
      market.noPrice -= bump;
    } else {
      market.noPrice += bump;
      market.yesPrice -= bump;
    }

    await market.save();

    return NextResponse.json({ status: "success", position, market });
  } catch (error) {
    return NextResponse.json({ status: "error", error }, { status: 500 });
  }
}
