import { NextResponse } from "next/server"
import  connectDB from "../../../../../../lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../../../lib/auth-options"
import Market from "../../../../../../lib/models/market"
import User from "../../../../../../lib/models/user"
import Transaction from "../../../../../../lib/models/Transaction"

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session =  await getServerSession(authOptions);
        if(!session || session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { outcome, amount } = await req.json();

        if(!outcome || !amount || amount <= 0) {
            return NextResponse.json({ error: "Invlaid bet Data"}, { status: 400 })
        }

        await connectDB();

        const user = await User.findOne({ email: session.user.email });
        const market = await Market.findById(params.id);

        if(!user || !market) {
            return NextResponse.json ({ error: "User or Market not found"}, { status: 404 });
        }

        if(user.balance < amount) {
            return NextResponse.json ({ erorr: "Insufficient balance"}, { status: 400 });
        } 

        user.balance -= amount;
        await user.save();

        if (market.pool[outcome] === undefined) {
            market.pool[outcome] = 0;
        }
        market.pool[outcome] += amount;
        await market.save();


        await Transaction.create({
            userId: user._id,
            marketId: market._id,
            outcome,
            amount,
        });

        return NextResponse.json({ success: true, newBalance: user.balance });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: (err as Error).message },
            { status: 500 }
        );
    }
}
