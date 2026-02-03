import Purchased from "../models/purchased.model.js";
import Cart from "../models/cart.model.js";

export const checkout = async (req, res) => {
  try {
    const { userId } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const items = cart.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      qty: item.qty,
    }));

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0,
    );

    await Purchased.create({
      userId,
      items,
      totalAmount,
    });

    // Clear cart
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.json({ success: true, message: "Checkout completed" });
  } catch (error) {
    console.error("Checkout error:", error);
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
