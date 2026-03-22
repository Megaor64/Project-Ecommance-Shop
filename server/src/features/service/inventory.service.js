import mongoose from 'mongoose';
import Product from '../models/productSchema.js';

async function reserveAndDeduct(items) {
  if (!items?.length) return [];

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const productIds = items.map((i) => i.productId);
    const products = await Product.find({
      _id: { $in: productIds },
      isActive: true,
    })
      .session(session)
      .lean();

    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    for (const item of items) {
      const id = item.productId?.toString?.() ?? item.productId;
      const product = productMap.get(id);

      if (!product) {
        await session.abortTransaction();
        throw new Error(`Product not found or inactive: ${id}`);
      }

      const requested = Number(item.quantity) || 0;
      if (requested < 1) {
        await session.abortTransaction();
        throw new Error(`Invalid quantity for product ${product.name}`);
      }

      if (product.stock < requested) {
        await session.abortTransaction();
        throw new Error(
          `Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${requested}`
        );
      }
    }

    const updates = [];
    for (const item of items) {
      const id = item.productId?.toString?.() ?? item.productId;
      const requested = Number(item.quantity) || 0;

      const result = await Product.findByIdAndUpdate(
        id,
        { $inc: { stock: -requested } },
        { new: true, session }
      ).lean();

      if (result) {
        updates.push({ productId: result._id, newStock: result.stock });
      }
    }

    await session.commitTransaction();
    return updates;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
}

async function setStock(productId, newStock) {
  const num = Number(newStock);
  if (num < 0) {
    throw new Error('Stock cannot be negative');
  }

  const product = await Product.findByIdAndUpdate(
    productId,
    { stock: num },
    { new: true }
  ).lean();

  if (!product) return null;

  return { productId: product._id, newStock: product.stock };
}

export {
  reserveAndDeduct,
  setStock
}