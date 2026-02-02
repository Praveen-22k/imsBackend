import mongoose from "mongoose";
const userschema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String },
    role: { type: String, enum: ["admin", "customer"], default: "customer" },
  },
  { timestamps: true },
);
export default mongoose.model("User", userschema);
