import mongoose, { Schema, Document } from "mongoose";

export interface ITrade extends Document {
  user: mongoose.Types.ObjectId;
  market: mongoose.Types.ObjectId;
  side: "yes" | "no";
  shares: number;
  price: number;
  createdAt: Date;
}

const TradeSchema = new Schema<ITrade>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    market: { type: Schema.Types.ObjectId, ref: "Market", required: true },
    side: { type: String, enum: ["yes", "no"], required: true },
    shares: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Trade ||
  mongoose.model<ITrade>("Trade", TradeSchema);
