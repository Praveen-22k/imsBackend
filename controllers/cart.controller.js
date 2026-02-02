import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

export const getCart = async (req, res) => {
  try {
    const { id } = req.params; // userId

    // Find the cart for the user and populate product details
    const cart = await Cart.findOne({ userId: id }).populate("items.productId");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ data: cart });
  } catch (error) {
    console.log("Get cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, userId } = req.body;

    if (!productId || !userId) {
      return res.status(400).json({ message: "ProductId or UserId missing" });
    }

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("add to cart product", product);

    // Find user's cart
    let cart = await Cart.findOne({ userId });
    console.log("cart", cart);

    // If cart exists
    if (cart) {
      // Check if product already in cart
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId,
      );

      if (itemIndex > -1) {
        // Product exists in cart, increment quantity
        cart.items[itemIndex].qty += 1;
      } else {
        // Product not in cart, add new item
        cart.items.push({
          productId: product._id,
          name: product.productName,
          price: product.productPrice,
          image: product.image,
          qty: 1,
        });
      }

      // Update totalAmount
      cart.totalAmount = cart.items.reduce(
        (acc, item) => acc + item.price * item.qty,
        0,
      );

      await cart.save();
      return res.status(200).json({ message: "Added to cart", cart });
    } else {
      // No cart exists for user, create new cart
      const newCart = await Cart.create({
        userId,
        items: [
          {
            productId: product._id,
            name: product.productName,
            price: product.productPrice,
            image: product.image,
            qty: 1,
          },
        ],
        totalAmount: product.productPrice,
      });

      return res
        .status(200)
        .json({ message: "Cart created and product added", cart: newCart });
    }
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const increaseQty = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ "items._id": itemId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.id(itemId);
    item.qty += 1;

    cart.totalAmount = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const decreaseQty = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ "items._id": itemId });
    const item = cart.items.id(itemId);

    if (item.qty > 1) item.qty--;
    else cart.items = cart.items.filter((i) => i._id.toString() !== itemId);

    cart.totalAmount = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ "items._id": itemId });

    cart.items = cart.items.filter((i) => i._id.toString() !== itemId);

    cart.totalAmount = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
