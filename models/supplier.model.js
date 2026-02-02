import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
  supplierName: { type: String, required: true },
  supplierAddress: { type: String, required: true },
  supplierEmail: {
    type: String,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
    unique: true,
  },
  supplierNo: {
    type: Number,
    required: true,
    match: [/^\d{10}$/, "Enter a valid 10-digit phone number"],
  },
});
export default mongoose.model("Supplier", supplierSchema);
