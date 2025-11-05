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
  pool: {
    qyes: number;
    qNo: number;
    b: number;
  };
  history: Array<{ t: Date; p: number }>;
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
      default: "open",
    },
    outcome: {
      type: String,
      enum: ["yes", "no", "pending"],
      default: "pending",
    },
    pool: {
      qyes: { type: Number, default: 0 },
      qNo: { type: Number, default: 0 },
      b: { type: Number, default: 100 },
    },
    history: {
      type: [{ t: Date, p: Number }],
      default: [],
    },
  },
  { timestamps: true }
);

const Market = models.Market || model("Market", marketSchema);
export default Market;
