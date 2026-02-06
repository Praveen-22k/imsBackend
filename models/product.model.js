// models/product.model.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: String,
    productPrice: Number,
    productStock: Number,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    productDescription: String,
    image: String,
  },
  { timestamps: true },
);

export default mongoose.model("Products", productSchema);
