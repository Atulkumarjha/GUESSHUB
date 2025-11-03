import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true },
    image: String,
    balance: { type: Number, default: 10000 },
    roe: { type: String, enum: ["user", "admin"], default: "user"},
  },
  { timestamps: true }
);
const User = models.User || model("User", userSchema);
export default User;
