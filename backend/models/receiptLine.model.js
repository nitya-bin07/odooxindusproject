import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "ReceiptLine",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      receiptId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      locationId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      expectedQty: {
        type: DataTypes.DECIMAL(12, 3),
        allowNull: false,
        defaultValue: 0,
      },
      receivedQty: {
        type: DataTypes.DECIMAL(12, 3),
        defaultValue: 0,
      },
    },
    {
      tableName: "receipt_lines",
      timestamps: true,
    }
  );
