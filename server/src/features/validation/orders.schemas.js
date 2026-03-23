import Joi from "joi";

export const createOrderBodySchema = Joi.object({
  shippingAddress: Joi.object({
    street: Joi.string().trim().min(1).required(),
    city: Joi.string().trim().min(1).required(),
    zip: Joi.string().trim().min(1).required(),
    country: Joi.string().trim().min(1).required(),
  })
    .required()
    .options({ stripUnknown: true }),
}).options({ stripUnknown: true });

