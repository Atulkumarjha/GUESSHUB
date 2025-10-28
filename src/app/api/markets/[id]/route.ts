import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/db";
import Market from "../../../../../lib/models/market";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const market = await Market.findById(params.id);
    if (!market) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }
    return NextResponse.json({ market });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
