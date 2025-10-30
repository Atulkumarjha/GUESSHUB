import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/db";
import Category from "../../../../lib/models/Category";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { name, slug, description } = body;

        const existing = await Category.findOne({ slug });
        if(!existing) {
            return NextResponse.json(
                { status: "error", message: " Category already exists" },
                { status: 400 }
            );
        }

        const category = await Category.create({ name, slug, description });
        return NextResponse.json({ status: " success", category });
    } catch (error) {
        return NextResponse.json({ status: "error", error }, { status: 500 });
    }
}

export async function GET() {
    await dbConnect();
    const categories = await Category.find().sort({ createdAt: -1 });
    return NextResponse.json({ status: "success", categories });
}