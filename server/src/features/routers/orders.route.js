import express from 'express';
import { authMiddleware } from '../../shared/middleware/authMiddleware.js';
import { createOrderFromCart } from '../controllers/orders.controller.js';
import { validateRequest } from '../../shared/middleware/validateRequest.js';
import { createOrderBodySchema } from '../validation/orders.schemas.js';

const router = express.Router();
router.post('/', validateRequest(createOrderBodySchema, "body"), authMiddleware, createOrderFromCart);

export default router;