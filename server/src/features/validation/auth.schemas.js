import Joi from "joi";

// registerSchema - for POST /auth/register
export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
}).options({ stripUnknown: true });

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
