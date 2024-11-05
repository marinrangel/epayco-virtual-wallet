import { DataTypes, Model } from "sequelize"
import sequelize from "../config/db.config"

class Client extends Model {
  public id!: number
  public document!: string
  public name!: string
  public email!: string
  public phone!: string
  public balance!: number
}

Client.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    document: { type: DataTypes.STRING, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    balance: { type: DataTypes.FLOAT, defaultValue: 0 }
  },
  {
    sequelize,
    modelName: "Client"
  }
)

export default Client
