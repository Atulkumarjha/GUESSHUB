import mongoose, { Schema, model, models } from "mongoose";

export interface IMarket extends Document {
  title: string;
  description?: string;
  category: mongoose.Types.ObjectId;
  endDate: Date;
  yesPrice: number;
  noPrice: number;
  totalLiquidity: number;
  status: "open" | "closed" | "resolved";
  outcome?: "yes" | "no" | "pending";
}

const marketSchema = new Schema<IMarket>(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    endDate: { type: Date, required: true },
    yesPrice: { type: Number, default: 0.5 },
    noPrice: { type: Number, default: 0.5 },
    totalLiquidity: { type: Number, default: 1000 },
    status: {
      type: String,
      enum: ["open", "closed", "resolved"],
    },
    outcome: {
      type: String,
      enum: ["yes", "no", "pending"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Market = models.Market || model("Market", marketSchema);
export default Market;
