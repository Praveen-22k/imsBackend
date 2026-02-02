import express from "express";
import {
  addCategory,
  getCategories,
  deleteCategory,
  updateCategory,
} from "../controllers/category.controller.js";

const router = express.Router();

router.post("/add", addCategory);
router.get("/", getCategories);
router.delete("/delete/:id", deleteCategory);
router.put("/update/:id", updateCategory);
export default router;
