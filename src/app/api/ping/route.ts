import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db";;
import Market from "../../../../lib/models/market";

export async function GET() {
    try {
        await connectDB();
        const count = await Market.countDocuments();
        return NextResponse.json({ status: "ok", markets: count });
    } catch(err) {
        return NextResponse.json({ status: "error", messsage: (err as Error).message },{ status: 500 });
    }
}