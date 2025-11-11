import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import Market from "../../../../lib/models/market";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth-options";
import Category from "../../../../lib/models/Category";
import Trade from "../../../../lib/models/trade";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const sort = searchParams.get("sort");

    const query: Record<string, unknown> = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    let marketsQuery = Market.find(query).populate("category", "name");

    // Sorting logic
    if (sort === "endingSoon") {
      marketsQuery = marketsQuery.sort({ endDate: 1 });
    } else if (sort === "liquidity") {
      marketsQuery = marketsQuery.sort({ totalLiquidity: -1 });
    } else if (sort === "recent") {
      marketsQuery = marketsQuery.sort({ createdAt: -1 });
    } else if (sort === "yesPrice") {
      marketsQuery = marketsQuery.sort({ yesPrice: -1 });
    } else {
      marketsQuery = marketsQuery.sort({ createdAt: -1 });
    }

    const markets = await marketsQuery.lean();

    // Calculate 24h ago timestamp for trending markets
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    let trendingMarkets: unknown[] = [];
    try {
      const trending = await Trade.aggregate([
        { $match: { createdAt: { $gte: twentyFourHoursAgo } } },
        { $group: { _id: "$market", volume: { $sum: "$shares" } } },
        { $sort: { volume: -1 } },
        { $limit: 5 },
      ]);

      trendingMarkets = await Market.find({
        _id: { $in: trending.map((t) => t._id) },
      })
        .populate("category", "name")
        .lean();
    } catch (err) {
      console.error("Error fetching trending:", err);
    }

    return NextResponse.json({ 
      status: "success", 
      markets,
      trending: trendingMarkets,
    });
  } catch (err) {
    return NextResponse.json(
      {
        status: "error",
        error: (err as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await req.json();
    const { title, description, category, endDate } = body;

    if (!title) {
      return NextResponse.json(
        { status: "error", message: "title is required" },
        { status: 400 }
      );
    }

    // Check if category exists
    if (category) {
      const catExists = await Category.findById(category);
      if (!catExists) {
        return NextResponse.json(
          { status: "error", message: "Category not found" },
          { status: 404 }
        );
      }
    }

    const market = await Market.create({
      title,
      description,
      category,
      endDate,
      yesPrice: 0.5,
      noPrice: 0.5,
      totalLiquidity: 1000,
      status: "open",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      creatorID: (session.user as any)._id,
    });

    return NextResponse.json({ status: "success", market });
  } catch (err) {
    return NextResponse.json(
      { status: "error", error: (err as Error).message },
      { status: 500 }
    );
  }
}
