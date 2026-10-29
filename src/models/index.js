const { DataTypes } = require("sequelize");
const { getSequelize } = require("../db/sequelize");

const sequelize = getSequelize();

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    status: { type: DataTypes.STRING(20), allowNull: false }
  },
  { tableName: "users", timestamps: false }
);

const Auction = sequelize.define(
  "Auction",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    minimum_price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    expires_at: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.STRING(20), allowNull: false }
  },
  { tableName: "auctions", timestamps: false }
);

const Bid = sequelize.define(
  "Bid",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    auction_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "auctions", key: "id" }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" }
    },
    amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false }
  },
  {
    tableName: "bids",
    timestamps: false,
    indexes: [
      {
        fields: ["auction_id", "id"]
      },
      {
        unique: true,
        fields: ["auction_id", "user_id", "amount"]
      }
    ]
  }
);

module.exports = { sequelize, User, Auction, Bid };