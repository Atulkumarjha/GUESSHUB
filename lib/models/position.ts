import mongoose, { Schema, Document } from "mongoose";

export interface IPosition extends Document {
  user: mongoose.Types.ObjectId;
  market: mongoose.Types.ObjectId;
  outcome: "yes" | "no";
  shares: number;
  avgPrice: number;
}

const PositionSchema = new Schema<IPosition>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    market: { type: Schema.Types.ObjectId, ref: "Market", required: true },
    outcome: { type: String, enum: ["yes", "no"], required: true },
    shares: { type: Number, default: 0 },
    avgPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Position ||
  mongoose.model<IPosition>("Position", PositionSchema);
