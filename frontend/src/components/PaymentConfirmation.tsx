import React, { useState, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button, Container, TextField, Typography } from "@mui/material"
import { useSnackbar } from "notistack"
import api from "../api"

const PaymentConfirmation: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>()
  const [confirmationCode, setConfirmationCode] = useState<string>("")
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const handleConfirmPayment = useCallback(async () => {
    try {
      const response = await api.post("/confirm-payment", {
        sessionId,
        token: confirmationCode
      })

      if (response.data.code === 200) {
        enqueueSnackbar("Pago confirmado exitosamente", { variant: "success" })
        navigate("/")
      } else {
        enqueueSnackbar("Código de confirmación incorrecto. Inténtalo de nuevo.", { variant: "error" })
      }
    } catch (error) {
      console.error("Error en la confirmación de pago", error)
      enqueueSnackbar("Ocurrió un error al procesar el pago. Inténtalo de nuevo.", { variant: "error" })
    }
  }, [confirmationCode, enqueueSnackbar, navigate, sessionId])

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCode = e.target.value.slice(0, 6)
    setConfirmationCode(newCode)
  }

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Confirmar Pago
      </Typography>
      <Typography variant="body2" gutterBottom>
        Ingrese el código de 6 dígitos que recibió para confirmar su pago.
      </Typography>
      <TextField
        label="Código de Confirmación"
        variant="outlined"
        fullWidth
        margin="normal"
        value={confirmationCode}
        onChange={handleCodeChange}
        inputProps={{ maxLength: 6 }}
      />
      <Button variant="contained" color="primary" onClick={handleConfirmPayment} fullWidth sx={{ mt: 2 }} disabled={confirmationCode.length !== 6}>
        Confirmar Pago
      </Button>
    </Container>
  )
}

export default PaymentConfirmation
