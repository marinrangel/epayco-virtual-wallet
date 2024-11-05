import React, { useState } from "react"
import { Box, Button, TextField, Typography } from "@mui/material"
import { useSnackbar } from "notistack"
import api from "../api"

interface RegisterClientModalProps {
  onClose: () => void
  onRegister: () => void
}

const RegisterClientModal: React.FC<RegisterClientModalProps> = ({ onClose, onRegister }) => {
  const { enqueueSnackbar } = useSnackbar()
  const [formData, setFormData] = useState({
    document: "",
    name: "",
    email: "",
    phone: ""
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await api.post("/register", formData)
      enqueueSnackbar("Cliente registrado exitosamente", { variant: "success" })
      onRegister()
      onClose()
    } catch (error) {
      console.error("Error registering client:", error)
      enqueueSnackbar("Error al registrar el cliente. Inténtelo de nuevo.", { variant: "error" })
    } finally {
      setLoading(false)
    }
  }

  const isFormComplete = Object.values(formData).every((field) => field !== "")

  return (
    <Box sx={{ padding: "2rem", backgroundColor: "white", maxWidth: 400, margin: "auto", mt: "10vh" }}>
      <Typography variant="h6" mb={2} style={{ color: "black" }}>
        Registrar Cliente
      </Typography>
      {["document", "name", "email", "phone"].map((field) => (
        <TextField key={field} fullWidth label={capitalize(field)} name={field} value={(formData as any)[field]} onChange={handleChange} margin="normal" />
      ))}
      <Button fullWidth variant="contained" color="primary" onClick={handleSubmit} disabled={!isFormComplete || loading} sx={{ mt: 2 }}>
        {loading ? "Registrando..." : "Registrar"}
      </Button>
      <Button fullWidth variant="text" color="secondary" onClick={onClose} sx={{ mt: 1 }}>
        Cancelar
      </Button>
    </Box>
  )
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export default RegisterClientModal
