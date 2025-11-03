import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import Position from "../../../../lib/models/position";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth-options";

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { status: "error", message: "Unauthorized" },
      { status: 401 }
    );
  }

  const positions = await Position.find({}).populate("market");
  return NextResponse.json({ status: "success", positions });
}
