import express from "express";
import { checkout, getPurchased } from "../controllers/purchased.controller.js";

const router = express.Router();

router.post("/checkout", checkout);
router.get("/", getPurchased);

export default router;
