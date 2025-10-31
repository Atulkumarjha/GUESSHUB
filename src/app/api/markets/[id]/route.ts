import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/db";
import Market from "../../../../../lib/models/market";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const market = await Market.findById(params.id).populate("category");
    
    if (!market) {
      return NextResponse.json(
        { status: "error", message: "Market not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ status: "success", market });
  } catch (err) {
    return NextResponse.json(
      { status: "error", error: (err as Error).message },
      { status: 500 }
    );
  }
}
