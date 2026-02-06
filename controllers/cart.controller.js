import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";
// GET CART
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("PARAM USERID =>", req.params.userId);

    const cart = await Cart.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });
    console.log("Cart items", JSON.stringify(cart));

    if (!cart) {
      return res.json({ success: true, data: { items: [] } });
    }

    res.json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADD TO CART
export const addToCart = async (req, res) => {
  try {
    const { userId, productId, qty = 1 } = req.body;

    let cart = await Cart.findOne({ userId });
    console.log("cart found:", cart);
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const index = cart.items.findIndex(
      (i) => i.productId.toString() === productId,
    );
    console.log("index:", index);
    if (index > -1) {
      cart.items[index].qty += qty;
    } else {
      let product = await Product.findOne({
        _id: new mongoose.Types.ObjectId(productId),
      });
      console.log("product found", JSON.stringify(product));
      cart.items.push({
        productId,
        qty,
        name: product.productName,
        price: product.productPrice,
        image: product.image,
      });
    }

    await cart.save();
    res.json({ success: true, message: "Added to cart" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// INCREASE QTY
export const increaseQty = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ "items._id": itemId });

    const item = cart.items.id(itemId);
    item.qty += 1;

    await cart.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DECREASE QTY
export const decreaseQty = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ "items._id": itemId });
    const item = cart.items.id(itemId);

    if (item.qty > 1) {
      item.qty--;
    } else {
      cart.items = cart.items.filter((i) => i._id.toString() !== itemId);
    }

    await cart.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// REMOVE ITEM
export const removeItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ "items._id": itemId });

    cart.items = cart.items.filter((i) => i._id.toString() !== itemId);

    await cart.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
