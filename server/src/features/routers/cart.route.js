import express from 'express';
import { addItem, clearCart, getCart, removeItem, syncCart, updateItem } from '../controllers/cart.controller.js';
import { checkPermissions } from '../../shared/middleware/checkPermissions.js';
import { authMiddleware } from '../../shared/middleware/authMiddleware.js';
const router = express.Router();

// Specific paths must be registered before generic `/:id` where they would conflict.
router.get("/:id", authMiddleware, checkPermissions, getCart)
router.post("/:id/sync", authMiddleware, checkPermissions, syncCart)
router.post("/:id", authMiddleware, checkPermissions, addItem)
router.patch("/:id", authMiddleware, checkPermissions, updateItem)
router.delete("/:id/items/:productId", authMiddleware, checkPermissions, removeItem)
router.delete("/:id/clear", authMiddleware, checkPermissions, clearCart)

export default router;
