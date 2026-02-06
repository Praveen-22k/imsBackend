import express from "express";
import {
  checkout,
  getPurchased,
  getAllPurchasedAdmin,
} from "../controllers/purchased.controller.js";

const router = express.Router();

router.post("/checkout", checkout);
router.get("/", getPurchased);
router.get("/admin", getAllPurchasedAdmin);
export default router;
