import express from "express"
import dotenv from "dotenv"
import clientRoutes from "./routes"
import sequelize from "./config/db.config"

dotenv.config()

const app = express()

app.use(express.json())
app.use("/api-db", clientRoutes)

const PORT = process.env.PORT || 3001

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Service DB running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error)
  })
