import Joi from "joi";

// registerSchema - for POST /auth/register
export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
}).options({ stripUnknown: true });

// adminRegisterSchema - for POST /auth/admin/register
export const adminRegisterSchema = registerSchema;

// verifySchema - for POST /auth/verify
export const verifySchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().length(6).pattern(/^\d+$/).required(),
}).options({ stripUnknown: true });

// loginSchema - for POST /auth/login
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}).options({ stripUnknown: true });

// adminLoginStep1Schema - for POST /auth/admin/login
export const adminLoginStep1Schema = loginSchema;

// adminLoginStep2Schema - for POST /auth/admin/login2
export const adminLoginStep2Schema = verifySchema;

// forgotPasswordSchema - for POST /auth/forgotPassward
export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
}).options({ stripUnknown: true });

// resetPasswordSchema - for POST /auth/resetPassward
export const resetPasswordSchema = Joi.object({
  token: Joi.string().min(10).required(),
  newPassword: Joi.string().min(8).required(),
}).options({ stripUnknown: true });

// logoutSchema - for POST /auth/logout
export const logoutSchema = Joi.object({
  email: Joi.string().email().required(),
  token: Joi.string().min(10).required(),
}).options({ stripUnknown: true });
