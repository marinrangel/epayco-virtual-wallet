import { Request, Response } from "express"
import Client from "../models/Client"
import PaymentToken from "../models/PaymentToken"
import { generateToken } from "../utils"
import { v4 as uuidv4 } from "uuid"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
})

const handleError = (res: Response, error: Error, code = 400, message = "Error en la solicitud") => {
  console.error(error)
  res.status(code).json({ code, message, error: error.message })
}

export const getAlllClients = async (req: Request, res: Response) => {
  try {
    const clients = await Client.findAll()
    res.json({ code: 200, clients })
  } catch (error) {
    handleError(res, error as Error, 400, "Error al cargar los clientes")
  }
}

export const registerClient = async (req: Request, res: Response) => {
  const { document, name, email, phone } = req.body

  try {
    const client = await Client.create({ document, name, email, phone })
    res.json({ code: 200, message: "Cliente registrado exitosamente" })
  } catch (error) {
    handleError(res, error as Error, 400, "Error al registrar cliente")
  }
}

export const addBalance = async (req: Request, res: Response) => {
  const { document, phone, amount } = req.body

  if (!amount || amount <= 0) {
    res.status(400).json({ code: 400, message: "Monto inválido" })
    return
  }

  try {
    const client = await Client.findOne({ where: { document, phone } })
    if (!client) throw new Error("Cliente no encontrado")

    client.balance += amount
    await client.save()

    res.json({ code: 200, message: "Saldo recargado exitosamente", balance: client.balance })
  } catch (error) {
    handleError(res, error as Error)
  }
}

export const pay = async (req: Request, res: Response) => {
  const { document, phone, amount } = req.body

  if (!amount || amount <= 0) {
    res.status(400).json({ code: 400, message: "Monto inválido" })
    return
  }

  try {
    const client = await Client.findOne({ where: { document, phone } })

    if (!client) throw new Error("Cliente no encontrado")
    if (client.balance < amount) throw new Error("Saldo insuficiente")

    const token = generateToken()
    const session_id = uuidv4()
    const confirmationLink = `${process.env.URL_FRONT_SITE}/${session_id}`

    await PaymentToken.create({
      client_id: client.id,
      token,
      session_id,
      amount,
      status: "pending"
    })

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: client.email,
      subject: "Código de confirmación de pago",
      text: `Tu código de confirmación es: ${token}`,
      html: `
        <h1>Confirmación de Pago</h1>
        <p>Tu código de confirmación es: <b>${token}</b></p><br />
        <p>Por favor, haga clic en el siguiente botón para confirmar su pago:</p>
        <a href="${confirmationLink}" style="text-decoration: none;">
          <button style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
            Confirmar Pago
          </button>
        </a>
        <p>Si el botón no funciona, copie y pegue el siguiente enlace en su navegador:</p>
        <p><a href="${confirmationLink}">${confirmationLink}</a></p>
      `
    })

    res.status(200).json({
      message: "Pago iniciado. Se envió un código de confirmación al correo del cliente.",
      session_id
    })
  } catch (error) {
    handleError(res, error as Error)
  }
}

export const confirmPayment = async (req: Request, res: Response) => {
  const { sessionId, token } = req.body

  if (!sessionId || !token) {
    res.status(400).json({ code: 400, message: "ID de sesión y token son requeridos" })
    return
  }

  try {
    const paymentToken = await PaymentToken.findOne({
      where: { session_id: sessionId, token, status: "pending" }
    })

    if (!paymentToken) throw new Error("Token o sesión inválido")

    const client = await Client.findByPk(paymentToken.client_id)
    if (!client) throw new Error("Cliente no encontrado")

    if (client.balance < paymentToken.amount) {
      res.status(400).json({ code: 400, message: "Saldo insuficiente" })
      return
    }

    client.balance -= paymentToken.amount
    await client.save()

    paymentToken.status = "confirmed"
    await paymentToken.save()

    res.json({ code: 200, message: "Pago confirmado", balance: client.balance })
  } catch (error) {
    handleError(res, error as Error)
  }
}

export const checkBalance = async (req: Request, res: Response) => {
  const { document, phone } = req.query

  if (!document || !phone) {
    res.status(400).json({ code: 400, message: "Documento y teléfono son requeridos" })
    return
  }

  try {
    const client = await Client.findOne({ where: { document, phone } })
    if (!client) throw new Error("Cliente no encontrado")

    res.json({ code: 200, message: "Consulta exitosa", balance: client.balance })
  } catch (error) {
    handleError(res, error as Error, 500, "Error al consultar el saldo")
  }
}
