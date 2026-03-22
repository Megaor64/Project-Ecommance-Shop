
import Product from '../models/productSchema.js';
import User from '../models/UserSchema.js';
import Order from '../models/orderSchema.js';
import {reserveAndDeduct} from '../service/inventory.service.js';
import { success, error } from '../../shared/utils/apiResponse.utils.js';

export async function createOrderFromCart(req, res, next) {
  try {
    const userId = req.user?.id;
    if (!userId) return error(res, 'Unauthorized', null, 401);

    const { shippingAddress } = req.body;
    if (!shippingAddress) return error(res, 'Missing shippingAddress', null, 400);

    // 1) להביא עגלה
    const user = await User.findById(userId).select('cart');
    if (!user) return error(res, 'User not found', null, 404);
    if (!user.cart?.length) return error(res, 'Cart is empty', null, 400);

    // 2) להביא מוצרים שרלוונטיים לעגלה
    const productIds = user.cart.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: productIds } })
      .select('_id name price stock isActive')
      .lean();

    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    // 3) לבנות items להזמנה + items למלאי
    const orderItems = [];
    const inventoryItems = [];
    let totalAmount = 0;

    for (const cartItem of user.cart) {
      const id = cartItem.productId.toString();
      const product = productMap.get(id);

      if (!product) return error(res, `Product not found: ${id}`, null, 404);
      if (!product.isActive) return error(res, `Product inactive: ${product.name}`, null, 400);

      const quantity = Number(cartItem.quantity) || 0;
      if (quantity < 1) return error(res, `Invalid quantity for: ${product.name}`, null, 400);

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity,
      });

      inventoryItems.push({ productId: product._id, quantity });

      totalAmount += product.price * quantity;
    }

    // 4) להוריד מלאי (יזרוק שגיאה אם אין מספיק)
    await reserveAndDeduct(inventoryItems);

    // 5) ליצור הזמנה
    const order = await Order.create({
      userId,
      items: orderItems,
      shippingAddress,
      totalAmount,
      paymentStatus: 'pending',
      orderStatus: 'processing',
    });

    // 6) לנקות עגלה
    user.cart = [];
    await user.save();

    return success(res, { order }, 'Order created', 201);
  } catch (err) {
    next(err);
  }
}