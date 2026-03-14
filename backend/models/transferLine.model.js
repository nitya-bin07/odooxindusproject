import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "TransferLine",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      transferId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      fromLocationId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      toLocationId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      qty: {
        type: DataTypes.DECIMAL(12, 3),
        allowNull: false,
      },
      doneQty: {
        type: DataTypes.DECIMAL(12, 3),
        defaultValue: 0,
      },
    },
    {
      tableName: "transfer_lines",
      timestamps: true,
    }
  );
