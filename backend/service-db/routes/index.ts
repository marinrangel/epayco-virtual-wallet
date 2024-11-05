import { Router } from "express"
import { getAlllClients, registerClient, addBalance, pay, confirmPayment, checkBalance } from "../controllers/clientController"

const router = Router()

router.get("/clients", getAlllClients)
router.post("/clients/register", registerClient)
router.post("/clients/add-balance", addBalance)
router.post("/clients/pay", pay)
router.post("/clients/confirm-payment", confirmPayment)
router.get("/clients/check-balance", checkBalance)

export default router
