import { DataTypes, Model } from "sequelize"
import sequelize from "../config/db.config"

class PaymentToken extends Model {
  public id!: number
  public client_id!: number
  public token!: string
  public session_id!: string
  public amount!: number
  public status!: "pending" | "confirmed"
}

PaymentToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    client_id: { type: DataTypes.INTEGER, allowNull: false },
    token: { type: DataTypes.STRING, allowNull: false },
    session_id: { type: DataTypes.STRING, allowNull: false },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.ENUM("pending", "confirmed"), defaultValue: "pending" }
  },
  {
    sequelize,
    modelName: "PaymentToken"
  }
)

export default PaymentToken
