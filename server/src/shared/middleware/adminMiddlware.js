import User from "../../features/models/UserSchema.js";

export const adminCheck = async (req, res, next) => {
  const { id } = req.user;
  const user = await User.findOne({ _id: id });
  if (user.role === "admin") {
    next();
  } else {
    res.status(400).json({
      status: 400,
      message: "Admin only",
      data: null,
    });
  }
};
