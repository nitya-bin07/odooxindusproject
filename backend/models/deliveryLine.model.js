import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "DeliveryLine",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      deliveryId: {
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
      demandQty: {
        type: DataTypes.DECIMAL(12, 3),
        allowNull: false,
        defaultValue: 0,
      },
      doneQty: {
        type: DataTypes.DECIMAL(12, 3),
        defaultValue: 0,
      },
    },
    {
      tableName: "delivery_lines",
      timestamps: true,
    }
  );
