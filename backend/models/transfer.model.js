import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "Transfer",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      reference: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: true,
      },
      fromWarehouseId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      toWarehouseId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("draft", "waiting", "ready", "done", "canceled"),
        defaultValue: "draft",
      },
      scheduledDate: {
        type: DataTypes.DATEONLY,
      },
      notes: {
        type: DataTypes.TEXT,
      },
      validatedAt: {
        type: DataTypes.DATE,
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      tableName: "transfers",
      timestamps: true,
      paranoid: true,
    }
  );
