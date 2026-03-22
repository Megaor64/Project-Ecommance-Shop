import express from "express"
import { createProduct, deleteProduct, listOfProducts, getProductById, updateProduct } from "../controllers/products.controller.js"
import { adminCheck } from "../../shared/middleware/adminMiddlware.js"
import { authMiddleware } from "../../shared/middleware/authMiddleware.js"

const router = express.Router()

router.post("/", authMiddleware, adminCheck, createProduct)
router.get("/", listOfProducts)
router.get("/:id", getProductById)
router.patch("/:id", authMiddleware, adminCheck, updateProduct)
router.delete("/:id", authMiddleware, adminCheck, deleteProduct)

export default router