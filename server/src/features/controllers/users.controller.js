import { success } from "../../shared/utils/apiResponse.utils.js"
import Order from "../models/orderSchema.js"
import User from "../models/UserSchema.js"

const getUsers = async (req, res) => {
    try {
        const user = await User.find()
        res.status(200).json({
            status: 200,
            message: "These are all the users",
            data: user
        })
    } catch (error) {
        res.status(400).json({
            status: 400,
            message: "Didn't found the users",
            data: null
        })
    }
}
async function getMyOrders(req, res, next) {
    try {
      const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
      return success(res, orders, 'Orders retrieved');
    } catch (err) {
      next(err);
    }
  }
const getUserById = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findOne({_id: id})
        res.status(200).json({
            status: 200,
            message: "Got the user",
            data: user
        })
    } catch (error) {
        res.status(400).json({
            status: 400,
            message: "User not found",
            data: null
        })
    }
}
const updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findByIdAndUpdate(id, req.body)
        res.status(200).json({
            status: 200,
            message: `Updated user with id: ${id}`,
            data: user
        })
    } catch (error) {
        res.status(400).json({
            status: 400,
            message: "Falied updating",
            data: null
        })
    }
}
const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json({
            status: 200,
            message: `Deleted user with id: ${req.params.id}`,
            data: null
        })
    } catch (error) {
        res.status(400).json({
            status: 400,
            message: "Falied deleting user",
            data: null
        })
    }
}

export{
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getMyOrders
}