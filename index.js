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
dotenv.config();

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

app.use(globalerrorhandler);
app.listen(process.env.PORT, () => {
  connectDB();
  console.log(`server is running ${process.env.PORT}`);
});
