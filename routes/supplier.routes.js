import express from "express";
import {
  addSupplier,
  getSupplier,
  deleteCategory,
  updateCategory,
} from "../controllers/supplier.controller.js";

const router = express.Router();
router.post("/add", addSupplier);
router.get("/", getSupplier);
router.delete("/delete/:id", deleteCategory);
router.put("/update/:id", updateCategory);

export default router;
