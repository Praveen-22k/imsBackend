import express from "express";
import {
  addToCart,
  getCart,
  increaseQty,
  decreaseQty,
  removeItem,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/add", addToCart);
router.get("/:id", getCart);
router.put("/increase/:itemId", increaseQty);
router.put("/decrease/:itemId", decreaseQty);
router.delete("/remove/:itemId", removeItem);

export default router;
