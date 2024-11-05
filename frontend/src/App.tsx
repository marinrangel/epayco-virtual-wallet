import React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import ClientList from "./components/ClientList"
import PaymentConfirmation from "./components/PaymentConfirmation"
import { SnackbarProvider } from "notistack"

import reactLogo from "./assets/epayco.png"

import "./App.css"

const App: React.FC = () => {
  return (
    <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
      <a href="https://epayco.com/" target="_blank">
        <img src={reactLogo} className="logo react" alt="React logo" />
      </a>
      <Router>
        <Routes>
          <Route path="/" element={<ClientList />} />
          <Route path="/confirm-payment/:sessionId" element={<PaymentConfirmation />} />
        </Routes>
      </Router>
    </SnackbarProvider>
  )
}

export default App
