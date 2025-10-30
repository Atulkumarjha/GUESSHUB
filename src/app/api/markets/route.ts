import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import Market from "../../../../lib/models/market";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth-options";
import Category from "../../../../lib/models/Category";

export async function GET() {
  try {
    await connectDB();
    const markets = await Market.find()
      .populate("category")
      .sort({ createdAt: -1 });
    return NextResponse.json({ status: "success", markets });
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
