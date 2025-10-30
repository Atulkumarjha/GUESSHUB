import { Schema, model, models } from "mongoose";

const transactionSchema = new Schema (
    {
        userId: { type: String, required: true },
        marketId: { type: String, required: true },
        outcome: { type: String, required: true },
        amount: { type: Number, required: true },
    },
    { timestamps: true }
);

const Transaction = models.Transaction || model("Transaction", transactionSchema);
export default Transaction;