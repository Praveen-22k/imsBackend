// models/purchased.model.js
import mongoose from "mongoose";

const purchasedSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    items: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        name: String,
        price: Number,
        image: String,
        qty: Number,
      },
    ],

    totalAmount: Number,
  },
  { timestamps: true },
);

export default mongoose.model("Purchased", purchasedSchema);
