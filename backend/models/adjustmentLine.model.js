import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "AdjustmentLine",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      adjustmentId: {
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
      countedQty: {
        type: DataTypes.DECIMAL(12, 3),
        allowNull: false,
      },
      previousQty: {
        type: DataTypes.DECIMAL(12, 3),
        allowNull: false,
        defaultValue: 0,
      },
      difference: {
        type: DataTypes.VIRTUAL,
        get() {
          return parseFloat(this.countedQty) - parseFloat(this.previousQty);
        },
      },
    },
    {
      tableName: "adjustment_lines",
      timestamps: true,
    }
  );
