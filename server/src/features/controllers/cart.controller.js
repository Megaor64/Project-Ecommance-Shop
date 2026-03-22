import Product from '../models/productSchema.js';
import { success, error } from '../../shared/utils/apiResponse.utils.js';
import User from '../models/UserSchema.js';

async function getCart(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select('cart').populate('cart.productId', 'name price imageUrl stock isActive');
    if (!user) return error(res, 'User not found', null, 404);
    const cart = (user.cart || []).map((item) => ({
      productId: item.productId?._id ?? item.productId,
      name: item.productId?.name,
      price: item.productId?.price,
      imageUrl: item.productId?.imageUrl,
      stock: item.productId?.stock,
      isActive: item.productId?.isActive,
      quantity: item.quantity,
    }));
    return success(res, { items: cart }, 'Cart retrieved');
  } catch (err) {
    next(err);
  }
}

async function syncCart(req, res, next) {
  try {
    const guestItems = req.body.items || [];
    const user = await User.findById(req.user.id).select('cart');
    if (!user) return error(res, 'User not found', null, 404);

    const merged = [...(user.cart || [])];
    for (const { productId, quantity } of guestItems) {
      const existing = merged.find((i) => i.productId.toString() === productId);
      if (existing) existing.quantity += quantity;
      else merged.push({ productId, quantity });
    }
    user.cart = merged;
    await user.save();
    return success(res, { items: user.cart }, 'Cart synced');
  } catch (err) {
    next(err);
  }
}

async function addItem(req, res, next) {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId).select('_id isActive stock');
    if (!product) return error(res, 'Product not found', null, 404);
    if (!product.isActive) return error(res, 'Product is not available', null, 400);

    const user = await User.findById(req.user.id).select('cart');
    if (!user) return error(res, 'User not found', null, 404);

    const existing = user.cart.find((i) => i.productId.toString() === productId);
    if (existing) existing.quantity += quantity;
    else user.cart.push({ productId, quantity });
    await user.save();
    return success(res, { items: user.cart }, 'Item added to cart');
  } catch (err) {
    next(err);
  }
}

async function updateItem(req, res, next) {
  try {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user.id).select('cart');
    if (!user) return error(res, 'User not found', null, 404);

    const item = user.cart.find((i) => i.productId.toString() === productId);
    if (!item) return error(res, 'Item not in cart', null, 404);
    item.quantity = quantity;
    await user.save();
    return success(res, { items: user.cart }, 'Cart updated');
  } catch (err) {
    next(err);
  }
}

async function removeItem(req, res, next) {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user.id).select('cart');
    if (!user) return error(res, 'User not found', null, 404);

    user.cart = user.cart.filter((i) => i.productId.toString() !== productId);
    await user.save();
    return success(res, { items: user.cart }, 'Item removed');
  } catch (err) {
    next(err);
  }
}

async function clearCart(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select('cart');
    if (!user) return error(res, 'User not found', null, 404);

    user.cart = [];
    await user.save();
    return success(res, { items: [] }, 'Cart cleared');
  } catch (err) {
    next(err);
  }
}

export {
  getCart,
  syncCart,
  addItem,
  updateItem,
  removeItem,
  clearCart
}