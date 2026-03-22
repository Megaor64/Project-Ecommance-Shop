import express from 'express';
import { authMiddleware } from '../../shared/middleware/authMiddleware.js';
import { createOrderFromCart } from '../controllers/orders.controller.js';

const router = express.Router();
router.post('/', authMiddleware, createOrderFromCart);

export default router;