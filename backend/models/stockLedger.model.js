import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "StockLedger",
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
      warehouseId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      // receipt | delivery | transfer_out | transfer_in | adjustment
      movementType: {
        type: DataTypes.ENUM(
          "receipt",
          "delivery",
          "transfer_out",
          "transfer_in",
          "adjustment"
        ),
        allowNull: false,
      },
      // positive = stock in, negative = stock out
      qty: {
        type: DataTypes.DECIMAL(12, 3),
        allowNull: false,
      },
      // running balance at this location after the move
      balanceAfter: {
        type: DataTypes.DECIMAL(12, 3),
        allowNull: false,
      },
      // UUID of the source document (receipt/delivery/transfer/adjustment)
      referenceId: {
        type: DataTypes.UUID,
      },
      referenceType: {
        type: DataTypes.STRING(50),
      },
      notes: {
        type: DataTypes.TEXT,
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      tableName: "stock_ledger",
      timestamps: true,
      updatedAt: false, // ledger rows are immutable
    }
  );
