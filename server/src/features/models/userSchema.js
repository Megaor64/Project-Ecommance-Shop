import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config()
const cartItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    street: { type: String, default: '', trim: true },
    city: { type: String, default: '', trim: true },
    zip: { type: String, default: '', trim: true },
    country: { type: String, default: '', trim: true },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    isVerified: { type: Boolean, default: false },
    verificationCode: {type: String},
    resetPasswordToken: { type: String, default: null },
    resetPasswordTokenExpiry: { type: Date, default: null },
    address: { type: addressSchema, default: () => ({}) },
    cart: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User
