import express from "express";
import cors from "cors";
import connectDB from "./db/connection.js";
import globalerrorhandler from "./middleware/globalerrorhandler.middleware.js";
import path from "path";
import authrouter from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import supplierRoutes from "./routes/supplier.routes.js";
import productRoutes from "./routes/product.routes.js";
import dotenv from "dotenv";
import cartRoutes from "./routes/cart.routes.js";
import userRoutes from "./routes/user.routes.js";
import purchasedRoutes from "./routes/purchased.routes.js";
import adminRoutes from "./routes/admin.routes.js";
dotenv.config();

// migration-script.js
import mongoose from "mongoose";
import Product from "./models/product.model.js";

const migrateProductStock = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    const products = await Product.find({});

    for (const product of products) {
      if (typeof product.productStock === "string") {
        product.productStock = parseInt(product.productStock, 10) || 0;
        await product.save();
        console.log(`Updated product ${product._id}: ${product.productStock}`);
      }
    }

    console.log("Migration completed!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

const app = express();
app.use(express.json());
app.use(cors());
app.use("/upload", express.static(path.resolve("upload")));
app.use("/api/cart", cartRoutes);
app.use("/api/product", productRoutes);
app.use("/api/auth", authrouter);
app.use("/api/category", categoryRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/user", userRoutes);
app.use("/api/purchased", purchasedRoutes);
app.use("/api/admin", adminRoutes);
app.use(globalerrorhandler);
app.listen(process.env.PORT, () => {
  connectDB();

  console.log(`server is running ${process.env.PORT}`);
});
