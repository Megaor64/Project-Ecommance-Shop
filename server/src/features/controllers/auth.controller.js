import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import mailer from "../../shared/utils/mailer.js";
import User from "../models/UserSchema.js";

dotenv.config();

const tokenBlacklist = new Set();
function generatecode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const code = generatecode();
    const user = await User.create({
      name,
      email,
      role: "customer",
      verificationCode: code,
      password: hashed,
    });
    try {
      await mailer.verificationMail(email, code);
      console.log("email sent");
    } catch (error) {
      console.log("email not sent");
    }
    res.status(200).json({
      status: 200,
      message: "Verification code sent.",
      data: user,
    });
  } catch (error) {
    const { code, keyValue } = error;
    console.log(code, keyValue);
    if (String(code) === "11000") {
      const { email } = keyValue;
      if (email) {
        return res.status(500).json({
          status: 500,
          message: "Cannot register with this email",
          data: null,
        });
      }
    }
    res.status(500).json({
      status: 500,
      message: "Failed register a new user",
      data: null,
    });
    console.log(error);
  }
};

export async function emailCodeVerification(req, res) {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Didn't find the user" });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ message: "Wrong code" });
    }

    user.isVerified = true;
    user.verificationCode = null;

    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
}

export const adminRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (password !== process.env.ADMIN_PASS) {
      return res.status(403).json({
        status: 403,
        message: "Admins only",
        data: null,
      });
    }
    const hashed = await bcrypt.hash(password, 10);
    const code = generatecode();
    const user = await User.create({
      name,
      email,
      role: "admin",
      verificationCode: code,
      password: hashed,
    });
    try {
      await mailer.verificationMail(email, code);
      console.log("email sent");
    } catch (error) {
      console.log("email not sent");
    }
    res.status(200).json({
      status: 200,
      message: "Verification code sent.",
      data: user,
    });
  } catch (error) {
    const { code, keyValue } = error;
    console.log(code, keyValue);
    if (String(code) === "11000") {
      const { email } = keyValue;
      if (email) {
        return res.status(500).json({
          status: 500,
          message: "Cannot register with this email",
          data: null,
        });
      }
    }
    res.status(500).json({
      status: 500,
      message: "Failed register a new user",
      data: null,
    });
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({
        status: 400,
        message: "Invalid credentials",
        data: null,
      });
      if (user.role !== "customer")
        return res.status(400).json({
          status: 400,
          message: "Customer login only",
          data: null,
        });
  
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({
        status: 400,
        message: "Invalid credentials",
        data: null,
      });

    if (!user.isVerified)
      return res.status(400).json({
        status: 400,
        message: "The user is not verified, please verify",
        data: null,
      });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    res.status(200).json({
      status: 200,
      message: "Login successfully",
      data: token,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "User login failed",
      data: null,
    });
  }
};

export const adminLoginStep1 = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: "admin" });
    if (!user) throw new Error("Invalid email or password");
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid email or password");
    const code = generatecode();
    await user.save();
    try {
      await mailer.verificationMail(email, code);
    } catch (error) {
      console.log("email not sent");
    }
    res.status(200).json({
      status: 200,
      message: "Verification code sent.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
export const adminLoginStep2 = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email, role: "admin" });
    if (!user) throw new Error("Invalid request");
    if (user.verificationCode === code) {
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
    });
    res.status(200).json({
      status: 200,
      message: "Login successfully",
      data: token,
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async ( req, res, next) =>{
  try {
    const { email, token } = req.body
    const user = await User.findOne({ email });
    if (!user)
      return { message: "If the email exists, a reset link has been sent" };
    const resetPasswordToken = token;
    const resetPasswordTokenExpiry = new Date(
      Date.now() + 1 * 60 * 60 * 1000,
    );
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordTokenExpiry = resetPasswordTokenExpiry;
    await user.save();
    try {
      await mailer.resetPasswordMail(email, token);
    } catch (error) {
      console.log("email not sent");
    }
  return res.status(200).json({
    status: 200,
    message: "Reset password link had been sent",
    data: null
  })
  } catch (error) {
    next(error)
  }
}

export const resetPassword = async ( req, res, next) =>{
  try {
    const { token, newPassword } = req.body
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiry: { $gt: new Date() },
    });
    if (!user) throw new Error("Invalid or expired reset token");
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    await user.save();
    return res.status(200).json({
      status: 200,
      message: "Password had been reseted",
      data: null
    })
  } catch (error) {
    next(error)
  }
}

export const logout = async ( req, res, next) =>{
  try {
    const {email, token} = req.body
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({
        status: 400,
        message: "Invalid credentials",
        data: null,
      });
  
    if (!token) {
      return res.status(400).json({
        status: 400,
        message: "Wrong token",
        data: null
      })}
      tokenBlacklist.add(token);
      const decoded = jwt.decode(token);
      if (decoded?.exp) {
        const ttl = (decoded.exp * 1000) - Date.now();
        if (ttl > 0) {
          setTimeout(() => tokenBlacklist.delete(token), ttl);
        }
      }
      res.status(200).json({
        status: 200,
        message: "Token deleted",
        data: null
      })
        } catch (error) {
    next(error)
  }
}
