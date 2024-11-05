import Joi from "joi"

export const registerClientSchema = Joi.object({
  document: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required()
})

export const addBalanceSchema = Joi.object({
  document: Joi.string().required(),
  phone: Joi.string().required(),
  amount: Joi.number().positive().required()
})

export const paySchema = Joi.object({
  document: Joi.string().required(),
  phone: Joi.string().required(),
  amount: Joi.number().positive().required()
})

export const confirmPaymentSchema = Joi.object({
  sessionId: Joi.string().required(),
  token: Joi.string().length(6).required()
})

export const checkBalanceSchema = Joi.object({
  document: Joi.string().required(),
  phone: Joi.string().required()
})
