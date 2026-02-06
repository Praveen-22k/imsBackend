import Purchased from "../models/purchased.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";
export const checkout = async (req, res) => {
  try {
    const { userId } = req.body;

    const cart = await Cart.findOne({ userId }).populate(
      "items.productId",
      "productName productPrice image productStock",
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Check stock availability before processing
    for (const item of cart.items) {
      const availableStock = Number(item.productId.productStock);
      if (availableStock < item.qty) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.productId.productName}. Available: ${item.productId.productStock}, Requested: ${item.qty}`,
        });
      }
    }

    const items = cart.items.map((item) => ({
      productId: item.productId._id,
      name: item.productId.productName,
      price: item.productId.productPrice,
      image: item.productId.image,
      qty: item.qty,
    }));

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0,
    );

    // Create purchase record
    await Purchased.create({
      userId,
      items,
      totalAmount,
    });

    // Reduce stock for each product
    for (const item of cart.items) {
      console.log("Item data:", JSON.stringify(item));
      let id = new mongoose.Types.ObjectId(item.productId._id);
      await Product.findByIdAndUpdate(id, {
        $inc: { productStock: -item.qty },
      });
    }

    // Clear cart
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.json({ success: true, message: "Checkout successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPurchased = async (req, res) => {
  try {
    const { userId } = req.query;
    const orders = await Purchased.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllPurchasedAdmin = async (req, res) => {
  try {
    const orders = await Purchased.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
