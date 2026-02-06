import Product from "../models/product.model.js";
import Category from "../models/Category.model.js";
import User from "../models/user.model.js";
import Purchased from "../models/purchased.model.js";

export const getDashboardStats = async (req, res) => {
  try {
    const products = await Product.find();
    const categories = await Category.countDocuments();
    const users = await User.countDocuments({ role: "customer" });
    const orders = await Purchased.countDocuments();

    const sales = await Purchased.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const outOfStock = products.filter((p) => p.productStock == 0).length;

    res.status(200).json({
      products: products.length,
      categories,
      users,
      orders,
      outOfStock,
      sales: sales[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
