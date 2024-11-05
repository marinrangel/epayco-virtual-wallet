import { Request, Response, Router, NextFunction } from "express"
import axios, { AxiosResponse } from "axios"
import { registerClientSchema, addBalanceSchema, checkBalanceSchema, confirmPaymentSchema, paySchema } from "../schema"

const router = Router()
const SERVICE_DB_URL = process.env.SERVICE_DB_URL || "http://localhost:3001/api-db/clients"

type HttpMethod = "post" | "get"
type ValidationSchema = typeof registerClientSchema

interface RouteConfig {
  endpoint: string
  method: HttpMethod
  schema?: ValidationSchema
}

const routesConfig: Record<string, RouteConfig> = {
  getAll: { endpoint: "", method: "get" },
  register: { endpoint: "register", method: "post", schema: registerClientSchema },
  addBalance: { endpoint: "add-balance", method: "post", schema: addBalanceSchema },
  pay: { endpoint: "pay", method: "post", schema: paySchema },
  confirmPayment: { endpoint: "confirm-payment", method: "post", schema: confirmPaymentSchema },
  checkBalance: { endpoint: "check-balance", method: "get", schema: checkBalanceSchema }
}

const handleServiceRequest = async (endpoint: string, method: HttpMethod, data?: any): Promise<AxiosResponse | null> => {
  const url = `${SERVICE_DB_URL}/${endpoint}`

  try {
    return method === "post" ? await axios.post(url, data) : await axios.get(url, { params: data })
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Error en la solicitud al servicio externo")
  }
}

const validateRequest = (schema?: ValidationSchema) => (req: Request, res: Response, next: NextFunction) => {
  if (!schema) return next()

  const { error } = schema.validate(req.method === "GET" ? req.query : req.body)

  if (error) {
    res.status(400).json({ error: "Datos inválidos", details: error.details })
    return
  }

  next()
}

const handleError = (res: Response, error: Error, code = 400, message = "Error en la solicitud") => {
  res.status(code).json({ code, message, error: error.message })
}

Object.entries(routesConfig).forEach(([route, config]) => {
  const { endpoint, method, schema } = config

  router[method](`/${endpoint}`, async (req: Request, res: Response) => {
    validateRequest(schema)

    try {
      const data = method === "get" ? req.query : req.body

      const response = await handleServiceRequest(endpoint, method, data)

      res.json(response?.data)
    } catch (error) {
      handleError(res, error as Error)
    }
  })
})

export default router
