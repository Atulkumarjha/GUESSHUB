import { Schema, model, models } from "mongoose";

const marketSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    outcomes: { type: [String], default: ["YES", "NO"] },
    pool: {
      YES: { type: Number, default: 0 },
      NO: { type: Number, default: 0 },
      b: { type: Number, default: 100 },
    },
    status: { type: String, default: "open" },
    resolution: { type: String, default: "" },
    creatorId: String,
    resolveAt: Date,
  },
  { timestamps: true }
);

const Market = models.Market || model("market", marketSchema);
export default Market;