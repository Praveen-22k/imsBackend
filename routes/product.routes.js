import express from "express";
import upload from "../middleware/upload.middleware.js";
import {
  addProduct,
  getProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/products.controller.js";

const router = express.Router();

router.post("/add", upload.single("image"), addProduct);
router.get("/", getProduct);
router.delete("/delete/:id", deleteProduct);
router.put("/edit/:id", upload.single("image"), updateProduct);

export default router;
