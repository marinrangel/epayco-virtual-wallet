import express from "express"
import dotenv from "dotenv"
import routes from "./routes"
import cors from "cors"

dotenv.config()

const app = express()

const corsOptions = {
  credentials: true,
  origin: ["http://localhost:8080"]
}

app.use(cors(corsOptions))
app.use(express.json())
app.use("/api/clients", routes)

const PORT = process.env.PORT || 3002

app.listen(PORT, () => {
  console.log(`Service API running on port ${PORT}`)
})
