import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "Delivery",
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
      warehouseId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      customer: {
        type: DataTypes.STRING(200),
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
      tableName: "deliveries",
      timestamps: true,
      paranoid: true,
    }
  );
