import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "Adjustment",
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
      reason: {
        type: DataTypes.STRING(255),
      },
      status: {
        type: DataTypes.ENUM("draft", "done", "canceled"),
        defaultValue: "draft",
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
      tableName: "adjustments",
      timestamps: true,
      paranoid: true,
    }
  );
