import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    productPrice: { type: Number, required: true },
    productStock: { type: String, required: true },
    productDescription: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Products", productSchema);
