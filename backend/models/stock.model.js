import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "Stock",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      locationId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.DECIMAL(12, 3),
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: "stocks",
      timestamps: true,
      indexes: [
        { unique: true, fields: ["productId", "locationId"] },
      ],
    }
  );
