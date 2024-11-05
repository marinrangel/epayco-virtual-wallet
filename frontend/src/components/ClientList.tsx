import React, { useState, useEffect } from "react"
import { useSnackbar } from "notistack"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Modal
} from "@mui/material"
import api from "../api"
import RegisterClientModal from "./RegisterClientModal"

interface Client {
  id: number
  document: string
  name: string
  email: string
  phone: string
  balance: number
}

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [dialogState, setDialogState] = useState({ open: false, type: "balance" as "balance" | "add" | "pay", balance: null })
  const [amount, setAmount] = useState<number>(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await api.get("")
        setClients(response.data?.clients)
      } catch (error) {
        console.error("Error fetching clients", error)
        enqueueSnackbar("Ocurrió un error al obtener los clientes registrados", { variant: "error" })
      }
    }
    fetchClients()
  }, [enqueueSnackbar])

  const openActionDialog = (client: Client, type: "balance" | "add" | "pay") => {
    setSelectedClient(client)
    setDialogState({ open: true, type, balance: type === "balance" ? null : dialogState.balance })
    if (type === "balance") fetchBalance(client.document, client.phone)
  }

  const closeActionDialog = () => {
    setDialogState({ open: false, type: "balance", balance: null })
    setSelectedClient(null)
    setAmount(0)
  }

  const fetchBalance = async (document: string, phone: string) => {
    try {
      const response = await api.get(`/check-balance?document=${document}&phone=${phone}`)
      setDialogState((prevState) => ({ ...prevState, balance: response.data.balance }))
    } catch (error) {
      console.error("Error fetching balance", error)
      enqueueSnackbar("Ocurrió un error al obtener el saldo del cliente", { variant: "error" })
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    setAmount(isNaN(value) || value <= 0 ? 0 : value)
  }

  const handleAddBalance = async () => {
    if (selectedClient) {
      try {
        await api.post("/add-balance", { document: selectedClient.document, phone: selectedClient.phone, amount })
        enqueueSnackbar("Saldo recargado exitosamente", { variant: "success" })
        refreshClients()
        closeActionDialog()
      } catch (error) {
        console.error("Error adding balance", error)
        enqueueSnackbar("Ocurrió un error al recargar saldo", { variant: "error" })
      }
    }
  }

  const handlePay = async () => {
    if (selectedClient) {
      try {
        await api.post("/pay", { document: selectedClient.document, phone: selectedClient.phone, amount })
        enqueueSnackbar("Pago realizado con éxito, se envió un correo con el token de confirmación", { variant: "success" })
        refreshClients()
        closeActionDialog()
      } catch (error) {
        console.error("Error making payment", error)
        enqueueSnackbar("Ocurrió un error al realizar el Pago", { variant: "error" })
      }
    }
  }

  const refreshClients = async () => {
    try {
      const response = await api.get("")
      setClients(response.data?.clients)
    } catch (error) {
      console.error("Error refreshing clients", error)
    }
  }

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flexGrow: 1, marginLeft: "120px" }}>
        <Typography variant="h4" gutterBottom>
          Clientes Registrados
        </Typography>
        <Button variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
          Registrar Cliente
        </Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Documento</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.document}</TableCell>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => openActionDialog(client, "balance")}>
                    Consultar Saldo
                  </Button>
                  <Button variant="outlined" onClick={() => openActionDialog(client, "add")}>
                    Recargar Billetera
                  </Button>
                  <Button variant="outlined" onClick={() => openActionDialog(client, "pay")}>
                    Realizar Pago
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <RegisterClientModal onClose={() => setIsModalOpen(false)} onRegister={refreshClients} />
        </Modal>

        <ActionDialog
          open={dialogState.open}
          onClose={closeActionDialog}
          actionType={dialogState.type}
          balance={dialogState.balance}
          amount={amount}
          onAmountChange={handleAmountChange}
          onSubmit={dialogState.type === "add" ? handleAddBalance : handlePay}
        />
      </div>
    </div>
  )
}

interface ActionDialogProps {
  open: boolean
  onClose: () => void
  actionType: "balance" | "add" | "pay"
  balance: number | null
  amount: number
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: () => void
}

const ActionDialog: React.FC<ActionDialogProps> = ({ open, onClose, actionType, balance, amount, onAmountChange, onSubmit }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{actionType === "balance" ? "Consultar Saldo" : actionType === "add" ? "Recargar Billetera" : "Realizar Pago"}</DialogTitle>
    <DialogContent>
      {actionType === "balance" && <Typography>Saldo Actual: {balance !== null ? `$${balance}` : "Cargando..."}</Typography>}
      {(actionType === "add" || actionType === "pay") && (
        <TextField label="Monto" type="number" fullWidth margin="normal" value={amount} onChange={onAmountChange} />
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Cancelar
      </Button>
      {(actionType === "add" || actionType === "pay") && (
        <Button onClick={onSubmit} color="primary" disabled={amount <= 0}>
          {actionType === "add" ? "Recargar" : "Pagar"}
        </Button>
      )}
    </DialogActions>
  </Dialog>
)

export default ClientList
