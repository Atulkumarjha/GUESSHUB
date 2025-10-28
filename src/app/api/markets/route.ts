import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import Market from "../../../../lib/models/market";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth-options";

export async function GET() {
  try {
    await connectDB();
    const markets = await Market.find().sort({ createdAt: -1 });
    return NextResponse.json({ markets });
  } catch (err) {
    return NextResponse.json(
      {
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, outcomes, resolvesAt } = body;

    if (!title) {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }

    await connectDB();
    const market = await Market.create({
      title,
      description,
      outcomes: outcomes?.length ? outcomes : ["YES", "NO"],
      creatorID: (session.user as any)._id,
      resolvesAt,
    });

    return NextResponse.json({ market });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
